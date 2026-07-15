# Fallback Models

## 1. Definition & Core Concepts
Fallback Models are backup AI models configured to handle user queries when primary models fail due to API timeouts, rate limit exhaustion, or server outages.

## 2. Why It Exists / What Problem It Solves
Third-party APIs and GPU clusters experience frequent outages, rate limits, and network drops. Fallback configurations ensure the application remains available by automatically routing requests to alternative providers.

## 3. What Breaks in Production Without It
- **Complete Application Outages:** A temporary outage at OpenAI takes down the entire customer-facing chat interface.
- **Rate Limit Blockages:** High-volume user queries trigger provider rate limit errors (HTTP 429), blocking all subsequent requests.
- **Unresponsive UIs:** Requests hang indefinitely because client SDKs lack timeout triggers and fallback switches.

## 4. Best Practices
- **Implement Cross-Provider Fallbacks:** Route to an alternative provider (e.g. swap OpenAI GPT for Anthropic Claude) if the primary fails.
- **Set Low API Timeouts:** Cap read timeouts at 5-10 seconds before switching to the fallback model.
- **Enforce Graceful Degradation:** Fall back to smaller, faster models to maintain responsiveness during traffic spikes.

## 5. Common Mistakes / Anti-Patterns
- **Routing to the same cluster:** Falling back to another model instance hosted on the same server, which is likely experiencing the same outage.
- **Infinite fallback loops:** Creating recursive fallback chains without exit conditions.

## 6. Security Considerations
- **Prompt compatibility:** Ensure system prompts and formatting schemas are compatible with fallback models.

## 7. Performance Considerations
- **Switching delay:** Verify that timeout thresholds are low enough to prevent users from experiencing long page hangs.

## 8. Scalability Considerations
- **Load distribution:** Configure the fallback model's connection pool to match the primary model's QPS targets.

## 9. How Major Companies Implement It
- **Cursor:** Automatically switches client requests to alternative model pools (e.g., swapping Claude with GPT) if the primary endpoint lags.
- **Vercel AI SDK:** Integrates fallback model arrays natively inside routing functions.

## 10. Decision Checklist (Fallback Rules)
- Implement **Cross-Provider Fallbacks** when:
  - The feature is user-facing and requires high availability.
- Use **Degraded Fallbacks (Smaller Models)** when:
  - System performance (latency) is a priority during traffic spikes.

## 11. AI Coding-Agent Guidelines
- Always wrap LLM API client calls in try-catch blocks that automatically retry requests on fallback model endpoints.

## 12. Reusable Checklist
- [ ] Fallback model array configured across different providers (e.g., OpenAI, Anthropic, self-hosted)
- [ ] Connect timeout capped at 2s, read timeout capped at 10s
- [ ] Prompt templates validated for fallback model compatibility
- [ ] Fallback alerts linked to developer notification dashboards
- [ ] Local fallback responses (static messages) configured for complete outages
- [ ] Fallback routing logic tested under simulated API errors (HTTP 429, 500)
