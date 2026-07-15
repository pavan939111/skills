# AI Finance Template

## 1. Definition & Core Concepts
An AI Finance system is a template designed to parse financial reports (10-Ks, balance sheets, invoice ledgers), calculate portfolio metrics, audit transactions for anomalies, run predictive forecasts, and generate compliance reports under strict validation rules.

## 2. Why It Exists / What Problem It Solves
Financial data analysis requires absolute numerical precision. Traditional LLMs are prone to arithmetic errors and hallucinations. A production-grade financial template integrates code execution environments (like Python sandboxes) and structured API tools to query exact numbers, separating calculation from text generation.

## 3. What Breaks in Production Without It
- **Calculation Hallucinations:** The model performs arithmetic in-context and gets the wrong sum, leading to incorrect financial reporting.
- **Compliance Violations:** The system recommends stocks or investment strategies without verifying regulatory suitability rules.
- **Data Leakage:** Sending confidential corporate spreadsheets to public model APIs, violating security policies.

## 4. Best Practices
- **Model Selection:** Use reasoning models (e.g. GPT-4o, Claude 3.5 Sonnet) for analysis, and fast models for data parsing.
- **Context/Prompt/Knowledge Strategy:** Feed raw tabular data as clean CSV or markdown grids. Enforce the rule: "Do not calculate values yourself. Generate Python code to calculate metrics, or use specific calculator tools."
- **Agent/RAG Pattern:** Use the Program-Aided Language (PAL) or Code-Agent pattern, giving the agent access to a sandboxed Python execution engine to run math scripts.
- **Evaluation:** Validate all outputs against baseline financial sheets. Confirm that generated code compiles and calculates correctly.
- **Deployment:** Deploy the system on private cloud clusters, wrapping Python sandboxes with strict memory and CPU limits.

## 5. Common Mistakes / Anti-Patterns
- **Asking LLMs to compute math directly:** Asking the model to compute complex compound interest formulas in-context without tools.
- **Assuming PDF tables are parsed correctly:** Processing financial reports using OCR engines without verifying column alignment, scrambling currency numbers.

## 6. Security Considerations
- **Isolated Math Sandboxes:** Ensure the Python code execution container has no network connection to prevent data exfiltration of financial keys.

## 7. Performance Considerations
- **CSV Data Compaction:** Remove empty rows and format numbers to standard decimal precision to minimize token usage during table analysis.

## 8. Scalability Considerations
- **Durable Computation Queues:** Queue long-running financial simulation audits on background worker pools, persisting results to relational databases.

## 9. How Major Companies Implement It
- **Bloomberg:** Operates BloombergGPT and financial search systems, integrating proprietary news archives and real-time market data APIs with code interpreters to output accurate reports.

## 10. Decision Checklist (Financial Assistant Blueprint)
- **Model Selection:** Claude 3.5 Sonnet / GPT-4o (Analysis nodes).
- **Execution Tool:** Sandboxed Python interpreter container.
- **Data Input Format:** Clean Markdown tables or compressed CSV inputs.
- **Oversight Gate:** 100% of generated financial reports require compliance officer approval before client delivery.

## 11. AI Coding-Agent Guidelines
- Write prompt templates that direct the model to format mathematical formulas as runnable Python scripts, capturing stdout outputs to return as observations.

## 12. Reusable Checklist
- [ ] Reasoning model configured alongside Python sandbox tool
- [ ] System prompt enforces calculations using Python/calculator tools
- [ ] Financial data formatted as clean markdown tables or CSV arrays
- [ ] Financial recommendations audited against regulatory compliance rules
- [ ] Python execution container isolated from corporate network (no egress)
- [ ] Compliance review gate configured for all client-bound outputs
