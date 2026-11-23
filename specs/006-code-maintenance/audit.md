# Code Maintenance audit

Baseline recorded 2026-11-22 before implementation. HEAD `bc9a705`; existing
changes: AGENTS.md and specs/README.md modified; .github/copilot-instructions.md,
.github/prompts/ and specs/006-code-maintenance/ untracked. Preserve these inputs.
Workspace-level entry-point paths are absent; repository-local guidance applies.

## Actual baseline

Local Node v24.9.0 / npm 11.6.0 differ from delivery Node 22.23.5 / npm 10.
`npm test -- --runInBand`: 6 suites, 66 tests pass.
`npm run test:e2e -- --runInBand`: 5 pass, 4 isolated MongoDB cases skipped.
`npm run build`, `npm run lint:check` and
`npx --no-install prettier --check 'src/**/*.ts' 'test/**/*.ts'`: pass.
No paid providers, production database, journal or deployment used.

## Source-backed dependency and responsibility map

- `src/app.module.ts`: currently registers every publisher provider/controller
  beside ConfigModule, HttpModule and ObservabilityModule. No forwardRef or cycle.
- Controller → tools/auth/config; tools → agent/owner/runs/preparations/drafts;
  preparation → agent/owner/drafts; agent → HTTP/owner/config;
  runs → owner/config; owner → HTTP/config; drafts → config/MongoDB.
- `src/publishing/publishing.controller.ts`: routing, bounded JSON after
  administrator validation, Origin/cookie selection and MCP transport lifecycle.
  These are boundary responsibilities, not misplaced persistence/use cases.
- `publishing-tools.service.ts`: shared HTTP/MCP schema dispatch, readiness and
  persisted-current checks. Retain the facade, strict schemas and compatibility.
- `publishing-run.service.ts`: private journal, ownership, exclusive creation,
  in-process active set, idempotency and uncertain-write recovery.
- `workshop-preparation.service.ts`: bounded asynchronous jobs, serialized starts,
  explicit repair budget, ownership/readiness and awaited durable checkpoints.
- `draft.repository.ts`: publisher-only collections/indexes, optimistic versions,
  serialized writes and restart interruption without replay.
- `owner.client.ts`: pinned owner DTOs, bearer-only forwarding, bounded response
  and timeouts, no redirects or owner database access.
- `draft-agent.service.ts`: approved models, private server credentials, bounded
  model calls, output parsing and verified uploader images. Tests use doubles.
- `publishing.schemas.ts` owns strict runtime/tool contracts; publisher config
  rejects unsafe owner URLs and invalid journal settings.
- `src/observability/`: independent Terminus module, native JSON logger and HTTP
  route-template logs; health GET/HEAD excluded. Request UUID currently local to
  middleware, so async business events cannot correlate.

## Prioritized findings and selected changes

1. P2: AppModule mixes composition and publisher domain registration. Move the
   existing registrations into PublishingModule with no public exports; retain
   root ConfigModule and operational ObservabilityModule. No service split is
   justified just by size; dependency flow is already acyclic.
2. P1: tools logs only generation errors as strings including field paths.
   Add bounded structured tool outcome events without input/error messages or
   arbitrary tool names. Carry locally generated request UUID via AsyncLocalStorage;
   never trust/echo client request IDs. Log private-job terminal outcomes and
   previously silent terminal checkpoint failures.
3. P2: owner requests have no safe boundary timing/outcomes. Record failed owner
   calls only (owner/method, no URL/path/payload/raw error). Tool summary and owner
   failure represent different boundaries, not repeated error stacks.
4. P2: Husky/lint-staged and format:check missing. Source/test formatting baseline
   is already clean. Gate these maintained TypeScript trees; staged formatting
   also covers supported config/scripts/docs. Explicitly exclude generated
   contracts, schema snapshots, build output and authoring skill assets.
   Do not introduce whole-repository legacy formatting drift into CI.

## Compatibility and constitution

All six principles remain satisfied: one domain; unchanged public contracts;
authorization before JSON/MCP; unchanged persistence/concurrency; regression
coverage before module movement; local evidence and external-owner handoff.
Existing tests cover generation invalid/refused/timeout, owner HTTP bytes and
credentials, receipt recovery/idempotency, preparation conflicts/foreign reads,
capacity and repair failures. Extend HTTP tests for malformed JSON before/after
authentication, Origin/member denial and owner failure before moving providers.
Do not change receipt listing semantics, async patterns or paid-model behavior.

## Integration limits

MongoDB persistence tests require PUBLISHER_TEST_MONGODB_URI and a disposable
database. Live Grafana/Alloy ingestion belongs to infrastructure owner
nginx-ngx-workshop.io; no credentials or production changes are authorized.
Local package-only installation is not an image/runtime acceptance claim.

## Final evidence

Delivery Node 22.23.5/npm 10.9.9 obtained as temporary validation tools; no runtime
or framework upgrade. Final `npm test -- --runInBand`: 7 suites / 71 pass.
`npm run test:e2e -- --runInBand`: 8 pass / 4 isolated MongoDB skipped.
Build, lint:check, format:check and both contract gen/build scripts pass.
Generated OpenAPI/discovery and contract source/dist are unchanged; four built
authoring assets present. Existing lockfile package versions are unchanged;
40 hook-related package entries added.

`node --test scripts/test-maintenance-workflow.cjs`: 4 pass on delivery runtime.
Actual clean developer, CI, no-Git/no-hook-files and production/no-dev installs
pass, with real pre-commit success/failure and partial-staging preservation.
Fixture Git commits exist only in disposable directories, which are removed.
`node --test scripts/test-publish-workflow.cjs`: 5 pass.
`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts -p
'test_deploy_production.py' -v`: 12 pass.
`git diff --check` and generated-output diff checks pass.

Implementation checks caught and fixed wrong middleware branch placement, test
input/type errors, native logger initialization noise in mock capture, and
lint-staged auto-discovery of an obsolete vendored config. The hook now uses an
explicit root config. These are resolved implementation failures, not hidden
baseline failures. Original application baseline had no failures.

Related prior handoffs confirm durable private draft/checkpoint semantics and
that live Alloy/Grafana authorization was already pending. No external source,
production database, journal, environment or collector configuration was changed.
Local Docker has no reachable server; four Mongo cases and live Grafana receipt
remain explicitly pending. See [tasks](tasks.md) and [handoff](handoff.md).
