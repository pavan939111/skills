# Deployment Review Checklist

## 1. Purpose
This checklist acts as a production readiness gate to review blue-green deployments, container environment variables, model weight loading caches, canary release weights, and rollback strategies before shipping code.

## 2. Checklist

### Container Infrastructure
- [ ] Base container images for model hosting (vLLM, Triton) scanned and verified.
- [ ] Container limits set to match target GPU memory allocations (VRAM).
- [ ] Model weights pre-downloaded or cached on fast local storage volumes.

### Deployment & Rollback
- [ ] Blue-green deployment configurations active to prevent container start downtime.
- [ ] Startup health checks include pre-warming routines using synthetic queries.
- [ ] Progressive canary weights (1% -> 10% -> 100%) and A/B split flags active.
- [ ] Automatic rollback rules configured to trigger on error spikes.

### Registry & Configuration
- [ ] Pinned prompt versions loaded dynamically from registries (no hardcoded files).
- [ ] Environment variables decouple API keys and DB secrets from code assets.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Model and Prompt Deployment](../../07-platform-engineering/01-devops-readiness/deployment-implementation.md)
- Canary Releases
- [Shadow Testing](../17-operations-management/shadow-testing-implementation.md)
- [Rollback Strategies](../17-operations-management/rollback-implementation.md)

## 4. Sign-off Criteria
The deployment review passes when:
1. 100% of checklist validation points are verified.
2. Deployment tests confirm container startups take less than 60 seconds using warm model weight caches.
3. Automated rollback test scenario successfully triggers and reverts the canary environment to the baseline model version when HTTP error rates exceed 2%.
