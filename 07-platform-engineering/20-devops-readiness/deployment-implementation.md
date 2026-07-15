# Deployment

## 1. Backend Application Context
Deployment governs the rollout of new application versions to environments, executing blue-green or canary rollouts to minimize risk.

## 2. Backend-Specific Pitfalls
- **Synchronous database updates:** Deploying code updates that drop database columns before old code versions are terminated, causing active routes to fail.

## 3. Code-Shape Example
`
Step 1: Deploy new database migrations (backward-compatible)
Step 2: Roll out new application containers (canary v2)
Step 3: Shift client traffic to new containers
Step 4: Terminate old containers (v1)
Step 5: Run cleanup migrations (drop old columns)
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [CI/CD](../../production_principles/delivery-and-readiness/02-ci-cd-strategy-implementation.md)
- [System Design Deployment Strategy](../../01-system-design/16-deployment-strategy/)
