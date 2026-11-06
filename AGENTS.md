# Agent entry point — service-ai-publisher

Read [.specify/memory/constitution.md](.specify/memory/constitution.md),
[architecture](docs/architecture.md), [development](docs/development.md),
[workflow](.specify/README.md) and the relevant [feature](specs/README.md).

This service owns workshop generation, images, preparation, publishing orchestration
and durable private receipts. It has no MongoDB. Domain data belongs to REST owners.
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
  See docs/migration.md before cutover or rollback. Preparation jobs are process-local.
- Main delivery publishes and deploys validated artifacts; a local build does neither.
- Consumer changes need a standalone contract handoff and context-doc updates.
