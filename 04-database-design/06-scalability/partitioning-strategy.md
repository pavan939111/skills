# Partitioning (Scaling Strategy & Trade-offs)

## 1. Definition & Core Concepts

Database Partitioning as a scaling strategy is the operational practice of dividing a massive table's data into smaller, physical sub-tables within a single server instance, optimizing memory utilization and query execution boundaries.

Core concepts:
- **Sliding Time Window Partitioning:** A rolling partition pattern (typically used for logs or transactions) where new partitions are created for incoming data (e.g. monthly) and oldest partitions are detached and archived.
- **Disk Tiering (Tablespace Routing):** Storing active, high-write partitions on fast NVMe SSD storage and moving historical, read-only partitions to cheaper HDD storage.
- **Partition Pruning Efficiency:** The database optimizer's ability to exclude irrelevant partitions from query scans based on search constraints.
- **Pre-Creation Pattern:** The practice of pre-building partition sub-tables in advance using background cron daemons, avoiding runtime table lockups.

*(Boundary Note: Schema-level SQL DDL declarations (Range, List, Hash syntax) and composite key constraints are covered in `03-schema-design/`. This document covers sliding windows, tablespace disk tiering, query pruning, and partition maintenance locks.)*

## 2. Why It Exists / What Problem It Solves

As table size grows past 50GB, standard B-Tree indexes expand, exceeding the server's RAM buffer. Every new write forces index updates on disk, slowing down writes. Partitioning keeps index sizes manageable. By dividing the table physically, the database only loads active indexes (e.g., current month's partition) into memory. This keeps transactional writes fast and allows dropping historical data instantly without generating transaction log lockups.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Table Lockouts from Runtime Partition Creation:** Designing systems that create partitions dynamically inside active user transactions (e.g., a checkout route attempts to run `CREATE TABLE IF NOT EXISTS order_2026_07` when a write occurs). Creating tables requires exclusive catalog locks, blocking all checkout traffic and causing API timeouts.
- **Storage Cost Inflation on SSDs:** Keeping terabytes of read-only historical partitions on expensive, high-speed NVMe SSD drives instead of migrating them to cold tablespaces.
- **Slow Query Scans from Pruning Failures:** Writing queries that search for records across partitions without including the partition key in the `WHERE` filters, forcing the database engine to scan all physical sub-tables on disk.
- **Out of Memory during Partition Rebuilds:** Running index rebuilds (`REINDEX`) on the parent table instead of target partitions. The engine attempts to index the entire dataset at once, exhausting server memory.

## 4. Best Practices

- **Pre-Create Partitions via Cron Daemon:** Use background cron schedulers or database worker agents (e.g., `pg_partman` in PostgreSQL) to pre-create partitions (e.g. next month's partition) days in advance, avoiding runtime catalog locks.
- **Deploy Disk Tiering (Storage Segregation):** Configure distinct tablespaces for different age tiers:
  - Route current, active partitions to fast NVMe SSD storage.
  - Route historical, read-only partitions to cheap HDD storage.
- **Keep Partition Sizes Under 50GB:** Maintain partition ranges so that no individual physical sub-table exceeds 50GB, ensuring indexes fit in memory.
- **Detach and Archive instead of Deleting:** When data ages out, run `ALTER TABLE ... DETACH PARTITION` to isolate the sub-table, export it to CSV/S3, and drop it. This avoids the heavy log logging of SQL `DELETE` commands.
- **Force Partition Keys in SQL Linter Rules:** Enforce query checks that require developers to include the partition key column in all `SELECT`, `UPDATE`, and `DELETE` filters.

## 5. Common Mistakes / Anti-Patterns

- **Dynamic Partition Creation on Write:** Creating tables inside API execution paths.
- **Dumping Stale Data on NVMe SSDs:** Keeping historical partitions on expensive storage.
- **Global Index Bloat:** Creating global indexes that span all partitions, which slows down partition drops. Use local indexes.
- **Over-Partitioning:** Partitioning tables into too many small segments (e.g., daily partitions for low-volume tables), which overloads the query planner.

## 6. Security Considerations

- **Archival Security Gating:** When detaching historical partitions and moving them to cold databases, ensure the target storage has matching security controls (encryption, access logs) to prevent data leaks.

## 7. Performance Considerations

- **Pruning Verification:** Regularly run `EXPLAIN` on queries to verify that the query planner is pruning partitions, ensuring queries scan only the active partition instead of the entire list.

## 8. Scalability Considerations

- **Single Instance Limits:** Partitioning scales a single database server vertically. When partition sizes exceed disk capacity or write volumes exceed single-primary limits, you must transition to horizontal sharding.

## 9. How Major Companies Implement It

- **Stripe:** Automatically pre-creates monthly database partitions for event logs, archiving and dropping expired partitions to keep their core database instances lean.
- **Uber:** Uses rolling time-window partition schemes for telemetry records, routing active updates to memory tables and exporting old partitions to long-term S3 data lakes.

## 10. Decision Checklist (Partition Maintenance Framework)

Set up partition management:

- Use **Asynchronous Pre-Creation (e.g., pg_partman)** when:
  - Table partitions are based on time ranges (monthly, daily).
  - You must prevent runtime table locks during user writes.
- Use **Disk Tiering (Tablespaces)** when:
  - Historical data must remain queryable, but storage costs must be minimized.
  - High-performance SSDs must be reserved for active writes.
- Never use **Dynamic On-The-Fly DDL** in:
  - Live transactional API paths.

## 11. AI Coding-Agent Implementation Guidelines

- Never generate SQL DDL code templates that create partitions dynamically inside write APIs.
- Always include automated partition pre-creation scripts (cron/worker) in database configuration setups.
- Always recommend local indexes instead of global indexes to optimize partition maintenance.
- Never write database query templates that omit the partition key in `WHERE` filters.
- Always recommend detaching and dropping partitions (`ALTER TABLE DETACH`) instead of executing large `DELETE` queries.

## 12. Reusable Checklist

- [ ] Partition pre-creation automated via background cron/worker (no runtime DDL)
- [ ] Active partitions routed to fast SSD tablespaces; historical to cheap storage
- [ ] Maximum partition size capped under 50GB/partition
- [ ] All indexes configured as local (partition-scoped) B-Trees
- [ ] Data retention managed via `DETACH` and `DROP` partition actions (no massive DELETEs)
- [ ] Query planner verified to execute partition pruning (EXPLAIN checked)
- [ ] No global indexes created on partitioned tables
- [ ] Default partition configured to catch out-of-range inserts
