# Architecture

Updated 2026-11-06. Adopted from the gateway publishing working tree, preserving
existing generation/preflight fixes. The seed example CRUD and MongoDB are removed.

HTTP/MCP → PublishingController administrator authorization → PublishingToolsService
→ DraftAgentService / WorkshopPreparationService / PublishingRunService → trusted
REST owner adapters. Native endpoints are `/publisher/tools` and `/mcp/publishing`.
The publisher exposes sixteen authoring tools; no catalog endpoint is registered.

`src/publisher.config.ts` validates owner URLs, port, model settings and absolute
journal path. `src/main.ts` disables automatic body parsing so authorization runs
before bounded JSON processing. The controller validates bearer credentials with
service-auth; browser cookies require the allowed administrator Origin. Production
allows https://admin.ngx-workshop.io, development allows localhost/127.0.0.1:4201.
Foreign subjects cannot read private preparation records or publication receipts.

`src/publishing/` owns generation format, four skill assets, checks, error diagnostics,
owner clients and orchestration. Skills are copied to dist by Nest. Preparations
use a bounded active/cache Map backed by MongoDB checkpoints; receipts remain durable in `/var/lib/ngx-publishing`.
One process writes the journal. Reference solutions/hidden tests remain private.

Owner boundaries: service-document, service-coding-labs (including /lab-preflight),
service-assessment-test, service-uploader and service-auth. No access to other services' database collections.
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

## Persistent drafts (003) — 2026-11-07

DraftRepository owns ai_publisher_drafts and ai_publisher_preparations in the configured
MongoDB database. MONGODB_URI is mandatory when publishing is enabled; MONGODB_DATABASE
selects the database (default ai_publisher). Production uses the existing shared database
with separate publisher collections. Credentials never enter draft/preparation documents.
MongoDB indexes unique draft/preparation IDs and subject/updatedAt/draftId for private
cursor-paged lists. Save/begin operations use optimistic draft versions; source edits
invalidate current preparation evidence. Immutable preparation snapshots retain repair
outage provenance. Checkpoints are serialized, awaited before AI work and after activities.
Startup marks running records interrupted and non-ready without replay. One writer remains
required, as with the receipt journal. Terminal evidence does not expire after one hour.

New tools: list_workshop_drafts, get_workshop_draft, save_workshop_draft. Preparation
inputs accept draftId/draftVersion; repairs retain the prior preparation reference for
restoring review after refresh. Generation brief/model and source edits are durable.
Published drafts leave Your drafts; stable draft-based publication request IDs preserve
receipt idempotency after refresh. No owner schema changes or historical migration.
