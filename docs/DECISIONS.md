# Flawless — Decision Register

Updated: 2026-09-10 · Status: Review required

## Confirmed user decisions

| ID | Decision |
| --- | --- |
| C-01 | Build a usable internal team pilot. |
| C-02 | Run scanners in the Flawless backend rather than relying on existing CI reports. |
| C-03 | Enforce both PR merges and deployments. |
| C-04 | Use GitHub Actions as the first deployment enforcement path. |
| C-05 | Evaluate all blocking findings, including existing ones, within the defined scan scope. |
| C-06 | Provide a GitHub-visible result with access to the corresponding Flawless report. |
| C-07 | Prefer managed services such as Vercel and Supabase to reduce implementation effort. Exact vendors and spend have not been approved. |

## Proposed technical decisions

| ID | Proposal | Reason / qualification |
| --- | --- | --- |
| P-01 | Reuse Next.js on Vercel. | Existing frontend foundation; no reason to introduce another UI framework. |
| P-02 | Python/FastAPI API plus separate trusted coordinator. | Keep scanning and durable jobs outside web requests. |
| P-03 | Supabase Postgres, Auth, Queues, and private Storage. | Consolidate managed infrastructure; access rules and job recovery still need implementation. |
| P-04 | Render for API/coordinator; AWS Fargate for isolated scan tasks. | Separate trusted application operations from repository analysis. Validate operational complexity and cost first. |
| P-05 | GitHub App with Checks API. | Repository-scoped integration and rich PR results. Login and App installation remain separate concepts. |
| P-06 | Deterministic policy rules; optional AI explanations. | Reproducible enforcement independent of LLM availability or output. |
| P-07 | Poll active scans initially. | Avoid a real-time transport dependency until needed. |

These proposals are not a promise of unlimited throughput, zero startup delay, or free hosting.

## Open decisions before dependent implementation

| ID | Question | Why it changes the design | Suggested respondent |
| --- | --- | --- | --- |
| O-01 | Which languages, package managers, repository sizes, and first deployment artifact must be supported? | Determines coverage, image scanning needs, identity/provenance, and worker sizing. | Technical lead |
| O-02 | Which login/SSO, team membership, and GitHub App installation permissions are available? | Determines onboarding, authorization, and integration feasibility. | Team administrator |
| O-03 | Do secret scans cover current files, a commit range, or complete history? | Deleting a secret from the latest file does not resolve a history finding. | Security owner |
| O-04 | What category rules block or warn, and may anyone grant exceptions? | Determines policy tests, false-positive handling, and audit requirements. If exceptions are allowed, define approver, reason, expiry, and scope. | Security/product owner |
| O-05 | How fresh must approvals and vulnerability intelligence be? What happens after policy changes? | Determines rescanning and approval reuse at deployment. | Security/operations |
| O-06 | What scan volume, concurrency, latency target, monthly budget, and delivery date apply? | Determines runtime/hosting choices and whether the proposed multi-provider setup is justified. | Product/operations |
| O-07 | May sanitized findings or source snippets go to an external LLM? | Determines whether optional AI can be enabled and which inputs it may receive. | Data/security owner |
| O-08 | What source/report retention, backup, residency, and deletion rules apply? | Determines storage settings, cleanup, restore, and provider regions. | Data/operations |
| O-09 | Who owns service incidents and emergency deployment bypass, if any? | A gate outage can stop delivery; bypass cannot be an undocumented workaround. | Operations/repository admin |

Until these are answered: do not invent supported-language guarantees, latency/cost commitments, exception permissions, retention periods, or a final release-approval schema. Keep external AI disabled and treat incomplete required scans as non-approving.

## Changes from the earlier background plans

- Internal pilot requirements supersede the presentation-only hackathon assumptions and old schedule.
- Backend-owned scanning resolves the earlier ambiguity about consuming existing reports.
- Deployment enforcement is a separate required path, not a side effect of posting a commit status.
- Automatic PR coverage is core for this pilot; a manual button alone is insufficient.
- The multiplicative score and arbitrary thresholds are rejected as implementation-ready policy.
- Source/history secret coverage, supported artifact coverage, and operational limits remain explicitly unresolved.
- The existing website is a prototype, not evidence that scanning or enforcement works.
