# Token Monitoring

## 1. Definition & Core Concepts
Token Monitoring is the continuous measurement, logging, and aggregation of token counts (input, output, and cached tokens) consumed during LLM interactions.

## 2. Why It Exists / What Problem It Solves
LLM pricing and rate limits are defined in tokens. Monitoring token consumption allows organizations to track model efficiency, anticipate API cost spikes, detect runaway loops (e.g. recursive agent tool calls), and ensure that prompts do not exceed the model's maximum context window.

## 3. What Breaks in Production Without It
- **Rate limit outages:** Unmonitored token surges trigger API rate limits, blocking downstream production services.
- **Runaway agents:** Agent reasoning loops spin out of control, consuming millions of tokens in minutes and generating massive unexpected bills.
- **Context window overflow:** Large payloads truncate silently or crash user experiences because inputs exceed model token limits.

## 4. Best Practices
- **Parse API usage meta:** Extract the `usage` block from LLM API responses (e.g. `prompt_tokens`, `completion_tokens`, `total_tokens`) rather than calculating it locally.
- **Estimate locally when needed:** Use library tokenizers (e.g., `tiktoken` for OpenAI, `sentencepiece` for LLaMA) to estimate token usage before sending requests to the API.
- **Set token budgets:** Define and enforce maximum token ceilings per user, per session, or per request.

## 5. Common Mistakes / Anti-Patterns
- **Character-based counting:** Assuming a simple character-to-token ratio (e.g., 4 characters = 1 token) which varies wildly across different languages, code structures, and model tokenizers.
- **Neglecting cached tokens:** Failing to track context-caching metrics (e.g. read vs. write cached tokens), leading to inaccurate financial and performance models.

## 6. Security Considerations
- **Denial of Service (DoS):** Attackers submit high-token inputs to exhaust rate limits and increase cloud operational costs. Set maximum input limits at the API gateway level.

## 7. Performance Considerations
- **Pre-estimation latency:** Avoid heavy local tokenizer computations on main request threads; run token counts asynchronously or optimize using compiled libraries.

## 8. Scalability Considerations
- **Aggregated metrics stream:** Send token counts to a time-series database (e.g. Prometheus, InfluxDB) to alert on usage anomalies and rate limit margins.

## 9. How Major Companies Implement It
- **Klarna:** Implements API gateway middleware that intercepts all vendor-bound LLM requests, monitors token metrics per customer account, and rejects requests exceeding monthly limits.

## 10. Decision Checklist (Token Counting Tiers)
- Use **API Response Metadata** when:
  - Performing final financial accounting, billing, and strict usage audits.
- Use **Local Tiktoken/Tokenizer Library** when:
  - Performing pre-routing decisions, context compression, or real-time cost projection before calling the API.

## 11. AI Coding-Agent Guidelines
- Implement middleware or helper functions that validate calculated context lengths against the model's specific limits before dispatching requests.

## 12. Reusable Checklist
- [ ] Token count fields (prompt, completion, total, cached) logged for all LLM calls
- [ ] Local token estimator configured for prompt pre-flight checks
- [ ] Token usage tracking tied to internal billing and client identifiers
- [ ] Rate limits monitored and alerts set at 80% capacity
- [ ] Runaway loop breakers implemented (max steps or max token limit per transaction)
- [ ] Input character limits enforced on user queries at the ingestion layer
