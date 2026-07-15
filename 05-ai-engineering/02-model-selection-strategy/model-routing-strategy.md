# Model Routing

## 1. Definition & Core Concepts
Model Routing is the architectural pattern where incoming user requests are dynamically directed to different AI models (e.g. lightweight vs premium models) based on query complexity, cost budgets, and performance targets.

## 2. Why It Exists / What Problem It Solves
Using premium frontier models (e.g. GPT-4o) for all tasks is expensive and slow. Routing layers inspect queries and direct simple tasks (e.g. classification) to cheap models, reserving expensive models for hard queries (e.g., coding).

## 3. What Breaks in Production Without It
- **Runaway API Bills:** Staging and production budgets are exhausted because all queries run on premium models.
- **Latency Bottlenecks:** Simple queries queue up behind slow, complex reasoning calls.
- **Provider Rate Exceeded outages:** Saturated endpoints trigger rate limits, dropping user connections.

## 4. Best Practices
- **Implement a router gate:** Use classification code (regex or small model) to select the target model.
- **Run semantic caching first:** Check cache tables (e.g., Redis) to bypass model routing loops.
- **Set clear fallback paths:** Route queries to alternative providers if the primary endpoint fails.

## 5. Common Mistakes / Anti-Patterns
- **Recursive routing loops:** Routing a query to a model, which routes it to another model, creating high latency.
- **Ignoring provider latency metrics:** Routing queries to slow models during high-traffic events.

## 6. Security Considerations
- **PII screening:** Router gates must scrub sensitive text inputs before forwarding requests to third-party endpoints.

## 7. Performance Considerations
- **Router Overhead:** Keep the router classification logic simple to ensure it takes under 50ms.

## 8. Scalability Considerations
- **Quota Management:** Distribute query traffic across multiple model providers to avoid rate limits.

## 9. How Major Companies Implement It
- **Martian:** Deploys dynamic model routers that evaluate inputs and route requests to the most cost-effective provider.
- **LlamaIndex:** Integrates model routing classes to let developers define router steps in agent configurations.

## 10. Decision Checklist (Routing Configurations)
- Use **Deterministic Routing (Regex / Keywords)** when:
  - Intended paths are distinct and keyword-bound (e.g., user inputs "/code").
- Use **Probabilistic Routing (Classifier Model)** when:
  - Query intents are complex and require semantic understanding.

## 11. AI Coding-Agent Guidelines
- Implement a model routing module in API gateways to manage model endpoints centrally, making updates simple.

## 12. Reusable Checklist
- [ ] Router gate classification latency verified under 50ms
- [ ] Model pricing models mapped in router configuration schemas
- [ ] Prompt semantic caching active (Redis integration verified)
- [ ] Fallback routing rules configured for API timeouts
- [ ] PII scrubbing active at router ingress
- [ ] Rate limits (TPM/RPM) monitors set up for all model pools
