# AI Product Analysis Checklist

## 1. Definition & Core Concepts
The AI Product Analysis Checklist is the validation tool used to confirm that an AI feature's feasibility, costs, user intents, and human-in-the-loop dependencies are analyzed and approved before system design starts.

## 2. Why It Exists / What Problem It Solves
It ensures project managers and developers align on the technical feasibility, cost boundaries, and security constraints of AI integrations, avoiding early development failures.

## 3. What Breaks in Production Without It
- **Project Scope Creep:** Launching features that cannot be completed due to missing datasets or API token limitations.
- **Unchecked Security Gaps:** Deploying search features that expose internal database structures to prompt injection.
- **Billing Crises:** Deploying features that trigger expensive LLM queries under simple user actions.

## 4. Best Practices
- **Run the checklist at project kickoff:** Standardize on validation reviews.
- **Verify data dependencies:** Confirm training or embedding datasets exist.
- **Quantify business margins:** Confirm the cost per transaction is acceptable.

## 5. Common Mistakes / Anti-Patterns
- **Post-Deploy Cost Analysis:** Calculating LLM billing metrics after launching to the public.
- **Assuming perfect model accuracy:** Designing customer interfaces without fallback messaging.

## 6. Security Considerations
- **PII limits:** Confirm that no prompt payload passes unmasked customer details to external models.

## 7. Performance Considerations
- **TTFT Budgets:** Verify that target latency budgets can support LLM network times.

## 8. Scalability Considerations
- **Concurrency checks:** Confirm that provider rate limits can support peak QPS projections.

## 9. How Major Companies Implement It
- **Microsoft:** Requires all Azure AI feature teams to complete Responsible AI and Feasibility checklists before design validation.
- **Google:** Enforces product-safety and cost-feasibility gates on all Generative AI integrations.

## 10. Decision Checklist (Kickoff Evaluation)
- Use **Full Checklist Review** when:
  - Designing new AI integrations or migrating legacy modules to LLMs.
- Use **Light Review** when:
  - Updating prompts inside existing, validated workflows.

## 11. AI Coding-Agent Guidelines
- Review the product analysis checklist to verify that accuracy, latency, and billing targets are defined before writing prompt templates.

## 12. Reusable Checklist
- [ ] AI Feasibility analysis completed (rule-based alternatives checked)
- [ ] Token and infrastructure costs modeled against business margins
- [ ] User intent classification pathways mapped
- [ ] Human-in-the-loop review hooks designed for write mutations
- [ ] Data privacy boundaries and PII masking methods approved
- [ ] Model latency P95 targets checked against UI budgets
- [ ] Provider TPM/RPM rate limits verified
- [ ] Hallucination fallback screens designed
