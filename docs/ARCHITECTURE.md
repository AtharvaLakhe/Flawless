# Flawless — Proposed Architecture

Updated: 2026-09-10 · Status: Draft; vendor choices remain proposed

## 1. Structure

Use one backend codebase with separately running request handling and job coordination. Keep source scanning outside web requests and outside trusted coordinator processes.

```text
Browser / dashboard on Vercel       GitHub App webhooks
                \                   /
                 FastAPI control API
                    |           |
          Supabase Postgres   Durable job queue
                    ^           |
                    |     Trusted coordinator
                    |           |
                    |     Isolated scan tasks
                    |     Gitleaks / Semgrep / Trivy
                    |           |
                    +-- Validated, sanitized evidence
                    |
             Policy evaluation
                 /       \
        Private report   GitHub check publication
                              |
                 Protected merge / deployment workflow
```

## 2. Proposed stack

| Responsibility | Recommendation | Boundary / trade-off |
| --- | --- | --- |
| Dashboard | Existing Next.js + TypeScript, Tailwind, shadcn/ui on Vercel | Reuse the application foundation. Keep marketing animations outside essential report interactions. |
| API | Python + FastAPI on an always-available Render service | Own authorization, webhooks, scan requests, and report access. No scanning inside an HTTP request. |
| Job coordinator | Python process deployed separately from API, initially as a managed background service | Claims jobs, launches tasks, checks progress, and handles recovery/publication. Verify provider setup during feasibility work. |
| Database | Supabase Postgres | Durable metadata, findings, policy decisions, and audit events. Use version-controlled migrations. |
| Identity | Supabase Auth, initially GitHub sign-in if acceptable to the team | Authentication does not grant repository membership or GitHub App installation rights. SSO requirements remain open. |
| Queue | Supabase Queues | Avoid Redis initially. Visibility/lease management, retry limits, and idempotency still belong to our application. |
| Scan runtime | Docker images executed as AWS ECS Fargate tasks | Managed task isolation; requires IAM/network configuration and has startup latency. Fargate runs the containers: do not assume nested Docker access. |
| Report storage | Private Supabase Storage | Store sanitized artifacts with controlled retention; no public report buckets. |
| Integration | GitHub App + Checks API | Scoped repository access and check summaries with a report link. |
| Release workflow | GitHub Actions | Checks the release input and applicable approval before using deployment authority. |
| Tests | pytest, Playwright, GitHub Actions | Adapter/policy tests, UI access tests, and real enforcement tests. |

Use managed secrets and provider logs initially. Select additional error tracking only if built-in logs and alerts do not meet operational needs. Pin scanner images and rule versions; select supported patched application dependencies during implementation.

## 3. Source scan lifecycle

1. Verify the user request or GitHub webhook signature and repository authorization. Deduplicate delivery IDs.
2. Resolve the target to repository identity and immutable commit SHA; persist a scan and durable job atomically where supported, or through a recoverable outbox.
3. Publish a queued/in-progress check. A publication failure is recorded and retried independently.
4. The coordinator claims work with a renewable lease. Limit global and per-repository concurrency.
5. A controlled ingestion step fetches the exact source using scoped credentials. Do not expose GitHub write credentials to scanners. Supply source through an access-limited transfer mechanism selected during the runtime spike.
6. Launch isolated scanner tasks with pinned rules, bounded resources, and writable output areas outside source paths. Source should be read-only wherever supported.
7. Validate report size and schema, redact sensitive evidence, and record per-scanner completion and coverage. Scanner exit codes are interpreted per tool/version.
8. Normalize observations, deduplicate proven identities, apply the versioned policy, and persist results before publishing completion.
9. Publish GitHub completion with a link to the exact report. Reconcile failed publications and abandoned jobs.
10. Remove source and temporary artifacts according to the cleanup policy, including on failures.

Retry attempts are distinct records. Only the authoritative attempt for a gate evaluation may publish its terminal decision; late attempts cannot overwrite a newer result. A queue delivery is not an exactly-once guarantee for external effects.

## 4. Minimum logical data model

These are conceptual records, not approved SQL or API wire schemas.

| Record | Necessary information |
| --- | --- |
| Team / membership | Identity, role, and authorized repository access. |
| Repository connection | Stable GitHub repository and installation IDs, supported scope, enforcement setup. |
| Scan run | Repository, target SHA, purpose, state, timestamps, attempt identity, policy snapshot, completeness. |
| Scanner execution | Tool/image/rules versions, intelligence provenance, coverage, exit status, error, artifact reference. |
| Finding and observations | Stable fingerprint, category, source evidence, available location, severity, rule/advisory/package identities, context confidence. |
| Policy decision | Findings evaluated, pass/warn/block, rule reasons, version, applicability and freshness. |
| Deployment evaluation | Commit, artifact digest if relevant, environment, approval references, workflow identity. |
| Integration delivery | Webhook deduplication and outgoing GitHub publication/retry state. |
| Audit event | Actor, action, target, time, and reason for sensitive changes. |

Locations and fixed versions may be absent; never fabricate them. Preserve multiple observations for a correlated finding. Shared file/line is insufficient identity. Add exception records only if an exception process is approved.

## 5. Application interfaces

The implementation should expose authenticated capabilities to request a scan, list scan history, retrieve progress and paginated findings, and retrieve the applicable deployment decision. GitHub needs a signed-webhook receiver. Workers need narrowly scoped job and evidence interfaces.

Use FastAPI's schema as the shared API contract and derive frontend types from it. Do not duplicate scoring or authorization rules in Next.js. Exact routes and request/response schemas will follow the unresolved scope decisions.

Start dashboard progress with bounded polling while a scan is active. Reports require authorization on every access, including artifact downloads. No Supabase privileged key or GitHub App private key belongs in frontend bundles.

## 6. Merge and deployment enforcement

- Publish one stable required Flawless check for the evaluated PR input. Repository protection and bypass settings are part of onboarding, not an assumption.
- At deployment, evaluate the actual release commit. A different merge commit requires its own applicable evidence.
- If deployment uses an artifact, associate approval with its digest and build provenance. Source scanning alone does not establish container or binary coverage.
- Define freshness and policy-change behavior before implementing approval reuse.
- GitHub Actions must authenticate to the decision service with verified workflow/repository identity. Prefer short-lived identity; exact exchange remains to be specified.
- Protect deployment workflow changes and credentials so removing the verification step cannot bypass the gate unnoticed.
- Backend unavailability, incomplete evidence, or mismatched input cannot authorize deployment. Any emergency bypass requires a separately approved, audited process.

## 7. Security and operational boundaries

- Authorize repository ownership and membership independently of GitHub login.
- Keep coordinator/database/GitHub write credentials outside scanner tasks; narrowly scope task artifact access.
- Restrict clone destinations, protocols, redirects, outbound access, and task privileges. Never interpolate repository input into shell commands.
- Bound repository size, file count, output, runtime, CPU, memory, and disk. Define submodule, LFS, symlink, and archive behavior.
- Scanner configuration and allowlists must come from trusted policy; a PR must not silently disable its own checks.
- Explicitly select Trivy scanners and Gitleaks history/directory scope. Use pinned Semgrep rules instead of relying on a changing auto configuration.
- Cache scanner intelligence through controlled updates. Record versions/freshness; do not let untrusted scans poison shared caches.
- Monitor queue age, lease expiry, failed scans, retry exhaustion, failed check updates, database capacity, and cleanup failures.
- Test backups and restore. Keep completed decisions immutable; record reevaluation separately.
- LLM processing is optional and subject to approved data-sharing policy. Treat generated output as untrusted display content.

## 8. Alternatives and sources

A dedicated Docker VM can reduce initial AWS setup but transfers patching, recovery, scaling, and isolation operations to the team. It is an alternative, not an approved replacement. Ordinary Vercel Functions are not the proposed heavy scanner runtime. No claim of zero latency or performance compromise is made; benchmark before sizing.

Official references reviewed during planning (provider limits can change):

- [Vercel Function limits](https://vercel.com/docs/functions/limitations)
- [Supabase Queues](https://supabase.com/docs/guides/queues), [Auth](https://supabase.com/docs/guides/auth), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), [private storage](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Render web services](https://render.com/docs/web-services)
- [AWS Fargate task isolation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [GitHub App installation authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/authenticating-as-a-github-app-installation), [Checks API](https://docs.github.com/en/rest/checks/runs), [required checks](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Gitleaks](https://github.com/gitleaks/gitleaks), [Semgrep CLI](https://docs.semgrep.dev/cli-reference), [Trivy filesystem coverage](https://trivy.dev/docs/latest/target/filesystem/)
