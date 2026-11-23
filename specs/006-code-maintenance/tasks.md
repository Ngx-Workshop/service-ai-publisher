# Tasks: Code Maintenance

Status: Implemented; integration pending. Checked tasks have local evidence below.
Spec: [spec.md](spec.md) · Plan: [plan.md](plan.md)

- [x] **T001 — Establish baseline (FR-001, AC-005).** Read local instructions,
      context and previous specs; inspect git status and relevant source. Run actual
      supported tests/build/non-mutating lint/format baseline; record commands,
      versions, existing failures and infrastructure limits in `audit.md` here.
- [x] **T002 — Audit and select refactors (FR-001/002/003, AC-001).** In `audit.md`,
      map module imports/exports, provider dependencies, controllers, use cases,
      persistence and upstream adapters. List concrete findings with paths/priority;
      audit validation, config/error handling, async lifecycles and logging. Finalize
      affected files and justified scope in `plan.md`, check constitution principles,
      and record compatibility risks. No rewrite justified solely by file size.
- [x] **T003 — Characterize boundaries (FR-003, AC-001).** Before moving behavior,
      cover relevant success, invalid input, access denial, not-found/conflict and
      upstream/storage failures. Include domain-specific edge cases from the spec;
      use meaningful assertions and isolated fixtures, not implementation mirroring.
- [x] **T004 — Refactor NestJS design (FR-002/003, AC-001; after T002–T003).**
      Implement justified thin-controller, cohesive-service and feature-module changes
      in inspected source paths. Use explicit DI, minimal exports and acyclic
      dependency flow; retain guards, DTOs, contracts and persistence semantics.
      Re-run relevant regressions after each coherent change.
- [x] **T005 — Add formatting workflow (FR-004, AC-002/003; after T001).** Update
      `package.json`/lockfile with compatible Husky/lint-staged, guarded prepare setup,
      `.husky/pre-commit`, staged-only Prettier config and intentional ignores. Add
      non-mutating `format:check`/`lint:check` where missing. Preserve lifecycle behavior,
      partial staging, existing style and generated-file boundaries. Do not run a
      blanket source rewrite. Account for package-only Docker install ordering.
- [x] **T006 — Verify hooks and CI (FR-004, AC-002/003; after T005).** Add the
      non-mutating formatting/lint gate to existing validation workflow(s). In
      disposable fixtures verify formatting a staged file, preserving partial/unstaged
      edits, a failing hook blocking commit, and CI rejecting bad formatting. Check
      clean local, CI, no-Git Docker-style and production/no-dev installs; record
      actual results and any pre-existing formatting baseline strategy.
- [x] **T007 — Add domain logs (FR-005, AC-004; after T002 and relevant T004).**
      Reuse native `Logger` and `src/observability/`. Add stable safe events for key
      use-case outcomes/upstream failures, appropriate levels, bounded fields and
      useful request/run correlation. Validate propagated IDs, preserve JSON shape,
      health exclusions and existing access logs. Keep noisy repetition, secrets,
      private payloads, raw upstream errors and Grafana tokens out of logs.
- [x] **T008 — Verify logging (FR-005, AC-004; after T007).** Extend relevant tests
      for success/failure JSON shape, safe metadata, canary-secret/content exclusion,
      correlation isolation and quiet health polls. Confirm actual field placement
      against existing collector expectations. Document emitted examples and query
      guidance in `docs/observability.md`; record live Grafana receipt separately.
- [x] **T009 — Run final checks (FR-003/006, AC-001–005; after T004/T006/T008).**
      Run meaningful regression suites, build, non-mutating lint and formatting checks.
      Regenerate/build owned OpenAPI/contracts only if affected; review diffs for
      accidental API/data/auth changes. Record exact passes, baseline failures, skips
      and missing external prerequisites; do not hide failures or count empty suites.
- [x] **T010 — Complete handoff (FR-006, AC-005; after T009).** Update architecture,
      development and observability docs, this task list, `handoff.md` and feature
      index. Explain changes, evidence, remaining risks and exact next action. Keep
      blocked checks visible; leave changes ready for review. Do not commit, push,
      publish or deploy unless separately requested.

## Completion evidence — 2026-11-22

- T001–T002: [audit](audit.md) records original dirty paths, passing baseline,
  source dependency map, prioritized scope, prior persistence/observability
  handoffs and constitution check. No schema/data/auth migration selected.
- T003: HTTP characterization passed 7 tests before provider movement, including
  malformed JSON before/after auth, member/Origin denial and owner failures.
  Existing unit cases retain receipt idempotency/recovery, private reads,
  optimistic/preparation conflict and unavailable-check behavior.
- T004: PublishingModule owns existing providers with no exports/forwardRef or
  duplicate registration. Final HTTP/MCP 8 pass; unit 71 pass.
- T005–T006: Husky 9.1.7/lint-staged 16.2.7, npm-10-generated lock; existing
  dependency versions unchanged. Delivery Node 22.23.5/npm 10.9.9
  `node --test scripts/test-maintenance-workflow.cjs`: 4 pass. Real fixture
  commits verify staged formatting, partial/unstaged preservation and parser
  failure blocking commit; negative format gate is non-mutating. All four clean
  install modes pass, including no-Git/no-hook-files and no-dev production.
  CI now runs format:check and fixture checks beside existing typed lint.
- T007–T008: parsed actual native JSON success/warn events, safe tool/owner/job
  failure canaries, terminal checkpoint failures, async request isolation,
  ignored inbound IDs, real HTTP/tool correlation and quiet GET/HEAD health.
  Preparation polling does not add success-domain noise; unserializable owner
  data cannot emit a false success event. No correlation metadata is persisted.
- T009: on delivery runtime, 71 unit and 8 HTTP/MCP tests pass; build, lint:check,
  format:check and contract gen/build pass. Generated snapshots/contracts have
  no diff. All four built SKILL.md assets present. Publication workflow 5 tests
  and deployment script 12 tests pass. Compatibility hunks reviewed and
  `git diff --check` passes.
- T010: architecture, development, observability, entry point, index, spec/plan,
  audit and [handoff](handoff.md) updated. No repository commit/push/deploy.

## Outstanding integration acceptance (not checked off)

- [ ] Run the four isolated MongoDB e2e cases with PUBLISHER_TEST_MONGODB_URI;
      no test database URI is available locally.
- [ ] Validate the Docker image in CI or an available daemon; local Docker info
      cannot reach a server. Package-only install checks are not an image build.
- [ ] Infrastructure owner nginx-ngx-workshop.io confirms host Alloy authorization,
      live publisher JSON receipt in Grafana Explore and heartbeat metrics.
