# Engineering Skills — Master Knowledge Base

A production-grade engineering knowledge base for AI coding agents (Claude, Cursor, Codex, Antigravity, Gemini CLI, etc.) to read before and during building any application — so decisions flow from real requirements and sound architecture, not arbitrary technology preference.

> **Connecting an AI tool?** Skip straight to the [MCP Server setup guide](./tools/mcp-server/README.md#quickstart) to give your assistant searchable access to this whole knowledge base.

## Workflow

Each stage answers a different question and drives the ones after it. Earlier stages constrain later ones — a database or framework choice should be a *consequence* of system design, not an independent preference.

```
Product Analysis          →  What are we building, for whom, and why?
        ↓
System Design              →  How should it be architected, at what scale?
        ↓
Backend Development         →  How should the services be implemented?
        ↓
Database Design               →  How should data be modeled, stored, and scaled?
        ↓
Engineering Principles      →  How do we write clean code and manage operations?
  + Operational Layers
        ↓
Implementation
```

## Folders

| Folder | Answers | Topics | Status |
|---|---|---|---|
| [`00-product-analysis/`](./00-product-analysis/index.md) | What are we building? | 9 | 9/9 |
| [`00-ai-foundations/`](./00-ai-foundations/index.md) | How do modern AI models fundamentally work? | 9 | 9/9 |
| [`01-system-design/`](./01-system-design/README.md) | How should it be architected? | 178 | 178/178 |
| [`02-engineering-principles/`](./02-engineering-principles/index.md) | How do we write clean, maintainable, and standard code? | 37 | 37/37 |
| [`03-backend-development/`](./03-backend-development/README.md) | How should application APIs and services be implemented? | 113 | 113/113 |
| [`04-database-design/`](./04-database-design/README.md) | How should data be modeled, stored, and scaled? | 119 | 119/119 |
| [`05-ai-engineering/`](./05-ai-engineering/README.md) | How should AI features/products be built, evaluated, and operated? | 205 | 205/205 |
| `06-frontend-development/` | How do we build modern web interfaces and rendering flows? | 0 | 0/0 |
| [`07-platform-engineering/`](./07-platform-engineering/index.md) | How do we containerize, provision infrastructure, and deploy? | 8 | 8/8 |
| [`08-security-engineering/`](./08-security-engineering/index.md) | How do we secure systems, handle authentication, and authorization? | 23 | 23/23 |
| [`09-testing-quality/`](./09-testing-quality/index.md) | How do we write tests and run quality controls? | 8 | 8/8 |
| [`10-production-operations/`](./10-production-operations/index.md) | How do we handle telemetry, observability, and logging? | 15 | 15/15 |
| [`11-developer-experience/`](./11-developer-experience/index.md) | How do we bootstrap local workspaces and mocks? | 2 | 2/2 |
| [`12-governance/`](./12-governance/index.md) | How do we audit compliance and engineering rules? | 21 | 21/21 |
| [`13-architecture-decision-records/`](./13-architecture-decision-records/README.md) | Why did we make specific architectural decisions? | 5 | 5/5 |

Note: The engineering layers represent independent, decoupled disciplines. Core practices like clean code reside in `02-engineering-principles/`, platform configurations in `07-platform-engineering/`, security rules in `08-security-engineering/`, testing setups in `09-testing-quality/`, and logging operations in `10-production-operations/`. `00-ai-foundations/` and `05-ai-engineering/` act as workload-specific layers for products requiring AI features.

## Scope boundaries between folders

- `00-product-analysis/` and `01-system-design/` both have "functional/non-functional requirements" files — product-analysis captures them in business language, system-design translates them into technical/architectural terms (throughput, latency, consistency model).
- `01-system-design/` decides *strategy only* — it never contains implementation how-to. Roughly half its folders (06–17, 19) are same-named as topics covered elsewhere (caching, sharding, CI/CD, CQRS, etc.); this is intentional layering, not duplication, and is governed by a hard rule: **the altitude rule**, documented in `01-system-design/README.md`. Every one of those files is a short "Decision Brief" (option comparison + decision rule + link out) — never a deep-dive. The deep-dive lives exactly once, in its canonical owner folder (`04-database-design/`, `03-backend-development/`, etc.).
- `04-database-design/` owns the data layer itself (schema, indexing, scaling) and the data access repository layers — application-level controllers and logic belong in `03-backend-development/`.
- `02-engineering-principles/` is strictly code-level, cross-cutting discipline — no backend-API-specific or database-schema-specific content lives there.
- Design patterns (CQRS, Saga, Outbox, Event Sourcing) exist in three places by design, each at a different altitude: `01-system-design/19-design-patterns/` (does this product's shape call for this pattern at all?), `04-database-design/13-design-patterns/` (how it shapes the schema/storage), and `03-backend-development/14-pattern-implementation/` (how to implement it in service code). Each file is short and points to the others rather than repeating them.
- `05-ai-engineering/` applies the altitude rule three more times: `01-product-analysis-strategy/` goes deeper than `00-product-analysis/` on AI-specific feasibility; `06-retrieval-pipeline-engineering/` covers the retrieval-pipeline angle while `04-database-design/10-ai-and-modern-databases/` covers the data-layer angle for the same RAG topics — every file in `06-retrieval-pipeline-engineering/` must open with a pointer to its data-layer counterpart; `16-performance-optimization/caching-implementation.md` covers semantic/prompt-response caching, mechanically different from generic caching elsewhere.

## How an AI agent should use this at the start of a new project

1. Work through `00-product-analysis/` with the user to establish what's being built.
2. Work through `01-system-design/` to decide the architecture and technology strategy.
3. Apply `03-backend-development/` and `04-database-design/` to implement that strategy.
4. If the product has AI features, also draw on `00-ai-foundations/` (as background) and `05-ai-engineering/` (for the AI-specific build) alongside steps 2–3, not instead of them — an AI product still needs a backend and a database.
5. Apply `02-engineering-principles/` and other operational layers (`07-`, `08-`, `09-`, `10-`, `11-`, `12-`) continuously.

---

## Model Context Protocol (MCP) Server

This repository includes a built-in **Model Context Protocol (MCP) Server** under [`tools/mcp-server/`](./tools/mcp-server/README.md) that exposes this entire engineering knowledge base (all 14 active domains) to any compatible AI-powered IDE or tool (e.g., Antigravity, Cursor, Windsurf, Claude Desktop, Claude Code, etc.) over `stdio` transport.

By connecting this MCP server to your editor, your AI assistant can dynamically discover, search, read, and cross-reference all 7,558 topic chunks using semantic and keyword-based hybrid search.

Jump straight to a section of the full guide:
- [Quickstart](./tools/mcp-server/README.md#quickstart)
- [Connect it to your AI tool](./tools/mcp-server/README.md#connect-it-to-your-ai-tool) — Claude Desktop, Claude Code, Cursor, Windsurf, Antigravity, VS Code
- [How to actually use it](./tools/mcp-server/README.md#how-to-actually-use-it)
- [Keeping it up to date](./tools/mcp-server/README.md#keeping-it-up-to-date)
- [Troubleshooting](./tools/mcp-server/README.md#troubleshooting)

### Quick Setup

1. **Install dependencies**:
   ```bash
   cd tools/mcp-server
   npm install
   ```
2. **Build search index & precompute semantic embeddings**:
   ```bash
   npm run build-index
   npm run build-embeddings
   ```
3. **Compile TypeScript**:
   ```bash
   npm run build
   ```

For detailed configuration guides for registering the server in Antigravity, Cursor, Windsurf, or Claude Desktop, see the [`tools/mcp-server/README.md` Setup Instructions](./tools/mcp-server/README.md).

