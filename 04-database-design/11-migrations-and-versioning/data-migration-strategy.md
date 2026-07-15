# Data Migration (Data Backfilling & Transformation)

## 1. Definition & Core Concepts

Data Migration at the database tier is the process of backfilling, transforming, and updating existing record values (DML) to align with schema updates (DDL), executed in throttled, idempotent batches to prevent resource exhaustion.

Core data migration concepts:
- **Throttled Batching:** Executing updates in small, bounded row counts (e.g., 1,000 to 5,000 rows per transaction) rather than updating the entire table at once.
- **Throttle Sleep:** Injecting a short time delay (e.g., 50ms–200ms) between batches to allow the database disk and replication stream to process active transactional API traffic.
- **Resume Capability (Idempotence):** Structuring migration scripts so they can be paused or restarted after a failure, resuming exactly from the last processed primary key.
- **Migration Tracking Table:** A temporary database-level table that records the progress of active data backfills (e.g., tracking the last processed ID).

*(Boundary Note: Code-level migration runners, application ETL job schedulers, and client-side script frameworks belong in `backend-development/`. This document covers SQL-level batch loops, throttling parameters, tracking schemas, disk I/O protection, and replication lag controls.)*

## 2. Why It Exists / What Problem It Solves

When table schemas are refactored (e.g., splitting a `name` column into `first_name` and `last_name`), new columns are created as nullable. Existing rows must be backfilled with transformed values. Running a single SQL update: `UPDATE users SET first_name = split_part(name, ' ', 1)` on a table with 50M rows holds exclusive write locks on all rows, blocks API updates, saturates the transaction log (WAL), and crashes the server. Throttled data migrations execute updates in small, non-blocking segments.

## 3. What Breaks in Production Without It

- **Primary Write Lockouts from Massive UPDATEs:** Running un-throttled, single-transaction updates on millions of rows. The write locks are held for minutes, causing concurrent API updates to time out and exhausting database connection pools.
- **Replication Lag Spikes:** An un-throttled data migration generates massive WAL write traffic. Replicas fall behind by minutes or hours attempting to process the sync stream, serving highly stale data to users.
- **Disk Space Starvation from WAL Bloat:** A single large update transaction writes old and new row states for millions of records, generating gigabytes of WAL logs that saturate disk space, crashing the server.
- **Irrecoverable Interrupted Migrations:** A migration runs for 2 hours and fails at row 9,000,000 due to a lock timeout. Because the script had no tracking table or resume capability, the DBA must roll back or restart the migration from row 1, repeating processed records.

## 4. Best Practices

- **Never Update Large Tables in a Single Transaction:** Always execute data migrations in throttled batches. Keep batch sizes between 1,000 and 5,000 rows.
- **Use Primary Keys for Batch Seeking:** Do not use `OFFSET` for batch pagination (very slow on deep offsets). Use keyset pagination, searching for primary keys greater than the last processed ID:
  - *SQL Example:*
    ```sql
    UPDATE user_account 
    SET first_name = split_part(name, ' ', 1) 
    WHERE id > :last_processed_id AND id <= :batch_limit_id;
    ```
- **Configure Throttle Sleeps:** Inject a sleep command (e.g. `pg_sleep(0.1)` in PostgreSQL or `DO SLEEP(0.1)` in MySQL) between batch executions to allow replica sync streams and disk queues to clear.
- **Enforce Resume Capability via Tracking Tables:** Create a temporary progress table (`data_migration_progress`) to store the `last_processed_id` for the active migration. If the migration crashes, the worker reads the table and resumes immediately.
- **Monitor Replication Lag during Migration:** Configure the migration script to poll replica lag. If replication lag exceeds 5 seconds, halt the migration loop until the replicas catch up.

## 5. Common Mistakes / Anti-Patterns

- **Single-Transaction UPDATE Queries:** Running updates on millions of rows at once.
- **Running Data Migrations during DDL Migrations:** Combining column additions and data updates in one migration file, holding locks on tables.
- **Pagination via OFFSET:** Using `OFFSET` to paginate through records for backfills, causing slow queries.
- **No Replication Lag Audits:** Running backfills at full speed without monitoring replica lag, causing stale reads on replicas.

## 6. Security Considerations

- **Secure Staging Payload Encryption:** If migrating data to temporary staging tables during complex refactoring, ensure staging tables inherit all database-level security controls (encryption at rest, RLS, audit logging).

## 7. Performance Considerations

- **Autovacuum Tuning:** Running massive backfills updates millions of rows, generating dead tuples. Ensure autovacuum settings are configured to vacuum tables aggressively during data migrations to prevent index bloat.

## 8. Scalability Considerations

- **Distributed Shard Backfills:** In sharded architectures, run data migrations in parallel across shards. Each shard executes its local backfill loop independently, preventing cross-shard network hops.

## 9. How Major Companies Implement It

- **Stripe:** Backfills financial transaction records using throttled background workers. Scripts monitor PostgreSQL replication lag and automatically slow down or pause write rates if replicas lag.
- **Uber:** Executes data migrations in small, rate-limited batch loops, keeping database disks optimized and avoiding API locks.

## 10. Decision Checklist (Data Migration Sizing)

Define data migration patterns based on table size:

- Use **Single-Transaction UPDATE** ONLY when:
  - Table size is small (<10,000 rows) and write lock durations are verified to be under 50ms.
- Use **Throttled Batch Loops (Keyset Pagination + Sleep)** when:
  - Table size exceeds 10,000 rows.
  - Active transactional traffic must be preserved during migration.
  - Replicas are active (prevents replication lag).
- Use **Change Data Capture (CDC) ETL** when:
  - Data must be migrated between completely different database engines (e.g. SQL to NoSQL).

## 11. AI Coding-Agent Implementation Guidelines

- Never generate single-transaction SQL updates for tables containing over 10,000 rows.
- Always include primary-key-based keyset pagination in data migration batch templates.
- Always include sleep loops (`pg_sleep`) in data migration scripts.
- Never write data migration scripts that run inside DDL schema transactions.
- Always configure database replication lag check queries in migration loops.

## 12. Reusable Checklist

- [ ] Data migration split into throttled batch sizes (1,000 to 5,000 rows per batch)
- [ ] Keyset pagination based on primary keys (no `OFFSET` pagination used)
- [ ] Throttle sleep delays configured between batch executions (e.g., 100ms)
- [ ] Progress tracking table created to store the last processed ID (resume active)
- [ ] Replication lag checks active in the migration loop (pauses if lag > 5 seconds)
- [ ] Data migrations segregated completely from DDL schema migrations
- [ ] Database autovacuum active to clean dead tuples generated by updates
- [ ] Data validation script run post-migration to verify data integrity
