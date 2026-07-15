# Backup Strategies

## 1. Definition & Core Concepts

Database Backup Strategies are the architectural and operational designs used to copy, store, and preserve database states to enable recovery from hardware failure, data corruption, or disaster events.

Core concepts:
- **Logical Backup:** Exporting database schemas and records into text SQL files (e.g. `pg_dump`, `mysqldump`). (Human-readable, portable across database versions, but slow to export and restore for large datasets).
- **Physical (Binary) Backup:** Copying raw database data directory files and byte blocks directly (e.g., `pg_basebackup`, volume snapshots). (Fast to write and restore, but database-engine and OS-version specific).
- **Point-in-Time Recovery (PITR):** Restoring a physical base backup and replaying sequential Write-Ahead Logs (WAL) or binary logs up to a specific transaction second, minimizing data loss.
- **Continuous Archiving:** Instantly shipping transaction logs (WAL segments) to remote, durable object storage as they are finalized.
- **Full vs. Incremental/Differential Backups:**
  - *Full:* Copying the entire dataset.
  - *Incremental:* Copying only database block pages that changed since the last backup.
  - *Differential:* Copying only changes since the last *full* backup.

*(Boundary Note: Code-level backup script cron triggers, application configuration parameters, and cloud console snapshot scheduler dashboards belong in operations and backend-development books. This document covers database-level dump/physical tools, WAL archiving, backup encryption, and recovery points.)*

## 2. Why It Exists / What Problem It Solves

Hardware failures, software bugs, security breaches, and human mistakes can destroy database state. A database backup strategy guarantees that a verified, consistent copy of the data exists outside the primary database server, allowing the business to restore operations and prevent permanent data loss.

## 3. What Breaks in Production Without It

- **Silent Backup Failures:** A backup cron script fails due to credentials changes or storage space shortages. Because no monitoring is configured, the failure goes unnoticed for months until a database crash occurs and developers realize no backups exist.
- **Table Lock Crashes from Logical Dumps:** Running raw logical backups (`pg_dump` or `mysqldump`) on large production databases during peak hours without lock-bypass configurations. The command requests shared locks, blocking concurrent writes and crashing transactional APIs.
- **Ransomware Backups Erasure:** Storing database backups on the same network subnet or cloud account as the primary servers. Attackers compromise the cloud account and delete both the primary databases and all backup files, holding the company hostage.
- **Dirty Block Crash Recovery Gaps:** Taking VM-level storage snapshots of an active database without running database freeze/flush checkpoints. The snapshot records dirty memory pages and uncommitted blocks, resulting in corrupted table spaces when restored.

## 4. Best Practices

- **Implement Physical Backups + WAL Archiving (PITR):** For production OLTP databases, combine weekly physical base backups with continuous WAL archiving. This allows restoring the database to a specific second, minimizing the Recovery Point Objective (RPO).
- **Isolate Backups in Isolated Read-Only Accounts:** Ship backup files to a separate, isolated cloud account. Enforce Object Lock policies (WORM - Write Once Read Many) to prevent ransomware or compromised admin keys from deleting backups.
- **Use Lock-Free Backups:** Avoid running blocking logical dumps on active write-heavy primaries. Execute backups on read-replicas, or use native lock-free physical backup tools (e.g. pgBackRest, Percona XtraBackup).
- **Automate Backup Integrity Verification:** Do not just verify that backup files exist. Configure automated systems to extract, decrypt, and load backups onto separate test servers daily to verify data consistency.
- **Compress and Encrypt Backups:** Encrypt backup files during generation using KMS keys. Compress backups (using gzip or zstd) to minimize network transfer times and storage costs.

## 5. Common Mistakes / Anti-Patterns

- **Local Storage Backups:** Storing backup archives on the same physical disks as the database server, losing both if the disk fails.
- **Relying Solely on VM Snapshots:** Taking raw VM snapshots without flushing database writes first, resulting in crashed files.
- **Unencrypted Backups in Public Storage:** Writing SQL dump files containing plain-text customer PII to unencrypted cloud storage buckets.
- **No Rotation Policy:** Storing every backup file indefinitely, generating high storage costs.

## 6. Security Considerations

- **Backup Access Control:** Restrict database backup download permissions. Limit KMS decryption key access to prevent unauthorized users from downloading and decrypting database archives.

## 7. Performance Considerations

- **Disk I/O and Network Contention:** Running physical backups saturates disk read IOPS and network card upload bandwidth. Schedule base backups during low-traffic maintenance windows, and throttle backup streaming speeds.

## 8. Scalability Considerations

- **Backups in Sharded Clusters:** In sharded architectures, coordinate backups across shards to ensure they are captured at consistent logical timestamps, preventing data drift across shards on recovery.

## 9. How Major Companies Implement It

- **Stripe:** Automatically ships PostgreSQL transaction logs (WAL) to secure, write-locked AWS S3 buckets every minute, utilizing automated restore-testing pipelines to verify backup integrity daily.
- **Netflix:** Utilizes automated database-agnostic backup systems to capture consistent snapshots of distributed Cassandra nodes, maintaining disaster recovery capacity across global regions.

## 10. Decision Checklist (Backup Strategy Matrix)

Select the backup approach:

- Use **Physical Backups + WAL Archiving (PITR)** when:
  - Database size exceeds 50GB.
  - RPO must be kept under 5 minutes (near-zero data loss).
  - Fast restore speed is required for large datasets.
- Use **Logical Backups (SQL Dumps)** when:
  - Database size is small (<10GB) and database write volume is low.
  - Data must be migrated between different database versions (e.g. PostgreSQL 12 to 16).
  - Portability across different cloud environments or SQL engines is required.
- Never use **Raw VM Snapshots** without:
  - Flushing database dirty pages and freezing table DDL writes (`flush tables with read lock`).

## 11. AI Coding-Agent Implementation Guidelines

- Never write database backup scripts that store credentials or passwords in plaintext.
- Always recommend physical backups (e.g. pgBackRest) instead of logical dumps for databases >50GB.
- Always enforce backup encryption configurations using external KMS keys.
- Never suggest storing backups on the primary database disk partitions.
- Always include automated compression configurations (gzip/zstd) in backup script templates.

## 12. Reusable Checklist

- [ ] Physical base backups + WAL archiving (PITR) configured for OLTP databases
- [ ] Backup files shipped to an isolated, read-only cloud storage account
- [ ] Object locking (WORM) active on backup storage to prevent deletion
- [ ] Backup files encrypted at rest using KMS encryption keys
- [ ] Backups executed on read-replicas or using lock-free physical backup tools
- [ ] Automated backup restore validation pipelines active (daily verify tests)
- [ ] Backup logs monitored and alert notifications set for failed operations
- [ ] Backup retention policy configured to prune old files automatically
