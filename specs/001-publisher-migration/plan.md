# Plan

Move the cohesive publishing subsystem, skills and tests from the gateway working tree. Replace seed CRUD with guarded publishing endpoints; use port 3014. Keep the gateway as a bounded HTTP forwarding adapter to a fixed configured publisher URL, preserving caller credentials for publisher authorization. Generate an independent publisher contracts package; vendor its tarball for standalone gateway builds. Gateway contracts retain compatibility types and discovery via that package.

Copy the existing receipt volume into the publisher deployment configuration; never mount it to two active writers. Preparation jobs are memory-only and require drain/restart. No domain DB migration. Update CI, environment examples and local docs. Validate unit, protocol, build, lint and generated contracts locally. Live production cutover requires an operator-controlled drain and environment/volume transfer; no deployment is implied.

First-deployment correction: initialize missing runtime via exclusive 0600 creation
from allowlisted settings in the existing root-private gateway file. Validate regular
files and ownership/mode; preserve source and any existing destination. Expose a
--prepare-runtime mode for staging before promotion. Retain receipt-writer rejection
and sanitize Docker prerequisite errors. Verify with focused Python tests.
