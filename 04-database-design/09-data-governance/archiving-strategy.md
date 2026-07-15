# Archiving (Data Archival Strategy)

## 1. Definition & Core Concepts

Database Archiving is the process of moving cold, inactive historical records from high-performance production databases (OLTP) to cheaper, secondary storage tiers (OLAP or data lakes) while preserving data format, integrity, and query access paths.

Core concepts:
- **Hot vs. Cold Data:**
  - *Hot:* Data actively queried and modified (e.g., current orders, active user sessions), stored in fast, expensive RAM/SSD systems.
  - *Cold:* Historical records rarely accessed (e.g., 5-year-old transactions), stored on low-cost compressed storage.
- **Columnar Archive Formats:** Storing data in column-oriented formats (like Apache Parquet or ORC) to achieve high compression rates (up to 80%) and fast analytical scans.
- **Federated Queries:** Querying across both the active database and the cold archive using unified SQL interfaces (e.g. AWS Athena, PostgreSQL Foreign Data Wrappers - FDW).
- **Data Lineage:** Tracking data transitions from production tables through the ETL (Extract, Transform, Load) pipelines into the archival lakes.

*(Boundary Note: Code-level ETL worker frameworks, application reporting dashboards, and analytical charts libraries belong in operations and backend-development. This document covers database-level archiving schemas, data compression formats, schema version sync, and federated database links.)*

## 2. Why It Exists / What Problem It Solves

Production OLTP database servers are sized with expensive resources (NVMe SSD storage, high RAM buffer caches). If a business keeps all historical records in the active tables, the primary database swells. This displaces hot indexes from memory, forces slow disk I/O, increases backup times, and bloats cloud infrastructure bills. Archiving offloads cold records, keeping production databases lean while maintaining query access.

## 3. What Breaks in Production Without It

- **Buffer Cache Pollution from Stale Scans:** An analyst runs a query searching for old transactions from 2018. The database must load ancient disk pages into the RAM buffer pool, displacing active user indexes and causing performance drops across the API.
- **Out of Memory during Backups:** Primary database backups take hours to run and fail due to network timeouts because the physical database size has reached multiple terabytes.
- **Archive Schema Mismatch Outages:** The primary OLTP database schema evolves (e.g., a column is renamed or dropped). The archival ETL pipeline continues to stream data into the archive using the old schema, causing the pipeline to break and corrupting the archive lake.
- **Expensive Cloud Billing Spikes:** Paying premium NVMe SSD pricing for petabytes of read-only logs that are only accessed once a year during financial audits.

## 4. Best Practices

- **Export in Highly Compressed Formats:** Convert archived data into columnar formats (like Apache Parquet) which offer high compression ratios and allow analytical engines to scan columns without reading entire rows.
- **Automate the Archival Pipeline (CDC/ETL):** Implement Extract, Transform, Load (ETL) or Change Data Capture (CDC) pipelines to automatically move data to secondary storage (e.g., S3/Cloud Storage) once it exits the active retention window.
- **Synchronize Schemas across Tiers:** Ensure that DDL schema migrations run on the primary database automatically propagate to the archive table schemas, maintaining schema version consistency.
- **Enforce Read-Only Status on Archives:** Configure archive databases and object storage buckets to be strictly read-only (`GRANT SELECT ON ...`), preventing historical records from being modified.
- **Provide Unified Interfaces (Federated SQL):** Set up read-only database wrappers (e.g., PostgreSQL Foreign Data Wrappers) to allow developers to query archived data using SQL queries when needed, without loading data back into the primary database.

## 5. Common Mistakes / Anti-Patterns

- **Hoarding Cold Data in OLTP:** Keeping years of inactive logs in transactional tables.
- **Storing Archives on Expensive SSDs:** Keeping historical tables in the active tablespace, wasting premium disk budgets.
- **No Schema Version Tracking:** Archiving data without documenting schema changes, making old data unreadable.
- **Manual Archiving Scripts:** Relying on developers to run manual SQL dumps to archive data, leading to inconsistent pipelines.

## 6. Security Considerations

- **Archived Data Encryption:** Ensure archived files in secondary storage are encrypted at rest using KMS. Verify that role permissions on the archive lake restrict access to authorized personnel (e.g., security auditors).

## 7. Performance Considerations

- **Federated Query Latency:** Federated queries spanning both OLTP and S3 archives are slower due to network hops. Isolate federated queries to reporting roles, preventing them from consuming production database connection pools.

## 8. Scalability Considerations

- **Horizontal Archive Scaling:** Route archives to distributed object storage systems (like AWS S3 or Google Cloud Storage) which offer infinite storage scaling, decoupling archival growth from server limits.

## 9. How Major Companies Implement It

- **Stripe:** Automatically offloads historical billing event logs from primary PostgreSQL databases into Apache Parquet archives stored on S3, using AWS Athena to run analytical queries.
- **Uber:** Moves old trip logs from active transactional engines to Hadoop and S3 data lakes, keeping OLTP table indexes cached entirely in RAM.

## 10. Decision Checklist (Archiving Framework)

Choose the data storage tier:

- Use **Production OLTP Tables (Hot RAM/SSD)** when:
  - Data is actively modified or frequently read by users (e.g., active orders, user sessions).
  - Sub-millisecond read/write latency is required.
- Use **Compressed Columnar Archives (S3/Parquet/OLAP)** when:
  - Data is older than the active window (e.g. >90 days old).
  - Data is read-only and modifications are prohibited.
  - Queries are analytical (BI reports, audits).
  - Storage cost must be minimized.

## 11. AI Coding-Agent Implementation Guidelines

- Never design databases that keep raw transactional log tables un-partitioned and un-archived past 90 days.
- Always recommend exporting cold data to columnar compressed files (Apache Parquet) for long-term storage.
- Always include schema version mappings when defining archival ETL pipelines.
- Never grant write permissions to database roles accessing historical archives.
- Always recommend Foreign Data Wrappers or federated query links for accessing archived data.

## 12. Reusable Checklist

- [ ] Inactive data identified and cold archival trigger windows defined (e.g. data >90 days old)
- [ ] Archival ETL/CDC pipelines automated to run during low-traffic windows
- [ ] Archive data converted to compressed, columnar storage formats (Parquet/ORC)
- [ ] Replicated KMS encryption keys active on secondary archival storage
- [ ] Schema migration scripts configured to update both OLTP and archive definitions
- [ ] Archive storage folders configured as read-only (prevents data modification)
- [ ] Federated query links (e.g. FDW / Athena) set up for historical lookups
- [ ] Operational OLTP database sizes and index RAM cache hit ratios monitored
