# Development and verification

Use Node 22.23.5 and `npm ci`. Configure `.env.example` with reachable trusted owner
URLs, AUTH_BASE_URL and a writable absolute PUBLISHING_JOURNAL_DIRECTORY. Configure MONGODB_URI and MONGODB_DATABASE for publisher-owned persistence. There is
no OpenAPI-generation auth stub. PUBLISHING_ENABLED=true enables guarded
authoring; false returns 404. Model credentials belong only to this service.

- `npm run build`: strict TypeScript, copied skill assets, generated OpenAPI/discovery.
- `npm test -- --runInBand`: generation/check/receipt and HTTP-owner unit tests.
- `npm run test:e2e -- --runInBand`: real Nest socket and official MCP client, auth/owner doubles.
- `npm run lint:check`: non-mutating typed lint/format check.
- `npm run format:check`: non-mutating Prettier gate for maintained source/test
  TypeScript (the verified existing formatting baseline).
- `npm --prefix contracts/service-ai-publisher ci`, then root contract gen/build scripts.
- `node --test scripts/test-publish-workflow.cjs`: publication failure/rerun tests.
- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s scripts -p test_deploy_production.py -v`: delivery/rollback tests without Docker.

OpenAPI generation forcibly disables publishing and uses illustrative document/lab
URLs, without a listener, owner request or database. Never interpret a test double
as live model, runner, storage, auth or production acceptance.

Docker runs as uid 1000 with private journal storage. Local Compose binds 3014 only
to loopback and uses external ngx-net and ngx-publisher-runs. Production has no
host-port publication and uses the private gateway connection. The deployment script
initializes a missing root-owned 0600 `/etc/ngx-workshop/ai-publisher/runtime.env`
from allowlisted private gateway settings without overwriting existing files, checks image
identity, rejects other active journal writers and restores the previous container
on failure. See [cutover](migration.md) before initial deployment.

AI check repair regression tests use model/owner doubles. Never use a paid provider
call as a unit/UI test. Regenerate discovery/OpenAPI and contracts after changing
repair schemas. Contracts 1.1.0 source is locally generated; publication is separate.

Persistent draft tests: PUBLISHER*TEST_MONGODB_URI=mongodb://127.0.0.1:27184 npm run test:e2e -- --runInBand.
The suite uses a unique publisher_test*\* database and drops only that isolated database.
CI supplies MongoDB 7.0 and runs these cases. Without the test URI they are explicitly
skipped; ordinary auth/MCP tests use doubles. Production credentials stay host-owned.

## Deployment storage policy

See [deployment cleanup](deployment-cleanup.md) for success-only image/container retention and local verification.

## Service observability

See [logging and heartbeat](observability.md) for operational endpoint semantics, JSON logging, collector ownership and actual validation.

## Staged formatting

`npm ci` enables Husky on developer Git checkouts. Pre-commit invokes the installed
lint-staged with the explicit root config, formatting only staged supported
TypeScript/JavaScript, JSON, Markdown and YAML files. Default stash/hide behavior
preserves partially staged and unrelated unstaged changes; parser failures block
the commit. No package download occurs at commit time.

The self-contained prepare command skips CI, HUSKY=0, production, omitted dev
dependencies and no-Git installs, without requiring a copied installer script.
Existing Docker install/prune `--ignore-scripts` behavior is unchanged.
Prettier ignores generated contracts/snapshots, build/coverage output, versioned
authoring assets and fixtures. CI gates the already-clean source/test baseline;
it does not silently impose a whole-repository formatting rewrite.

Run `node --test scripts/test-maintenance-workflow.cjs` for four disposable
clean-install/real-Git-hook cases: developer and partial staging, CI, package-only
no-Git and production/no-dev. Fixtures clean their private temporary directories.
Validated with delivery Node 22.23.5/npm 10.9.9. Local application regressions also
pass on Node 24.9.0; Docker daemon and live Grafana remain separate prerequisites.

Deployment and npm publication now follow [deployment-workflows](deployment-workflows.md).
