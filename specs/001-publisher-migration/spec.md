# AI publisher ownership migration

FR-001: service-ai-publisher owns workshop generation, images, preparation checks, owner adapters and durable publishing/recovery.
FR-002: The catalog gateway owns only catalog tools and a compatibility forwarding adapter for /publisher/tools and /mcp/publishing. Existing callers retain their paths and result shapes.
FR-003: Publisher validates platform administrator credentials before parsing bodies; receipt and preparation subject isolation remains enforced. No MongoDB or catalog OAuth dependency in publisher.
FR-004: Publisher builds and tests without sibling source. Preserve existing in-progress generation fixes during the move.

AC-001: Publisher unit and official MCP/HTTP tests pass using disposable doubles.
AC-002: Gateway catalog tests pass; forwarding preserves auth/errors and bounded request/response behavior.
AC-003: Both independent contract packages build; gateway consumes a packaged publisher schema snapshot.
AC-004: Deployment config assigns model secrets and receipt volume exclusively to publisher; rollout preserves existing receipts.

FR-005: First deployment can initialize missing publisher runtime from the existing
private gateway file using only publisher settings. Existing target/source files are
preserved; insecure or missing source settings fail with safe actionable messages.
AC-005: Runtime initialization tests cover secret filtering, mode, missing settings,
symlinks, and existing-file preservation; legacy writer guard remains enforced.
