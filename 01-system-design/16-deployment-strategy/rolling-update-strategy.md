# Rolling Update Strategy

### 1. The Question Decided
"Should the application deploy using Rolling Updates (gradually replacing old containers with new ones), and what concurrency limits protect system throughput?"

### 2. Options Compared
| Dimension | Rolling Updates | Blue-Green | Canary |
|---|---|---|---|
| **Cost** | Low (Zero additional infra capacity) | High | Medium |
| **Downtime Risk** | Low (Graceful shutdown required) | Low | Low |
| **Rollback Speed** | Slow | Instant | Fast |
| **Complexity** | Low (Supported natively in K8s) | Medium | High |

### 3. Decision Rule
- **Choose Rolling Updates if:** Deploying stateless application containers where budget is priority, the environment handles high-concurrency requests, and native K8s orchestration is available.
- **Enforce compatibility rules:** Schema updates must be backward-compatible since old and new container versions run simultaneously.

### 4. Red Flags to Revisit
- Dynamic request routers send traffic to booting containers before they are ready, causing connection timeouts (missing readiness probes configuration).
- Upgrades stall because the new version crashes on boot, and the rolling config is not set to abort automatically.

### 5. Where to Go Next
- For configuring readiness and liveness probes in deployment descriptors, see [DevOps Foundations](../../07-platform-engineering/devops-configuration.md).
- For backward-compatible database schema designs, see [Schema Compatibility Guidelines](../../04-database-design/11-migrations-and-versioning/compatibility-strategy.md).
