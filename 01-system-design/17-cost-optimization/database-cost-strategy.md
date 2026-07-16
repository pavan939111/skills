# Database Cost Strategy

### 1. The Question Decided
"How do we manage database license and instance hosting costs, and at what scale thresholds do we optimize schemas to reduce IOPS fees?"

### 2. Options Compared
| Dimension | Managed DB Service (e.g. AWS RDS) | Serverless DB (e.g. Aurora Serverless) | Self-Hosted DB on EC2 |
|---|---|---|---|
| **Hosting Cost** | Medium-High | Variable | Low |
| **IOPS Cost** | Fixed baseline | Pay-per-request | Fixed baseline |
| **Complexity** | Low | Low | High |
| **Scaling Control**| Medium | High | High |

### 3. Decision Rule
- **Choose Managed DB Services if:** The database has steady baseline query volumes and data size is predictable, making fixed monthly hosting costs easy to budget.
- **Choose Serverless DB if:** Workloads are highly volatile or idle for long periods (e.g. dev/test staging environments) where scaling down to zero saves cost.

### 4. Red Flags to Revisit
- AWS billing contains high "Provisioned IOPS" or "Aurora I/O" charges due to un-indexed query scans triggering disk reads.
- Database scaling actions fail because resizing VM nodes requires database downtime during peak hours.

### 5. Where to Go Next
- For database query tuning, query index sizing, and storage footprint reductions, see [Cost Optimization & FinOps Guide](../../12-governance/03-operations-and-governance/01-cost-optimization-finops-guideline.md).
- For database vertical scaling limits, see Vertical Database Scaling.
