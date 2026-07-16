# Performance Review Checklist

## 1. Purpose
This checklist acts as a production readiness gate to review response streaming configurations, prompt compression parameters, parallel execution concurrency, latency percentiles, and semantic caching before deployment.

## 2. Checklist

### Latency & Delivery
- [ ] Response streaming (SSE/WebSockets) active for all user-interactive dialogue flows.
- [ ] P95 Time to First Token (TTFT) budget defined and met (target < 800ms).
- [ ] Client interface handles chunk loading progressively without rendering lags.

### Optimization & Caching
- [ ] Prompts optimized to compress context and structure static blocks first (enabling caching).
- [ ] Semantic caching active for repetitive queries with similarity filters set (> 0.96).
- [ ] Multi-step retrieval and independent database tools execute in parallel.

### Client Limits & Resources
- [ ] Max token output ceilings (`max_tokens`) configured on API requests.
- [ ] Outgoing connection pooling and TCP settings optimized for model endpoint APIs.
- [ ] Dynamic batching enabled on self-hosted model inference containers.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Prompt Optimization](../16-performance-optimization/prompt-optimization.md)
- [Semantic Caching](../../04-database-design/04-database-best-practices/caching-implementation.md)
- [Streaming Responses](../../03-backend-development/13-performance-optimization/streaming-implementation.md)
- [Parallel Execution](../16-performance-optimization/parallel-execution-optimization.md)

## 4. Sign-off Criteria
The performance review passes when:
1. 100% of checklist validation points are verified.
2. Load testing demonstrates that concurrent requests do not cause P95 TTFT latency to exceed 1.2 seconds.
3. Vector similarity cache tests verify a 99% accuracy rate in returning cached answers for semantically identical queries.
