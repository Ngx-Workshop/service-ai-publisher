# Handoff: Code Maintenance

Status: Implemented; integration pending · Updated: 2026-11-22
[Spec](spec.md) · [Plan](plan.md) · [Tasks](tasks.md)

## Implemented

- PublishingModule encapsulates the existing domain providers/controller with
  explicit HttpModule dependency and no exports. AppModule is composition only.
  Controllers retain transport authorization, Origin checks and bounded JSON/MCP
  lifecycle; no business/persistence rewrite was justified by the source audit.
- Husky 9.1.7 and lint-staged 16.2.7 format supported staged files with the existing
  Prettier style and explicit root config. Guarded self-contained prepare supports
  Git developer installs, CI, package-only no-Git and production/no-dev installs.
  Generated contracts/snapshots/assets/output are ignored. CI now runs
  non-mutating format:check and the disposable hook/install checks.
- Native structured tool outcomes, failed owner requests, terminal preparation/
  run outcomes and terminal storage failures contain bounded safe metadata only.
  AsyncLocalStorage carries generated request UUIDs across awaits; incoming IDs
  are ignored. Process-local job timings/correlation never enter MongoDB.
  Successful preparation polling avoids extra domain logs. A tool dispatch
  success is not an assertion that publication/preparation succeeded.
- Context docs and feature records capture ownership, commands, logger structure,
  correlation limits and infrastructure handoff. Original worktree inputs and
  historical feature records are preserved.

## Compatibility

No route, DTO/tool schema, response/error, auth policy, owner protocol, persisted
document/receipt shape, repair budget, idempotency, concurrency or restart replay
change. No consumer contract handoff or migration is needed. Generated contract
source/dist and OpenAPI/discovery remain unchanged after regeneration. All four
authoring SKILL.md assets remain in dist. Existing dependency versions unchanged.

## Verification

Detailed baseline/findings in [audit](audit.md); task evidence in [tasks](tasks.md).
Final application commands ran on delivery Node 22.23.5/npm 10.9.9:

| Check                                                         | Actual result                                    |
| ------------------------------------------------------------- | ------------------------------------------------ |
| `npm test -- --runInBand`                                     | 7 suites / 71 tests pass                         |
| `npm run test:e2e -- --runInBand`                             | 8 pass; 4 isolated MongoDB cases skipped         |
| `npm run build`                                               | pass, strict build + generated OpenAPI/discovery |
| `npm run lint:check` / `npm run format:check`                 | pass, non-mutating                               |
| Both root contract gen/build scripts                          | pass, generated outputs unchanged                |
| `node --test scripts/test-maintenance-workflow.cjs`           | 4 pass on delivery runtime                       |
| `node --test scripts/test-publish-workflow.cjs`               | 5 pass                                           |
| Python deployment unittest command in development guide       | 12 pass                                          |
| Generated-output diff, built skill assets, `git diff --check` | pass                                             |

Hook fixtures perform real commits only in disposable Git directories: staged
formatting, partial and unrelated unstaged content preservation, parser-error
commit blocking, negative CI format rejection without edits and generated ignore
behavior. Four modes perform actual clean npm ci, not mocked lifecycle calls.
Application model/auth/owner tests use doubles and private temporary journals;
no paid generation or production publication occurred. Native JSON tests parse
actual ConsoleLogger output and cover safe success/failure, canary exclusions,
concurrent async context, HTTP/tool correlation and quiet GET/HEAD health.
Baseline had no application failures; resolved implementation failures are
recorded in the audit, not mislabeled as baseline issues.

## Remaining acceptance and external-owner handoff

1. Publisher CI/maintainer: run e2e with an isolated PUBLISHER_TEST_MONGODB_URI.
   Four cases are explicitly skipped locally; production credentials must not
   be substituted. Existing CI MongoDB service supplies the prerequisite.
2. Publisher CI/maintainer: execute existing validated Docker build/image checks.
   Local daemon is unreachable; passing package-only install is not image evidence.
3. Infrastructure owner **nginx-ngx-workshop.io**: authorize the host-owned Alloy
   token/config, confirm publisher native JSON in Grafana Explore and heartbeat
   metrics. Keep the existing selector and parse `message.event`/`message.outcome`
   as described in [observability](../../docs/observability.md). Do not create
   high-cardinality request-ID labels or application-held credentials.

No deployed/remote CI/Grafana receipt is claimed. Review this worktree, then run
those acceptance checks when prerequisites are available. Changes are not
committed, pushed, published or deployed. Host environment and one-writer journal
volume remain untouched.
