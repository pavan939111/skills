# AI Feasibility

## 1. Definition & Core Concepts
AI Feasibility is the product-level assessment that evaluates whether integrating Artificial Intelligence (machine learning, LLMs, vector search, or predictive modeling) into a feature is technically viable, financially sound, and operationally maintainable.

Core concepts:
- **Task Alignment:** Verifying if the target business problem can be solved reliably using AI (heuristics vs ML).
- **Data Availability:** Ensuring the system has access to high-quality, structured training or context data.
- **Cost-Benefit Analysis:** Calculating LLM API call or GPU hosting costs against the business value generated.
- **Accuracy & Fallback Boundaries:** Setting acceptable accuracy levels (hallucination limits) and defining fallback rules when the AI fails.

## 2. Why It Exists / What Problem It Solves
Many products add "AI features" due to industry hype without evaluating if the tech fits. This leads to high model costs, buggy user experiences, and project delays. AI Feasibility assesses whether a feature should use AI, a simple heuristic (standard SQL/code logic), or is unfeasible, saving time and money.

## 3. What Goes Wrong on a Project Without It
- **Runaway API Call Costs:** Launching an LLM feature that costs $2.00 in tokens per query, but only generates $0.05 in business revenue, draining budgets.
- **Hallucination Outages (Stripe/Fintech):** Using LLMs to categorize financial transactions without safety boundaries, leading the model to hallucinate billing values and charge users incorrectly.
- **Slow Query Latencies:** Using heavy vector searches for standard lookup tasks, spiking page load times past seconds.
- **Data Privacy Breaches:** Sending sensitive corporate PII to public, third-party AI APIs without legal checks.

## 4. Best Practices
- **Try Heuristics/Standard Rules First:** Always ask: "Can this problem be solved using standard SQL queries, regex, or code logic?" If yes, avoid AI.
- **Define Token Cost Budgets:** Calculate token consumption early. Establish limits on prompt size, context retrieved, and completion widths.
- **Enforce Human-in-the-Loop for Write Paths:** Never allow AI agents to execute direct database updates on financial or permission tables without human verification.
- **Design Fail-Safe Fallbacks:** If the AI response is slow, times out, or fails validation checks, fall back to standard keyword searches or default options.
- **Assess Latency Budgets early:** If vector search is used, budget RAM and compute resources to ensure lookups stay under SLA limits (<100ms).

## 5. Common Mistakes / Anti-Patterns
- **AI Hype Engineering:** Using LLMs to solve simple tasks like string formatting or basic calculations that could be written in two lines of JavaScript.
- **No Cost Auditing:** Deploying LLM routes without logging token consumption database-side, leading to high billing surprises.
- **Assuming 100% LLM Accuracy:** Designing systems that crash or break if an LLM outputs malformed JSON or unexpected values.
- **No Data Privacy Checks:** Shipping customer PII to external models, violating compliance regulations.

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** Feasible AI features require two-stage retrieval architectures (vector search + reranking) and asynchronous background processing worker queues.
- **Backend Architecture:** LLM integrations require robust input sanitization, token tracking, retry middleware, and JSON schema validators.
- **Database Design:** RAG systems require parent-child chunk schemas, HNSW vector indexes, and database-level RLS to secure data boundaries.

## 7. What "Good" Looks Like
A high-quality AI feasibility assessment determines the business value, evaluates technical viability (data quality, model availability), estimates token and compute costs, defines hallucination limits, and outlines clear non-AI fallback routes.

## 8. How Major Companies/Teams Do It
- **Stripe:** Restricts LLMs to support diagnostics and semantic documentation searches. Financial calculations are kept strictly in deterministic SQL databases, ensuring mathematical correctness.
- **Google:** Employs multi-stage filters on AI assistant paths, routing queries to simple cached rule databases first to avoid expensive transformer runs.

## 9. Decision Checklist
Go **Deep** (comprehensive AI feasibility study) when:
- Designing features that modify database states or make automated choices (e.g. autokick/checkout approvals).
- Token usage is projected to scale to millions of monthly queries.
- Storing or sending sensitive customer PII to external APIs.

Keep it **Lightweight** when:
- The AI feature is a minor, read-only UI addition (e.g., summarizing text logs).
- Building internal prototypes for developer testing.

## 10. AI Coding-Agent Implementation Guidelines
When a user requests an "AI/LLM feature":
1. **Challenge the AI Use Case:** Ask: "Can this be solved using standard SQL, database joins, regex, or basic code rules?"
2. **Calculate the Costs:** Estimate the cost per query based on prompt size and target LLM models.
3. **Establish Safety Limits:** Ask: "How will we validate the LLM outputs? What is the fallback system if the AI fails or hallucinates?"
4. **Produce AI Feasibility Artifact:** Generate an assessment page using the template below.

## 11. Reusable Checklist
- [ ] Task evaluated for deterministic vs probabilistic viability (AI vs Heuristic check)
- [ ] Availability and quality of source context data verified
- [ ] Token usage costs estimated per query (ROI validated)
- [ ] Non-AI fallback system defined and integrated into flow designs
- [ ] AI model output validation patterns (JSON schema checks) specified
- [ ] PII data privacy checks conducted (compliance verified)
- [ ] Latency budget checked for LLM API and vector search paths
- [ ] Human-in-the-loop validation enforced for database-writing AI paths

## 12. Output Template
```markdown
# AI Feasibility Assessment: [Feature Name]

### 1. Problem Statement & AI Target
[What feature is being built, and how is AI proposed to solve it?]

### 2. Heuristic Alternative (Non-AI Check)
- **Can we solve this without AI?** [Yes/No]
- **Heuristic Strategy:** [Describe how this could be coded using standard SQL, regex, or code-level filters.]
- **Why AI is preferred:** [Justify the AI selection over the heuristic alternative.]

### 3. Data & Context Availability
- **Context Source:** [e.g., Internal product catalog data, customer support tickets]
- **Data Quality Status:** [e.g., Data is structured in SQL, clean, and ready for vector chunking.]

### 4. Cost-Benefit Estimation
- **Target Model:** [e.g., OpenAI gpt-4o-mini]
- **Estimated Prompt Tokens:** [e.g. 1,000 tokens/query]
- **Cost per 1,000 runs:** $[0.15]
- **Revenue/Value per 1,000 runs:** $[10.00] (Financial viability confirmed).

### 5. Fallback & Safety Plan
- **Validation Rule:** [e.g., Output must parse as a valid JSON matching schema `OrderCategorySchema`.]
- **Fallback system:** [e.g., If JSON parsing fails or API times out, system defaults to Category: 'Unclassified' and sends to manual triage queue.]
- **Human-in-the-loop:** [e.g., All AI categorization changes must be reviewed and approved by a staff editor before database writes commit.]
```
