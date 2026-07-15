# CI/CD

## 1. Backend Application Context
CI/CD pipelines automate testing, code compiling, linter auditing, and container deployments to production environments.

## 2. Backend-Specific Pitfalls
- **Deploying builds that bypass tests:** Allowing code merges to trigger production deployments even when tests fail.

## 3. Code-Shape Example
`yaml
# GitHub Actions deployment workflow snippet
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run Tests
      run: |
        npm ci
        npm test # Must pass before deployment stage triggers
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [CI/CD](../../production_principles/delivery-and-readiness/02-ci-cd-strategy-implementation.md)
