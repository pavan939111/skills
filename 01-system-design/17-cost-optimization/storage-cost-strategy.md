# Storage Cost Strategy

### 1. The Question Decided
"How does the system design control data storage costs, and what data lifecycles offload files to cold tiers?"

### 2. Options Compared
| Dimension | Active SSD SSD Tier | Object Storage (Standard S3) | S3 Archive (Glacier Deep Archive) |
|---|---|---|---|
| **Cost/GB/Month** | Extremely High | Medium | Extremely Low |
| **Access Time** | Instant | Instant | Slow (12-48 hours) |
| **Max Capacity** | Restricted | Infinite | Infinite |
| **Use Case** | Active SQL indexes | User uploads, active logs | Regulatory backups, old logs |

### 3. Decision Rule
- **Enforce strict storage lifecycles to control costs:**
  - *If* active database transactional data, *then* host on **SSD Tiers**.
  - *If* static attachments or daily logs, *then* store in **Standard S3**.
  - *If* archives $>90\text{ days old}$ or database snapshots, *then* migrate to **Glacier Deep Archive**.

### 4. Red Flags to Revisit
- Storage costs expand because daily database dumps are kept on expensive SSD volumes indefinitely instead of being shipped to S3 Glacier.
- Queries lag because the SQL database page cache is saturated with historical, rarely accessed data tables.

### 5. Where to Go Next
- For configuring storage budget limits, data pruning schedules, and lifecycle parameters, see [Cost Optimization & FinOps Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/03-operations-and-governance/01-cost-optimization-finops-guideline.md).
- For details on backup storage archiving tiers, see [Backup Storage Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/10-storage-strategy/backup-storage-strategy-implementation.md).
