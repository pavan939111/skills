# AI Feasibility Analysis

## 1. Definition & Core Concepts
AI Feasibility is the systematic evaluation of whether a proposed product feature requires artificial intelligence (such as LLMs or computer vision) or if it can be solved more reliably and cheaply using heuristics, rule-based algorithms, or standard machine learning classifiers.

## 2. Why It Exists / What Problem It Solves
Integrating AI/LLMs blindly into every software problem introduces latency, high token costs, and non-deterministic error rates. Feasibility analysis ensures AI is reserved only for tasks where structured rules fail (e.g. abstract reasoning, semantic translation, creative text summaries).

## 3. What Breaks in Production Without It
- **API Cost Overruns:** Features like search or status updates run up massive LLM bills because simple databases indices or string templates could have solved the issue.
- **Latency Spikes:** User interfaces stall for seconds waiting for LLM completions when standard B-Tree index lookups could have returned results in milliseconds.
- **Failing Non-Deterministic Outputs:** Simple form data validation fails or leaks hallucinated values because an LLM was used instead of a regex validator.

## 4. Best Practices
- **Heuristics-First Rule:** Always start with regular expressions, database queries, or decision trees before introducing generative AI.
- **Task Complexity Scoping:** Classify target features by required reasoning depth (e.g., entity extraction = low, multi-step planning = high).
- **Feasibility Rating Matrix:** Quantify accuracy tolerance, latency limits, and target cost budgets.

## 5. Common Mistakes / Anti-Patterns
- **LLM as Database Lookup:** Querying an LLM to find stock counts or pricing values instead of reading SQL tables.
- **Form Regex replacement:** Using an LLM to check if an email string is formatted correctly.
- **Neglecting accuracy drift:** Building high-risk systems (e.g., direct drug dosing) with non-deterministic text generation models.

## 6. Security Considerations
- **PII Leakage Risks:** Multi-tenant prompts sent to third-party LLM APIs might expose private data.
- **Prompt Injection Vulnerabilities:** Heuristic checkers are required to inspect inputs before passing them to LLMs.

## 7. Performance Considerations
- **TTFT latency:** LLM API execution adds 500ms to 3s latency. Ensure interactive UI paths run on deterministic systems.

## 8. Scalability Considerations
- **Provider API Quotas:** Third-party LLM APIs enforce rate limits (TPM/RPM), blocking horizontal scale-outs.

## 9. How Major Companies Implement It
- **Stripe:** Restricts LLM integrations to support search and coding assistants; internal routing and ledger ledger processing remain strictly deterministic.
- **Uber:** Uses standard gradient-boosted trees (XGBoost) for ride matching and pricing algorithms, avoiding slow generative AI steps in core loops.

## 10. Decision Checklist (Feasibility Evaluation)
- Use **Rule-Based/Heuristic** solutions when:
  - Output must be 100% deterministic (e.g., ledger calculation).
  - Target latency is under 50ms.
  - The problem has a clear mathematical or logical algorithm (e.g., sorting).
- Use **Generative AI (LLMs)** when:
  - Input text is unstructured and requires semantic reasoning.
  - Multi-lingual translation or summarization is required.
  - The task requires classification over open-ended categories.

## 11. AI Coding-Agent Implementation Guidelines
- Check if the task can be completed using standard programming libraries before writing LLM integrations.
- Always implement local heuristic checks (e.g., regex filters) to inspect input data before sending payloads to LLMs.

## 12. Reusable Checklist
- [ ] Task logic verified against rule-based/regex alternatives
- [ ] Latency budget checked against LLM Time-to-First-Token (TTFT) limits
- [ ] Cost per transaction modeled and compared to user billing rates
- [ ] Output accuracy tolerance quantified (Go/No-go for non-deterministic data)
- [ ] Input data size verified to fit model context window
- [ ] Rate limits (TPM/RPM) verified for target scale
