# Semantic Caching

> [!NOTE]
> This file covers **semantic/prompt-response caching** (cache key = semantic similarity of the prompt, not an exact key match) — a different mechanism from [Generic Application Caching](../../production_principles/data-and-messaging/01-caching-implementation.md) and [Backend Caching](../../backend-development16-performance-optimization/caching-implementation.md), which cover generic application caching.

## 1. Definition & Core Concepts
Semantic Caching is the process of storing previous LLM prompts and their generated responses, and using a vector similarity search to serve cached responses to new prompts that are semantically identical or highly similar, bypassing the need for a new LLM generation.

## 2. Why It Exists / What Problem It Solves
LLM API calls are slow and expensive. In conversational applications, users frequently ask variations of the same questions (e.g. "What is your refund policy?" vs. "How do I get a refund?"). Semantic caching matches these variations to the same cached entry, reducing costs and returning answers in milliseconds.

## 3. What Breaks in Production Without It
- **High Operational Costs:** The system repeatedly pays for expensive model generations to answer identical user queries.
- **Latency Spikes:** During high-traffic events, users face long model response times, whereas a cached hit would be instantaneous.
- **API Rate Limiting:** Runaway duplicate requests quickly exhaust provider API quotas.

## 4. Best Practices
- **Define a Strict Similarity Threshold:** Set a vector similarity metric (e.g., Cosine similarity > 0.96) to ensure cached answers are only returned for truly identical intents.
- **Cache Eviction and TTL:** Implement Time-To-Live (TTL) values so cached content expires when the underlying source data updates.
- **Standardize Input Queries:** Normalize inputs (e.g., lowercase, strip whitespace, remove punctuation) before checking the semantic cache.

## 5. Common Mistakes / Anti-Patterns
- **Setting similarity thresholds too low:** Returning a cached answer for a query that had a different semantic meaning (e.g. returning "How to cancel subscription" for "How to upgrade subscription").
- **Caching personalized information:** Caching answers that contain user-specific context or dynamic variables, leaking data between sessions.

## 6. Security Considerations
- **Data Isolation:** Segregate cache spaces by tenant, organization, or user group to prevent tenant A from receiving cached answers containing tenant B's private data.

## 7. Performance Considerations
- **Embedding Generation Speed:** Ensure that generating the query embedding and performing the vector similarity check is significantly faster (under 50ms) than calling the LLM API.

## 8. Scalability Considerations
- **Distributed Cache Store:** Use high-performance vector databases or vector-enabled memory grids (e.g., Redis VL, pgvector with index tuning) to handle high-frequency cache checks.

## 9. How Major Companies Implement It
- **Microsoft:** Implements semantic caching gateways in front of Azure OpenAI services, reducing recurrent internal support bot API costs by over 40%.

## 10. Decision Checklist (Cache Policy)
- Use **Semantic Caching** when:
  - Building customer support bots, product search systems, or document Q&A interfaces where users ask similar queries.
- Use **Direct LLM Calls** when:
  - Generating highly creative, personalized, dynamic, or real-time trading outputs.

## 11. AI Coding-Agent Guidelines
- Always implement cache checks as middleware, wrapping the model client library to keep application code clean.

## 12. Reusable Checklist
- [ ] Similarity search threshold configured and calibrated on test dataset
- [ ] Input normalization middleware active on cache keys
- [ ] Cache data partitioned by tenant or user role to prevent data leaks
- [ ] TTL and invalidation policies configured to run when documents update
- [ ] Fast vector-caching database deployed and indexed (e.g., Redis HNSW)
- [ ] Cache bypass flag supported for developer debugging and testing
