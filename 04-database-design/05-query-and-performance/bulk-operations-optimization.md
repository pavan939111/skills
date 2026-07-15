# Bulk Operations

## 1. Definition & Core Concepts

Bulk Operations are techniques used to import, update, or delete large volumes of data (tens of thousands to millions of rows) efficiently, minimizing transaction overhead, network chatter, and disk write amplification.

Core concepts:
- **Batching:** Grouping data mutations into bounded chunks (e.g., 1,000 to 5,000 rows) rather than processing rows individually or all at once.
- **`COPY` Command:** A database-native protocol (e.g., PostgreSQL `COPY`, MySQL `LOAD DATA INFILE`) that streams raw data files directly into the database engine, bypassing SQL parsing overhead.
- **Multi-Row `INSERT`:** Writing single SQL insert statements that contain multiple value blocks (e.g., `INSERT INTO table (col) VALUES (val1), (val2), (val3)`).
- **Partition Swapping:** An instant DDL operation where a fully populated staging table is swapped into a partitioned table as a new partition range, achieving zero-downtime loading.
- **Write-Ahead Log (WAL) Bypass:** Temporarily disabling or minimizing database logging during bulk operations (e.g. using `UNLOGGED` tables).

*(Boundary Note: Code-level batch loop controllers, application file parsing modules (CSV parsers), and client stream pipelines belong in `backend-development/`. This document covers database-level load commands, indexing drop rules, transactional batch boundaries, and partition swapping DDL.)*

## 2. Why It Exists / What Problem It Solves

Running single-row INSERT statements inside loops (e.g., inserting 100,000 rows one-by-one) generates massive network chatter. Each insert requires a round-trip network loop and forces the database to write to the Write-Ahead Log (WAL) and update indexes individually, taking hours. Conversely, attempting to insert all 100,000 rows in a single transaction locks the table, blocks concurrent queries, and risks out-of-memory errors. Bulk operations optimize database throughput.

## 3. What Breaks in Production Without It

- **Disk Queue Saturation from WAL Congestion:** A single transaction inserts 1 million rows. The database engine's transaction log disk queue saturates, freezing all write operations across the entire server.
- **Table Lockout Timeouts:** Executing bulk updates or deletes without batching. The transaction holds exclusive locks on the target rows or tables for minutes, causing concurrent API queries to time out.
- **Out of Memory Crashes on Client:** The application retrieves 500,000 rows to process in memory at once instead of using pagination or cursors, running the server out of RAM.
- **Index Fragmentation:** Continuous single-row writes to random B-Tree positions forcing index pages to split repeatedly, slowing down writes over time.

## 4. Best Practices

- **Batch Multi-Row Inserts to 1,000–5,000 Rows:** Group inserts into bounded batch queries. This balances network efficiency and database memory usage.
- **Use `COPY` / `LOAD DATA` for Raw Imports:** For initial data migrations or bulk loads, stream files directly using the database-native COPY protocols instead of compiling INSERT statements.
- **Disable Indexes and Constraints During Bulk Migration:** If importing a massive dataset (>10M rows) into an empty table, drop the secondary indexes, load the data in bulk, and rebuild the indexes afterwards. Rebuilding indexes in bulk is faster than updating them row-by-row during writes.
- **Execute Deletes and Updates in Batches:** When deleting expired logs, run queries in loop batches with short transaction boundaries to avoid locking tables.
  - *Example:* `DELETE FROM logs WHERE created_at < NOW() - INTERVAL '1 year' AND id IN (SELECT id FROM logs WHERE created_at < NOW() - INTERVAL '1 year' LIMIT 5000);`
- **Use Partition Swapping for Instant Data Loads:** Populated a staging table, build indexes and constraints on it, and attach it to the partitioned table using a metadata swap.
  - *Example:* `ALTER TABLE parent_table ATTACH PARTITION staging_table FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');`

## 5. Common Mistakes / Anti-Patterns

- **Single INSERT Loops:** Writing code that executes `INSERT` queries in application loops.
- **Unbounded Bulk Deletes:** Running `DELETE FROM table WHERE date < X` on tables containing millions of records, locking the table and saturating the WAL.
- **Leaving Indexes Active During Migrations:** Keeping 10 indexes active when importing millions of rows of data.
- **Ignoring Batch Commit Frequencies:** Batching data but executing a single database `COMMIT` at the end of the entire loop, keeping locks open. Commit after every batch.

## 6. Security Considerations

- **SQL Injection in Bulk Strings:** When parsing raw CSV files for bulk imports, ensure delimiters and strings are escaped to prevent malicious payloads from executing as SQL commands during load.

## 7. Performance Considerations

- **WAL Flush Overhead:** Every transaction commit forces a synchronous write (flush) to the WAL disk. Batching reduces the number of commits, minimizing disk I/O bottlenecks.

## 8. Scalability Considerations

- **Parallel Loading Pipelines:** Split massive files into smaller chunks and load them in parallel across separate database connections, taking care not to exceed server CPU limits.

## 9. How Major Companies Implement It

- **Stripe:** Imports merchant billing ledger logs using batch streaming frameworks, batching updates in sizes of 1,000 to maximize transactional throughput and prevent write locks.
- **Retail Warehouses:** Load daily inventory catalog prices using staging partition swaps, enabling instant metadata attachment with zero runtime checkout locks.

## 10. Decision Checklist (Bulk Operations Matrix)

Select the bulk operation approach:

- Use **`COPY` / `LOAD DATA INFILE`** when:
  - Performing raw text/CSV file imports containing over 50,000 rows.
  - Doing initial database seeding or data migrations.
- Use **Multi-Row `INSERT` Batches (1,000 - 5,000 rows)** when:
  - Applications write batch data payloads dynamically (e.g. batch user imports).
  - Data validation must run database-side in real-time.
- Use **Batch Loops (`LIMIT` Deletes/Updates)** when:
  - Deleting or updating historical logs or transactional records in production tables.
  - Write locks must be minimized to preserve API availability.
- Use **Partition Swapping** when:
  - Deposing massive datasets into partitioned tables with zero downtime or write lockouts.

## 11. AI Coding-Agent Implementation Guidelines

- Never generate database code templates that run single-row insert queries in loops.
- Always batch bulk delete and update operations into loops using `LIMIT` boundaries.
- Always recommend dropping secondary indexes before performing massive data migrations.
- Never write database migrations that load raw files using individual `INSERT` statements — recommend `COPY`.
- Always verify that each batch execution commits its transaction before starting the next loop.

## 12. Reusable Checklist

- [ ] Bulk writes grouped into batch sizes of 1,000 to 5,000 rows
- [ ] Direct file imports stream using database-native `COPY` / `LOAD DATA` protocols
- [ ] Bulk deletes and updates batch-looped with explicit transaction commits per loop
- [ ] Secondary indexes dropped before massive migrations and rebuilt afterwards
- [ ] Partition swapping utilized to attach large table segments with zero downtime
- [ ] Data validation and constraints active on staging tables before swap operations
- [ ] CSV/Bulk files sanitized to prevent format injection
- [ ] Write-Ahead Log (WAL) size configured to prevent disk congestion during load
