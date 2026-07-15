# Router Agents

## 1. Definition & Core Concepts
A Router Agent is an agentic pattern where a model acts as a decision-maker, analyzing incoming user queries or system states and directing them to the most suitable downstream model, prompt configuration, tool, database index, or workflow.

## 2. Why It Exists / What Problem It Solves
AI products often face a wide variety of user requests. Routing all requests to a single large, expensive reasoning model is inefficient and costly. A router agent inspects the user's intent and directs simple queries to cheap models, coding queries to code generators, and database queries to search indices, optimizing both performance and cost.

## 3. What Breaks in Production Without It
- **Bloated Operational Costs:** The system sends basic queries (like "Hi") to expensive models (like Claude 3.5 Sonnet) because there is no triage router.
- **Degraded Response Quality:** Complex requests are sent to small models that lack the reasoning capacity to answer them, generating incorrect outputs.
- **Slow Latencies:** Simple tasks take seconds to generate because they are processed by slow reasoning networks.

## 4. Best Practices
- **Use Distilled Models for Routing:** Deploy small, fast models (e.g. GPT-4o-mini, LLaMA-3-8B) with specialized system instructions to perform quick classification routing.
- **Implement Few-shot Examples:** Include clear examples of query classifications in the router prompt to minimize classification errors.
- **Define a Fallback Route:** Always specify a default route (typically pointing to a general reasoning model) in case the classification logic is ambiguous or fails.

## 5. Common Mistakes / Anti-Patterns
- **Overcomplicating the router:** Building multi-step agent routers for simple classification tasks that could be handled by a single fast model call or simple regex.
- **Omitting latency tracking:** Failing to monitor the router's execution time, which can offset the latency savings gained by routing to smaller models.

## 6. Security Considerations
- **Router Hijacking:** Ensure that malicious user inputs (prompt injections) do not trick the router agent into directing queries to internal debugging tools or restricted database indices.

## 7. Performance Considerations
- **Keep Router Latency Low:** The router adds overhead to every request. Optimize prompt sizes and use JSON mode to keep router classification times under 150ms.

## 8. Scalability Considerations
- **Router Port Allocation:** Scale router container pools independently from execution nodes, as routers handle high-volume ingress traffic.

## 9. How Major Companies Implement It
- **Martian / RouteLLM:** Deploy specialized routing frameworks that dynamically predict model performance per query, routing requests to the cheapest model that satisfies the quality threshold.

## 10. Decision Checklist (Routing Mechanisms)
- Use **LLM Classifier Routers** when:
  - Queries are complex, conversational, semantic, or require interpreting user intent and ambiguity.
- Use **Rule-based/Regex Routers** when:
  - Routing can be decided by explicit keywords, file extensions, or API route endpoints.

## 11. AI Coding-Agent Guidelines
- Write router classes that return structured JSON outputs containing the selected route name and confidence scores, wrapping execution routes in clean switch statements.

## 12. Reusable Checklist
- [ ] Router model selected is small, fast, and cost-efficient
- [ ] Few-shot classification examples cover all active routing targets
- [ ] Fallback default route configured for low-confidence classifications
- [ ] Router execution time monitored and optimized (target < 150ms)
- [ ] Structured JSON output mode enforced on router queries
- [ ] Prompt injection checks prevent malicious routing redirect attacks
