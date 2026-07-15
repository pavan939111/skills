# Pagination

## 1. Definition & Core Concepts

Database Pagination is the process of retrieving a large dataset in smaller, sequential subsets (pages) rather than loading the entire table into memory at once.

Core pagination strategies:
- **Offset Pagination (`LIMIT` / `OFFSET`):** Requesting a specific page by skipping a set number of rows (e.g., `LIMIT 20 OFFSET 100`).
- **Keyset (Cursor-Based) Pagination:** Requesting the next page by filtering on a unique, ordered key value from the last retrieved row (e.g., `WHERE id > :last_seen_id LIMIT 20`).
- **Deterministic Sorting:** Enforcing that the sort criteria used for pagination must result in a unique, predictable sequence (e.g., sorting by `(created_at, id)` instead of `created_at` alone, to resolve tiebreakers).

*(Boundary Note: Code-level cursor serialization (like base64 encryption), API response wrapper structures, and frontend scroll handlers belong in `backend-development/`. This document covers database-level query limits, B-Tree range scans, and offset cost analysis.)*

## 2. Why It Exists / What Problem It Solves

If a database table contains millions of rows, executing a query like `SELECT * FROM orders` exhausts database memory, saturates network bandwidth, and crashes the application with OutOfMemory errors. Pagination limits the database output to a small chunk (e.g. 20 rows), protecting database memory and reducing network transfer latency.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Deep Offset Performance Collapse:** Using `LIMIT/OFFSET` for deep pages. A query runs `LIMIT 20 OFFSET 500000`. The database engine cannot jump directly to row 500,000; it must read and sort all 500,020 rows from disk into memory, discard the first 500,000, and return the final 20. Under load, this causes disk read spikes and query timeouts.
- **Data Drift (Missed/Duplicate Rows):** If a new row is inserted or deleted while a user is paginating using offsets. The rows shift, causing the user to see duplicate records on Page 2 or miss rows completely.
- **Full Table Scans from Unindexed Sorting:** Querying pagination subsets sorted by unindexed columns (e.g. `ORDER BY user_score LIMIT 20`). The database must perform a full-table scan and sort (filesort on disk) to identify the top 20 rows, slowing performance.
- **Non-Deterministic Sort Tiebreakers:** Sorting by a non-unique column (like `first_name`). If multiple rows share the name, the database engine returns them in arbitrary order depending on physical disk layout, causing duplicate pages.

## 4. Best Practices

- **Use Keyset (Cursor-Based) Pagination by Default:** Implement cursor-based pagination (`WHERE id > :last_seen_id ORDER BY id LIMIT 20`) for high-volume operational APIs, infinite scroll feeds, and rapidly changing datasets.
- **Index the Sorting Columns:** Ensure the column used to sort and filter pagination keys is covered by a B-Tree index.
- **Enforce Deterministic Sorting:** Always append a unique key (like `id`) as a tiebreaker to your sorting criteria:
  - *Bad:* `ORDER BY created_at DESC LIMIT 20`
  - *Good:* `ORDER BY created_at DESC, id DESC LIMIT 20`
- **Use Offset Pagination for Small, Static Admin Panels Only:** Limit `LIMIT/OFFSET` usage to back-office dashboards where page counts are small (<1,000 rows) and random page access (e.g., jumping directly to Page 5) is a strict user requirement.
- **Optimize Offset Queries with Deferred Joins:** If you must use `LIMIT/OFFSET` on large tables, fetch only the primary keys first to bypass wide column reads, then join the table on those IDs to retrieve the payload.

## 5. Common Mistakes / Anti-Patterns

- **Offset Pagination on Infinite Scroll Feeds:** Using offsets for feeds where users scroll deep, causing queries to slow down as the user scrolls.
- **Sorting on Unindexed Columns:** Executing pagination queries without backing indexes.
- **Non-Unique Sort Keys:** Sorting solely on columns with low selectivity (like status or category) without tiebreaker keys.
- **Retrieving Unbounded Lists:** Writing API queries that omit `LIMIT` boundaries entirely, exposing the database to memory exhaustion.

## 6. Security Considerations

- **Cursor Token Tampering:** If cursor identifiers (like IDs or dates) are exposed to client APIs, encrypt or hash them (e.g., base64 encoding a structured JSON string like `{"id": 123, "time": 171800}`) to prevent users from manipulating cursor values to access unauthorized data offsets.

## 7. Performance Considerations

- **Offset Cost Scale:**
  - *Offset Pagination:* Latency scales linearly with depth ($O(N)$), as the engine must scan skipped rows.
  - *Keyset Pagination:* Latency remains constant ($O(\log N)$) regardless of page depth because B-Tree indexes jump directly to the cursor key.

## 8. Scalability Considerations

- **Distributed Shard Queries:** In sharded architectures, executing offset pagination requires the router to query all shards, request `OFFSET + LIMIT` rows from each, merge them, and sort. Keyset pagination queries a single shard or uses cursor indices, scaling horizontally.

## 9. How Major Companies Implement It

- **Stripe:** Enforces cursor-based pagination across all public APIs, using base64 encoded cursor tokens (`starting_after` and `ending_before` parameters) to query primary databases using range seek indexes.
- **Slack:** Uses cursor-based pagination to load channel chat history logs, fetching messages using UTC timestamps and message IDs to prevent duplicate posts when concurrent updates occur.

## 10. Decision Checklist (Pagination Matrix)

Choose the pagination model:

- Use **Keyset (Cursor-Based) Pagination** when:
  - Table volume is large (>100k rows) and growth is continuous.
  - Designing public API endpoints, mobile feeds, or infinite scrolls.
  - Data is updated frequently (prevents data drift).
  - Constant latency ($O(\log N)$) is required on deep pages.
- Use **Offset Pagination (LIMIT/OFFSET)** ONLY when:
  - Designing internal back-office tables with low row counts (<10,000 rows).
  - Users require jumping to specific page numbers (e.g. Page 12) rather than next/prev queries.
  - Data is static and updates are rare.

## 11. AI Coding-Agent Implementation Guidelines

- Always require a `LIMIT` constraint on all select queries.
- Never recommend offset pagination (`LIMIT/OFFSET`) for high-volume or mobile feed APIs.
- Always include a unique column (like `id`) as a tiebreaker in `ORDER BY` statements.
- Never write pagination queries that sort on unindexed columns.
- Always implement cursor seek statements (`WHERE id > :last_id`) in generated code templates.

## 12. Reusable Checklist

- [ ] Keyset (cursor-based) pagination implemented for high-volume APIs
- [ ] Sorting columns backed by B-Tree indexes
- [ ] Sorting criteria is deterministic (unique column/ID used as tiebreaker)
- [ ] Limit constraint (`LIMIT`) present on all list retrieval queries
- [ ] Offset pagination restricted to low-volume, static admin panels
- [ ] Deep offsets avoided (or optimized using deferred joins)
- [ ] Cursors secure against client tampering (obfuscated or hashed)
- [ ] Query planner verified to execute index seeks on cursor values
