# Performance Review Checklist

## 1. Purpose
This checklist validates that database queries, indexes, connection pools, and caching configurations are optimized for high throughput and low latency, preventing CPU starvation or table lockouts in production. It should be run before releasing new query routes or table schemas to production.

## 2. Checklist

### Query Optimization & SARGability
- [ ] `EXPLAIN` or `EXPLAIN ANALYZE` run on all queries to verify index seeks (no sequential scans on tables >10,000 rows).
- [ ] Filters are SARGable (no functions, math, or type casts applied to indexed columns in `WHERE` clauses).
- [ ] No `SELECT *` statements present in production SQL paths (explicit columns lists used).
- [ ] Text search queries use trailing wildcards only (`LIKE 'term%'`). Leading wildcards avoided.

### Indexing & Joins
- [ ] Joins execute on indexed keys (primary keys or foreign keys).
- [ ] Composite indexes position equality columns leftmost, range/sort columns rightmost.
- [ ] Covering indexes (`INCLUDE` columns) configured to eliminate Heap Fetches for high-frequency paths.
- [ ] Unused or duplicate indexes identified and dropped.

### Pagination & Chatter
- [ ] List retrieval queries have strict `LIMIT` bounds.
- [ ] Infinite scroll feeds and high-volume lists use Keyset (Cursor-based) pagination.
- [ ] No SQL queries are executed inside loop blocks in application code (no N+1 queries).

### Infrastructure & Pool
- [ ] Connection pool limits sized according to database CPU core counts.
- [ ] Database statement and transaction timeouts configured (e.g. `statement_timeout = 5000` ms).
- [ ] Memory buffer settings (`shared_buffers` / `innodb_buffer_pool_size`) optimized for server RAM.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- Indexing Strategy
- [Query Optimization](../05-query-and-performance/query-optimization.md)
- [Execution Plans](../05-query-and-performance/execution-plans-optimization.md)
- [N+1 Queries](../05-query-and-performance/n-plus-one-optimization.md)
- [Pagination](../../03-backend-development/05-api-development/pagination-implementation.md)
- [Connection Pooling](../04-database-best-practices/connection-pooling-implementation.md)
- [Caching](../04-database-best-practices/caching-implementation.md)

## 4. Sign-off Criteria
The performance review passes when:
1. 100% of checklist boxes are verified.
2. Query execution plans on staging datasets show zero table scans on active tables.
3. Sort and join operations execute entirely in memory (no disk spilling).
4. Average query latencies stay under defined SLA limits (e.g. <50ms).
