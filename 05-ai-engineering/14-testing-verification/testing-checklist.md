# AI Testing Checklist

## 1. Definition & Core Concepts
The AI Testing Checklist is the validation tool used to confirm that prompt templates, state machine workflows, regression benchmarks, red teaming exercises, and integrations checks are properly configured before release.

## 2. Why It Exists / What Problem It Solves
It ensures that AI systems are deployed with robust testing coverages, protecting applications and users from quality regressions.

## 3. What Breaks in Production Without It
- **Infinite execution cycles:** Loops run indefinitely without exit handlers.
- **Accidental State Mutates:** Tools modify production databases without review.
- **System Memory Crashes:** In-memory states fail during server reboots.

## 4. Best Practices
- **Run the checklist during CI/CD steps:** Automate verification checking.
- **Verify data boundaries:** Enforce least-privilege checks.
- **Validate moderations:** Ensure content filters are active.

## 5. Common Mistakes / Anti-Patterns
- **Superuser configurations:** Granting root API tokens.
- **Skipping output validation:** Directly outputting model text to downstream APIs.

## 6. Security Considerations
- **Sandboxed Execution:** Verify sandbox constraints are active on all command tools.

## 7. Performance Considerations
- **Parallel processing validations:** Ensure database connections are optimized.

## 8. Scalability Considerations
- **Compute Sizing:** Distribute task loads across worker pools.

## 9. How Major Companies Implement It
- **Microsoft:** Requires Copilot development teams to complete safety checklists before launch.
- **Google:** Enforces security-readiness gates on all automated workflow scripts.

## 10. Decision Checklist (Pipeline Validation)
- Use **Testing Validation Checklist** when:
  - Deploying new prompt templates, models, or testing configurations.

## 11. AI Coding-Agent Guidelines
- Review the AI testing checklist to confirm formatting and validation configurations are verified.

## 12. Reusable Checklist
- [ ] Golden dataset compiled (covering success, edge, and adversarial inputs)
- [ ] LLM API calls mocked in unit test files
- [ ] Checkpoint savers active on transition edges
- [ ] Ingress moderation screening active (Llama Guard/regex checks)
- [ ] Tool parameters validated against JSON schemas in code
- [ ] User memory profiles support GDPR-compliant deletion rules
- [ ] Tracing telemetry enabled for workflow paths
- [ ] Task loops iteration limit checked
