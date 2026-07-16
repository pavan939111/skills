# Deployment Checklist

## 1. Backend Application Context
The Deployment Checklist is an audit tool used to verify that Dockerfiles compile securely, resources limits are declared, tests pass in CI/CD, and infrastructure configs are tracked.

## 2. Backend-Specific Pitfalls
- **Signing off checks with hardcoded container credentials:** Deploying containers that store staging passwords.

## 3. Code-Shape Example
`markdown
### DevOps PR Review Guidelines:
- [ ] Dockerfiles configure non-root execution permissions (USER node)
- [ ] Kubernetes pods declare CPU/memory requests and limits
- [ ] CI/CD pipelines run linters and test suites before deploys
- [ ] Deployment migrations check for backward compatibility
- [ ] Infrastructure provisioned via Terraform configurations
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [DevOps](../devops-configuration.md)
