# Integration checklist

service-ai-publisher owns workshop authoring at native `/publisher/tools` and
`/mcp/publishing`, port 3014. The gateway forwards existing browser `/api/publisher/tools`
and agent publishing requests. There is no `/ai-publisher` CRUD API and no MongoDB.

Use the host-owned environment and existing receipt volume described in
[cutover](docs/migration.md). Deploy only after draining the legacy writer. Current
architecture and development docs supersede the seed adoption baseline.
