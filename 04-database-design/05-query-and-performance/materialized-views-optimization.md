# Materialized Views

## 1. Definition & Core Concepts

A Materialized View is a database object that stores (persists) the pre-calculated results of a complex query on disk, acting as a physical cache table that can be indexed and queried.

Core concepts:
- **Standard View vs. Materialized View:**
  - *Standard View:* A virtual query wrapper. Every reference to the view executes the underlying SQL query at runtime (dynamic execution).
  - *Materialized View:* A physical table. Querying the view reads the pre-calculated dataset directly from disk (static execution).
- **Refresh Strategy:** The mechanism used to update the view's data:
  - *Full Refresh:* Truncating and rebuilding the entire view table.
  - *Concurrent Refresh:* Updating the view in place using diff comparisons, allowing concurrent SELECT queries to run without locks.
- **Incremental Refresh:** Rebuilding only the rows that changed since the last refresh (supported natively in databases like Oracle/Materialize, or simulated via ETL).

*(Boundary Note: Code-level scheduled cron runners, caching wrappers, and frontend dashboard components belong in `backend-development/`. This document covers database-level materialized schema definitions, index configurations, and refresh lock behaviors.)*

## 2. Why It Exists / What Problem It Solves

Analytical queries calculating aggregations (`SUM`, `AVG`, `GROUP BY`) across millions of rows are slow. Running them at runtime when users load their dashboard freezes API responses and saturates database CPU. Materialized views resolve this by running the complex calculations once in the background and saving the results to disk. Sub-second read queries can then query the materialized view directly, sacrificing real-time updates for query performance.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Read Lockouts during Refreshes (Non-Concurrent Locks):** Running `REFRESH MATERIALIZED VIEW view_name` without the `CONCURRENTLY` parameter. The database locks the view with an exclusive lock, blocking all application read queries until the refresh completes.
- **Stale Dashboard Outages (Silent Sync Failures):** A database materialized view is configured to refresh daily. The background refresh task fails silently. The application shows stale data to users, violating business SLAs.
- **Synchronous Write Bloat:** Refreshing a materialized view inside a transactional API write route (e.g. refreshing a sales summary view during checkout). The write transaction hangs, connection pools exhaust, and checkout APIs fail.
- **Index Build Failures on Concurrent Refreshes:** Running `REFRESH MATERIALIZED VIEW CONCURRENTLY` on a view that lacks a unique index. The database throws errors and rejects the update, as concurrent updates require unique keys.

## 4. Best Practices

- **Always Create a Unique Index on the View:** Define a unique, indexable identifier column in the materialized view (e.g., `date_key`, `tenant_id`) and create a unique index on it. This is mandatory for concurrent refreshes.
- **Use CONCURRENTLY for Production Refreshes:** Always run updates using the concurrent syntax:
  `REFRESH MATERIALIZED VIEW CONCURRENTLY view_name;`
- **Schedule Refreshes During Off-Peak Hours:** Run refresh tasks during low-traffic windows. Size the refresh frequency to align with business SLAs (e.g., refreshing hourly or daily).
- **Index Materialized Views for Searches:** Create standard B-Tree indexes on the columns of the materialized view that are targeted by dashboard search filters (e.g., `user_id`, `created_at`).
- **Never Refresh Synchronously on Transactions:** Ensure view refreshes run asynchronously in background queues, completely decoupled from operational transactional write APIs.

## 5. Common Mistakes / Anti-Patterns

- **Missing `CONCURRENTLY` Parameter:** Running standard refreshes that block reads in production.
- **Missing Unique Indexes:** Attempting concurrent refreshes without unique index declarations.
- **Real-Time Assumptions:** Using materialized views for features that require immediate, real-time data correctness (use standard queries or caches instead).
- **Over-Frequent Refreshes:** Scheduling refreshes every minute, saturating disk write queues and slowing down the server.

## 6. Security Considerations

- **Row-Level Security (RLS) on Materialized Views:** Materialized views do not automatically inherit RLS policies from their source tables. If you materialize a view containing sensitive data, you must configure RLS policies directly on the materialized view itself to prevent data leaks.

## 7. Performance Considerations

- **Storage Space Overhead:** Since materialized views persist data, they consume disk space. Monitor size growth, especially for views aggregating data across multiple dimensions.

## 8. Scalability Considerations

- **Analytical Data Warehouses (OLAP):** In large analytical data warehouses, materialized views are often automatically refreshed by the engine (using incremental updates), serving as pre-aggregates that scale BI dashboard performance.

## 9. How Major Companies Implement It

- **Stripe:** Utilizes materialized views in merchant analytics portals to display monthly billing transaction volumes and fee calculations, updating views asynchronously in the background.
- **Netflix:** Materializes subscriber metric summaries across reporting databases, avoiding runtime scans on transactional billing ledgers.

## 10. Decision Checklist (View Selection Matrix)

Choose the view type:

- Use **Standard Views (Virtual)** when:
  - You need to simplify complex queries or hide schema structures.
  - Data must remain 100% real-time and consistent with the source tables.
  - The source table is small, and runtime query cost is low.
- Use **Materialized Views (Persisted)** when:
  - Querying source tables is slow due to complex calculations and joins.
  - Eventual consistency is acceptable (stale metrics for minutes/hours).
  - You need to index the view results to optimize search filters.
- Never use **Materialized Views** for:
  - Live checkout routes, ledger balance checks, or credential validation pathways.

## 11. AI Coding-Agent Implementation Guidelines

- Always require a unique index to be defined on any materialized view.
- Never write DML statements that refresh materialized views synchronously inside transactional routes.
- Always use the `CONCURRENTLY` keyword when writing refresh SQL statements.
- Never use materialized views for real-time transactional checks.
- Always configure RLS policies directly on materialized views containing sensitive customer data.

## 12. Reusable Checklist

- [ ] Materialized view defined to cache slow analytical aggregate queries
- [ ] Unique index created on the materialized view
- [ ] Refresh scripts use the `CONCURRENTLY` keyword (prevents read locks)
- [ ] View refreshes scheduled asynchronously in the background (decoupled from APIs)
- [ ] RLS policies configured directly on the materialized view if it contains PII
- [ ] Secondary B-Tree indexes created on search filter columns in the view
- [ ] Data freshness SLA documented (e.g. data refreshed every 1 hour)
- [ ] No real-time billing or checkout operations query the materialized view
