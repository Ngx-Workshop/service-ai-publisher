import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { PUBLISHER_CONFIG, PublisherConfig } from '../publisher.config';
import { GenerationError } from './generation-error';
import { PreparationReport, SavedWorkshopDraft } from './publishing.schemas';

export type StoredPreparation = {
  preparationId: string;
  draftId: string;
  subject: string;
  inputHash: string;
  report: PreparationReport;
  unavailable: string[];
  finished?: number;
};
type DraftDocument = SavedWorkshopDraft & { subject: string };

@Injectable()
export class DraftRepository implements OnModuleInit, OnModuleDestroy {
  private client?: MongoClient;
  private readonly writes = new Map<string, Promise<void>>();
  private drafts!: Collection<DraftDocument>;
  private preparations!: Collection<StoredPreparation>;
  constructor(
    @Inject(PUBLISHER_CONFIG) private readonly config: PublisherConfig
  ) {}
  async onModuleInit() {
    if (!this.config.publishing) return;
    if (!this.config.mongoUri)
      throw new Error('MONGODB_URI is required for publishing');
    this.client = new MongoClient(this.config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      ignoreUndefined: true,
    });
    await this.client.connect();
    const db = this.client.db(this.config.mongoDatabase);
    this.drafts = db.collection<DraftDocument>('ai_publisher_drafts');
    this.preparations = db.collection<StoredPreparation>(
      'ai_publisher_preparations'
    );
    await this.drafts.createIndex({ draftId: 1 }, { unique: true });
    await this.drafts.createIndex({ subject: 1, updatedAt: -1, draftId: 1 });
    await this.preparations.createIndex({ preparationId: 1 }, { unique: true });
    const now = new Date().toISOString();
    for await (const job of this.preparations.find({
      'report.status': 'running',
    })) {
      job.report.status = 'failed';
      job.report.ready = false;
      job.report.updatedAt = now;
      job.report.message =
        'Processing was interrupted by a service restart. Your draft is saved. Run checks again; AI work will not restart automatically.';
      job.finished = Date.now();
      for (const row of job.report.activities)
        if (row.status === 'running') {
          row.status = 'failed';
          row.detail = 'Interrupted by service restart. Run checks again.';
          row.finishedAt = now;
          job.unavailable.push(row.id);
        }
      await this.preparations.replaceOne(
        { preparationId: job.preparationId },
        job
      );
    }
    await this.drafts.updateMany(
      { status: 'running' },
      { $set: { status: 'interrupted', updatedAt: now } }
    );
  }
  async onModuleDestroy() {
    await this.client?.close();
  }
  async loadJob(preparationId: string, subject?: string) {
    return this.preparations.findOne(
      { preparationId, ...(subject ? { subject } : {}) },
      { projection: { _id: 0 } }
    );
  }
  async get(draftId: string, subject: string): Promise<SavedWorkshopDraft> {
    const row = await this.drafts.findOne(
      { draftId, subject },
      { projection: { _id: 0, subject: 0 } }
    );
    if (!row) throw new GenerationError('DRAFT_UNAVAILABLE');
    return row;
  }
  async list(subject: string, before?: string) {
    const cursor = before ? await this.get(before, subject) : undefined;
    return this.drafts
      .find(
        {
          subject,
          status: { $ne: 'published' },
          ...(cursor
            ? {
                $or: [
                  { updatedAt: { $lt: cursor.updatedAt } },
                  {
                    updatedAt: cursor.updatedAt,
                    draftId: { $lt: cursor.draftId },
                  },
                ],
              }
            : {}),
        },
        {
          projection: { _id: 0, subject: 0, json: 0, brief: 0 },
        }
      )
      .sort({ updatedAt: -1, draftId: -1 })
      .limit(50)
      .toArray();
  }
  async begin(
    draftId: string,
    subject: string,
    preparationId: string,
    expectedVersion?: number,
    json?: string,
    brief?: SavedWorkshopDraft['brief'],
    previousPreparationId?: string
  ) {
    const now = new Date().toISOString();
    if (expectedVersion === undefined) {
      try {
        await this.drafts.insertOne({
          draftId,
          subject,
          preparationId,
          version: 1,
          name: 'Untitled workshop',
          ...(brief ? { brief } : {}),
          json: json ?? '',
          status: 'running',
          createdAt: now,
          updatedAt: now,
        });
      } catch (error) {
        if ((error as { code?: number }).code === 11000)
          throw new GenerationError('DRAFT_CONFLICT');
        throw error;
      }
    } else {
      const result = await this.drafts.updateOne(
        {
          draftId,
          subject,
          version: expectedVersion,
          status: { $nin: ['running', 'published'] },
        },
        {
          $set: {
            preparationId,
            status: 'running',
            updatedAt: now,
            ...(json === undefined ? {} : { json }),
            ...(brief ? { brief } : {}),
            ...(previousPreparationId ? { previousPreparationId } : {}),
          },
          ...(!previousPreparationId
            ? { $unset: { previousPreparationId: '' } }
            : {}),
          $inc: { version: 1 },
        }
      );
      if (!result.matchedCount) throw new GenerationError('DRAFT_CONFLICT');
    }
  }
  async save(draftId: string, subject: string, version: number, json: string) {
    let name = 'Untitled workshop';
    try {
      const parsed: unknown = JSON.parse(json);
      if (
        parsed &&
        typeof parsed === 'object' &&
        'name' in parsed &&
        typeof parsed.name === 'string'
      )
        name = parsed.name.slice(0, 160);
    } catch {
      /* Preserve incomplete editor input too. */
    }
    const result = await this.drafts.findOneAndUpdate(
      { draftId, subject, version, status: { $nin: ['running', 'published'] } },
      {
        $set: {
          json,
          name,
          status: 'edited',
          updatedAt: new Date().toISOString(),
        },
        $unset: { preparationId: '', previousPreparationId: '' },
        $inc: { version: 1 },
      },
      { returnDocument: 'after', projection: { _id: 0, subject: 0 } }
    );
    if (!result) throw new GenerationError('DRAFT_CONFLICT');
    return result;
  }
  async assertCurrent(preparationId: string, subject: string) {
    const row = await this.drafts.findOne({
      preparationId,
      subject,
      status: { $ne: 'published' },
    });
    if (!row) throw new GenerationError('PREPARATION_STALE');
  }
  async published(preparationId: string, subject: string, requestId: string) {
    await this.drafts.updateOne(
      { preparationId, subject },
      {
        $set: {
          status: 'published',
          publishedRequestId: requestId,
          updatedAt: new Date().toISOString(),
        },
      }
    );
  }
  async flush(id: string) {
    await this.writes.get(id);
  }
  checkpoint(job: StoredPreparation): Promise<void> {
    const prior = this.writes.get(job.preparationId) ?? Promise.resolve();
    const next = prior.then(() => this.writeCheckpoint(job));
    this.writes.set(job.preparationId, next);
    void next
      .finally(() => {
        if (this.writes.get(job.preparationId) === next)
          this.writes.delete(job.preparationId);
      })
      .catch(() => undefined);
    return next;
  }
  private async writeCheckpoint(job: StoredPreparation) {
    await this.preparations.replaceOne(
      { preparationId: job.preparationId },
      job,
      { upsert: true }
    );
    const report = job.report;
    await this.drafts.updateOne(
      {
        draftId: job.draftId,
        subject: job.subject,
        preparationId: job.preparationId,
      },
      {
        $set: {
          status:
            report.status === 'running'
              ? 'running'
              : report.ready
                ? 'ready'
                : 'needs_attention',
          updatedAt: report.updatedAt,
          ...(report.draft
            ? {
                json: JSON.stringify(report.draft, null, 2),
                name: report.draft.name,
              }
            : {}),
        },
      }
    );
  }
}
