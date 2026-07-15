# Indexing Strategy

## 1. Definition & Core Concepts

An Indexing Strategy is the design discipline of organizing, ordering, and maintaining database indexes to match the application's query profile, optimizing read latency while minimizing write overhead and disk storage.

Core concepts:
- **Covering Index:** An index that contains all the columns required to serve a query (both filters and selectors), allowing the database engine to return data directly from the index tree without fetching the raw row from disk (Heap Fetch).
- **Index Seek vs. Index Scan:**
  - *Index Seek:* Navigating the index tree directly to locate specific keys ($O(\log N)$).
  - *Index Scan:* Scanning the entire index structure to locate keys, typically because the query filter lacks prefix keys.
- **Selectivity:** The ratio of unique values to total rows in a column. High selectivity columns are candidates for indexing.
- **Left-to-Right Composite Index Rule:**
  - *Equality First, Range Second:* Place columns queried with equality filters (`=`, `IN`) first, and columns queried with range filters (`>`, `<`, `BETWEEN`) second in composite index definitions.
- **Index Bloat / Unused Indexes:** Over-allocated or fragmented index tables that consume RAM and slow writes without serving reads.

*(Boundary Note: Database-level index type DDL declarations (B-Tree, GIN, BRIN) and clustered index layouts are covered in `03-schema-design/`. This document covers query matching, index selection strategy, index pruning, and selectivity analysis.)*

## 2. Why It Exists / What Problem It Solves

If every query is indexed with single-column indexes, complex queries (like filtering on `tenant_id` and sorting by `created_at`) will perform poorly. The database must scan and merge multiple single-column indexes (Index Merge), which consumes CPU. Conversely, creating too many indexes slows down write operations, as every insert forces the engine to update all B-Trees on disk. An indexing strategy balances read query performance against write throughput.

## 3. What Breaks in Production Without It

- **High Heap Fetch Disk Latency:** A B-Tree index is defined on `email`. A query executes `SELECT id, name, email FROM user WHERE email = :email`. The engine uses the index to find the row, but must perform a slow disk read (Heap Fetch) to retrieve the `name` column, slowing down queries.
- **Write Path Degradation from Over-Indexing:** Adding 15 indexes to a high-volume transactional table (e.g. order logs). Every row insert forces the database to execute 15 separate index page writes on disk, degrading write performance.
- **Index Scan Slowdowns from Wrong Key Order:** A composite index is defined on `(created_at, status)`. The query filters on `status = 'active' AND created_at > '2026-07-01'`. Because the range column is placed first, the engine must scan the entire index, bypassing the index seek.
- **Query Filters Bypassing Indexes:** Writing query expressions like `WHERE price * 1.1 > 100`. The function math forces the engine to scan the entire table, bypassing the index on `price`.

## 4. Best Practices

- **Create Covering Indexes using INCLUDE:** Include frequently retrieved columns in the index payload without making them part of the index search key.
  - *Example (PostgreSQL):* `CREATE INDEX idx_user_email_cover ON user(email) INCLUDE (name, role);`
- **Follow the "Equality First, Range Second" Rule:** In composite indexes, place columns queried with equality checks leftmost, followed by columns used for sorting (`ORDER BY`) or range filters.
- **Prune Unused Indexes Regularly:** Monitor index usage statistics. Query database system tables (e.g., `pg_stat_user_indexes` in PostgreSQL or `sys.dm_db_index_usage_stats` in SQL Server) and drop indexes that have zero scans.
- **Avoid Over-Indexing Tables:** Limit the number of indexes on transactional tables to a maximum of 5 to 7. Only create indexes that are targeted by high-frequency query paths.
- **Rewrite Math Expressions in Queries:** Never perform mathematical calculations or functions directly on indexed columns in the query filter.
  - *Bad:* `WHERE created_at + INTERVAL '1 day' > NOW()`
  - *Good:* `WHERE created_at > NOW() - INTERVAL '1 day'`

## 5. Common Mistakes / Anti-Patterns

- **Duplicate Index Paths:** Creating an index on `(tenant_id)` and another on `(tenant_id, created_at)`. The single-column index is redundant and should be dropped.
- **Indexing Low-Selectivity Columns:** Indexing columns like `gender` or `is_active` in isolation, which are ignored by the query planner.
- **Range First in Composite Keys:** Defining composite indexes with range columns leftmost, preventing index seeks on subsequent columns.
- **Failing to Audit Usage:** Leaving obsolete indexes in the database schema for years, slowing writes.

## 6. Security Considerations

- **Secure Index Diagnostics:** Restrict access to database system performance catalogs (e.g. `pg_stat_statements`) to database administrators, preventing unauthorized users from scanning query patterns and index sizes.

## 7. Performance Considerations

- **Write Amplification Cost:** Every index on a table directly increases the write amplification factor of database writes. Prioritize index creation on read-heavy tables, and keep indexing minimal on write-heavy tables.

## 8. Scalability Considerations

- **Memory Cache Constraints:** Ensure that the sum of all active index sizes fits within the database server's RAM buffer cache, preventing disk swapping.

## 9. How Major Companies Implement It

- **Stripe:** Implements automated index auditing tools that parse query logs and index statistics. If an index has not been scanned in 30 days, the tool flags it for deletion to optimize database write capacity.
- **GitHub:** Designs compound covering indexes that match their API search filters, ensuring that loading repository feeds requires zero heap lookups.

## 10. Decision Checklist (Index Design Matrix)

Use the following mapping to design indexes:

| Query Pattern | Recommended Index Structure | Key Column Ordering |
|---|---|---|
| Filter on `col_a = X` AND `col_b = Y` | Composite Index on `(col_a, col_b)` | Order by selectivity (highest leftmost) |
| Filter on `col_a = X`, Retrieve `col_b` | Covering Index on `col_a` with `INCLUDE (col_b)` | `col_a` is search key; `col_b` in payload |
| Filter on `col_a = X` AND `col_b > Y` | Composite Index on `(col_a, col_b)` | `col_a` (Equality) leftmost; `col_b` (Range) rightmost |
| Filter on `col_a = X` ORDER BY `col_b` | Composite Index on `(col_a, col_b)` | `col_a` leftmost; `col_b` rightmost |

## 11. AI Coding-Agent Implementation Guidelines

- Always check for existing composite index prefixes before suggesting a new index.
- Never write composite indexes that position range columns (`>`, `<`, `BETWEEN`) before equality columns (`=`).
- Always use `INCLUDE` clauses to create covering indexes, avoiding unnecessary heap lookups.
- Never recommend creating indexes on tables with high write traffic and low query volume.
- Always rewrite query expressions to isolate the indexed column from mathematical calculations.

## 12. Reusable Checklist

- [ ] Composite indexes position equality columns leftmost, range/sort columns rightmost
- [ ] Covering indexes (`INCLUDE` payloads) used to eliminate Heap Fetches for high-frequency queries
- [ ] Redundant indexes (duplicate prefixes) identified and dropped
- [ ] Database system tables audited to identify and drop unused indexes
- [ ] Query filters do not perform mathematical calculations or functions on indexed columns
- [ ] Total index size fits within the database RAM buffer cache
- [ ] Index count on high-write transactional tables limited (<7 indexes)
- [ ] No single-column indexes exist on low-selectivity columns
