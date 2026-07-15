# Canary Deployment Strategy

### 1. The Question Decided
"Should code updates be routed to a small percentage of users (Canary Release) before full promotion, and what telemetry metrics trigger automated rollbacks?"

### 2. Options Compared
| Dimension | Canary Deployment | Blue-Green | Rolling Updates |
|---|---|---|---|
| **Cost** | Medium | High | Low |
| **Risk Minimization**| High (Exposes code to actual users) | Medium | Low |
| **Rollback Speed** | Fast (Drop canary route) | Instant | Slow |
| **Complexity** | High (Requires weighted routers) | Medium | Low |

### 3. Decision Rule
- **Choose Canary Deployment if:** Operating high-traffic applications where new features carry risk, and we can monitor client error rates to trigger rollbacks.
- **Avoid Canary if:** System metrics telemetry (logging, tracing) cannot isolate canary errors from standard node logs.

### 4. Red Flags to Revisit
- Canary releases are deployed, but errors go unnoticed because there are no automated monitors tracking canary node metrics.
- Users experience session failures because they are routed between canary and standard nodes without session bindings.

### 5. Where to Go Next
- For configuring weighted traffic routing on gateways and monitors rules, see [CI/CD Implementation Reference](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/delivery-and-readiness/02-ci-cd-strategy-implementation.md).
- For tracing error metrics, see [Observability Reference](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/foundations/03-observability-management-guide.md).
