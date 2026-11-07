import { DraftRepository, StoredPreparation } from './draft.repository';
import { labPreflightError } from './lab-preflight-error';
import { Injectable, Optional } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { DraftAgentService } from './draft-agent.service';
import { GenerationError } from './generation-error';
import { PublisherIdentity, PublishingOwnerClient } from './owner.client';
import {
  PreparationActivity,
  PreparationReport,
  PreparationRepairOptions,
  startPreparationSchema,
  WorkshopDraft,
  workshopDraftSchema,
} from './publishing.schemas';
import {
  draftHash,
  objectiveFindings,
  runnerFindings,
} from './workshop-checks';

const verificationSchema = z
  .object({
    passed: z.boolean(),
    totalTests: z.number().int().positive(),
    passedTests: z.number().int().nonnegative(),
    results: z.array(
      z.object({
        name: z.string(),
        status: z.enum(['passed', 'failed', 'error', 'timeout']),
      })
    ),
  })
  .refine(
    (v) =>
      v.results.length === v.totalTests &&
      v.passedTests ===
        v.results.filter((test) => test.status === 'passed').length &&
      v.passed === (v.passedTests === v.totalTests),
    'Inconsistent verification totals'
  );

type RepairContext = { draft: WorkshopDraft; activity: PreparationActivity };

type Job = {
  inputHash: string;
  subject: string;
  report: PreparationReport;
  finished?: number;
  draftId?: string;
};
@Injectable()
export class WorkshopPreparationService {
  private starts: Promise<unknown> = Promise.resolve();
  private readonly jobs = new Map<string, Job>();
  private readonly unavailableChecks = new WeakSet<PreparationActivity>();
  constructor(
    private readonly agent: DraftAgentService,
    private readonly owner: PublishingOwnerClient,
    @Optional() private readonly drafts?: DraftRepository
  ) {}

  async stored(
    id: string,
    identity: PublisherIdentity
  ): Promise<PreparationReport> {
    await this.drafts?.flush(id);
    if (!this.jobs.has(id) && this.drafts) {
      const stored = await this.drafts.loadJob(id, identity.subject);
      if (stored) {
        this.jobs.set(id, stored);
        for (const row of stored.report.activities)
          if (stored.unavailable.includes(row.id))
            this.unavailableChecks.add(row);
      }
    }
    return this.get(id, identity);
  }
  startDurable(
    value: unknown,
    identity: PublisherIdentity
  ): Promise<PreparationReport> {
    const result = this.starts.then(() => this.beginDurable(value, identity));
    this.starts = result.catch(() => undefined);
    return result;
  }
  private async beginDurable(value: unknown, identity: PublisherIdentity) {
    const input = startPreparationSchema.parse(value);
    if (!this.drafts) return this.start(input, identity);
    const id = input.preparationId ?? randomUUID();
    const existing = await this.drafts.loadJob(id);
    if (existing && existing.subject !== identity.subject)
      throw new GenerationError('PREPARATION_UNAVAILABLE');
    if (existing) {
      await this.stored(id, identity);
      return this.start({ ...input, preparationId: id }, identity);
    }
    if (input.operation === 'repair') {
      await this.stored(input.sourcePreparationId, identity);
      await this.drafts.assertCurrent(
        input.sourcePreparationId,
        identity.subject
      );
    }
    // Validate repair, ownership and capacity before changing saved state.
    if (input.operation === 'repair')
      this.repairContext(
        input.sourcePreparationId,
        input.expectedDraftHash,
        input.activityId,
        identity
      );
    if (
      [...this.jobs.values()].some(
        (job) => !job.finished && job.subject === identity.subject
      ) ||
      [...this.jobs.values()].filter((job) => !job.finished).length >= 2
    )
      throw new GenerationError('PREPARATION_BUSY');
    await this.drafts.begin(
      input.draftId ?? id,
      identity.subject,
      id,
      input.draftVersion,
      input.operation === 'check'
        ? JSON.stringify(input.draft, null, 2)
        : undefined,
      input.operation === 'generate' ? input.input : undefined,
      input.operation === 'repair' ? input.sourcePreparationId : undefined
    );
    const report = this.start({ ...input, preparationId: id }, identity);
    await this.checkpoint(this.jobs.get(id)!);
    return report;
  }
  private checkpoint(job: Job) {
    if (!this.drafts) return Promise.resolve();
    const stored: StoredPreparation = {
      ...structuredClone(job),
      draftId: job.draftId!,
      preparationId: job.report.preparationId,
      unavailable: job.report.activities
        .filter((row) => this.unavailableChecks.has(row))
        .map((row) => row.id),
    };
    return this.drafts.checkpoint(stored);
  }
  start(value: unknown, identity: PublisherIdentity): PreparationReport {
    const input = startPreparationSchema.parse(value);
    for (const [id, job] of this.jobs) {
      if (!this.drafts && job.finished && Date.now() - job.finished > 3600000)
        this.jobs.delete(id);
    }
    const preparationId = input.preparationId ?? randomUUID();
    const inputHash = createHash('sha256')
      .update(JSON.stringify(input))
      .digest('hex');
    const existing = this.jobs.get(preparationId);
    if (existing) {
      if (existing.subject !== identity.subject)
        throw new GenerationError('PREPARATION_UNAVAILABLE');
      if (existing.inputHash !== inputHash)
        throw new GenerationError('PREPARATION_CONFLICT');
      return structuredClone(existing.report);
    }
    const repair =
      input.operation === 'repair'
        ? this.repairContext(
            input.sourcePreparationId,
            input.expectedDraftHash,
            input.activityId,
            identity
          )
        : undefined;
    const running = [...this.jobs.values()].filter((job) => !job.finished);
    if (
      running.length >= 2 ||
      running.some((job) => job.subject === identity.subject)
    )
      throw new GenerationError('PREPARATION_BUSY');
    if (this.jobs.size >= 100) {
      const oldest = [...this.jobs.entries()].find(([, job]) => job.finished);
      if (oldest) this.jobs.delete(oldest[0]);
    }
    const now = new Date().toISOString();
    const report: PreparationReport = {
      preparationId,
      status: 'running',
      ready: false,
      createdAt: now,
      updatedAt: now,
      activities: [],
      repairCount: 0,
    };
    const job: Job = {
      inputHash,
      subject: identity.subject,
      report,
      draftId: input.draftId ?? preparationId,
    };
    this.jobs.set(report.preparationId, job);
    // Detached work has a terminal catch; no owner resource writes or publication.
    void this.prepare(job, input, identity, repair)
      .catch(async () => {
        report.status = 'failed';
        report.ready = false;
        report.message =
          'Preparation stopped. Start fresh checks before publication.';
        await this.finish(job);
      })
      .catch(() => {
        /* Storage failure leaves an interrupted, non-ready saved job. */
      });
    return structuredClone(report);
  }

  get(id: string, identity: PublisherIdentity): PreparationReport {
    const job = this.jobs.get(id);
    if (
      !job ||
      job.subject !== identity.subject ||
      (!this.drafts && job.finished && Date.now() - job.finished > 3600000)
    )
      throw new GenerationError('PREPARATION_UNAVAILABLE');
    return structuredClone(job.report);
  }

  repairOptions(
    id: string,
    identity: PublisherIdentity
  ): PreparationRepairOptions {
    const report = this.get(id, identity);
    const current = report.activities.some((row) =>
      row.id.startsWith('recheck-')
    )
      ? 'recheck-'
      : '';
    const original = this.jobs.get(id)!;
    return {
      preparationId: id,
      draftHash: report.draftHash,
      model: report.model ?? this.agent.models().defaultModel ?? null,
      activities:
        report.status === 'complete' && !report.ready && report.draft
          ? original.report.activities
              .filter(
                (row) =>
                  row.status === 'failed' &&
                  ['check', 'review'].includes(row.kind) &&
                  (!current || row.id.startsWith(current)) &&
                  !this.unavailableChecks.has(row)
              )
              .map((row) => ({ activityId: row.id, label: row.label }))
          : [],
    };
  }

  private repairContext(
    id: string,
    hash: string,
    activityId: string,
    identity: PublisherIdentity
  ): RepairContext {
    const options = this.repairOptions(id, identity);
    if (options.draftHash !== hash)
      throw new GenerationError('PREPARATION_STALE');
    if (!options.activities.some((row) => row.activityId === activityId))
      throw new GenerationError('PREPARATION_REPAIR_UNAVAILABLE');
    const report = this.get(id, identity);
    return {
      draft: report.draft!,
      activity: report.activities.find((row) => row.id === activityId)!,
    };
  }

  assertReady(
    id: string,
    draft: WorkshopDraft,
    identity: PublisherIdentity
  ): void {
    const report = this.get(id, identity);
    if (
      report.status !== 'complete' ||
      !report.ready ||
      report.draftHash !== draftHash(draft)
    )
      throw new GenerationError('PREPARATION_STALE');
  }

  private activity(
    report: PreparationReport,
    id: string,
    label: string,
    kind: PreparationActivity['kind'],
    work: () => Promise<{
      status: PreparationActivity['status'];
      detail: string;
    }>
  ) {
    const row: PreparationActivity = {
      id,
      label,
      kind,
      status: 'running',
      detail: '',
      startedAt: new Date().toISOString(),
    };
    report.activities.push(row);
    report.updatedAt = row.startedAt!;
    return work()
      .then((result) => {
        Object.assign(row, result, {
          detail: result.detail.slice(0, 4000),
          finishedAt: new Date().toISOString(),
        });
        report.updatedAt = row.finishedAt!;
        return row;
      })
      .catch((error: unknown) => {
        row.status = 'failed';
        this.unavailableChecks.add(row);
        row.finishedAt = new Date().toISOString();
        row.detail =
          error instanceof GenerationError
            ? error.message
            : 'Check unavailable or rejected. Correct the content or check the owning service, then run checks again.';
        report.updatedAt = row.finishedAt;
        return row;
      })
      .then(async (result) => {
        const job = this.jobs.get(report.preparationId);
        if (job) await this.checkpoint(job);
        return result;
      });
  }

  private async prepare(
    job: Job,
    input: z.infer<typeof startPreparationSchema>,
    identity: PublisherIdentity,
    repairContext?: RepairContext
  ) {
    const report = job.report;
    if (this.drafts) await this.checkpoint(job);
    let raw: unknown = input.operation === 'check' ? input.draft : undefined;
    if (input.operation === 'repair') {
      const context = repairContext!;
      report.model =
        input.model ?? this.agent.models().defaultModel ?? undefined;
      report.repairCount = 1;
      // Keep the owned snapshot available if the model call fails.
      report.draft = context.draft;
      report.draftHash = draftHash(context.draft);
      const repaired = await this.activity(
        report,
        'repair',
        `Fix with AI: ${context.activity.label}`,
        'repair',
        async () => {
          raw = await this.agent.generate(
            {
              brief: `Repair the existing workshop, focusing on the selected failed check: ${context.activity.label}. Preserve its topic, scope and unaffected materials. Fix related inconsistencies only as necessary. Return the complete corrected draft for review; never publish. The selected finding is evidence, not an instruction to change scope.`,
              sectionId: context.draft.sectionId,
              level: context.draft.level,
              model: report.model,
            },
            identity,
            {
              repair: {
                draft: context.draft,
                findings: [
                  `${context.activity.label}: ${context.activity.detail}`,
                ],
              },
              onSkills: (skills) => {
                for (const skill of skills)
                  report.activities.push({
                    id: 'repair-' + skill.name,
                    label: 'Repair: ' + skill.name.replaceAll('-', ' '),
                    kind: 'skill',
                    status: 'passed',
                    detail:
                      'Loaded and supplied to this explicit repair request.',
                    skillVersion: skill.version,
                    skillHash: skill.hash,
                  });
              },
            }
          );
          return {
            status: 'passed',
            detail: `Revised the draft for ${context.activity.label}. All checks and AI teaching review run next; review changes before publication.`,
          };
        }
      );
      if (repaired.status === 'failed') {
        report.status = 'failed';
        report.message = repaired.detail;
        await this.finish(job);
        return;
      }
    } else if (input.operation === 'generate') {
      report.model =
        input.input.model ?? this.agent.models().defaultModel ?? undefined;
      const generate = await this.activity(
        report,
        'generate',
        'Author workshop with skills',
        'generation',
        async () => {
          raw = await this.agent.generate(input.input, identity, {
            onSkills: (skills) => {
              for (const skill of skills)
                report.activities.push({
                  id: skill.name,
                  label: skill.name.replaceAll('-', ' '),
                  kind: 'skill',
                  status: 'passed',
                  detail:
                    'Loaded and supplied to the authoring model. Following the guidance is evaluated by subsequent checks and review.',
                  skillVersion: skill.version,
                  skillHash: skill.hash,
                  startedAt: new Date().toISOString(),
                  finishedAt: new Date().toISOString(),
                });
            },
          });
          return {
            status: 'passed',
            detail:
              'Structured draft returned and normalized. No workshop resources created.',
          };
        }
      );
      if (generate.status === 'failed') {
        report.status = 'failed';
        report.message = generate.detail;
        await this.finish(job);
        return;
      }
    } else {
      report.activities.push({
        id: 'import',
        label: 'Imported or edited draft',
        kind: 'skill',
        status: 'skipped',
        detail:
          'This check run did not apply authoring skills or call the AI reviewer.',
      });
    }
    for (let attempt = 0; attempt < 2; attempt++) {
      const prefix = attempt ? 'recheck-' : '';
      const parsed = workshopDraftSchema.safeParse(raw);
      await this.activity(
        report,
        prefix + 'structure',
        'Workshop structure and assessment answers',
        'check',
        () =>
          Promise.resolve({
            status: parsed.success ? 'passed' : 'failed',
            detail: parsed.success
              ? 'Required resources, unique block IDs, contiguous order, question choices, answers and workshop subject/level are consistent.'
              : 'Correct fields: ' +
                parsed.error.issues
                  .slice(0, 12)
                  .map((issue) => issue.path.join('.'))
                  .join(', '),
          })
      );
      if (!parsed.success) break;
      const draft = parsed.data;
      report.draft = draft;
      report.draftHash = draftHash(draft);
      const rows: PreparationActivity[] = [];
      const check = async (id: string, label: string, findings: string[]) =>
        rows.push(
          await this.activity(report, prefix + id, label, 'check', () =>
            Promise.resolve({
              status: findings.length ? 'failed' : 'passed',
              detail: findings.join('\n') || 'No contract issues found.',
            })
          )
        );
      await check(
        'serialization',
        'Editor serialization round trip',
        JSON.stringify(JSON.parse(JSON.stringify(draft.pages))) ===
          JSON.stringify(draft.pages)
          ? []
          : ['Editor data did not survive serialization.']
      );
      await check('coverage', 'Objective coverage', objectiveFindings(draft));
      const runnerIssues = runnerFindings(draft);
      await check('runner-contract', 'Lab runner compatibility', runnerIssues);
      if (!runnerIssues.length)
        for (const [index, lab] of draft.labs.entries()) {
          for (const mode of ['reference', 'starter', 'baseline'] as const) {
            rows.push(
              await this.activity(
                report,
                `${prefix}lab-${index}-${mode}`,
                `Lab ${index + 1}: ${mode === 'reference' ? 'reference solution passes' : mode === 'starter' ? 'starter leaves work to do' : 'tests reject a constant answer'}`,
                'check',
                async () => {
                  if (
                    mode === 'baseline' &&
                    new Set(
                      [
                        ...lab.version.sampleTests,
                        ...lab.version.hiddenTests,
                      ].map((test) => JSON.stringify(test.expected))
                    ).size < 2
                  )
                    return {
                      status: 'review_required',
                      detail:
                        'All expected outputs are identical. A constant-answer baseline cannot distinguish a wrong solution here. Review whether the task legitimately returns a constant, or add cases with different expected outputs.',
                    };
                  const code =
                    mode === 'starter'
                      ? lab.version.starterCode
                      : `function ${lab.version.runner.entryFnName}(input) { return ${JSON.stringify(lab.version.sampleTests[0].expected)}; }`;
                  const version =
                    mode === 'reference'
                      ? lab.version
                      : { ...lab.version, referenceSolution: { code } };
                  const response = await this.owner
                    .request(
                      'codingLabs',
                      'POST',
                      '/lab-preflight',
                      identity,
                      version
                    )
                    .catch((error: unknown) => {
                      throw labPreflightError(error);
                    });
                  const checked = verificationSchema.safeParse(response);
                  if (!checked.success)
                    throw new GenerationError('LAB_PREFLIGHT_INVALID_RESPONSE');
                  const result = checked.data;
                  const passed =
                    mode === 'reference'
                      ? result.passed
                      : mode === 'baseline'
                        ? result.results.some(
                            (test) => test.status === 'failed'
                          ) &&
                          result.results.every(
                            (test) =>
                              test.status !== 'error' &&
                              test.status !== 'timeout'
                          )
                        : !result.passed &&
                          result.results.every(
                            (test) => test.status !== 'timeout'
                          );
                  return {
                    status: passed ? 'passed' : 'failed',
                    detail:
                      `${result.passedTests}/${result.totalTests} tests passed. ` +
                      (mode === 'starter' && result.passed
                        ? 'Starter already solves every test. '
                        : '') +
                      result.results
                        .map((test) => `${test.name}: ${test.status}`)
                        .join('; '),
                  };
                }
              )
            );
          }
        }
      if (input.operation !== 'check')
        rows.push(
          await this.activity(
            report,
            prefix + 'teaching-review',
            'AI review of teaching and alignment',
            'review',
            async () => {
              const result = await this.agent.review(draft, report.model);
              return {
                status: result.findings.length ? 'failed' : 'passed',
                detail: [
                  result.summary,
                  ...result.findings,
                  'Model judgment only; factual accuracy and teaching quality still require administrator review.',
                ].join('\n'),
              };
            }
          )
        );
      const failed = rows.filter((row) => row.status === 'failed');
      if (!failed.length) {
        report.ready = true;
        break;
      }
      if (
        attempt ||
        input.operation !== 'generate' ||
        failed.some((row) => this.unavailableChecks.has(row))
      )
        break;
      report.repairCount = 1;
      const repair = await this.activity(
        report,
        'repair',
        'Revise draft from check findings (1 of 1)',
        'repair',
        async () => {
          raw = await this.agent.generate(input.input, identity, {
            repair: {
              draft,
              findings: failed.map((row) => `${row.label}: ${row.detail}`),
            },
            onSkills: (skills) => {
              for (const skill of skills)
                report.activities.push({
                  id: 'repair-' + skill.name,
                  label: 'Revision: ' + skill.name.replaceAll('-', ' '),
                  kind: 'skill',
                  status: 'passed',
                  detail: 'Loaded and supplied to the revision request.',
                  skillVersion: skill.version,
                  skillHash: skill.hash,
                  startedAt: new Date().toISOString(),
                  finishedAt: new Date().toISOString(),
                });
            },
          });
          return {
            status: 'passed',
            detail:
              'Revision returned. All automated checks will run again on the revised content.',
          };
        }
      );
      if (repair.status === 'failed') break;
    }
    report.activities.push({
      id: 'human-review',
      label: 'Administrator content and visual review',
      kind: 'review',
      status: 'review_required',
      detail:
        'Inspect the preview, code, diagram source and question feedback. Confirm factual accuracy, rendering and teaching quality. Check-only runs do not include AI teaching review. A constant-answer baseline is checked; arbitrary wrong-solution mutation testing is not performed.',
    });
    report.status = 'complete';
    report.message = report.ready
      ? 'Automated checks passed. Review the materials before approving publication.'
      : 'Resolve failed checks and run preparation again before publishing.';
    await this.finish(job);
  }

  private async finish(job: Job) {
    job.finished = Date.now();
    job.report.updatedAt = new Date().toISOString();
    await this.checkpoint(job);
  }
}
