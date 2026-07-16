# 05 — AI Engineering

How to design, build, evaluate, deploy, and operate production-grade AI applications and autonomous agent systems. Distinct from `00-ai-foundations/` (enduring theory — transformers, tokenization, attention) and organized around the AI-systems-architect question: *"given this product, how do I build it correctly?"* — not a flat list of trendy topics.

**Status legend:** ✅ done · ⏳ pending

## Workflow position

This is a peer discipline to `backend-development/` and `database-design/`, not a subset — an AI product still goes through `00-product-analysis/` → `01-system-design/` first (system design decides *whether* the product needs AI at all and at what scale), then draws on this folder for everything AI-specific, while still using `backend-development/` for its non-AI service code and `database-design/` for its non-vector data.

## The altitude rule, applied here too

Three overlaps exist with folders already built, resolved the same way as everywhere else in this knowledge base — a clear angle difference plus an explicit cross-reference, never a blind duplicate:

| This folder | Overlaps with | How they differ |
|---|---|---|
| `01-product-analysis-strategy/ai-feasibility-analysis.md`, `success-metrics-analysis.md` | `../00-product-analysis/ai-feasibility-analysis.md`, `success-metrics-analysis.md` | `00-product-analysis/` asks "should this product use AI at all" at the business level. This folder goes deeper *once the answer is yes*: deterministic-vs-AI at the feature level, single vs. multi-model, agent vs. workflow. |
| `06-retrieval-pipeline-engineering/` (chunking, hybrid-search, metadata-filtering, reranking) | `../04-database-design/10-ai-and-modern-databases/` (same file names, already fully written) | `database-design/` covers the **data-layer** angle — how to store and index vectors, which vector DB, schema for embeddings. This folder covers the **retrieval-pipeline** angle — chunking strategy for answer quality, retrieval tuning for relevance, grounding, citation. Every file here must open with a one-line pointer to its `database-design/10-.../` counterpart rather than re-explaining storage mechanics. |
| `16-performance-optimization/caching-implementation.md` | `../production_principles/data-and-messaging/01-caching-implementation.md`, `../backend-development16-performance-optimization/caching-implementation.md` | Those cover generic application caching. This file covers **semantic/prompt-response caching** specific to LLM calls (cache key = semantic similarity, not exact match) — a genuinely different mechanism, not a rehash. |

`12-security-implementation/pii-protection-strategy.md` and `secret-protection-implementation.md` similarly note their generic counterparts (`database-design/07-security/pii-protection-strategy.md`, `production_principles/foundations/01-configuration-management.md`) but stay full-depth since prompt-level PII leakage and secret protection in tool calls are mechanically different problems from database-level or config-level protection.

## Format

Every folder uses the standard 12-section research template (Definition, Why It Exists, What Breaks Without It, Best Practices, Common Mistakes, Security/Performance/Scalability Considerations, How Major Companies Implement It, Decision Checklist, AI Coding-Agent Implementation Guidelines, Reusable Checklist), **except**:
- `21-readiness-audit/` and `22-verification-checklists/` use the lighter checklist format (Purpose, Checklist, Cross-references, Sign-off criteria) — see the note in `22-verification-checklists/index.md` on how the two differ in scope (one-time gate vs. recurring per-feature checklist).
- Every file in `06-retrieval-pipeline-engineering/` that shares a name with a `database-design/10-.../` file must open with the one-line pointer described above.

## Folder map

```
05-ai-engineering/
├── README.md                          (this file)
│
├── 01-product-analysis-strategy/             9 topics
├── 02-model-selection-strategy/                12 topics
├── 03-context-window-management/             9 topics
├── 04-prompt-template-management/              9 topics
├── 05-knowledge-base-management/           8 topics
├── 06-retrieval-pipeline-engineering/                10 topics  (cross-references database-design/10)
├── 07-autonomous-agent-engineering/              10 topics
├── 08-multi-agent-orchestration/            10 topics
├── 09-agent-memory-management/              9 topics
├── 10-external-tool-integration/                9 topics
├── 11-workflow-orchestration/          8 topics
├── 12-security-implementation/                     8 topics
├── 13-response-evaluation/                  10 topics
├── 14-testing-verification/                      8 topics
├── 15-observability-management/                8 topics
├── 16-performance-optimization/                  8 topics  (cross-references caching elsewhere)
├── 17-operations-management/                          8 topics
├── 18-compliance-governance/                   8 topics
├── 19-pattern-implementation/             14 topics
├── 20-product-blueprints/           10 topics
├── 21-readiness-audit/            8 topics  [checklist]
└── 22-verification-checklists/                   7 topics  [checklist]
```

**Total: 205 topics.**

## Workflow

```
AI Product Analysis
      ↓
Model Selection
      ↓
Context Engineering → Prompt Engineering
      ↓
Knowledge Engineering → RAG Engineering
      ↓
Agent Engineering → Multi-Agent Systems → Memory Engineering
      ↓
Tool Integration → Workflow Orchestration
      ↓
AI Security
      ↓
AI Evaluation → AI Testing
      ↓
AI Observability → AI Performance
      ↓
LLMOps
      ↓
AI Governance
      ↓
Production Readiness
```

---

## Folder reference

| Folder | Covers | Status |
|---|---|---|
| [`01-product-analysis-strategy/`](./01-product-analysis-strategy/index.md) | AI Feasibility, Use-Case Identification, User Intent Analysis, Automation Opportunity, Deterministic vs AI, AI Cost Analysis, Success Metrics, Human-in-the-Loop | 9/9 |
| [`02-model-selection-strategy/`](./02-model-selection-strategy/index.md) | Closed/Open-Source/Multimodal/Reasoning/Embedding/Reranking/Speech/Vision Models, Fine-Tuned Models, Model Routing, Fallback Models, Selection Framework | 12/12 |
| [`03-context-window-management/`](./03-context-window-management/index.md) | Context Window, Building, Compression, Prioritization, Versioning, Session/Long-Term Context, Debugging | 9/9 |
| [`04-prompt-template-management/`](./04-prompt-template-management/index.md) | System Prompts, Templates, Structured Output, Reasoning Prompts, Chain-of-Thought, Few-Shot, Versioning, Evaluation, Library | 9/9 |
| [`05-knowledge-base-management/`](./05-knowledge-base-management/index.md) | Knowledge Acquisition, Document Processing, Metadata, Source Validation, Refresh, Versioning, Ontology | 8/8 |
| [`06-retrieval-pipeline-engineering/`](./06-retrieval-pipeline-engineering/index.md) | Chunking, Embedding Strategy, Vector DB Selection, Hybrid Search, Metadata Filtering, Reranking, Retrieval Optimization, Citation, Grounding | 10/10 |
| [`07-autonomous-agent-engineering/`](./07-autonomous-agent-engineering/index.md) | Agent Architecture, Planning, Reasoning, Reflection, Self-Correction, Task Decomposition, Tool Selection, State Management, Execution Loop | 10/10 |
| [`08-multi-agent-orchestration/`](./08-multi-agent-orchestration/index.md) | Supervisor/Planner-Worker/Manager-Worker/Swarm/Hierarchical Patterns, Delegation, Communication, Shared Memory, Conflict Resolution, Orchestration | 10/10 |
| [`09-agent-memory-management/`](./09-agent-memory-management/index.md) | Working/Episodic/Semantic/Long-Term/User Memory, Update, Retrieval, Pruning | 9/9 |
| [`10-external-tool-integration/`](./10-external-tool-integration/index.md) | Function Calling, MCP, API/Database/Filesystem/Browser Tools, Authentication, Permissions | 9/9 |
| [`11-workflow-orchestration/`](./11-workflow-orchestration/index.md) | LangGraph, Temporal, Durable Workflows, State Machines, Recovery, Human Approval, Long-Running Tasks, Orchestration Patterns | 8/8 |
| [`12-security-implementation/`](./12-security-implementation/index.md) | Prompt Injection, Jailbreaks, Tool Security, PII/Secret Protection, Output Filtering, Permission Models | 8/8 |
| [`13-response-evaluation/`](./13-response-evaluation/index.md) | Groundedness, Faithfulness, Hallucination, Answer Quality, Tool/RAG Evaluation, Benchmark Design, Golden Dataset, Automated Evaluation | 10/10 |
| [`14-testing-verification/`](./14-testing-verification/index.md) | Prompt/Workflow/Regression/Adversarial/Tool/Memory/Integration Testing | 8/8 |
| [`15-observability-management/`](./15-observability-management/index.md) | Prompt Logging, Trace Analysis, Token/Cost/Latency Monitoring, Workflow Tracing, Agent Monitoring | 8/8 |
| [`16-performance-optimization/`](./16-performance-optimization/index.md) | Prompt Optimization, Caching, Batching, Streaming, Parallel Execution, Token Optimization, Latency Reduction | 8/8 |
| [`17-operations-management/`](./17-operations-management/index.md) | Model/Prompt Versioning, Deployment, Canary, Shadow Testing, Continuous Evaluation, Rollback | 8/8 |
| [`18-compliance-governance/`](./18-compliance-governance/index.md) | Responsible AI, Compliance, Explainability, Audit, Bias, Transparency, Human Oversight | 8/8 |
| [`19-pattern-implementation/`](./19-pattern-implementation/index.md) | RAG, Agentic RAG, Planner-Executor, Reflection, ReAct, Code/Research/Memory/Evaluator/Router/Supervisor Agent, Tool-Use, Workflow, Hybrid Patterns | 14/14 |
| [`20-product-blueprints/`](./20-product-blueprints/index.md) | AI Chatbot, Coding Assistant, Research Agent, Customer Support, CRM, Medical Assistant, Document Analysis, Finance, Workflow Automation, AI SaaS | 10/10 |
| [`21-readiness-audit/`](./21-readiness-audit/index.md) | Model/Prompt/Evaluation/Security/Performance/Observability/Deployment Review, Production Checklist | 8/8 [checklist] |
| [`22-verification-checklists/`](./22-verification-checklists/index.md) | Prompt/RAG/Agent/Evaluation/Security/Deployment Review, Production-Ready | 7/7 [checklist] |

---

## Overall progress

**205 of 205 topics done.**
