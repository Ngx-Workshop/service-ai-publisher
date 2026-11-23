# Service logging and heartbeat

This service uses native NestJS 11 `ConsoleLogger` JSON output to stdout/stderr, with `Logger` context for application events. No Angular logger or application-held Grafana credential is used. HTTP logs contain generated request ID, method, route template, status and duration; bodies, cookies, authorization headers, concrete identifiers and query strings are not logged by the middleware. Health polling is excluded from access logs. Avoid embedding secrets or personal search text in domain log messages.

`GET /health` and HEAD return the anonymous operational Terminus heartbeat with `status: ok` and `heartbeat: up`, plus `Cache-Control: no-store`. This is liveness only; it does not claim MongoDB or upstream readiness. Existing business-route authentication remains enforced. The gateway's exact read-only heartbeat is the only exception to its normalized proxy-envelope requirement. The operational endpoint is excluded from business Swagger/contracts where that service generates them.

Docker probes `/health` every 30 seconds. Deployments bound each container's local JSON log files to 10 MiB × 3. Host Alloy discovers active service names and ships logs and private HTTP heartbeat probe metrics to Grafana Cloud stack `ivorytoffee195`. Collector configuration/dashboard lives in infrastructure owner `nginx-ngx-workshop.io/ops/grafana`; its ingestion token remains host-owned, scoped to logs/metrics write, and requires account authorization before activation. No production credential belongs in this repository.

Validation on 2026-11-21: the isolated observability HTTP suite passed (5 scenarios), build passed, Linux-targeted lockfile dry run passed. Guarded services additionally passed the anonymous-heartbeat/protected-business-route HTTP test. Gateway production ingress e2e passed (51 scenarios), including exact-path/method heartbeat boundaries. Gateway and publisher lint passed. Full existing unit suites passed except Backstage's unchanged Octokit ESM test-loader failure, reproduced on its pre-change HEAD. Uploader tests pass under its documented `npm test` command; its 10 optional cases remain skipped. Publisher persistence e2e cases require the isolated Mongo URI and remain skipped when unavailable. These are local checks, not evidence of Grafana ingestion or live deployment.

CI follow-up: Node 22 ships npm 10.9.9, whose optional peer resolver requires the nested webpack entry omitted by this Mac's npm 11. Regenerated the lock with npm 10.9.9; its Linux clean-install dry run passes. No runtime dependency or bundler setting changed.

## Publisher domain events (006)

Native Nest JSON retains `level` and `context` at the top level; structured event
fields live inside `message`, not at the top level. Verified by parsing actual
ConsoleLogger stdout, not by inferring collector labels.

| Event                               | Context                    | Level and meaning                                                                               |
| ----------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------- |
| `publishing_tool`                   | PublishingToolsService     | log on successful dispatch; warn on invalid input/domain rejection; error on unexpected failure |
| `publishing_owner_request`          | PublishingOwnerClient      | warn on failed owner HTTP calls only                                                            |
| `publishing_preparation`            | WorkshopPreparationService | log on ready terminal completion; warn on failed/non-ready completion                           |
| `publishing_preparation_checkpoint` | WorkshopPreparationService | error when terminal checkpointing cannot complete                                               |
| `publishing_run`                    | PublishingRunService       | log on persisted completion; warn on persisted needs_recovery                                   |

Tool dispatch success is not publication success or preparation readiness: inspect
the run/preparation terminal event. Duplicate receipt retrieval does not replay or
emit a new run execution event. Successful preparation polling produces HTTP logs
only, not additional domain summaries. Owner failure and tool/job outcome are
distinct boundary records; no raw exception or duplicate stack is logged.

Fields are bounded: approved tool name (unknown names become `unknown`), owner,
method, fixed outcome/failure classification, elapsed milliseconds and UUID
correlation IDs. No subject, credentials, content, prompts, field paths, concrete
owner URL/path, model response, receipt or raw upstream error enters these logs.
Generation failure messages still reach the original tool response; logs contain
only safe failure classification. Existing HTTP and GET/HEAD health behavior is
unchanged.

The middleware always creates a fresh UUID and ignores incoming X-Request-ID.
AsyncLocalStorage propagates that ID across awaits and detached preparation work;
concurrent requests remain isolated. `runId` and `preparationId` are validated
UUIDs; they are not Loki labels. Process-local WeakMap metadata retains preparation
start timing/correlation without changing MongoDB records. A resumed record after
restart has no original request context. This is local correlation, not distributed
tracing: owner headers are unchanged, and no client trace ID is accepted.

Illustrative native output:

```json
{
  "level": "warn",
  "context": "PublishingRunService",
  "message": {
    "event": "publishing_run",
    "runId": "11111111-1111-4111-8111-111111111111",
    "outcome": "needs_recovery",
    "durationMs": 12
  }
}
```

Once the infrastructure owner confirms the actual stream selector, append:

```logql
| json event="message.event", outcome="message.outcome", requestId="message.requestId"
| event="publishing_tool"
```

Use the stream's existing infrastructure-owned service selector; do not assume
a new application label. Filter request/run IDs as parsed fields, not labels.
Local JSON/context/redaction/failure/quiet-health tests pass. Live Grafana receipt
remains pending infrastructure owner nginx-ngx-workshop.io: authorize host-owned
Alloy ingestion, confirm one publisher terminal event in Explore and verify
heartbeat metrics. No application Grafana token, SDK, deployment or paid test is
part of this maintenance.
