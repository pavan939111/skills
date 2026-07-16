# Backup Storage Strategy

### 1. The Question Decided
"Where and how are system backups and databases dumps stored, and what lifecycles manage archival storage classes?"

### 2. Options Compared
| Dimension | Standard S3 Storage | S3 Infrequent Access (IA) | S3 Glacier Deep Archive |
|---|---|---|---|
| **Storage Cost/GB** | High | Medium | Extremely Low |
| **Retrieval Cost** | Low | Medium | High |
| **Retrieval Speed** | Instant | Instant | Slow (12-48 hours) |
| **Min Storage Duration**| None | 30 days | 180 days |

### 3. Decision Rule
- **Use Lifecycle rules to tier backup storage:**
  - *If* backups are $<30\text{ days old}$, *then* store in **Standard S3** for instant recovery.
  - *If* backups are $30\text{ to }90\text{ days old}$, *then* migrate to **S3 Infrequent Access** to save costs.
  - *If* backups are $>90\text{ days old}$, *then* migrate to **S3 Glacier Deep Archive** for long-term compliance retention.

### 4. Red Flags to Revisit
- Cloud hosting bills increase because the team stores terabytes of historical, un-deleted daily database dumps on standard hot SSD tiers.
- A critical disaster recovery run fails because backup files were corrupted during transition to archive classes.

### 5. Where to Go Next
- For database backup schedules, retention periods, and restoration verification scripts, see [Backup Strategies Guide](../../04-database-design/08-reliability-and-backup/backup-strategies-strategy.md).
- For general object storage configurations, see [Object Storage Implementation](../../04-database-design/file-storage-strategy.md).
