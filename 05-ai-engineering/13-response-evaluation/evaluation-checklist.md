# AI Evaluation Checklist

## 1. Definition & Core Concepts
The AI Evaluation Checklist is the validation tool used to confirm that groundedness, faithfulness, hallucination checks, answer quality metrics, tool executions, datasets, and CI/CD evaluation pipelines are properly configured before release.

## 2. Why It Exists / What Problem It Solves
It ensures that AI systems are deployed with robust measurement capabilities, protecting users and applications from quality regressions.

## 3. What Breaks in Production Without It
- **Factual Hallucinations:** Support bots invent refund steps the company does not support.
- **Accidental Safety leaks:** Models output instructions that violate safety policies.
- **Corporate liability risks:** AI engines give incorrect legal or financial advice.

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
- Use **Evaluation Validation Checklist** when:
  - Deploying new prompt templates, models, or evaluation configurations.

## 11. AI Coding-Agent Guidelines
- Review the AI evaluation checklist to confirm formatting and validation configurations are verified.

## 12. Reusable Checklist
- [ ] Grounding rules and fallback messages configured
- [ ] Golden dataset curated (covering success, edge, and adversarial inputs)
- [ ] Evaluation criteria defined (faithfulness metrics configured)
- [ ] Judge model configured with scoring guidelines
- [ ] CI pipeline gates configured to block deployments on quality drops
- [ ] Evaluation token costs monitored
- [ ] User feedback corrections added to the golden dataset periodically
- [ ] Tool parameters validated against JSON schemas in code
