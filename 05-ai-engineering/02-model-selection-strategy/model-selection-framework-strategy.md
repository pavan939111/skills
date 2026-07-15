# Model Selection Framework

## 1. Definition & Core Concepts
The Model Selection Framework is the structured decision process used to select the optimal model class (closed, open-weights, reasoning, embedding, reranking) for each application domain.

## 2. Why It Exists / What Problem It Solves
Selecting models based on brand popularity or assumptions lead to over-spending and poor performance. This framework uses quantitative criteria (cost, latency, accuracy, compliance) to find the right match.

## 3. What Breaks in Production Without It
- **Runaway API billing:** Projects fail because the cost of premium models exceeds customer subscription prices.
- **Unacceptable Latency:** Users exit search interfaces because LLM prefill steps take too long.
- **Data Leakages:** Sending compliance-restricted data to third-party endpoints, triggering regulatory violations.

## 4. Best Practices
- **Define Selection Matrices:** Weight criteria based on project priorities (e.g. startup MVP: prioritize low cost; medical assistant: prioritize accuracy).
- **Run Benchmark Audits:** Test candidates on domain-specific datasets rather than general benchmarks.
- **Review Compliance Rules:** Verify data residency requirements before selecting model providers.

## 5. Common Mistakes / Anti-Patterns
- **Assuming one model fits all:** Standardizing the entire application codebase on a single model.
- **Ignoring hosting complexity:** Opting for open-weights models without evaluating GPU maintenance costs.

## 6. Security Considerations
- **Endpoint Encryption:** Verify that all API endpoints use secure TLS transport channels.

## 7. Performance Considerations
- **Prefill vs Generation Sizing:** Verify prefill performance limits on embedding and retrieval tasks.

## 8. Scalability Considerations
- **Concurrency headroom:** Check rate limits (TPM/RPM) before committing to a provider.

## 9. How Major Companies Implement It
- **HubSpot:** Implements centralized model registries, letting product teams pick from approved, compliance-vetted model lists.
- **Uber:** Deploys a unified framework evaluating cost and accuracy metrics across self-hosted and closed model pools.

## 10. Decision Checklist (Selection Matrix)
- Select **Closed APIs** when:
  - Complex reasoning is required, and time-to-market is critical.
- Select **Open-Weights (Self-Hosted)** when:
  - Data privacy compliance is mandatory, or query scale is extremely high.
- Select **Reasoning Models** when:
  - The task involves complex math, coding, or logical verification.

## 11. AI Coding-Agent Guidelines
- Review the model selection matrix to justify model choices in the design documentation before writing integration client code.

## 12. Reusable Checklist
- [ ] Model selection matrix scored against cost, latency, and accuracy targets
- [ ] Regional data privacy and compliance guidelines checked
- [ ] Provider rate limits (TPM/RPM) verified for production scale
- [ ] Fallback and backup model endpoints configured
- [ ] Evaluation benchmarks run on target dataset schemas
- [ ] SDK integration client classes decoupled to make model updates simple
