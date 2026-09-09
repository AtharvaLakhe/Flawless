# Flawless — AI Security Release Gate

Your pipeline already runs the scanners. Flawless reads everything they find, ranks what's actually dangerous, and decides whether this release is safe to ship — automatically.

## How it works

Scanners give you a list. Not an answer. A single pipeline run can flag dozens of issues across Trivy, Gitleaks, Semgrep, and other tools that don't talk to each other. Flawless:

1. **Scan** — reads the findings from the scanners you already run.
2. **Normalize** — merges overlapping and duplicate findings into one clear picture.
3. **Score** — ranks each finding by real-world risk: exploitability, exposure, blast radius.
4. **Decide** — issues a verdict — ship, warn, or block — and enforces it on the pull request.

## Repository structure

| Path | Description |
| ---- | ----------- |
| `landing page/` | The main marketing site — a Next.js 16 (App Router) + Tailwind CSS app |
| `ai-animation-states/` | Animation experiment components (particle field, connection lines, etc.) |
| `index.html` | Early standalone static prototype of the landing page |

## Getting started

### Prerequisites

- **Node.js 20.9 or newer** (required by Next.js 16)
- **pnpm** — comes with Corepack, which ships with Node. If it's not enabled yet, run `corepack enable` once.

### Run the site locally

From the repository root:

```bash
cd "landing page"
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

If you already have pnpm installed globally, `pnpm install && pnpm dev` works the same way.

### Other commands

| Command | Description |
| ------- | ----------- |
| `corepack pnpm dev` | Start the development server with hot reload |
| `corepack pnpm build` | Create a production build |
| `corepack pnpm start` | Serve the production build |
| `corepack pnpm lint` | Run ESLint |

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- shadcn/ui components
- Three.js / React Three Fiber
- Motion