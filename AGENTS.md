# Agent entry point — service-ai-publisher

Read [.specify/memory/constitution.md](.specify/memory/constitution.md),
[architecture](docs/architecture.md), [development](docs/development.md),
[workflow](.specify/README.md) and the relevant [feature](specs/README.md).

This service owns workshop generation, images, preparation, publishing orchestration
and durable private receipts. Publisher-owned drafts and preparation evidence persist in MongoDB. Published domain data belongs to REST owners.
The catalog gateway retains only forwarding compatibility; catalog OAuth belongs there.

- Inspect git status and preserve unrelated changes. Maintain local spec/plan/tasks/handoff.
- Require validated platform administrator credentials before JSON/tool processing;
  never add a local auth bypass. Keep preparation and receipt ownership checks.
- Use owner APIs and pinned published contracts; never access owner databases.
- Schemas in src/publishing/publishing.schemas.ts own tool contracts. Regenerate
  OpenAPI, mcp-tools.json and contracts after changes; never hand-edit generated files.
- Keep all four versioned authoring SKILL.md assets in the built image.
- Verify unit/HTTP/MCP behavior, strict build, lint:check and contract generation/build.
  Tests use doubles and private temporary journals; never run paid generation as a test.
- Preserve the host-owned environment and ngx-publisher-runs volume. Run one writer.
  See docs/migration.md before cutover or rollback. Drafts and preparation checkpoints are durable; active execution is process-local.
- Main delivery publishes and deploys validated artifacts; a local build does neither.
- Consumer changes need a standalone contract handoff and context-doc updates.

## Next task: Code Maintenance

The selected work is [Code Maintenance](specs/006-code-maintenance/spec.md)
(Implemented; integration pending).
Read its [plan](specs/006-code-maintenance/plan.md), [tasks](specs/006-code-maintenance/tasks.md) and
[handoff](specs/006-code-maintenance/handoff.md). Resume its integration checks; retain older unfinished
feature records without treating them as the next task. The requested work covers
NestJS module/domain boundaries, thin controllers, cohesive services, Prettier
with Husky/lint-staged, CI checks and safe domain logging through existing
observability. Local implementation is verified; isolated MongoDB, Docker image
and live Grafana acceptance remain separate pending checks.
