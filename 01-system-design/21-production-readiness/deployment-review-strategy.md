# Deployment Review Readiness Guide

## 1. What Question This Answers
"Is the CI/CD pipeline, container manifest, and release configuration verified and ready for production promotions?"

## 2. Why It Matters at the System-Design Stage
Incomplete deployment pipelines lead to silent test failures, exposed registry credentials, and connection drops during container promotions.

## 3. Methodology / How to Work Through It
1. **Audit Container Configurations:** Verify Docker files are using multi-stage builds.
2. **Review CI pipeline jobs:** Confirm linting, security scans, and unit tests execute on branch merges.
3. **Verify Probes settings:** Check Kubernetes readiness and liveness parameters.
4. **Execute Deployment Checklist:** Complete log file.

## 4. Inputs Needed
- Selected deployment methods.
- Chosen CI/CD configurations.

## 5. Outputs Produced
- Feeds into DevOps validation runs.

## 6. Worked Checklist Example
- [x] Dockerfiles run processes as non-root users.
- [x] Readiness probes verify database connectivity before routing requests to new containers.
- [x] Environment secrets are injected via vault keys.

## 7. Common Mistakes
- **Running containers as Root:** Leaving containers open to host filesystem compromise.
- **Missing Readiness Probes:** Routing requests to containers before the application finishes boot operations.

## 8. AI Coding-Agent Guidelines
1. **Enforce Non-Root Users:** Check that Dockerfiles specify non-root user execution.
2. **Verify Probes:** Always require readiness probes.
3. **Produce Deployment Audit Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Deployment Review Log: [System Name]

### 1. Delivery Checks
- [ ] Multi-stage Dockerfiles utilize non-root users.
- [ ] Kubernetes manifests configure CPU/RAM requests and limits.
- [ ] Readiness and liveness probes are defined.
- [ ] CI pipeline runs security scanning on all commits.

### 2. Sign-off Status
- **Status:** [Go / No-Go]
- **Outstanding Actions:** [e.g. Configure health check probes on web pods.]
```
