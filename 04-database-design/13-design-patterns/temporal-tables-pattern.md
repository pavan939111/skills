# Temporal Tables (System-Versioned Tables)

## 1. Definition & Core Concepts

Temporal Tables (or System-Versioned Tables) are database tables that natively record the historical periods of validity for all rows. The database engine automatically archives historical row states as modifications occur, allowing queries to retrieve data exactly as it existed at any point in the past.

Core temporal concepts:
- **System Versioning:** The database engine automatically manages historical row tracking, recording the time interval during which a row's state was valid.
- **System Time Period:** The time range defined by two columns (typically `sys_start` and `sys_end`) representing the transaction commit start and end times for the row state.
- **SQL:2011 standard:** The ANSI SQL standard that defines the syntax and rules for temporal tables (e.g. `FOR SYSTEM_TIME AS OF`).
- **History Table:** The secondary table where the database engine automatically moves old row versions, keeping the primary table focused on active states.

```
Active Table:
┌────┬──────┬───────────┬───────────┐
│ ID │ Val  │ sys_start │  sys_end  │
├────┼──────┼───────────┼───────────┤
│ 1  │ B    │ t2        │ MaxValue  │
└────┴──────┴───────────┴───────────┘
History Table:
┌────┬──────┬───────────┬───────────┐
│ ID │ Val  │ sys_start │  sys_end  │
├────┼──────┼───────────┼───────────┤
│ 1  │ A    │ t1        │ t2        │
└────┴──────┴───────────┴───────────┘
```

*(Boundary Note: Application-level audit UI reports, client-side history diff rendering code, and temporal dashboard charts belong in `backend-development/`. This document covers database-native system versioning, history tablespaces, temporal queries, index design, and storage partition splits.)*

## 2. Why It Exists / What Problem It Solves

In business domains (billing, compliance, user profiles), table states change. A user updates their shipping address. A month later, a billing audit is run. If the database only stores the *current* address, old order reports display incorrect customer shipping addresses, violating compliance. Custom auditing triggers can track this history, but they are difficult to write and index. Temporal tables automate this, allowing queries like "Get the user profile *as of* January 1st, 2026" using native SQL.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Storage Bloat Outages:** Executing frequent updates on temporal tables. Because every update clones the row and writes to the history table, storage space expands rapidly, leading to out-of-space crashes.
- **Query Planner Scans on Massive History:** Querying active states without partitioning history. The query planner scans through millions of historical rows to return active records, causing slow query performance.
- **Unindexed Time Queries:** Running `FOR SYSTEM_TIME AS OF` queries without indexing the `sys_start` and `sys_end` columns. The database must scan the entire history table to locate the valid time slice, saturating CPU.
- **Broken Schema Migrations:** Applying schema upgrades to the active table (e.g. adding columns) but failing to migrate the history table schema, causing system versioning writes to crash.

## 4. Best Practices

- **Leverage Native System Versioning:** Use native temporal features where supported (MariaDB, SQL Server, or PostgreSQL temporal extensions) rather than writing custom trigger frameworks.
  - *SQL Server/MariaDB Example:*
    ```sql
    CREATE TABLE product_catalog (
        id INT PRIMARY KEY,
        price DECIMAL(10,2),
        sys_start TIMESTAMP GENERATED ALWAYS AS ROW START,
        sys_end TIMESTAMP GENERATED ALWAYS AS ROW END,
        PERIOD FOR SYSTEM_TIME (sys_start, sys_end)
    ) WITH SYSTEM_VERSIONING;
    ```
- **Partition and Segregate the History Table:** Always store the historical rows in a separate history table (or distinct tablespace) to keep the primary table narrow and optimized for active lookups.
- **Index the System Time Columns:** Enforce composite indexes on `(id, sys_start, sys_end)` in the history table to optimize temporal queries.
- **Prune History Tables Systematically:** Setup data retention rules on the history table to delete or archive records older than a specific window (e.g., delete history older than 7 years):
  `ALTER TABLE product_catalog DROP PERIOD FOR SYSTEM_TIME;` (prune, and rebuild).
- **Verify Schema Migrations on Both Tables:** Ensure CI/CD migration scripts apply identical column modifications to both the active table and its corresponding history table.

## 5. Common Mistakes / Anti-Patterns

- **Single-Table Storage without Splits:** Keeping active and historical states in one un-partitioned table.
- **No Time Indexing:** Omitting indexes on `sys_start` and `sys_end` columns.
- **Editing History Directly:** Running DML writes against the history table. The database engine must enforce strict write locks on history tables, allowing updates only via system versioning.
- **High-Frequency Writes on Temporal Tables:** Using temporal tables for fast-changing states (e.g. page counts, session trackers), generating massive history bloat.

## 6. Security Considerations

- **Temporal Data Access Isolation:** Restrict read access to historical tables. Historical logs contain older, decrypted PII states or old price catalogs that unauthorized users should not access.

## 7. Performance Considerations

- **Write Amplification on Update:** Every `UPDATE` on a system-versioned table generates a write to the active table and a secondary write to the history table. Limit temporal patterns to slow-changing tables (catalogs, accounts, profiles).

## 8. Scalability Considerations

- **Sharding History:** Ensure historical tables share the same sharding keys as the active tables, keeping the active and historical records co-located on the same shard node.

## 9. How Major Companies Implement It

- **Fintech Providers:** Enforce system-versioned tables on billing plan structures to audit product price states during customer invoice generation.
- **Enterprise Resource Planning (ERP) Systems:** Use temporal tables natively to audit inventory ledger accounts and track financial records over time.

## 10. Decision Checklist (Temporal Tables Mapping)

Select the versioning pattern:

- Use **Native Temporal Tables (System-Versioned)** when:
  - Regulatory audits demand automated, tamper-proof tracking of schema updates.
  - Queries frequently require viewing states at specific historical times (Slow Changing Dimension Type 4).
  - The database engine natively supports ANSI SQL:2011 temporal features.
- Use **Audit Log Pattern (JSON Diff)** when:
  - System write volume is high, and database storage bloat must be minimized.
  - History is rarely queried, and simple raw logs are sufficient.
- Never use **Temporal Tables** on:
  - High-frequency write tables (session counters, IoT telemetry, queues).

## 11. AI Coding-Agent Implementation Guidelines

- Always declare temporal period definitions when generating system-versioned schemas.
- Never write database configuration files that allow manual updates to history tables.
- Always include composite indexes on time bounds `(sys_start, sys_end)` in history table templates.
- Never suggest temporal patterns for high-frequency write tables.
- Always verify that schema migrations apply to both the active and history tables.

## 12. Reusable Checklist

- [ ] Native database system versioning configured on target tables
- [ ] Active and historical tables segregated physically on disk
- [ ] Columns `sys_start` and `sys_end` defined to manage time periods
- [ ] Composite index active on `(id, sys_start, sys_end)` in the history table
- [ ] Direct manual updates/deletes prohibited on the history table
- [ ] Schema migrations configured to update both active and historical tables concurrently
- [ ] History retention policy active (old versions pruned or archived)
- [ ] Temporal queries (`FOR SYSTEM_TIME AS OF`) verified to execute index seeks
