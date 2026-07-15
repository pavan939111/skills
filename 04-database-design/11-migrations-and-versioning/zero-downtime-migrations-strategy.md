# Zero-Downtime Migrations

## 1. Definition & Core Concepts

Zero-Downtime Migrations are database schema deployment patterns designed to apply DDL and DML modifications to active databases without interrupting application reads and writes, requiring zero maintenance windows or offline outages.

Core zero-downtime concepts:
- **Expand-Contract (Write-Read-Delete) Pattern:** A multi-phase database rollout strategy:
  1. *Expand:* Add new columns or tables (schema grows) while keeping old fields active.
  2. *Deploy:* Update application code to read from the old fields but write to both the old and new fields (double-writing).
  3. *Backfill:* Copy historical data from old fields to new fields in slow background batches.
  4. *Deploy:* Update application code to read and write exclusively from the new fields.
  5. *Contract:* Drop the old, unused columns or tables (schema shrinks).
- **Lock Timeouts:** Setting database session parameters to abort DDL commands if they cannot acquire table locks within a short window, protecting active queries.
  - *Example (PostgreSQL):* `SET lock_timeout = '2s';`
- **Online Index Building:** Creating database indexes concurrently in the background without locking table writes (e.g. `CREATE INDEX CONCURRENTLY` in PostgreSQL, `ONLINE = ON` in SQL Server).

*(Boundary Note: Code-level application double-writing logic, feature flags toggles, and load balancer canary deployments belong in `backend-development/` and devops books. This document covers database-level DDL locks, expand-contract schemas, lock timeouts, and non-blocking index additions.)*

## 2. Why It Exists / What Problem It Solves

If a database table has millions of rows, running a simple command like `ALTER TABLE users ADD COLUMN age INT DEFAULT 0 NOT NULL` blocks the table. In many SQL engines, this command rewrites the entire table on disk to fill the default value, locking out all insert and update queries for minutes. Under production load, queries queue up, database connections exhaust, and the application crashes. Zero-downtime migrations structure database changes so that locks are minimized, keeping transactional APIs online.

## 3. What Breaks in Production Without It

- **API Outages from Lock Queuing:** Running a DDL statement on a high-traffic table. The DDL requests an exclusive lock and waits for active read queries to finish. While waiting, all new read/write queries queue up behind the DDL request. The connection pool exhausts, and the API throws timeout exceptions.
- **Application Crashes from Column Renames:** Running `ALTER TABLE user RENAME COLUMN email TO contact_email` while application servers are running. The old code attempts to read `email`, immediately throwing query exceptions and crashing the user dashboard until redeployments complete.
- **Index-Build Write Lockouts:** Creating an index on a table containing 100M rows without concurrent settings. The database locks all writes to the table for hours while building the index.
- **Table Rewrite CPU Starvation:** Adding a default value column synchronously on a wide table, forcing the database engine to execute massive disk writes and spike CPU.

## 4. Best Practices

- **Follow the Expand-Contract Pattern for Refactoring:** Never rename or delete database columns directly. Apply changes in separate, backward-compatible phases.
- **Configure Strict Lock Timeouts:** Always prefix migration DDL files with a lock timeout parameter to ensure the migration fails fast if it cannot acquire a table lock, preventing connection queues.
  - *PostgreSQL DDL Prefix:*
    ```sql
    SET statement_timeout = '5s';
    SET lock_timeout = '2s';
    ```
- **Create Indexes Concurrently:** Always build indexes asynchronously without locking write paths.
  - *PostgreSQL DDL:* `CREATE INDEX CONCURRENTLY idx_user_status ON user_account(status);`
- **Add Columns as Nullable First:** When adding a column with a default value, add it as nullable first without a default. Then add the default constraint, backfill the data in batches, and finally add the `NOT NULL` constraint:
  1. `ALTER TABLE user ADD COLUMN age INT;`
  2. `ALTER TABLE user ALTER COLUMN age SET DEFAULT 0;`
  3. (Backfill historical data in batches)
  4. `ALTER TABLE user ALTER COLUMN age SET NOT NULL;`
- **Avoid Adding Check Constraints Synchronously:** Add check constraints using the `NOT VALID` parameter first (which applies the check to new writes only, avoiding table scans), and validate the historical rows asynchronously.
  - *Example:* `ALTER TABLE product ADD CONSTRAINT chk_price CHECK (price > 0) NOT VALID;` followed by `ALTER TABLE product VALIDATE CONSTRAINT chk_price;`

## 5. Common Mistakes / Anti-Patterns

- **Direct Table/Column Renames:** Renaming columns directly, breaking backward compatibility.
- **Blocking Index Creations:** Running standard `CREATE INDEX` on active tables without concurrent flags.
- **Synchronous Large Defaults Addition:** Adding non-nullable columns with defaults to large tables in a single migration statement.
- **No Migration Lock Timeouts:** Allowing DDL scripts to wait indefinitely for exclusive locks, blocking active connections.

## 6. Security Considerations

- **Secure Staging/Temporary Tables:** If the expand-contract pattern requires copying data to temporary tables during backfills, ensure the staging tables inherit the same security policies (RLS, encryption, auditing) as the source tables.

## 7. Performance Considerations

- **Write Amplification of Backfills:** Backfilling millions of rows to update new columns generates high Write-Ahead Log (WAL) traffic. Throtle backfill batch writes to run in small chunks (e.g. 1,000 rows per transaction) to prevent I/O queues.

## 8. Scalability Considerations

- **Zero-Downtime in Sharded Clusters:** Apply expand-contract phases sequentially across shards. Apply the "Expand" phase to all shards first, deploy application code, and then apply "Contract" phases to keep sharded endpoints compatible.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict linters in CI pipelines that block pull requests containing blocking DDL (like direct column renames or non-concurrent index builds), enforcing the expand-contract pattern.
- **GitHub:** Uses online schema migration orchestrators (gh-ost) to build copy tables, sync mutations in the background, and execute metadata table swaps in milliseconds with zero write downtime.

## 10. Decision Checklist (Zero-Downtime Commands)

Select DDL execution commands:

- Use **`CREATE INDEX CONCURRENTLY`** when:
  - Building B-Tree or vector indexes on active production tables.
- Use **`ALTER TABLE ADD COLUMN` (Nullable first)** when:
  - Adding columns to tables containing over 10,000 rows.
- Use **`NOT VALID` Constraints** when:
  - Adding CHECK or FOREIGN KEY constraints on large, active tables.
- Use **Expand-Contract Pattern** when:
  - Renaming columns, dropping tables, or changing column datatypes.

## 11. AI Coding-Agent Implementation Guidelines

- Never write migration templates that execute direct column renames.
- Always include `SET lock_timeout = '2s';` at the top of all generated DDL migration files.
- Always write index creation statements using concurrent/online syntax templates.
- Never write DDL scripts that add non-nullable default columns to large tables in a single step.
- Always recommend the expand-contract pattern for schema refactoring tasks.

## 12. Reusable Checklist

- [ ] Schema changes follow the multi-phase Expand-Contract pattern (no direct renames)
- [ ] DDL scripts configure session `lock_timeout` limits (aborts fast to prevent queues)
- [ ] New database indexes built asynchronously (`CREATE INDEX CONCURRENTLY` / `ONLINE = ON`)
- [ ] Columns added as nullable first, with default constraints added separately
- [ ] Data backfills run asynchronously in rate-limited loop batches (no massive updates)
- [ ] Constraints added using `NOT VALID` first and validated asynchronously
- [ ] DDL statements tested on production-scale staging clones to verify lock timings
- [ ] Database migration tool set to abort if locks cannot be acquired within threshold
