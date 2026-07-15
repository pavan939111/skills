# Backup Review Checklist

## 1. Purpose
This checklist validates that database backup frequencies, continuous WAL archiving settings, restoration scripts, recovery timelines, and disaster recovery processes comply with RTO/RPO limits. It should be run before moving user environments to production and audited quarterly.

## 2. Checklist

### Strategy & Continuous Archiving
- [ ] Weekly physical base backups are scheduled and active for OLTP databases.
- [ ] Write-Ahead Log (WAL) or binary log archiving streams logs continuously to remote storage.
- [ ] Backups are executed on read replicas to avoid locking production primaries.
- [ ] Log shipping parameters (WAL slot size) optimized to match RPO targets.

### Storage & Security
- [ ] Backup files are shipped to an isolated, read-only cloud storage account.
- [ ] Object Locking (WORM) policy active on backup storage buckets to prevent ransomware deletion.
- [ ] Backup files encrypted at rest using KMS encryption keys.
- [ ] Decryption keys replicated to the DR region KMS key vault.

### Restore & Recovery
- [ ] Ephemeral restore sandboxes provisioned to run daily automated restore verification checks.
- [ ] Post-restore data integrity scripts check block page checksums and table record counts.
- [ ] Disaster recovery (DR) standby instances configured in a separate geographical region.
- [ ] Consensus-based failover orchestrators (Patroni) active with node fencing (STONITH) enabled.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Backup Strategies](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/backup-strategies-strategy.md)
- [Restore Testing](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/restore-testing-strategy.md)
- [Disaster Recovery](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/disaster-recovery-strategy-implementation.md)
- [Failover](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/failover-strategy.md)
- [RTO / RPO](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/rto-rpo-strategy.md)

## 4. Sign-off Criteria
The backup review passes when:
1. 100% of checklist boxes are verified.
2. Daily automated restore verification reports confirm that backup files are restorable.
3. Test sandbox database recovery completes within the defined RTO window (e.g. <1 hour).
4. Automated alerts are active and page engineers if backup execution or log shipping fails.
