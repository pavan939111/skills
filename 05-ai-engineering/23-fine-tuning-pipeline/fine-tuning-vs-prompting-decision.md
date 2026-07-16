# Fine-Tuning vs Prompting Decision

> [!NOTE]
> For prompt template management guidelines, see [Prompt Template Management](../../05-ai-engineering/04-prompt-template-management/index.md).

## 1. Definition & Core Concepts
The Fine-Tuning vs Prompting Decision is the strategic evaluation of whether to solve model capability gaps using prompt engineering (few-shot, RAG, agent workflows) or custom weight fine-tuning.

## 2. Why It Exists / What Problem It Solves
It manages cost, latency, and capability boundaries. Prompting is fast to implement but increases input token counts and costs. Fine-tuning requires upfront investment but lowers context overhead and enforces strict formatting constraints.

## 3. What Breaks in Production Without It
- **Runaway Token Costs:** Relying on long few-shot prompts for high-volume endpoints, blowing up the API budget.
- **Latency Outages:** Large context windows increase response times, violating user experience limits.
- **Factual Hallucinations:** Fine-tuning a model to "know" static factual data, which fails because neural networks hallucinate static records over time.

## 4. Best Practices
- **Prompt for Knowledge Retrieval:** Use RAG and prompting when the target domain data updates frequently (e.g., daily news, product prices).
- **Fine-Tune for Style and Syntax:** Use fine-tuning to teach models specific formatting structures (JSON schemas, custom DSLs, output tones) or when you must reduce context sizes.
- **Run Hybrid Models:** Use a fine-tuned model for formatting and speed, combined with prompted RAG inputs for factual lookups.

## 5. Common Mistakes / Anti-Patterns
- **Tuning for Static Data:** Attempting to teach a model database facts via fine-tuning, instead of utilizing search queries.
- **Prompting for Strict Grammars:** Pushing hundreds of few-shot examples into context to force a specific formatting output, which fails due to context drift.

## 6. Security Considerations
- **Prompt Injection Risks:** Prompted models are vulnerable to prompt injections. Fine-tuned models have stronger structural constraints but can still be influenced by inputs.

## 7. Performance Considerations
- **Inference Latency Profile:** Fine-tuned models allow you to strip few-shot examples, reducing input context length and accelerating Time-to-First-Token (TTFT).

## 8. Scalability Considerations
- **Dedicated Hosting Costs:** Fine-tuned weights hosted on dedicated container instances require active billing, whereas prompted calls on shared endpoints scale elastically.

## 9. How Major Companies Implement It
- **Stripe:** Uses prompted RAG systems to answer support questions, but trains custom fine-tuned adapters to convert natural queries to SQL schema queries.
- **Harvey AI:** Fine-tunes model layers on legal case formatting, but injects case files dynamically via prompted context windows.

## 10. Decision Checklist (Method Selection)
- Use **Prompt Engineering / RAG** when:
  - Factual data changes frequently.
  - Upfront budget and development time are limited.
- Use **Fine-Tuning** when:
  - Style, formatting (JSON/DSL), or output tone constraints must be strictly guaranteed.
  - You need to reduce context sizes and API costs at large transaction volumes.

## 11. AI Coding-Agent Guidelines
- Write comparative trade-off analyses calculating cost/latency thresholds before proposing fine-tuning runs.

## 12. Reusable Checklist
- [ ] RAG/prompting verified as insufficient before fine-tuning investments
- [ ] Context token cost projection analysis calculated for high-volume routes
- [ ] Model style, format, and behavior requirements documented
- [ ] Hosted model pricing vs API token budgets analyzed
- [ ] Prototyping tests verify base model capacity limits
- [ ] Hybrid architecture (fine-tuned adapter + prompted RAG context) evaluated\n