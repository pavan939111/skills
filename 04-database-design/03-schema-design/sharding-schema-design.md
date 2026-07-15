# Sharding (Schema-Level Sharding)

## 1. Definition & Core Concepts

Schema-level Sharding is the database modeling technique of partitioning a single logical table across multiple independent physical database server instances (shards), where each database node runs its own isolated engine.

Core concepts:
- **Shard Key:** The database column value used by a hash or range algorithm to determine which physical server node stores a given row.
- **Global (Reference) Tables:** Small, static tables (e.g. status codes, country lists) that are duplicated on every shard server to enable local joins.
- **Sharded Tables:** High-volume transaction tables partitioned and distributed across shards based on the shard key.
- **Scatter-Gather Queries:** Queries written without the shard key. The database middleware must send the query to every server in the cluster and merge the results, causing high latency.
- **Single-Shard Routing:** Queries that include the shard key, allowing the router to send the query directly to the single server containing that data.

*(Boundary Note: Shard rebalancing algorithms, distributed routing proxies (e.g. Vitess configuration), and CAP theorem trade-offs belong in `06-scalability/`. This document covers schema design constraints, shard key selection rules, unique index limitations, and cross-shard join boundaries.)*

## 2. Why It Exists / What Problem It Solves

Single database instances, even when partitioned, eventually reach hardware limits (CPU cores, disk IOPS, network bandwidth). To scale past these limits, databases must scale horizontally. Sharding divides the schema across multiple independent servers. By selecting a routing shard key (e.g., `tenant_id`), the system ensures that all write and read queries for a specific tenant are routed to a single database server, allowing the database tier to scale write capacity.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Cross-Shard Join Failures:** Attempting to join a sharded table (e.g. `orders` sharded by `order_id`) with another table sharded on a different key (e.g. `customers` sharded by `customer_id`). The engine cannot perform the join locally, forcing the application middleware to pull millions of rows over the network, causing memory crashes.
- **Uniqueness Violations Across Shards:** The database engine can only enforce `UNIQUE` constraints on indexes stored locally on its node. If a table is sharded by `tenant_id`, the database cannot enforce uniqueness on `email` across different shards, allowing duplicate emails to be written.
- **Scatter-Gather Latency Spikes:** Writing queries that omit the shard key. The database router must query 100 servers in parallel, exhausting network connections and spiking latency.
- **Hot Shard Resource Exhaustion:** Selecting a low-cardinality shard key (like `status`). All active rows route to a single shard, running that server out of disk and crashing the system, while other shards sit empty.

## 4. Best Practices

- **Select a High-Cardinality Shard Key:** Use columns with many unique values that distribute writes evenly (e.g., `tenant_id`, `user_id`, `company_uuid`).
- **Include Shard Keys in Composite Primary Keys:** Ensure all primary keys and unique indexes on sharded tables include the shard key column (e.g., `PRIMARY KEY (id, tenant_id)`).
- **Duplicate Static Tables (Global Tables):** Duplicate lookup tables (like `currencies` or `roles`) to all shard nodes. This allows transactional queries to perform joins locally on the shard server.
- **Enforce Global Uniqueness via Lookup Tables:** If you must enforce uniqueness on a non-shard key (like `email` in a table sharded by `tenant_id`), create a dedicated, non-sharded global lookup table that maps `email` to `tenant_id` to act as a validation gate.
- **Align Sharding Keys Across Related Tables:** Shard related tables on the same key (e.g. shard both `orders` and `order_items` by `customer_id`) to ensure related rows are stored on the same server, enabling local joins.

## 5. Common Mistakes / Anti-Patterns

- **Sharding by Auto-Increment IDs:** Sharding by sequential integer IDs. All new writes route to the highest ID range shard, creating a write hotspot on one node while historical shards sit idle.
- **Cross-Shard Transactions:** Executing queries that update rows on multiple different shards in a single transaction, requiring slow distributed commit protocols (2PC).
- **Omitting Shard Keys in WHERE Clauses:** Writing query statements that omit the shard key, triggering scatter-gather operations.
- **Sharding Too Early:** Introducing sharding complexity for small datasets (<1TB) that could run reliably on a single vertically scaled SQL server.

## 6. Security Considerations

- **Multi-Tenant Isolation Protection:** Sharding by `tenant_id` provides physical data isolation. Restrict database user access at the routing middleware level to ensure tenant sessions only connect to their designated shard, preventing cross-tenant data leaks.

## 7. Performance Considerations

- **Single-Shard Query Performance:** Ensure that 95% of application queries contain the shard key. Single-shard queries execute in sub-milliseconds, whereas scatter-gather queries scale latency with the size of the cluster.

## 8. Scalability Considerations

- **Schema Evolution Across Shards:** Schema migrations must run on all shard nodes simultaneously. Use zero-downtime migration tools to execute schema updates incrementally across shards without taking the system offline.

## 9. How Major Companies Implement It

- **Stripe:** Shards transaction data using partition keys, ensuring merchant ledgers remain isolated on dedicated shards to prevent cross-merchant resource contention.
- **Slack:** Shards database tables by workspace ID. Because all queries for a workspace (channels, messages, files) include the workspace ID, queries run locally on a single database shard.

## 10. Decision Checklist (when to use / when NOT to use)

- Shard a **Table / Schema** when:
  - Database write volume exceeds the capacity of a single vertically scaled primary node.
  - Data storage size exceeds 2TB and continues to grow rapidly.
  - You can partition the entire application domain around a clean, high-cardinality routing key (e.g. Workspace ID, Tenant ID).
- Keep a **Single Database Instance** when:
  - The dataset is small (<1TB) or can scale vertically.
  - The query patterns require complex, ad-hoc joins across all entities.
  - High-frequency cross-entity transactions are required.

## 11. AI Coding-Agent Implementation Guidelines

- Always include the shard key in the composite primary key declaration of all sharded tables.
- Never write DDL schemas that require cross-shard joins or distributed transactions.
- Always recommend duplicating small reference lookup tables (Global Tables) to all shard nodes.
- Never write application database queries targeting sharded tables without including the shard key in the `WHERE` filters.
- Always implement global uniqueness checks on non-shard keys using centralized lookup tables.

## 12. Reusable Checklist

- [ ] High-cardinality shard key (e.g. `tenant_id`, `user_uuid`) selected
- [ ] Composite Primary Key includes the shard key column
- [ ] Related tables sharded on the same key to enable local joins
- [ ] Small reference lookup tables duplicated to all shard nodes (Global Tables)
- [ ] Global uniqueness of non-shard keys enforced via centralized lookup tables
- [ ] All primary query paths include the shard key in the `WHERE` clause
- [ ] No cross-shard joins written in application query scripts
- [ ] Database migration tools configured to apply DDL schemas across all shards
