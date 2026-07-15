# Lifecycle Management (Data Lifecycle Management - DLM)

## 1. Definition & Core Concepts

Data Lifecycle Management (DLM) at the database layer is the automated, policy-driven process of managing the transitions of data through distinct utility stages: from initial ingestion and active modification (hot), to read-only access (warm), cold storage archiving, and final physical destruction (purging).

Core DLM stages:
- **Ingestion / Active (Hot Stage):** Newly written data that is frequently updated and queried, requiring low-latency storage (RAM-cached B-Trees, high-performance NVMe SSDs).
- **Read-Only / Operational (Warm Stage):** Data that is no longer modified but is queried occasionally (e.g. past month's invoices), stored on standard cost-effective SSD tablespaces.
- **Archival / Compliance (Cold Stage):** Historical records kept for regulatory compliance but rarely queried (e.g. 5-year-old financial logs), stored in highly compressed formats (Parquet/S3) on cheap storage.
- **Destruction (End of Life - EOL):** The physical erasure (hard delete) of data and backups once their legal retention window expires, satisfying GDPR compliance.

*(Boundary Note: Code-level batch processors, application reporting portals, and legal compliance documentation belong in backend-development and product analysis. This document covers database-level storage tier routing, automated partition movement, lifecycle triggers, WAL archiving, and DDL dropping.)*

## 2. Why It Exists / What Problem It Solves

If databases treat all data identically, old records remain in high-performance transactional tables forever. Storage volumes grow, making database backups and indexes too large to fit in memory. This degrades query speeds and inflates cloud infrastructure costs. DLM automates data transitions, keeping active tables lean, optimizing query performance, and ensuring data is purged according to legal constraints.

## 3. What Breaks in Production Without It

- **Primary SSD Storage Starvation:** Telemetry or transaction tables grow to terabytes, saturating premium NVMe SSD storage volumes. The database cannot scale further, and provisioning more premium storage becomes cost-prohibitive.
- **Index Eviction Performance Collapse:** Ancient, inactive log records occupy B-Tree index pages. This displaces active user record indexes from RAM, forcing queries to read from disk and slowing down overall API response times.
- **Catastrophic Outages from Bulk Deletes:** Attempting to purge years of old data manually using huge SQL `DELETE` commands, which lock tables, saturate WAL queues, and crash transactional services.
- **Failed Compliance Audits:** Storing customer transaction histories past their legal retention limit, violating data privacy regulations.

## 4. Best Practices

- **Implement Automated Partitioning by Time:** Design transactional tables using range partitioning (e.g., monthly). This allows moving or dropping entire time-based tables dynamically.
- **Enforce Storage Tier Routing (Tablespaces):**
  - Route current active partitions (hot stage) to high-speed NVMe SSDs.
  - Route past partitions (warm stage) to standard block storage volumes.
  - Export old partitions (cold stage) to object storage (S3/Cloud Storage) and drop the primary tables.
- **Automate Lifecycle Triggers via Cron Jobs:** Configure database-level schedulers (e.g. pg_cron) to execute lifecycle scripts (such as archiving and dropping old partitions) during low-traffic windows.
- **Compress Cold Data Column-wise:** Convert archived data into highly compressed columnar formats (like Apache Parquet) to minimize storage costs and optimize analytical query speeds.
- **Enforce Physical Destruction (Hard Deletes):** Ensure the final EOL stage executes physical DDL drops (`DROP PARTITION`) or batch deletes to completely wipe data from primary disks and backups, satisfying GDPR requirements.

## 5. Common Mistakes / Anti-Patterns

- **Single-Tier Storage Hoarding:** Storing all data (both hot and cold) on a single high-performance primary disk.
- **Manual Data Shifting:** Relying on developers or DBAs to manually archive or delete old tables, leading to skipped cycles and disk space issues.
- **Leaving Cold Data Uncompressed:** Archiving raw SQL text files instead of compressed formats (Parquet/zstd), wasting storage budgets.
- **Ignoring Backups in Lifecycle Plans:** Purging active tables but keeping unencrypted raw backups in cold storage buckets indefinitely.

## 6. Security Considerations

- **Archival Encryption & Access Isolation:** Ensure cold storage archives are encrypted using separate KMS keys, restricting access to specialized auditing roles to prevent data leakage.

## 7. Performance Considerations

- **Write Amplification Reduction:** Using DDL partition drops (`DROP TABLE`) to transition data to EOL avoids row-level indexing updates and WAL writes, keeping transaction performance high.

## 8. Scalability Considerations

- **Object Storage Offloading:** Offload cold archival stages to cloud object storage (S3/Cloud Storage), which provides infinite storage scaling independent of database host hardware limits.

## 9. How Major Companies Implement It

- **Stripe:** Automatically manages transaction data lifecycles. Payment events are kept in active PostgreSQL tables for 90 days, then exported to S3 Parquet archives, and physically dropped from primary tables using automated partition workflows.
- **Netflix:** Moves old playback and viewing history records from active Cassandra node caches to cold storage lakes, keeping memory cached for current active sessions.

## 10. Decision Checklist (DLM Sizing Framework)

Map data lifecycle stages based on database size:

- Use **Partition-Based Tablespaces (Hot/Warm SSD Split)** when:
  - Database size is 100GB to 1TB.
  - Historical data (warm) must remain immediately queryable via SQL.
  - Budget permits maintaining larger SSD volumes.
- Use **Object Storage Archival (Cold Storage Export + Table Drop)** when:
  - Database size exceeds 1TB.
  - Data older than a specific window (e.g., >1 year) is read-only and rarely accessed.
  - Storage cost must be minimized.
- Use **Columnar OLAP Warehouses** when:
  - Cold data must be aggregated for business intelligence (BI) reports.

## 11. AI Coding-Agent Implementation Guidelines

- Always use time-range partitioned table templates for schemas that grow continuously.
- Never write database configuration files that store all data tiers on a single SSD tablespace.
- Always include automated partition movement and drops in cron event scripts.
- Never suggest keeping PII data in active tables past its legal retention limit.
- Always recommend compressing archival data using Apache Parquet or similar formats.

## 12. Reusable Checklist

- [ ] Data lifecycle policy (hot, warm, cold, EOL) defined per data class
- [ ] Time-range partitioning configured to isolate data by age
- [ ] Storage volume tiers (tablespaces) allocated matching performance requirements
- [ ] Automated ETL/CDC scripts active to export cold data partitions to S3
- [ ] Archive data compressed using columnar formats (Parquet/ORC)
- [ ] EOL stage configured to physically delete (hard delete) data and backups
- [ ] Lifecycle transition scripts scheduled to run during low-traffic hours
- [ ] Backup retention policies synchronized with database lifecycle stages
