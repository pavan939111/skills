# Partitioning (Schema-Level Partitioning)

## 1. Definition & Core Concepts

Schema-level Partitioning is the database design technique of splitting a single logical table into multiple smaller physical sub-tables (partitions) within the same database engine instance, managed transparently by the database query optimizer.

Core partitioning methods:
- **Range Partitioning:** Mapping rows to partitions based on value ranges of the partition key (e.g., partitioning an `orders` table by year/month ranges of `created_at`).
- **List Partitioning:** Mapping rows to partitions based on a defined list of explicit values (e.g., partitioning a `users` table by `country_code` values).
- **Hash Partitioning:** Distributing rows across a set number of partitions using a modulus hash algorithm on the partition key, ensuring even data distribution.
- **Local vs. Global Indexes:**
  - *Local Index:* An index that is partitioned alongside its sub-table, matching its boundaries.
  - *Global Index:* A single index structure that spans all physical partitions, maintaining table-wide uniqueness but complicating writes.

*(Boundary Note: Operational scaling strategies, cross-server database sharding networks, and CAP theorem trade-offs belong in `06-scalability/`. This document covers single-instance DDL schema definition rules, partition keys, local indexing, and table constraints.)*

## 2. Why It Exists / What Problem It Solves

As a relational table grows past 100 million rows, its B-Tree indexes expand, exceeding the server's RAM buffer capacity. Writes degrade because updating indexes requires loading pages from disk. Partitioning resolves this by dividing the large table into smaller physical partitions. The query optimizer executes **Partition Pruning**, analyzing query filters (e.g., `WHERE created_at > '2026-07-01'`) and scanning *only* the physical partition containing that range, keeping index sizes small enough to fit in RAM.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Uniqueness Enforcement Blockages:** Relational database engines require that any `PRIMARY KEY` or `UNIQUE` constraint on a partitioned table must include the partition key column in its definition. If you need to enforce uniqueness on a non-partition key (like `email` in a table partitioned by `country_code`), the database engine cannot enforce it natively.
- **Insert Failures from Missing Ranges:** In range-partitioned tables, inserting a row with a key that falls outside the defined partition ranges (e.g. entering a 2027 transaction when partitions only cover up to 2026). The write fails, throwing runtime database errors.
- **Slow Queries from Failed Pruning:** Writing SQL queries that omit the partition key in the `WHERE` clause. The query planner must scan every physical partition in the table (a Partition Scan), degrading performance.
- **Row Migration Lockups:** Updating a row's partition key value, forcing the database engine to physically delete the row from one partition and insert it into another, locking tables and slowing writes.

## 4. Best Practices

- **Select the Partition Key Wisely:** Choose an immutable, highly queried column (typically `created_at` for time-series/logs or `tenant_id` for multi-tenant SaaS) as the partition key.
- **Ensure Primary Keys Include the Partition Key:** Declare primary keys as composite keys containing the partition key (e.g., `PRIMARY KEY (id, created_at)` in a time-partitioned table).
- **Always Define a DEFAULT Partition:** When using range or list partitioning, always configure a fallback default partition (e.g., `PARTITION OF table DEFAULT`) to catch unexpected values and prevent insert crashes.
- **Default to Local Indexes:** Create local indexes on partitions rather than global indexes to ensure that drop or rebuild operations only lock individual partitions, preserving system availability.
- **Only Partition Large Tables:** Only apply partitioning to tables expected to exceed 10 million to 50 million rows. Partitioning small tables adds query optimizer overhead and slows down reads.

## 5. Common Mistakes / Anti-Patterns

- **Partitioning Small Tables:** Partitioning tables containing under 1 million rows, increasing query planner latency.
- **Mutable Partition Keys:** Partitioning by a column that updates frequently, forcing the database to move rows between physical disks.
- **Omitting the Partition Key in Queries:** Writing application query statements that filter on indexed columns but omit the partition key, bypassing partition pruning.
- **Excessive Partition Counts:** Creating too many tiny partitions (e.g., partitioning by day for low-volume tables), overloading the database engine's file descriptor limits.

## 6. Security Considerations

- **Partition-Level Data Purges:** Partitioning simplifies data compliance deletes (e.g. GDPR retention limits). Instead of running a slow `DELETE WHERE created_at < X` query that logs transactions and locks rows, you can drop the entire expired partition table instantly (`DROP TABLE partition_name`), leaving no residual data.

## 7. Performance Considerations

- **Partition Pruning Verification:** Verify that the query planner is pruning partitions by running `EXPLAIN` on queries. Ensure the output shows the query scans only the targeted partitions, not the entire partition list.

## 8. Scalability Considerations

- **Disk Space Allocation:** Place active, highly written partitions on fast SSD storage, and move older, read-only partitions to slower, cheaper hard drive volumes (Tablespaces) to manage storage costs.

## 9. How Major Companies Implement It

- **Stripe:** Range-partitions log and event ledger tables by month, allowing them to drop expired historical partitions instantly without locking active payment transaction tables.
- **Global Financial Networks:** Use hash partitioning on account identifiers to distribute transaction workloads evenly across sub-tables, preventing index hotspots.

## 10. Decision Checklist (when to use / when NOT to use)

- Partition a **Table** when:
  - Table size exceeds 20 million rows or 50GB in size.
  - The table has a natural, immutable range column (like time/date) or list column (like region).
  - Data must be periodically archived or deleted in bulk blocks (drop partition).
- Skip Partitioning when:
  - The table is small (<10M rows) and B-Tree indexes fit comfortably in RAM.
  - The primary key cannot include the partition key due to strict external uniqueness constraints.

## 11. AI Coding-Agent Implementation Guidelines

- Always include the partition key in composite primary keys and unique index declarations.
- Never partition tables that are estimated to remain under 10 million rows.
- Always configure a default partition when using list or range partitioning.
- Never write SQL queries targeting partitioned tables without including the partition key in the `WHERE` filters.
- Always implement indexes as local to the partitions.

## 12. Reusable Checklist

- [ ] Table size or growth rate justifies partitioning (>10M rows)
- [ ] Partition key is immutable and frequently used in query filters
- [ ] Composite Primary Key declared including the partition key column
- [ ] DEFAULT partition configured to prevent insert range failures
- [ ] Indexes are configured as local (partition-scoped) B-Trees
- [ ] Query execution plans verified to confirm partition pruning is active
- [ ] No volatile or frequently updated columns used as partition keys
- [ ] Data retention pipelines drop historical partitions using DDL `DROP TABLE`
