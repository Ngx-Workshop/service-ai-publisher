# service-ai-publisher

Owns AI workshop drafting, generated images, preparation/check jobs and publishing
receipts. Native administrator endpoints: `/publisher/tools` (browser facade) and
`/mcp/publishing` (stateless MCP). Default port: 3014. All tool requests require
platform administrator authorization through service-auth. There is no MongoDB.

Use Node 22.23.3. Run `npm ci`, copy `.env.example` to `.env`, supply trusted owner
URLs and a private writable journal directory, then `npm run start:dev`. Set
`OPENAI_API_KEY` privately for paid generation. Validation and publication do not
require model credentials. Tests use doubles and never call paid providers.

`npm run build`, `npm test -- --runInBand`, `npm run test:e2e -- --runInBand` and
`npm run lint:check` verify the service. Generate/build the independent contract
package using `npm run contracts:service-ai-publisher:gen` and
`npm run contracts:service-ai-publisher:build` after installing its tooling with
`npm --prefix contracts/service-ai-publisher ci`.

Existing callers can continue using the catalog gateway's compatibility endpoints.
See [migration and cutover](docs/migration.md), [architecture](docs/architecture.md),
[development](docs/development.md) and [publishing behavior](docs/workshop-publishing.md).
Main pushes validate, publish contracts through npm OIDC and promote the validated
image. Initial cutover requires the host configuration and existing receipt volume;
local implementation does not deploy them.
