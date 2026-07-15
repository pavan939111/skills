# Production-Ready Checklist

## 1. Purpose
This checklist acts as the final checklist developers run before deploying any prompt, RAG pipeline, agent tool, or model adjustment. It ensures all secondary review checkpoints have been completed.

## 2. Checklist

### Validation Reviews
- [ ] Per-change prompt review checklist verified.
- [ ] Per-change RAG review checklist verified (if RAG configurations changed).
- [ ] Per-change agent review checklist verified (if tools/planning changed).
- [ ] Per-change evaluation review checklist verified.

### Safety & Deploy Checks
- [ ] Per-change security review checklist verified.
- [ ] Per-change deployment review checklist verified.
- [ ] Verification tests confirm outputs are formatted correctly in JSON/XML.
- [ ] Cost and latency metrics verified to fit in product budgets.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Per-Change Prompt Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering22-verification-checklists/prompt-review-checklist.md)
- [Per-Change Security Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering22-verification-checklists/security-review-strategy-implementation.md)
- [Per-Change Deployment Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering22-verification-checklists/deployment-review-strategy-implementation.md)
- [Production Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/production-checklist.md)

## 4. Sign-off Criteria
The production-ready review passes when:
1. 100% of checklist validation points are verified.
2. The pull request compiles and passes all CI/CD unit testing checks.
3. Feature flag weights are safely set to route initial traffic to the updated model/prompt endpoints.
