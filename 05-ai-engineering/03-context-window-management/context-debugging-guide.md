# Context Debugging

## 1. Definition & Core Concepts
Context Debugging is the process of inspecting, logging, and analyzing prompt assemblies to identify formatting errors, information loss, and prompt injection vulnerabilities.

## 2. Why It Exists / What Problem It Solves
Prompt assembly is complex. Without debugging tools, developers cannot see what text was actually sent to the model, making it difficult to diagnose why a query failed.

## 3. What Breaks in Production Without It
- **Untraceable Prompt Injection:** Attackers successfully execute system overrides because developers cannot trace the input variables path.
- **Silent Formatting Errors:** Models fail to output valid JSON because hidden control characters in the prompt broke the schema constraints.
- **High Token Costs:** Unnoticed loops append duplicate context text blocks to prompts.

## 4. Best Practices
- **Implement Prompt Tracing:** Log full, assembled prompts (input + completion) to private developer dashboards during testing.
- **Run local validation checks:** Use regex checkers to verify template structures before dispatching requests.
- **Measure attention metrics:** Track model attention weights on instruction regions to optimize layout placements.

## 5. Common Mistakes / Anti-Patterns
- **Logging Assembled Prompts in Production Logs:** Writing full customer prompts containing PII to standard console logs (violating privacy compliance).
- **Manual Print Debugging:** Relying on basic `console.log` print lines scattered in code instead of a centralized trace collector.

## 6. Security Considerations
- **PII Protection:** De-identify or mask sensitive customer details in all prompt logs saved to developer dashboards.

## 7. Performance Considerations
- **Async Logging:** Dispatch prompt traces to log collectors asynchronously to prevent adding latency to request routes.

## 8. Scalability Considerations
- **Storage Limits:** Set low retention limits (e.g. 7 days) on prompt log databases to prevent disk exhaustion.

## 9. How Major Companies Implement It
- **Langfuse:** Provides open-source tracing platforms to log, version, and evaluate prompts and model completions.
- **Weights & Biases:** Tracks prompt iterations and model evaluations across deep learning teams.

## 10. Decision Checklist (Debugging Pipelines)
- Use **Git-based Local Logging** when:
  - Designing prompts locally during development stages.
- Use **Centralized Tracing Platforms (e.g., Langfuse)** when:
  - Running multi-agent or RAG loops in staging and production.

## 11. AI Coding-Agent Guidelines
- Never deploy prompt assembly code without wrapping calls in tracing middleware, making debugging simple.

## 12. Reusable Checklist
- [ ] Centralized prompt tracing middleware configured
- [ ] PII masking filters enabled on trace loggers
- [ ] Assembled prompts database has automated retention limits (e.g. 7 days)
- [ ] Prompt validation tests check for control characters
- [ ] Exception handlers capture and log API error codes (e.g. HTTP 429)
- [ ] Dynamic template variables mapped and validated in unit tests
