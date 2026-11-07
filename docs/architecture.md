# Architecture

Updated 2026-11-06. Adopted from the gateway publishing working tree, preserving
existing generation/preflight fixes. The seed example CRUD and MongoDB are removed.

HTTP/MCP → PublishingController administrator authorization → PublishingToolsService
→ DraftAgentService / WorkshopPreparationService / PublishingRunService → trusted
REST owner adapters. Native endpoints are `/publisher/tools` and `/mcp/publishing`.
The publisher exposes thirteen authoring tools; no catalog endpoint is registered.

`src/publisher.config.ts` validates owner URLs, port, model settings and absolute
journal path. `src/main.ts` disables automatic body parsing so authorization runs
before bounded JSON processing. The controller validates bearer credentials with
service-auth; browser cookies require the allowed administrator Origin. Production
allows https://admin.ngx-workshop.io, development allows localhost/127.0.0.1:4201.
Foreign subjects cannot read private preparation jobs or publication receipts.

`src/publishing/` owns generation format, four skill assets, checks, error diagnostics,
owner clients and orchestration. Skills are copied to dist by Nest. Preparations
are bounded in-memory jobs; receipts remain durable in `/var/lib/ngx-publishing`.
One process writes the journal. Reference solutions/hidden tests remain private.

Owner boundaries: service-document, service-coding-labs (including /lab-preflight),
service-assessment-test, service-uploader and service-auth. No direct database access.
The gateway consumes a standalone publisher contract tarball and forwards its two
legacy authoring paths here. Catalog protocol, OAuth, readiness and three public
read-only tools remain in service-mcp-gateway. Browser callers and existing gateway
contract consumers retain their current shapes and paths.

The publisher package exports independent input/output types, mcpPublisherContract
and publisherSchemas. Source schemas generate OpenAPI and discovery; the gateway's
compatibility schemas are generated from that packaged snapshot, without importing
publisher source. See [migration](migration.md) for rollout and receipt ownership.

## Explicit AI repair of failed checks

get_workshop_repair_options reads server-authoritative eligible failed content rows.
start_workshop_preparation operation repair binds a new job to the owned source
report hash and activity, calls one revision and reruns checks plus teaching review.
The old report/receipt shapes remain unchanged. No owner resources are written.
See specs/002-ai-check-repair/handoff.md for compatibility, security and release.
