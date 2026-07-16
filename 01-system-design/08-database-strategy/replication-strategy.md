# Replication Strategy

### 1. The Question Decided
"Should the database deploy read replicas, and what consistency model (Synchronous vs. Asynchronous replication) controls master-replica syncing?"

### 2. Options Compared
| Dimension | Single Node (No Replication) | Asynchronous Replication | Synchronous Replication |
|---|---|---|---|
| **Cost** | Low | Medium (Extra replica nodes) | High |
| **Write Latency** | Low | Low (Commit instantly on master) | High (Wait for replica ACK) |
| **Availability** | Low | High (Failover candidates) | High |
| **Read Scale** | Low | High (Reads distributed) | High |
| **Data Loss Risk**| High | Low (Minor replication lag loss) | Zero (Within replica group) |

### 3. Decision Rule
- **Choose Asynchronous Replication if:** The application is read-heavy, requires high availability, and can tolerate eventual consistency (minor replication lag on reads).
- **Choose Synchronous Replication if:** The application handles critical financial transactions where database promotions must guarantee zero data loss ($RPO \approx 0$).

### 4. Red Flags to Revisit
- Primary writes fail completely because a synchronous replica node crashed or experienced network latency, blocking master node commits.
- Users experience database read errors because application read replicas experience significant replication lag (>10 seconds).

### 5. Where to Go Next
- For database failover, promotions, and replica orchestrations, see [Failover Strategy Guide](../../04-database-design/08-reliability-and-backup/failover-strategy.md).
- For setting up replication cluster configurations, see [High Availability Database design](../../04-database-design/08-reliability-and-backup/high-availability-strategy.md).
