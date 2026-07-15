# Performance Checklist

## 1. Definition & Core Concepts
The Performance Checklist is a structured audit and design tool used to verify that an AI application has implemented necessary optimizations (including streaming, semantic caching, concurrent queries, token limits, and model routing) to meet production speed and cost requirements.

## 2. Why It Exists / What Problem It Solves
AI application performance is highly variable and depends on remote API availability, payload lengths, and network speeds. Without a unified checklist, teams routinely release features that suffer from high latencies and bloated costs, leading to poor user adoption and budget overruns.

## 3. What Breaks in Production Without It
- **Sluggish User Interfaces:** Systems ship without streaming or caching, leaving customers waiting on blank loading pages.
- **Unexpected Budget Failures:** High token inputs are sent to expensive reasoning models without optimization, exhausting project budgets in days.
- **Gateway Timeouts:** Downstream sequential calls take longer than API gateways allow, causing frequent HTTP 504 errors.

## 4. Best Practices
- **Establish a Performance Budget:** Define acceptable latency thresholds (e.g. TTFT under 800ms, total latency under 3 seconds) for all user-facing features.
- **Implement Tiered Optimizations:** Standardize caching first, then parallel execution, then prompt compression, and finally model routing.
- **Automate Regression Audits:** Run simulated user flows in build pipelines to monitor token count changes and duration regressions before release.

## 5. Common Mistakes / Anti-Patterns
- **Optimizing prematurely:** Setting up complex semantic cache configurations before verifying if user query patterns are actually repetitive.
- **Relying solely on large models:** Using slow reasoning models for tasks that could be executed faster and cheaper by distilled models.

## 6. Security Considerations
- **Boundary Verification:** Confirm that latency optimizations (like context pruning or model routing) do not bypass security prompts or validation checks.

## 7. Performance Considerations
- **Optimizing telemetry write overhead:** Ensure that logging, metric gathering, and trace collection steps run asynchronously and do not add to response times.

## 8. Scalability Considerations
- **Concurrency headroom:** Test performance budgets under simulated peak load to ensure that systems can handle high concurrent traffic without queue delays.

## 9. How Major Companies Implement It
- **Netflix:** Audits all AI-driven search features against an internal performance checklist, requiring streaming, fallback models, and caching before code can be merged.

## 10. Decision Checklist (Performance Gate)
- Approve **Release to Production** when:
  - The feature meets P95 latency and token budgets, implements streaming, and includes fallback mechanisms.
- Require **Performance Re-evaluation** when:
  - P95 latency exceeds budgets or single-request costs threaten product profit margins.

## 11. AI Coding-Agent Guidelines
- Write automated checks that track prompt size, generated tokens, and total latency for all integration tests, reporting regressions automatically.

## 12. Reusable Checklist
- [ ] Streaming (stream: true) configured for user-interactive chat flows
- [ ] Semantic caching implemented with clear similarity thresholds
- [ ] Concurrency/Parallel gather patterns active on independent tasks
- [ ] Context inputs compressed and stripped of HTML/formatting bloat
- [ ] Model router redirects simple prompts to fast, distilled models
- [ ] Connection pool sizes and TCP settings optimized for provider APIs
- [ ] P95 latency and spend budgets defined, monitored, and alerted
- [ ] Fallback configurations handle API timeout failures cleanly
