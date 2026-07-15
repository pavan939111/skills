# Per-Change Deployment Review Checklist

## 1. Purpose
This checklist is used to review deployment variables, registry changes, feature flag switches, model endpoints, and rollbacks for a specific prompt or model change before shipping.

## 2. Checklist

### Configuration & Registry
- [ ] Model endpoint strings pinned to explicit, version-locked identifiers.
- [ ] Prompt configuration updates registered in Git-based config repository.
- [ ] Environment credentials decoupled from code commits.

### Delivery & Fallback
- [ ] Weighted canary flag configurations define the routing weight split (e.g. 5% canary).
- [ ] Fallback API model configurations define backup routes on error.
- [ ] Streaming transport configurations verified (SSE chunk headers).

### Rollback Procedures
- [ ] Rollback steps documented and automated validation alerts verified.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Model Versioning](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering17-operations-management/model-versioning-strategy-implementation.md)
- [Prompt Versioning](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering17-operations-management/prompt-versioning-strategy-implementation.md)
- [Deployment Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/deployment-review-strategy-implementation.md)

## 4. Sign-off Criteria
The per-change deployment review passes when:
1. 100% of checklist validation points are verified.
2. Target prompt configurations are successfully synced to staging databases.
3. Automated rollback scenarios verify that the system successfully returns route pointers to baseline versions on model connection failures.
