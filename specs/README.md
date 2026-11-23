# Feature specifications

## Next task: Code Maintenance

Status: Implemented; integration pending. Selected on 2026-11-22.
Local maintenance checks pass; isolated MongoDB, Docker image and live Grafana
acceptance remain pending as recorded in the handoff.

[Spec](006-code-maintenance/spec.md) · [Plan](006-code-maintenance/plan.md) ·
[Tasks](006-code-maintenance/tasks.md) · [Handoff](006-code-maintenance/handoff.md) ·
[Reusable Copilot prompt](../.github/prompts/code-maintenance.prompt.md)

T001–T010 local implementation and evidence are recorded. Older unfinished work
retains its recorded status below.

Keep implementation context in this repository so future agents can resume work
without the original conversation or other repository checkouts.

Use the [workflow](../.specify/README.md) and its templates. Create a folder such
as `001-document-search/` for actual feature work, then replace the empty index
below with relative links. A feature folder contains `spec.md`, `plan.md`,
`tasks.md`, and `handoff.md`; add supporting research/contracts only when useful.

| Feature                | Status | Spec | Plan | Tasks | Handoff |
| ---------------------- | ------ | ---- | ---- | ----- | ------- | --- |
| No feature records yet | —      | —    | —    | —     | —       | —   |

Keep one row per feature, retain completed records for rationale, and update
status when work changes. Select work from the user's request and this index;
the largest folder number is not automatically the active feature.

| Publisher migration | Deployed; authoring acceptance pending | [001](./001-publisher-migration/spec.md) | [Plan](./001-publisher-migration/plan.md) | [Tasks](./001-publisher-migration/tasks.md) | [Handoff](./001-publisher-migration/handoff.md) |

| 002 AI check repair | Deployed; live CTA verified | [Spec](002-ai-check-repair/spec.md) | [Plan](002-ai-check-repair/plan.md) | [Tasks](002-ai-check-repair/tasks.md) | [Handoff](002-ai-check-repair/handoff.md) |

| 003 Persistent workshop drafts | Deployed; live recovery verified | [Spec](003-persistent-drafts/spec.md) | [Plan](003-persistent-drafts/plan.md) | [Tasks](003-persistent-drafts/tasks.md) | [Handoff](003-persistent-drafts/handoff.md) |

- [004-deployment-cleanup](004-deployment-cleanup/spec.md): Deployment cleanup; implemented and locally verified.

- [005-service-observability](005-service-observability/spec.md): Implemented and locally verified; Grafana ingestion authorization pending.

- [007-deployment-management](007-deployment-management/spec.md): Implemented locally; automatic verification/deployment, manual publication.
