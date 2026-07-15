# Indexes (Schema Index Types)

## 1. Definition & Core Concepts

An Index is a database data structure that maps column values to their physical storage locations on disk, enabling the database engine to locate rows without scanning the entire table.

Core Index Structures:
- **B-Tree (Balanced Tree):** The default index type. It keeps data sorted and allows search, sequential access, insertions, and deletions in logarithmic time ($O(\log N)$). Ideal for equality and range queries.
- **Hash Index:** Maps values to buckets using a hash function. Supports only equality comparisons ($O(1)$) and cannot be used for range queries or sorting.
- **GIN (Generalized Inverted Index):** Optimized for searching within composite values, such as arrays, full-text documents, and JSON documents.
- **BRIN (Block Range Index):** Designed for extremely large tables containing naturally ordered data (like timestamps). It stores only the minimum and maximum values for a block of pages, requiring minimal storage space.
- **Clustered vs. Non-Clustered:**
  - *Clustered Index:* Dictates the physical disk storage order of table rows (only 1 per table, typically the primary key).
  - *Non-Clustered Index:* A separate index structure containing copies of selected column values and a pointer (row locator) to the physical row.

*(Boundary Note: Query profiling commands (like `EXPLAIN ANALYZE`), index execution plan optimizations, and application query logic belong in `05-query-and-performance/` and `backend-development/`. This document covers index DDL structures, index types, and storage formats.)*

## 2. Why It Exists / What Problem It Solves

Without indexes, locating a single row in a table containing 10 million records requires the database to read every single data page from disk (Sequential Scan / Full Table Scan), resulting in high latency and heavy disk I/O. Indexes act as a catalog, allowing the engine to traverse a B-Tree structure and locate rows in a few disk reads.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Write Performance Collapse (Write Amplification):** Creating indexes on every column in a table. Every `INSERT`, `UPDATE`, or `DELETE` statement requires the database to update the table data *and* modify all associated index trees on disk, degrading write throughput.
- **Disk Space Exhaustion from Index Bloat:** Index sizes grow larger than the raw table data itself, filling server storage and crashing the operating system.
- **Index Scan Bypass on Casing Searches:** A B-Tree index is defined on the `email` column. The application queries using `WHERE LOWER(email) = :input`. The database engine cannot use the index because of the function wrapper, performing a slow table scan. (An Expression Index is required).
- **Index Swapping Latency Spikes:** The total size of table indexes exceeds the database server's RAM allocation. The engine must continuously read and write index segments to disk (swapping), causing query latency to spike from milliseconds to seconds.

## 4. Best Practices

- **Create Partial (Filtered) Indexes:** If a query only targets a subset of rows, create a partial index to keep the index size small (e.g. `CREATE INDEX idx_active_users ON user(id) WHERE is_deleted = false`).
- **Use Expression (Functional) Indexes:** If queries search using function transformations (like lowercase lookups), define the index on the expression directly (e.g. `CREATE INDEX idx_user_lower_email ON user(LOWER(email))`).
- **Apply GIN Indexes for JSONB Payload Searches:** Use GIN indexes when indexing JSONB columns or arrays in PostgreSQL to speed up nested path queries.
- **Use BRIN for Large Sequential Logs:** Use BRIN indexes on massive timestamped tables (e.g. logs, events) to reduce index storage space by up to 99% compared to standard B-Tree indexes.
- **Index Foreign Keys:** Ensure foreign key columns have indexes to optimize join query paths and prevent lock contention during cascading updates.

## 5. Common Mistakes / Anti-Patterns

- **Over-Indexing Tables:** Creating separate indexes for every column in the table, degrading write speeds.
- **Index Duplication:** Creating an index on `(col_a)` and a composite index on `(col_a, col_b)`. The B-Tree prefix rule allows the composite index to serve queries on `col_a` alone, making the single-column index redundant.
- **Indexing Low Cardinality Columns:** Creating indexes on boolean fields or columns with few unique values, which the query optimizer ignores.
- **Ignoring Clustered Index Order:** Using random identifiers (like UUIDv4) as primary keys in tables with clustered indexes, forcing random disk page writes.

## 6. Security Considerations

- **Index Side-Channel Auditing:** Indexes duplicate data columns to B-Tree structures. Ensure that sensitive encrypted columns are not indexed in plaintext, as attackers with read access to index files can view column values without decrypting the primary table.

## 7. Performance Considerations

- **The RAM Working Set:** Ensure that the total size of active indexes fits entirely within the database server's RAM buffer cache (Working Set), ensuring index lookups execute in memory without hitting disk.

## 8. Scalability Considerations

- **Index Partitioning:** In partitioned tables, define indexes as local (partitioned alongside the table data) to ensure index maintenance operations (like rebuilding) run quickly on isolated blocks.

## 9. How Major Companies Implement It

- **Stripe:** Utilizes partial and expression indexes across their transactional systems, ensuring that searches targeting active subscriptions bypass deleted rows and lowercase email lookups execute in sub-milliseconds.
- **GitHub:** Uses BRIN indexes on massive, time-sequenced system metrics tables, reducing index storage space on disk and maintaining fast metrics query speeds.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **B-Tree Indexes** when:
  - Querying range conditions (`>`, `<`, `BETWEEN`) or exact equality matches (`=`).
  - Columns are targeted in `ORDER BY` and `GROUP BY` sorting statements.
- Use **GIN Indexes** when:
  - Querying arrays, full-text searches, or nested JSONB documents.
- Use **Partial Indexes (WHERE)** when:
  - Queries filter on a specific constant value (e.g., `is_deleted = false`, `status = 'failed'`).
- Use **BRIN Indexes** when:
  - Table size is massive (>50GB) and columns are naturally time-ordered.
- Skip Indexing a **Column** when:
  - The column has low cardinality or is updated at high frequencies.

## 11. AI Coding-Agent Implementation Guidelines

- Always check if an index prefix is already covered before recommending a new composite index.
- Never write B-Tree indexes on individual low-cardinality columns.
- Always use Partial Indexes when queries only target active/non-deleted records.
- Never index columns that store large text blocks or binary blobs — use search engines or index URLs.
- Always use Expression Indexes when queries perform function conversions (like `LOWER()`) on search attributes.

## 12. Reusable Checklist

- [ ] B-Tree indexes created on foreign key columns and frequently joined attributes
- [ ] GIN indexes applied to JSONB or array columns targeted in queries
- [ ] Partial indexes (`WHERE`) used to exclude inactive/deleted records from index size
- [ ] Expression indexes (`LOWER(col)`) defined for function-based search queries
- [ ] No redundant index definitions present (covered by composite indexes)
- [ ] BRIN indexes selected for massive, chronologically sorted metrics/log tables
- [ ] Low-cardinality columns excluded from single-column indexes
- [ ] Total index size budgeted to fit within database RAM allocation
