# Data Retention

## 1. Definition & Core Concepts

Data Retention is the operational policy and database design practice of defining how long specific classes of data must reside in active database storage and enforcing their automated purging or anonymization once they exceed their lifecycle window.

Core concepts:
- **Retention Window:** The defined period (e.g. 30 days, 7 years) that a specific data class (logs, transactions, user records) is legally or operationally required to be stored.
- **Data Minimization:** The privacy principle (mandated by GDPR/CCPA) that databases must only store the minimum necessary personal data required to fulfill the specific service transaction.
- **Automated Purging:** Database-level background processes or partition drops that systematically delete expired data without human intervention.
- **Retention Segregation:** Grouping tables or partitions based on their retention window (e.g., segregating 30-day session logs from 7-year audit ledgers).

*(Boundary Note: Code-level customer data export portals, privacy policy web pages, and legal compliance contracts belong in product analysis and backend-development. This document covers database partition drops, automated deletion loops, log purging scripts, storage capacity limits, and archival metadata schemas.)*

## 2. Why It Exists / What Problem It Solves

If databases store all data forever without classification:
- Storage volumes swell, generating high monthly cloud costs.
- Queries slow down as indexes expand past RAM boundaries, forcing disk scans.
- The organization violates data privacy laws (like GDPR) by keeping user PII indefinitely, exposing the company to heavy regulatory fines during audits.
Data retention keeps databases lean, optimized, and legally compliant.

## 3. What Breaks in Production Without It

- **Disk Space Outages from Log Accrual:** High-volume user session logs or telemetry tables accumulate millions of rows daily. Without automated retention purging, the primary database disk hits 100% capacity, forcing the engine to lock down and crash.
- **API Performance Degradation:** Standard user search queries must scan through 10 years of historical invoice records instead of the current active fiscal year, slowing down page loads.
- **catastrophic Locking from Single DELETE Transactions:** Attempting to purge 100 million expired log rows in a single query: `DELETE FROM logs WHERE created_at < NOW() - INTERVAL '1 year'`. The transaction holds exclusive locks on the table for hours, blocks API writes, bloats the transaction log (WAL), and crashes the database.
- **GDPR Non-Compliance Fines:** Auditors discover the database retains full PII address and contact details of users who closed their accounts 5 years ago, violating data minimization rules.

## 4. Best Practices

- **Align Schemas with Partition-Based Retention:** Design high-volume tables (logs, audits, events) using range partitioning based on time. Purge old data instantly with zero write locks by dropping partitions:
  `ALTER TABLE user_logs DROP PARTITION logs_2026_01;`
- **Group Tables by Retention Windows:** Segregate tables into distinct schemas or tablespaces based on retention requirements:
  - *Short-Term (30 Days):* Sessions, logs, temporary tokens.
  - *Medium-Term (1 Year):* User notifications, analytics metrics.
  - *Long-Term (7+ Years):* Billing ledgers, tax records.
- **Execute Row Purges in Bounded Batches:** If partitioning is not possible, delete expired rows in loop batches using limits and commit after every batch to prevent lock congestion:
  `DELETE FROM session WHERE expired_at < NOW() AND id IN (SELECT id FROM session WHERE expired_at < NOW() LIMIT 5000);`
- **Automate Purges via Database Schedulers:** Use database-native schedulers (e.g. pg_cron in PostgreSQL or MySQL Event Scheduler) to run purge tasks during off-peak hours.
- **Audit and Purge Database Backups:** Ensure database snapshots and backup files follow matching retention rules (e.g., delete backup snapshots older than 35 days).

## 5. Common Mistakes / Anti-Patterns

- **Storing All Data Forever:** Accumulating historical records indefinitely without a business or legal requirement.
- **Unbounded DELETE Queries:** Running massive deletions in single transactions, locking tables and saturating the WAL.
- **Soft Deleting without Hard Deletion:** Setting `is_deleted = true` but never executing physical deletes, keeping PII on disk forever.
- **No Backups Retention Rules:** Keeping raw SQL dumps on S3 buckets for years after their retention window has expired.

## 6. Security Considerations

- **Secure Anonymization Paths:** If data must be kept for analytics but PII must be purged, write database triggers that overwrite names and email columns with random hashes (e.g., SHA-256) rather than deleting rows, satisfying both data residency and business intelligence queries.

## 7. Performance Considerations

- **Write Amplification on Row Deletion:** Deleting millions of rows individually generates high write amplification as indexes are updated. Prefer partition drops, which are instant DDL catalog updates requiring zero row-level I/O write loops.

## 8. Scalability Considerations

- **Cold Storage Offloading:** Before dropping expired database partitions, run automated Change Data Capture (CDC) or ETL scripts to export the partition data to cold object storage (S3 Glacier/Cloud Storage) for historical analytics.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict data retention boundaries. Financial ledgers are preserved for 7+ years to comply with tax laws, while event logs and HTTP traces are automatically purged from primary databases using sliding partition windows after 90 days.
- **Netflix:** Monitors telemetry and user viewing streams across partitioned Cassandra nodes, automatically purging old data records via database TTL (Time-To-Live) settings configured at the column level.

## 10. Decision Checklist (Data Retention Framework)

Select the database purging strategy:

- Use **Partition-Based Dropping (DDL Drop)** when:
  - Table volume is high (>10M rows) and grows continuously (logs, events).
  - Data retention is based on time ranges (monthly/daily partitions).
  - You must guarantee zero table locks during database cleanups.
- Use **Batch-Looped Row Deletion (DML Delete)** when:
  - Storing low-to-medium volume tables.
  - Expired rows are distributed randomly across different time ranges (not partition-aligned).
  - Bounded delete loops can run during low-traffic windows.
- Use **Native Column TTL** when:
  - Operating NoSQL databases (Cassandra, Redis, DynamoDB) that natively support column-level expiration.

## 11. AI Coding-Agent Implementation Guidelines

- Never write massive delete queries (`DELETE FROM ... WHERE`) without including batch limits and commit loops.
- Always recommend range partitioning based on time for tables that grow continuously.
- Always include automated pg_cron or schedule event definitions in database setups.
- Never allow user PII to remain on disk in soft-deleted rows indefinitely.
- Always ensure backup retention policies are defined alongside database storage lifecycles.

## 12. Reusable Checklist

- [ ] Data retention windows defined and documented per table category
- [ ] Range partitioning on time configured for high-volume log and event tables
- [ ] Deletion of expired partitions automated via cron/scheduler (no manual DDL)
- [ ] Non-partitioned table deletes run in bounded loop batches (<5,000 rows/commit)
- [ ] Soft-deleted rows physically purged or anonymized after retention window expires
- [ ] Database backup retention policies configured to prune expired snapshots
- [ ] CDC/ETL pipelines export data to cold storage (S3) before database purges
- [ ] Disk space alerts configured to monitor storage capacity before retention runs
