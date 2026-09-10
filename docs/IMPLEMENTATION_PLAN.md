# Flawless — Implementation and Verification Plan

Updated: 2026-09-10 · Status: Proposed; no implementation authorized by this document

## Phase 0 — Resolve scope and prove feasibility

- Resolve launch-blocking questions in [DECISIONS.md](DECISIONS.md).
- Select one representative repository and deployment workflow, supported languages/lockfiles, and explicit secret scan scope.
- Verify GitHub permissions, required-check availability, deployment protection, managed-provider budget, regions, and container execution capabilities.
- Define category blocking policy, unknown/incomplete coverage behavior, approval freshness, and any exception process.
- Benchmark real scanner outputs and task startup on representative inputs; establish resource and latency targets.

Exit: approved pilot boundaries, policy examples, operating budget, and a verified execution/enforcement design. Do not promise dates from the old hackathon schedule.

## Phase 1 — Trusted foundation and one real scan

- Retain the Next.js frontend; establish Python backend and separate coordinator roles.
- Implement team/repository authorization, durable scan/job records, migrations, and protected report access.
- Connect a GitHub App and verify/deduplicate webhooks.
- Run Gitleaks in an isolated task, sanitize its output, and expose progress plus a real report.
- Add bounded retries, leases, cleanup, and independent check-publication tracking from the start.

Exit: one authorized request survives browser closure and worker restart; an unauthorized user cannot view it; execution failure never yields approval.

## Phase 2 — Prove both enforcement paths

- Publish the required PR check and configure actual repository protection.
- Add a protected GitHub Actions deployment path that verifies the exact release input.
- Test blocked, missing, stale, and mismatched decisions, plus new commits after a passing scan.
- Review workflow modification permissions, deployment credentials, and any bypass behavior.

Exit: real merge and deployment rejection demonstrated on the pilot repository. Do this before investing in dashboard polish.

## Phase 3 — Complete scanning and policy

- Add Semgrep and Trivy adapters with pinned tool/rule versions and explicit coverage.
- Normalize sanitized real-output fixtures; retain all source observations.
- Implement conservative identity-based deduplication and explainable policy evaluation.
- Apply the approved category rules to all supported findings, including pre-existing blockers.
- Validate incomplete scans, unsupported targets, missing metadata, and historical-secret handling.

Exit: all required scanners contribute verified evidence; deterministic decisions match reviewed policy fixtures.

## Phase 4 — Operational dashboard and remediation

- Add repository selection, scan history, active progress, verdicts, paginated/filterable findings, and exact-report links.
- Show evidence, coverage, policy reasons, and tool versions without exposing raw secrets.
- Provide template-based remediation, including revoke-first secret guidance.
- Keep illustrative marketing content clearly separate from real reports.
- Add optional LLM explanations only after data-sharing rules are approved; failure must not affect gating.

Exit: a developer can understand, remediate, and rescan a finding end to end.

## Phase 5 — Pilot readiness

- Set and measure concurrency, timeouts, cost alerts, queue-age alerts, and scanner-intelligence update behavior.
- Exercise backups, restores, cleanup, token revocation, failed publication recovery, and incident procedures.
- Establish deployment rollback and schema-migration procedures; test migrations on a disposable database before rollout.
- Audit existing frontend dependencies, enable meaningful type/lint verification, and keep unused experiments out of deployment.
- Document the service owner and support process. Review measured reliability and latency against agreed targets.

Exit: the PRD pilot criteria are met and launch-blocking decisions are closed.

## Required verification matrix

| Area | Essential scenarios |
| --- | --- |
| Adapters | Clean output, findings, malformed/oversized output, unexpected schema, missing location, unsupported lockfile, partial scan, timeout. |
| Policy | Blocking secret, known dependency vulnerability, SAST finding, unknown severity/context, threshold boundaries, no blockers, adding harmless findings never clears a block. |
| Deduplication | Repeated identical observation; advisory aliases; two different issues at the same line; multiple package versions. |
| Jobs | Duplicate webhook, duplicate queue delivery, lease expiry, coordinator restart, scanner crash, canceled/stale attempt, disk exhaustion. |
| GitHub | Wrong SHA, updated PR, late retry, revoked installation, API error, failed result publication, report deep link. |
| Enforcement | Actual rejected merge and deployment; missing approval; different merge commit; changed artifact digest; stale policy; service outage. |
| Security | Cross-team/repository report access, unauthenticated scan, forged webhook, clone URL abuse, command injection input, symlink escape, repository-controlled suppression, secret redaction. |
| Operations | Intelligence update failure, cleanup failure, retry exhaustion, backup restoration, migration failure, resource saturation. |
| UI / AI | Progress after refresh, empty/large reports, expired access, copy guidance, safe rendering, unavailable LLM, untrusted instructions in finding text. |

Use pytest for adapters/policy and integration behavior; Playwright for user journeys. Use inert secret fixtures and controlled vulnerable dependencies. Record sanitized real scanner output as regression fixtures. A fixture is test evidence, not a claim of a live scan.

## Delivery discipline

- Implement in small reviewable changes; do not begin with a repository rewrite or microservice split.
- Keep database migrations versioned and define one schema-migration authority across backend and Supabase resources.
- Approve exact API contracts after scope decisions; generate frontend types from the backend contract.
- Update PRD, architecture, and decisions when behavior changes.
- Do not provision services, alter branch rules, or deploy merely because they appear in this plan; those are subsequent implementation activities.
