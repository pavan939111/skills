# Query Optimization

## 1. Definition & Core Concepts
Query Optimization is the practice of profiling, writing, indexing, and structuring database queries and schemas to minimize execution time and resource consumption.

## 2. Why It Exists / What Problem It Solves
Database queries are the primary performance bottleneck in most backend systems. Slow queries lock tables, exhaust CPU, and slow down user interfaces. Optimization ensures that databases can process millions of daily queries with minimal resource footprints.

## 3. What Breaks in Production Without It
- **API Outages:** Slow queries lock indexing tables during peak traffic, blocking other database reads and causing system-wide timeouts.
- **High Cloud Costs:** Databases run at 100% CPU capacity, forcing companies to pay for expensive database upgrades.

## 4. Best Practices
- **Configure Database Indexes:** Create indexes on columns used in WHERE, JOIN, and ORDER BY operations (e.g. foreign keys, status fields).
- **Audit Execution Plans:** Run EXPLAIN or EXPLAIN ANALYZE on queries to verify that the database engine is using indexes (Index Scan) rather than scanning tables (Seq Scan).
- **Avoid SELECT *:** Retrieve only the specific columns required for the request to minimize memory and network transfer overhead.

## 5. Common Mistakes / Anti-Patterns
- **Over-indexing:** Creating indexes on every column in a table, slowing down insert and update transactions.
- **Ignoring Case Sensitivity:** Querying tables using case-insensitive transformations on un-indexed columns, causing full table scans.

## 6. Security Considerations
- **Access Bounds:** Ensure optimized queries still respect row-level security constraints to prevent unauthorized data reads.

## 7. Performance Considerations
- **Analyze Table Statistics:** Regularly update database table statistics to help the query planner choose the most efficient execution path.

## 8. Scalability Considerations
- **Read-Replica Offloading:** Route expensive read queries, exports, and reporting checks to replica databases to protect primary servers.

## 9. How Major Companies Implement It
- **Uber:** Monitors query times in real-time, automatically routing queries that exceed 200ms to dedicated optimization pipelines.

## 10. Decision Checklist (Indexing Strategy)
- Use **Indexes (B-Tree)** when:
  - Filtering or sorting columns containing high-cardinality values (e.g. IDs, UUIDs, dates, email addresses).
- Use **Partial Indexes** when:
  - Querying subsets of tables (e.g. indexing active users only: WHERE status = 'active').

## 11. AI Coding-Agent Guidelines
- Inspect database execution plans (EXPLAIN) before shipping new database queries to ensure indexing compatibility.

## 12. Reusable Checklist
- [ ] EXPLAIN validation verifies index usage for database queries
- [ ] SQL select statements return only necessary columns (no SELECT *)
- [ ] Indexes configured on foreign keys and search filter columns
- [ ] Case-insensitive queries utilize partial or functional indexes
- [ ] Analytical or slow reporting queries routed to replica databases
- [ ] Table indexes monitored to ensure write speeds remain optimal
