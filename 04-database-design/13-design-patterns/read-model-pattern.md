# Read Model Pattern (Pre-computed Views)

## 1. Definition & Core Concepts

The Read Model Pattern (also known as the Projection Pattern) is the database design practice of creating, storing, and maintaining denormalized tables optimized specifically for rapid query retrieval, separating them from the normalized tables used for transactional writes.

Core read model concepts:
- **Projection:** The process of translating a stream of events or relational table changes into a consolidated read model row.
- **Denormalized Storage:** Storing duplicate copies of data fields (e.g., storing a user's name directly in the `user_orders_read_model` table) to eliminate SQL `JOIN` operations.
- **Pre-computed Aggregates:** Storing calculated totals (sums, averages, counts) in read model rows to avoid executing runtime `GROUP BY` scans.
- **Read Model Synchronization:** The asynchronous process (triggered by CDC or event brokers) that updates the read model tables after primary transactions commit.

*(Boundary Note: Code-level application query routing, HTTP response formatting, and client-side state caching belong in `backend-development/`. This document covers database-level read model schemas, denormalized indexes, CDC sync paths, write amplification, and read latency optimization.)*

## 2. Why It Exists / What Problem It Solves

Normalized database schemas (3NF) are optimized to prevent data anomalies during writes, but they require complex, slow queries to read. If a user dashboard demands displaying total spent, account status, and recent activity, the application must run multiple joins and aggregations. Under high traffic, this saturates database CPU. The Read Model pattern pre-computes these views asynchronously. When a user requests their dashboard, the database retrieves a single pre-calculated row, executing reads in milliseconds.

## 3. What Breaks in Production Without It (or When Misapplied)

- **CPU Starvation from Dashboard Joins:** High-volume user dashboard requests execute multi-table joins and `COUNT` queries on every page load. The database CPU hits 100%, causing connection queues and slowing down the checkout API.
- **Write Amplification Outages (Over-Denormalization):** Creating too many distinct read models for a single write. When a write occurs, the database or sync workers must execute dozens of secondary updates, saturating disk write IOPS.
- **Stale Dashboard Loops (Unmonitored Sync Lag):** The CDC sync pipeline crashes. The application queries the read model, which contains stale data. The user attempts to update a value, but the UI continues to display the old value, leading to repeat submissions.
- **Unindexed Read Model Scans:** Failing to index lookup keys in read model tables, forcing slow sequential scans.

## 4. Best Practices

- **Match Read Models strictly to UI Views:** Structure the read model table schema to match the exact data structure required by the target UI screen (e.g., one table row contains all fields for the User Dashboard).
- **Update Read Models Asynchronously:** Never update read models synchronously inside write transactions. Use Change Data Capture (CDC) or message brokers to update read models asynchronously.
- **Index Read Model Query Columns:** Configure B-Tree indexes on lookup keys (e.g., `user_id`, `tenant_id`) in read model tables to keep query lookups under 5ms.
- **Implement Idempotent Sync Handlers:** Ensure read model update scripts use upsert queries (`INSERT ON CONFLICT DO UPDATE`) to handle duplicate sync events safely.
- **Expose Sync Timestamps for Lag Detection:** Include a `last_sync_at` timestamp in the read model schema to allow client APIs to detect sync lag and manage UI state.

## 5. Common Mistakes / Anti-Patterns

- **Querying OLTP Tables for Dashboards:** Running aggregate queries on transactional tables instead of using pre-computed read models.
- **Synchronous Read Model Updates:** Writing to read models inside the write transaction, slowing down write queries.
- **Unindexed Read Model Tables:** Omitting indexes on lookup keys, forcing table scans.
- **Assuming Read Models are Real-Time:** Designing application flows that require strict real-time consistency on eventually consistent read models.

## 6. Security Considerations

- **Access Controls Alignment:** Because read models contain denormalized copies of user data, ensure they inherit the same security controls (encryption at rest, RLS) as the primary tables.

## 7. Performance Considerations

- **Write Amplification:** Balance read optimization against write overhead. Monitor database disk IOPS to ensure the number of read model updates does not bottleneck primary write transactions.

## 8. Scalability Considerations

- **Horizontal Read Model Scaling:** Distribute read models across sharded nodes using the primary query key (e.g., `user_id` or `tenant_id`) to keep read queries localized and fast.

## 9. How Major Companies Implement It

- **Stripe:** Pre-computes merchant dashboard views asynchronously, storing consolidated invoice and balance counts in read-optimized tables to serve dashboard API calls instantly.
- **Netflix:** Generates pre-computed video recommendation feeds for users, loading ready-to-render recommendation rows in milliseconds during application boot.

## 10. Decision Checklist (Read Model Pattern Selection)

Select the read model strategy:

- Use **Pre-Computed Read Model Tables (Projections)** when:
  - Read traffic scales independently and dominates write traffic (e.g., 100:1 read-to-write ratio).
  - Queries require expensive joins, counts, or aggregates on transactional tables.
  - User dashboards demand sub-10ms query return times.
  - Eventually consistent data (lag <500ms) is acceptable.
- Use **Direct OLTP Queries** ONLY when:
  - System scale is low (<1,000 requests/second).
  - Reads must be strictly consistent with the latest write transactions (RPO = 0).
  - Table sizes are small (<10,000 rows).

## 11. AI Coding-Agent Implementation Guidelines

- Never write application controllers that execute joins and aggregates on transactional tables for high-frequency dashboards.
- Always include `last_sync_at` columns in read model schema templates.
- Always recommend asynchronous CDC or message queues to update read models.
- Never write database transactional scripts that update read models synchronously.
- Always configure indexes on lookup keys in read model tables.

## 12. Reusable Checklist

- [ ] Read model tables designed to match specific UI view structures
- [ ] Read model updates decoupled asynchronously (CDC/Events active)
- [ ] Indexes configured on lookup keys (e.g. `user_id`, `tenant_id`) in read model tables
- [ ] Idempotent upsert logic configured in read model sync handlers
- [ ] `last_sync_at` timestamp column present in the read model schema
- [ ] Read model permissions configured (write access restricted to sync workers)
- [ ] Synchronization lag monitored and alert thresholds configured
- [ ] Client applications designed to support eventual consistency read states
