# LLMOps Checklist

## 1. Definition & Core Concepts
The LLMOps Checklist is a comprehensive operational audit tool designed to verify that model registries, deployment pathways, canary controls, continuous evaluations, and rollback strategies are configured for production stability.

## 2. Why It Exists / What Problem It Solves
Operating AI applications requires managing dynamic, unpredictable models alongside traditional software code. Without a structured LLMOps checklist, teams frequently deploy model updates that trigger API rate limits, run up unexpected costs, break formatting parsing libraries, or offer no direct rollback mechanism.

## 3. What Breaks in Production Without It
- **Broken API integrations:** Model updates alter response formats, crashing parsing logic in downstream services.
- **Uncontrolled Rollout Outages:** Unmonitored canary releases cause service degradations that affect customers because there was no automated rollback trigger.
- **Data Incompatibilities:** Upgrading embedding models without re-embedding historical vector databases, rendering search features non-functional.

## 4. Best Practices
- **Standardize Release Pipelines:** Require all model and prompt deployments to pass through three environments: development, staging, and production.
- **Automate Pre-flight Benchmarks:** Run validation tests on new prompt/model variants before pushing them to live canary channels.
- **Establish Monitoring Baselines:** Verify that alert thresholds are calibrated to historical averages before launching new features.

## 5. Common Mistakes / Anti-Patterns
- **Ad-Hoc Model Updates:** Updating model identifiers directly in production environments without testing formatting compatibility or checking rate limits.
- **Skipping Continuous Evaluation:** Assuming a model that performs well during pre-release testing will maintain that performance level on live production data.

## 6. Security Considerations
- **Environment Isolation:** Ensure that development and staging environments do not access production databases or write to production logs.

## 7. Performance Considerations
- **Pre-warming Routines:** Ensure that new GPU pods or model servers are pre-warmed with synthetic queries before receiving live production traffic to prevent cold-start delays.

## 8. Scalability Considerations
- **Rate Limit Planning:** Verify that new model endpoints have sufficient rate limits (tokens per minute, requests per minute) configured with the provider.

## 9. How Major Companies Implement It
- **Uber:** Applies an automated release checklist that blocks all conversational AI deployments unless the system implements canary routing, rollback controls, and PII scrubbing.

## 10. Decision Checklist (LLMOps Audits)
- Approve **Production Deployment** when:
  - Model versions are pinned, evaluations are configured, canary routing is active, and the rollback plan is tested.
- Require **Release Deferral** when:
  - The model/prompt has not completed pre-flight evaluation testing or lacks automated rollback triggers.

## 11. AI Coding-Agent Guidelines
- Write CI/CD configuration files that automatically deploy prompts, models, and evaluation tests to isolated environments based on Git branches.

## 12. Reusable Checklist
- [ ] Model versions explicitly pinned and locked in registry config
- [ ] Prompt templates versioned and decoupled from code deploy logic
- [ ] Blue-green or progressive canary rollout pipelines configured
- [ ] Automated rollback triggers connected to system health alerts
- [ ] Continuous evaluation active using sampling and judge models
- [ ] Embeddings model upgrades require rebuilding corresponding indices
- [ ] Startup checks include endpoint validation and GPU pre-warming
- [ ] API provider rate limits verified for target rollout traffic volumes
