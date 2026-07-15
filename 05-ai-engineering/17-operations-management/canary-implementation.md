# Canary Releases

## 1. Definition & Core Concepts
Canary Releases is the operational technique of routing a small fraction of production traffic (e.g. 1% to 5%) to a newly deployed AI model version or prompt configuration, while sending the majority of traffic to the stable baseline, to detect behavioral or performance regressions with minimal impact.

## 2. Why It Exists / What Problem It Solves
AI behavior changes in unpredictable ways when exposed to live production data. Even if a model passes offline evaluation datasets, it might react poorly to real-world edge cases. Canary releases allow teams to test new models or prompts on live queries, verify their performance, and roll them back if issues occur.

## 3. What Breaks in Production Without It
- **Catastrophic Outages:** Deploying a new prompt version to 100% of users that crashes the system because of an unhandled parsing error under real-world input variations.
- **Undetected Bias/Quality Regressions:** A new model version starts generating low-quality responses for a subset of users, which goes unnoticed because offline benchmarks did not cover those user profiles.

## 4. Best Practices
- **Implement Weighted Routing:** Use API gateways (like Envoy, Kong, or AWS ALB) to split traffic dynamically based on configurable weight allocations (e.g., 95% baseline, 5% canary).
- **Automate Quality Audits:** Stream canary inputs and outputs to real-time evaluations (like LLM-as-a-judge checking for formatting or safety) to identify anomalies instantly.
- **Define Progressive Rollouts:** Step-up traffic split incrementally (e.g., 1% -> 5% -> 25% -> 50% -> 100%) if P95 latency and error rate metrics remain stable.

## 5. Common Mistakes / Anti-Patterns
- **Rolling out without automated rollback:** Shifting traffic to the canary version without setting up automated triggers to revert the change if error rates spike.
- **Ignoring low-frequency edge cases:** Running a canary deployment for too short a period, failing to expose the new version to rare but critical production inputs.

## 6. Security Considerations
- **Data Isolation:** Ensure canary nodes do not write test outputs or logs to shared production locations in a way that risks leaking experimental results to other tenants.

## 7. Performance Considerations
- **Router Overhead:** Ensure the API gateway proxy performing the weighted routing does not add latency to the client request flow.

## 8. Scalability Considerations
- **Node Scaling Pools:** Ensure the canary infrastructure (GPU nodes or server endpoints) scales up automatically in sync with the progressive increase in traffic weight.

## 9. How Major Companies Implement It
- **Uber:** Routes conversational customer-support query upgrades through a progressive canary system, monitoring customer satisfaction scores and tool call failure rates for the canary cohort.

## 10. Decision Checklist (Canary Triggers)
- Use **Canary Releases** when:
  - Deploying major model updates (e.g. GPT-4o-mini to LLaMA-3-8B-Instruct) or major prompt revisions that alter output formatting.
- Use **Direct Release** when:
  - Correcting minor spelling mistakes in prompts or making trivial logic changes with zero architectural impact.

## 11. AI Coding-Agent Guidelines
- Write API gateway configuration scripts that allocate traffic weights based on feature flags, monitoring performance dashboards to decide rollout adjustments.

## 12. Reusable Checklist
- [ ] Weighted routing logic configured at the API gateway or proxy layer
- [ ] Canary target group metrics (latencies, HTTP error rates, cost) isolated
- [ ] Real-time LLM-as-a-judge validation active on canary responses
- [ ] Auto-rollback threshold values defined (e.g. rollback if error rate > 1%)
- [ ] Progressive rollout schedule designed (e.g., 1% -> 10% -> 50% -> 100%)
- [ ] User cohorts tracked to ensure consistent routing during sessions
