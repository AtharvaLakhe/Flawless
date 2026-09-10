# Flawless — Product Requirements Document

Updated: 2026-09-10 · Status: Draft for review

## 1. Product and purpose

Flawless helps an internal development team decide whether code meets its security policy before it is merged or deployed. It runs established security scanners, combines their findings, explains actionable problems, and publishes a decision in GitHub with a link to a private report.

The product does not guarantee vulnerability-free software. A pass means that the supported scans completed and found no unwaived blocking policy violations for the evaluated input.

## 2. Users and outcomes

| User | Needs |
| --- | --- |
| Developer | See scan progress in a PR, understand failures, fix findings, and rescan. |
| Team administrator | Connect approved repositories, manage access, and configure enforcement. |
| Security/policy owner | Review policy and any permitted exceptions with an audit trail. |
| Service operator | Detect stuck jobs, recover failures, and manage capacity and retention. |

Success means developers can follow a finding from GitHub to the exact report, and both merge and deployment are prevented when the applicable approval is absent or invalid.

## 3. Confirmed scope

- Usable internal pilot, not just a presentation or simulated demo.
- Flawless backend owns scanner execution.
- Gitleaks for secrets, Semgrep for source-code patterns, and Trivy for dependency vulnerabilities.
- Gate both PR merges and deployments; deployment enforcement uses GitHub Actions.
- Evaluate all blocking findings in the supported scan scope, not only newly introduced findings.
- Provide a GitHub-visible status/check and a link to detailed results.

### Outside the initial scope

Public multi-tenant onboarding, automatic code changes or PR creation, automatic credential rotation, Git history rewriting, live secret verification, proven function reachability, blast-radius calculation, compliance certification, and multiple Git providers.

Container-image and infrastructure-configuration coverage are not implicitly included by choosing Trivy. Their inclusion depends on the first release target and supported coverage decision.

## 4. Functional requirements

| ID | Requirement | Acceptance criterion |
| --- | --- | --- |
| FR-01 | Authenticate users and authorize team/repository access. | A signed-in user without repository access cannot start its scans or read its reports, including through direct URLs. |
| FR-02 | Connect explicitly approved repositories. | Repository access is granted through an authorized integration; arbitrary pasted credentials are not required for normal onboarding. |
| FR-03 | Support manual and PR-driven scanning. | Opening or updating a supported PR queues the applicable commit; a manual request also resolves to an immutable commit. |
| FR-04 | Show durable scan progress. | Users can close the browser and later retrieve the same scan; states include queued, running, completed, failed, and canceled. |
| FR-05 | Run required scanners and report coverage. | Missing tools, unsupported required inputs, parse errors, or incomplete required scans cannot produce approval. |
| FR-06 | Normalize and rank findings. | Each finding retains tool evidence, category, identity, available location, severity, and decision reason. Related issues are not incorrectly removed as duplicates. |
| FR-07 | Apply a versioned security policy. | Every verdict identifies the policy used; adding nonblocking findings cannot turn a block into a pass. |
| FR-08 | Publish GitHub results. | GitHub shows progress and completion for the evaluated commit, a short summary, and a link to its scan report. |
| FR-09 | Enforce PR merge protection. | A required Flawless check prevents an ordinary contributor from merging a blocked or unapproved commit. Bypass rules are explicitly documented. |
| FR-10 | Enforce deployment protection. | The protected deployment workflow verifies approval for its actual release input; a different commit or artifact cannot reuse that approval. |
| FR-11 | Explain remediation by category. | Secret findings show revoke/rotate guidance before code cleanup. CVE guidance uses verified fix metadata or states that no fix is known. |
| FR-12 | Retain useful history and audit events. | Authorized users can retrieve prior decisions; changes in policy, permitted exceptions, and enforcement configuration are attributable. |

## 5. Primary user journey

1. An administrator connects a repository and configures required merge and deployment checks.
2. A developer opens or updates a PR. Flawless reports that scanning is queued or running.
3. Workers scan the exact source input. The backend evaluates normalized evidence.
4. GitHub shows either no blocking issues, warnings without blockers, blocking findings, or an execution error.
5. The developer opens the exact report, reviews locations and remediation, and pushes a fix.
6. The new commit is evaluated independently. A prior commit's pass is not reused automatically.
7. At release time, GitHub Actions verifies approval for the actual release input before deployment proceeds.

Manual scanning remains available for troubleshooting. It does not replace automatic coverage of protected PR and deployment paths.

## 6. Verdict and remediation rules

- Keep execution outcome separate from security verdict: failed execution is not a clean scan and is not a fabricated vulnerability.
- Completed scans may have pass, warn, or block verdicts. Only completed, sufficiently current, applicable pass/warn results may authorize a gate.
- Blocking rules operate on individual findings. A numerical summary must not average away a blocker.
- Exact severity mappings and blocking thresholds remain open. Do not implement the earlier multiplicative 0–1 formula against 0–100 thresholds.
- Unknown exposure or exploitability stays unknown. File paths alone do not prove that a vulnerability is unreachable.
- Explain why a finding blocks, warns, or is excluded. Record relevant evidence and policy version.
- Existing blocking findings count. Historical-secret scope and permitted exception handling must be settled separately.
- Optional LLM text cannot alter findings, policy, approvals, or execution state. Template guidance remains available if AI fails.

## 7. Nonfunctional requirements

- Process repository contents as untrusted input; do not execute repository builds or install scripts during source scans.
- Restrict scanner resource use and isolate it from control-plane credentials.
- Redact credentials before logs, persisted reports, or optional external AI processing.
- Recover from process restarts and duplicate deliveries without contradictory decisions.
- Bound scan concurrency, retries, output size, and retention; concrete limits require a pilot workload and budget.
- Preserve decision provenance so users can understand results when rules or vulnerability databases change.
- Monitor queue age, scanner failures, scan duration, and GitHub publication failures.
- Use paginated reports; avoid loading all findings into one browser response.

## 8. Pilot exit criteria

- A controlled repository demonstrates real clean, blocked, and repaired scans.
- Both merge and deployment rejection are tested, including missing and mismatched approvals.
- Unauthorized report access and secret disclosure tests pass.
- Restart recovery, duplicate delivery, and failed GitHub publication are exercised.
- Required scan coverage, policy, service limits, backup/retention settings, and operational ownership are documented.
- Latency, reliability, and cost are measured on representative repositories and accepted against agreed targets. No unmeasured performance guarantee is made.

See [open decisions](DECISIONS.md) before implementation commitments.
