# Development and verification

Use Node 22.23.3 and `npm ci`. Configure `.env.example` with reachable trusted owner
URLs, AUTH_BASE_URL and a writable absolute PUBLISHING_JOURNAL_DIRECTORY. There is
no database or OpenAPI-generation auth stub. PUBLISHING_ENABLED=true enables guarded
authoring; false returns 404. Model credentials belong only to this service.

- `npm run build`: strict TypeScript, copied skill assets, generated OpenAPI/discovery.
- `npm test -- --runInBand`: generation/check/receipt and HTTP-owner unit tests.
- `npm run test:e2e -- --runInBand`: real Nest socket and official MCP client, auth/owner doubles.
- `npm run lint:check`: non-mutating typed lint/format check.
- `npm --prefix contracts/service-ai-publisher ci`, then root contract gen/build scripts.
- `node --test scripts/test-publish-workflow.cjs`: publication failure/rerun tests.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts -p test_deploy_production.py -v`: delivery/rollback tests without Docker.

OpenAPI generation forcibly disables publishing and uses illustrative document/lab
URLs, without a listener, owner request or database. Never interpret a test double
as live model, runner, storage, auth or production acceptance.

Docker runs as uid 1000 with private journal storage. Local Compose binds 3014 only
to loopback and uses external ngx-net and ngx-publisher-runs. Production has no
host-port publication and uses the private gateway connection. The deployment script
requires a root-owned 0600 `/etc/ngx-workshop/ai-publisher/runtime.env`, checks image
identity, rejects other active journal writers and restores the previous container
on failure. See [cutover](migration.md) before initial deployment.
