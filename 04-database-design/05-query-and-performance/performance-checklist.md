# Performance Checklist (Query Performance Auditing)

## 1. Definition & Core Concepts

The Query Performance Checklist is a structured diagnostic framework used to audit, evaluate, and optimize database schemas, queries, and index usage before deploying code to production.

Core audit concepts:
- **Index Seek Verification:** Confirming that the database engine traverses indexes directly ($O(\log N)$) rather than scanning tables sequentially.
- **Connection Capacity Validation:** Checking that connection pools and thread limits are sized appropriately for database hardware.
- **Lock Contention Auditing:** Checking query blocks to ensure they do not hold locks on active tables for extended periods.
- **Temp File Allocation Tracking:** Confirming that sorting operations execute in RAM and do not spill to disk.
- **Cache Hit Rate Tracking:** Verifying that buffer pools are sized to keep hot tables and indexes in RAM.

*(Boundary Note: Code-level profiling decorators, application APM configuration, and dashboard visual setups belong in `backend-development/` and operations books. This document covers database-level query auditing, index validation, lock checks, and performance thresholds.)*

## 2. Why It Exists / What Problem It Solves

Developers frequently write SQL queries that work fine on small local development databases but fail in production under concurrent traffic. Without a systematic checklist, unindexed queries, slow joins, or long transactions slip into production, leading to CPU exhaustion, table lockouts, and system outages. This checklist ensures every query is audited against production-scale criteria before release.

## 3. What Breaks in Production Without It

- **Slow Query API Timeouts:** Running unindexed queries on large production tables, causing API requests to hang and time out.
- **Table Lockouts from Long Transactions:** A query takes seconds to execute, keeping database locks open and blocking concurrent updates.
- **Disk Saturation from Temp File Sorting:** Queries performing sorting operations on large datasets without sufficient sort memory, forcing the database to write temporary files to disk, slowing down performance.
- **Connection Pool Exhaustion:** Slowly executing queries occupy database connections, exhausting the application's connection pool.

## 4. Best Practices

- **Verify Index Usage with `EXPLAIN`:** Always run `EXPLAIN` on all queries. Ensure the output shows the query scans only indexes and uses partition pruning where applicable.
- **Verify SARGability of Filters:** Ensure all `WHERE` and `JOIN` filters isolate indexed columns without applying functions or math directly to them.
- **Audit Table Scan Sizes:** Identify any query that performs a sequential scan (`Seq Scan`) on tables containing over 10,000 rows. Add indexes or rewrite the query to utilize B-Trees.
- **Eliminate `SELECT *`:** Explicitly select only the columns required by the application.
- **Check sort memory requirements:** Verify that query sorting operations execute in memory without spilling to disk (look for `spilled to disk` or `temp read/write` in explain plans).
- **Audit Lock Contention:** Ensure queries do not hold exclusive locks on tables during peak traffic hours. Keep transactions short.

## 5. Common Mistakes / Anti-Patterns

- **No Index Verification:** Deploying queries without running `EXPLAIN` to verify index utilization.
- **Indexing Low Cardinality Columns:** Creating indexes on boolean or status columns, wasting disk space and write performance.
- **Unbounded SELECTs:** Writing SELECT queries without `LIMIT` constraints, risking memory exhaustion.
- **Synchronous View Refreshes:** Refreshing materialized views synchronously inside transaction paths.

## 6. Security Considerations

- **Statement Timeouts:** Configure strict statement timeouts on the database engine (e.g. `statement_timeout = 5000` ms) to force-abort runaway queries that lock tables, preventing Denial of Service (DoS) attacks.

## 7. Performance Considerations

- **Write Amplification:** Balance index counts. Ensure that transactional tables have only the required indexes to keep write performance high.

## 8. Scalability Considerations

- **Query Decomposition:** If joining multiple tables causes performance bottlenecks, decompose the query into multiple smaller queries and merge the data in the application layer.

## 9. How Major Companies Implement It

- **Stripe:** Enforces a strict pre-deployment checklist for all database migrations. Developers must provide query execution plans showing index usage before DDL changes are approved.
- **Google:** Uses automated performance linters in CI pipelines to analyze SQL queries, blocking code merges if any query performs full-table scans.

## 10. Decision Checklist (Performance Audit Framework)

Audit queries using the following checklist criteria:

- If **Seq Scan** is present on tables >10,000 rows: Add B-Tree indexes or rewrite the query to allow index range scans.
- If **Temp Files** are written to disk during sorts: Increase database sort memory (e.g. `work_mem`) or optimize indexes.
- If **SELECT *** is used: Replace with explicit column lists.
- If **Replication Lag** is high: Route reads to the primary or configure lag threshold limits.

## 11. AI Coding-Agent Implementation Guidelines

- Always check query execution plans on representative datasets before recommending index creations.
- Never write SQL queries that perform sequential scans on large tables.
- Always require `LIMIT` constraints on all SELECT queries.
- Never use database stored procedures or triggers for complex business calculations.
- Always use parameterized queries (bind variables) to prevent SQL injection.

## 12. Reusable Checklist

- [ ] All queries analyzed using `EXPLAIN` to verify index utilization
- [ ] No sequential scans (`Seq Scan`) on tables containing over 10,000 rows
- [ ] Query filters are SARGable (no functions, math, or type casts on indexed columns)
- [ ] `SELECT *` avoided; queries select only required columns
- [ ] Sort and Join operations execute in RAM (no temp files written to disk)
- [ ] Limit constraint (`LIMIT`) present on all list queries
- [ ] Statement and transaction timeouts configured on the database engine
- [ ] Foreign keys and join columns have indexes configured
- [ ] Parameterized queries (bind variables) used globally
