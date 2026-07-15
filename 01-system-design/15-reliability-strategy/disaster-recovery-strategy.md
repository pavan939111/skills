# Disaster Recovery Strategy

### 1. The Question Decided
"Which disaster recovery pattern (Backup-Restore, Pilot Light, Warm Standby, or Multi-Site Active-Active) fits our downtime and recovery budgets (RTO/RPO)?"

### 2. Options Compared
| Pattern | Backup & Restore | Pilot Light | Warm Standby | Active-Active |
|---|---|---|---|---|
| **RTO (Recovery Time)**| Hours-Days | Under 1 hour | Minutes | Real-Time (<1 min) |
| **RPO (Data Loss)** | 24 Hours | Under 1 hour | Under 1 minute | Near-Zero |
| **Cost** | Extremely Low | Low | Medium | Extremely High |
| **Complexity** | Low | Medium | High | Very High |

### 3. Decision Rule
- **Choose Disaster Recovery patterns based on RTO/RPO limits:**
  - *If* RTO $<15\text{ minutes}$ and RPO $<1\text{ minute}$, *then* deploy **Warm Standby** with continuous database replication to a secondary region.
  - *If* RTO $>4\text{ hours}$ is acceptable and budgets are tight, *then* select **Backup & Restore** from S3.

### 4. Red Flags to Revisit
- A regional datacenter outage takes the system offline for 12 hours because the team had no automated failover promotion scripts.
- Multi-site Active-Active configuration is selected, but database queries experience write conflicts and split-brain sync errors.

### 5. Where to Go Next
- For disaster recovery plans, regional failovers, and failover verification checklists, see [Disaster Recovery Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/disaster-recovery-strategy-implementation.md).
- For calculating recovery time and point limits, see [RTO and RPO Specifications](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/rto-rpo-strategy.md).
