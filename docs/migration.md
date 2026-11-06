# Gateway → AI publisher cutover

Updated 2026-11-06. Initial deployment runtime preparation is implemented; production cutover remains pending.

## Ownership and compatibility

The complete publishing subsystem moved, including generation, image upload/generation,
skill assets, private preparation state, checks, owner clients and durable publishing
runs. Gateway `/mcp` remains unchanged. Gateway `/publisher/tools` and `/mcp/publishing`
forward bounded opaque requests to a fixed AI_PUBLISHER_BASE_URL; the publisher
validates credentials before parsing JSON. Gateway forwarding permits 8 MiB bodies
and responses, disallows redirects/proxies and waits up to 600 seconds. Existing
Nginx timeout remains an external limit; async preparation uses short polling calls.
Gateway errors return 502 publisher_unavailable if the owner cannot be reached.

The publisher's independent `@tmdjr/service-ai-publisher-contracts` 1.0.0 replaces
seed CRUD exports. It is built locally, not yet registry-published. Gateway vendors
the reproducible package tarball for isolated builds and retains the prior publishing
exports/discovery in its own package. Current frontend can keep its package and
`/api/publisher/tools` path; adoption of the new contract package is optional.
To refresh compatibility, generate/build publisher contracts, `npm pack --ignore-scripts`
into the gateway vendor directory, refresh its lockfile, build gateway and regenerate
its contracts. No checkout dependency exists at runtime or in CI.

## Initial production sequence

1. Pause new administrator publishing/generation, drain active operations, save any
   needed preparation drafts and back up the private ngx-publisher-runs volume.
   Preparation IDs are memory-only and cannot survive the move; recheck drafts after restart.
2. Initialize the private publisher runtime using `python3 scripts/deploy-production.py
   --prepare-runtime` on the application host as root. The deployment script also
   performs this on first deployment if the file is missing. It copies only publisher
   owner/auth/model settings from the existing private gateway runtime, sets port 3014,
   NODE_ENV=production, PUBLISHING_ENABLED=true and the existing journal path. It
   creates `/etc/ngx-workshop/ai-publisher/runtime.env` at mode 0600 and never overwrites
   an existing file or changes the source. Missing/insecure/incomplete source settings
   fail explicitly, without exposing values. Alternatively provision the file from
   `.env.example` with actual settings. Keep both files outside CI/source.
3. Set gateway AI_PUBLISHER_BASE_URL=http://service-ai-publisher:3014 and retain
   PUBLISHING_ENABLED=true. Remove its model API key, model catalog, assessment/uploader
   URLs and journal settings. Preserve all catalog OAuth/ingress settings.
4. Deploy the new gateway first. It no longer mounts or writes ngx-publisher-runs.
   Compatibility calls may return 502 until publisher is ready; keep publishing paused.
5. Deploy publisher on ngx-net using the same existing ngx-publisher-runs volume,
   writable by uid 1000. The script rejects another running journal writer. No
   receipt-format conversion or domain database migration is required. Do not use
   a fresh empty volume in place of the existing journal.
6. Verify missing credentials yield 401 through both paths; verify a real admin can
   read their existing history and cannot read another subject's receipt. Run import/check
   with /lab-preflight, then resume new work. Paid generation/live publication requires
   explicit operational acceptance and funded model access, not the local tests.

Before rolling back to a legacy gateway image, stop publisher so it cannot share
journal writes. Restore the gateway's original private environment/volume mount and
inspect uncertain receipts before any retry. Do not delete journals or mint a new
request ID to retry an uncertain mutation. Existing Nginx browser/agent routes can
remain on the gateway; no browser endpoint change is required. Configure npm OIDC
for the new package before its first release. Deployment workflow uses the validated
image and host-owned environment, replacing the seed database-based deployment.

## First deployment failure — run 42302561829

Validation, image build, contract publication and artifact transfer succeeded. The
promotion script failed before Docker promotion because the new publisher runtime
file did not exist; FileNotFoundError fell through to its generic error handler.
Read-only host checks confirmed the missing file and all required publisher settings
in the private legacy gateway runtime. The old gateway still mounts ngx-publisher-runs;
the existing publisher container is the seed image without a journal mount.

The runtime preparation helper now creates the missing file using an exclusive create
and allowlisted settings, validates regular-file ownership/mode, preserves existing
files, and gives actionable missing-setting/configuration errors. Docker network/volume
preflight failures also have safe messages. The single-writer guard remains mandatory:
deploy the gateway extraction before publisher promotion. Retrying publisher while the
legacy gateway remains active will intentionally stop at that guard. Twelve local
Python regression tests pass, including initialization, secret filtering, missing and
insecure configuration, symlinks, existing-file preservation and deployment rollback.
