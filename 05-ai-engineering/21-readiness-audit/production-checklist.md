# Production Checklist

## 1. Purpose
This checklist acts as the final master sign-off gate for deploying AI features and products into production, aggregating audits across models, prompts, evaluations, security, performance, observability, and deployments.

## 2. Checklist

### Baseline Reviews
- [ ] Model review checklist completed and quotas approved.
- [ ] Prompt configurations versioned, tested, and optimized in registry.
- [ ] Offline evaluation results (faithfulness, relevance) verify no regressions.

### Security & Privacy
- [ ] Input and output moderation check endpoints active.
- [ ] PII scrubbing middleware active on logging pipelines.
- [ ] Tool executions isolated in secure sandbox environments.
- [ ] RLS access controls enforced on vector search queries.

### Performance & Scaling
- [ ] Time to First Token (TTFT) streaming active for user UIs.
- [ ] Semantic caching thresholds configured and verified.
- [ ] P95 latency and API spend budgets defined.

### Operations & Deploy
- [ ] Continuous evaluation metrics stream to alert dashboards.
- [ ] Progressive canary weighted routing active at the gateway.
- [ ] Rollback configurations tested and automated triggers verified.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Model Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/model-review-checklist.md)
- [Prompt Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/prompt-review-checklist.md)
- [Security Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/security-review-strategy-implementation.md)
- [Deployment Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/deployment-review-strategy-implementation.md)

## 4. Sign-off Criteria
The master production sign-off passes when:
1. 100% of checklist validation points are verified.
2. Compliance, security, operations, and product managers sign off on the audit log.
3. System runs successfully under a 24-hour shadow testing cycle with zero failures, zero database leaks, and within performance budgets.
