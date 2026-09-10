# Flawless project documents

Updated: 2026-09-10

Status: Draft for review. These documents authorize no application implementation or infrastructure provisioning.

Flawless is an internal security service that scans repository code, explains findings, and supplies decisions enforced at both PR merge and deployment time.

## Read in this order

1. [Product requirements](PRD.md): users, scope, behavior, and acceptance criteria.
2. [Architecture](ARCHITECTURE.md): components, trust boundaries, data flow, and proposed stack.
3. [Implementation plan](IMPLEMENTATION_PLAN.md): delivery phases and verification.
4. [Decision register](DECISIONS.md): confirmed requirements, recommendations, and unanswered questions.

## Current project state

The repository currently contains a Next.js marketing site, animation experiments, and a static prototype. Its displayed reports and gate are demonstrations. There is no implemented scanning service, database, authentication, or GitHub enforcement.

The root README describes consuming existing scanner reports. The confirmed direction here is backend-owned scanning. The root README has intentionally not been changed as part of this documentation task.

## How to interpret this set

- **Confirmed:** explicitly chosen by the user.
- **Required:** behavior needed to satisfy the confirmed product and security boundaries.
- **Proposed:** a recommendation awaiting review; not an approved vendor purchase or implementation decision.
- **Open:** information still needed before dependent work begins.

The earlier external architecture and plan documents are background proposals. Their hackathon timeline, sample scoring thresholds, and instructions are not treated as current implementation authorization. If requirements change, update this document set together so product behavior and technical design remain consistent.
