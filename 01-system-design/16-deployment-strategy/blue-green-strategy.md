# Blue-Green Deployment Strategy

### 1. The Question Decided
"Should the application deploy using Blue-Green routing (maintaining two identical environments: active and idle), and how are routing shifts managed?"

### 2. Options Compared
| Dimension | Blue-Green Deployment | Rolling Updates | Canary Deployment |
|---|---|---|---|
| **Cost** | High (Requires 2x server capacity) | Low | Medium |
| **Rollback Speed** | Instant (Toggle router switch) | Slow (Must pull old container) | Fast |
| **Database Compat**| Strict backward compatibility | Strict | Strict |
| **Complexity** | Medium | Low | High |

### 3. Decision Rule
- **Choose Blue-Green Deployment if:** Target apps require zero-downtime releases, instant rollbacks on deployment failures are a priority, and infrastructure budgets can support 2x active server footprints during deployments.
- **Avoid Blue-Green if:** The primary database does not support backward-compatible schemas (destructive updates make instant routing shifts impossible).

### 4. Red Flags to Revisit
- Rollbacks fail because the new version executed a destructive database schema update, corrupting compatibility with the old code version.
- Routing shifts cause connection drops because load balancers lack active connection draining configurations.

### 5. Where to Go Next
- For configuring CD pipeline steps and rollback scripts, see [CI/CD Implementation Reference](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/delivery-and-readiness/02-ci-cd-strategy-implementation.md).
- For configuring connection draining on load balancers, see [DevOps Foundations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/delivery-and-readiness/03-devops-configuration.md).
