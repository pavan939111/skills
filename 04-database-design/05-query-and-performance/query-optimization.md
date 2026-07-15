# Query Optimization

## 1. Definition & Core Concepts

Query Optimization is the practice of writing and restructuring database queries (SQL) to minimize execution time, CPU utilization, disk I/O, and memory footprints.

Core concepts:
- **Cost-Based Optimizer:** The database engine component that calculates the estimated execution cost (based on statistics) of different query paths and chooses the most efficient plan.
- **SARGable Query (Search Argument Able):** A query structured so that the database engine can utilize indexes. The query filter must isolate the indexed column without applying functions or math directly to it.
- **Wildcard Search Limits:** The rule that leading wildcards (e.g., `LIKE '%term'`) prevent B-Tree index utilization, whereas trailing wildcards (e.g., `LIKE 'term%'`) allow index range scans.
- **Join Optimization:** Structuring tables and join filters to allow the engine to execute efficient join algorithms (Hash Join, Merge Join, Nested Loop).

*(Boundary Note: Code-level ORM query compilation, client-side pagination wrappers, and server connection pooling code belong in `backend-development/`. This document covers SQL query structure, SARGability, join pathways, and optimizer behaviors.)*

## 2. Why It Exists / What Problem It Solves

Poorly structured SQL queries saturate database resources. An un-optimized query executing full table scans on millions of rows consumes disk read queues and spikes server CPU to 100%, causing other concurrent transactional queries to time out. Optimizing queries ensures that the database processes the minimum required number of disk pages, keeping latency low under concurrent load.

## 3. What Breaks in Production Without It

- **API Timeouts from Non-SARGable Filters:** Writing queries like `SELECT * FROM orders WHERE EXTRACT(year FROM created_at) = 2026`. The date function forces the database to perform a slow full table scan, timing out the API.
- **Database CPU Starvation from SELECT *:** Retrieving all columns (`SELECT *`) from wide tables. The database must read unneeded text/binary columns from disk and serialize them over the network, exhausting CPU and bandwidth.
- **Index Scans from Leading Wildcards:** Querying `LIKE '%abc%'` to search strings. B-Trees sort data left-to-right; a leading wildcard forces the database to scan the entire index, bypassing seeks.
- **In-Memory Sorting Spills (Temp Files):** Running `ORDER BY` queries on unindexed columns. If the dataset exceeds the database's sort memory limit (e.g., `work_mem` in PostgreSQL), the engine writes temporary files to disk, slowing down queries.

## 4. Best Practices

- **Write SARGable Queries:** Isolate indexed columns from functions, math, or type conversions in filters.
  - *Non-SARGable:* `WHERE DATE(created_at) = '2026-07-15'`
  - *SARGable:* `WHERE created_at >= '2026-07-15 00:00:00' AND created_at < '2026-07-16 00:00:00'`
- **Avoid SELECT * in Production:** Explicitly select only the columns required by the application (e.g. `SELECT id, status`).
- **Use Trailing Wildcards for Searches:** If using B-Tree indexes for text matching, ensure queries search using trailing wildcards only (e.g., `LIKE 'term%'`).
- **Optimize Joins on Foreign Keys:** Verify that all tables are joined on columns that are primary keys or have foreign key indexes.
- **Use CTEs for Readability, but check Materialization:** Use Common Table Expressions (CTEs) to organize complex queries. Note that in older database versions, CTEs acted as optimization fences, materializing temporary tables in memory. Use `WITH AS NOT MATERIALIZED` in modern PostgreSQL if inline optimization is preferred.

## 5. Common Mistakes / Anti-Patterns

- **Functions on WHERE Columns:** Running functions (like `LOWER()`, `DATE()`, `SUBSTR()`) directly on indexed columns, bypassing index seeks.
- **SELECT * on Wide Tables:** Retrieving large text or json columns unnecessarily.
- **Leading Wildcard Searches:** Writing `LIKE '%term'` or `LIKE '%term%'` queries.
- **Correlated Subqueries in Loops:** Writing `SELECT` statements inside select columns or WHERE clauses that execute a nested query for every row in the outer table. Use JOINs instead.

## 6. Security Considerations

- **Parametrized Bind Variables:** Never construct SQL queries by concatenating raw strings with user inputs. Always use parameterized queries (bind variables) to prevent SQL injection vulnerabilities.

## 7. Performance Considerations

- **Sort Memory Limits:** If queries sort large datasets, verify that the database server's sort memory configuration (e.g. `work_mem` in PostgreSQL) is sized to hold the sort dataset in RAM, avoiding disk writes.

## 8. Scalability Considerations

- **Query Decomposition:** If joining 8+ tables bottlenecks the database, decompose the query into multiple smaller, fast queries and combine the data in the application layer.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict static analysis rules in CI pipelines that block pull requests containing `SELECT *` statements or non-sargable query structures, maintaining high database throughput.
- **Netflix:** Analyzes slow query logs using monitoring daemons, flagging any query that performs sequential scans on tables containing over 100,000 rows.

## 10. Decision Checklist (SARGability Mapping)

Use the following query patterns to optimize SQL:

| Slow / Non-SARGable Pattern | Optimized / SARGable Pattern | Reason |
|---|---|---|
| `WHERE LOWER(email) = 'user@test.com'` | `WHERE email = 'user@test.com'` (or use expression index) | Avoids function execution on index key |
| `WHERE price - 10 > 90` | `WHERE price > 100` | Isolates column for B-Tree traversal |
| `WHERE created_at::date = '2026-07-15'` | `WHERE created_at >= '2026-07-15' AND created_at < '2026-07-16'` | Allows index range scans |
| `WHERE name LIKE '%john'` | `WHERE name LIKE 'john%'` (or use GIN index) | Enables left-to-right B-Tree search |

## 11. AI Coding-Agent Implementation Guidelines

- Never generate SQL queries containing `SELECT *` in production code templates.
- Always write SARGable filters, isolating indexed columns from functions or math.
- Never write search queries that use leading wildcards (`LIKE '%term'`) on standard B-Tree indexes.
- Always use parameterized parameters (bind variables) in all SQL definitions.
- Always recommend joining tables using indexed foreign keys.

## 12. Reusable Checklist

- [ ] `SELECT *` avoided; queries select only required columns
- [ ] Query filters are SARGable (no functions, math, or type casts on indexed columns)
- [ ] Text search queries use trailing wildcards only (`LIKE 'term%'`)
- [ ] Parameterized queries (bind variables) used globally (no string concatenation)
- [ ] Joins execute on indexed primary keys or foreign keys
- [ ] Correlated subqueries replaced with JOINs or CTEs
- [ ] Sort fields covered by indexes to prevent disk-based sorting (Temp files)
- [ ] CTEs configured to allow optimizer inlining (`NOT MATERIALIZED` where supported)
