# Performance Review Checklist

## 1. Purpose
The Performance Review Checklist is an audit tool used to verify that database query indices, cache lifetimes, stream outputs, and bulk operations comply with scaling standards.

## 2. Checklist
- [ ] Database indexes active on foreign keys and search columns
- [ ] Joins configured to prevent N+1 query loops
- [ ] Large queries stream results (no memory buffering)
- [ ] Compression middleware active for JSON payloads
- [ ] Connection pool parameters configured for concurrent traffic

## 3. Cross-References
- [Performance engineering reference](../../03-backend-development/13-performance-optimization/)
- [Caching configurations](../../04-database-design/04-database-best-practices/caching-implementation.md)

## 4. Sign-off Criteria
- Approved when p99 response latencies meet targets under concurrency tests.
