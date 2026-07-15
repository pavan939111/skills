# CQRS Database Patterns

## 1. Definition & Core Concepts

Command Query Responsibility Segregation (CQRS) at the data layer is the architectural design pattern that physically separates the database models and engines used for writing data (commands) from the database models and engines used for reading data (queries).

Core CQRS concepts:
- **Write Database (Command Model):** Optimized for high-throughput write performance, transactional safety (ACID), and data integrity. Typically structured in Third Normal Form (3NF) relational databases.
- **Read Database (Query Model / Projection):** Optimized for fast, complex search and read queries. Denormalized, containing pre-computed data structures matching specific user interface requirements. Often stored in search indexes (Elasticsearch) or NoSQL document stores (MongoDB, Redis).
- **Synchronization Pipeline:** An asynchronous data streaming mechanism (CDC or event bus) that propagates mutations committed in the write database to update read models.
- **Eventual Consistency:** The operational state where the read model lags slightly behind the write model, sync-updating in milliseconds.

*(Boundary Note: Code-level application route divisions, command handlers, query dispatchers in code frameworks, and HTTP routing controllers belong in `backend-development/`. This document covers database-tier write schemas, read projections, CDC sync channels, denormalization layouts, and eventual consistency lag.)*

## 2. Why It Exists / What Problem It Solves

In high-scale systems, writes and reads have conflicting performance requirements:
- Writes require transactional locks, normalized schemas (to prevent duplication), and index structures (B-Trees) that slow down under massive volumes.
- Reads require fast aggregations, denormalized fields (to avoid expensive joins), and text indexes.
Running both workloads against a single database engine causes resource contention: complex reporting queries hold read locks that block payment transactions, crashing the system. CQRS isolates these paths, allowing write and read databases to be optimized and scaled independently.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Lock Starvation from Heavy Reporting:** An analyst runs a query compiling quarterly sales trends, joining 15 tables. The query runs for 10 seconds. While executing, it locks shared pages, blocking checkout transactions on the same tables, causing API timeouts.
- **Permanent Read Model Drift:** A sync worker fails to process a CDC record because of a schema mismatch. The write database saves the update, but the read database misses it. Now, the user's dashboard displays stale information indefinitely.
- **Synchronous Write Latency Spikes:** Attempting to implement CQRS by writing synchronously to both the write database and the read search index inside the application write handler. A network hiccup on the search index blocks the checkout API, increasing transaction latency.
- **Infinite Sync Loops:** Misconfiguring database trigger loops, causing updates on the read database to trigger secondary updates back to the write database.

## 4. Best Practices

- **Normalize the Write Model, Denormalize the Read Model:**
  - *Write Database:* Keep schema in 3NF to prevent duplicate anomalies and keep transaction times short.
  - *Read Database:* Denormalize data into pre-computed document rows (e.g. store user details inside invoice rows) to eliminate the need for SQL `JOIN` queries.
- **Use Asynchronous Change Data Capture (CDC) to Sync:** Propagate updates from the write database to the read database asynchronously using log-based CDC (e.g., Debezium streaming write updates) or transaction message queues.
- **Implement Idempotent Update Consumers:** Ensure the workers updating the read models execute upsert queries based on entity IDs, resolving out-of-order sync messages safely.
- **Restrict Read Databases to Read-Only Access:** Set user role permissions on the read databases to be strictly read-only (`GRANT SELECT`) for the application query microservices, preventing direct writes.
- **Expose Sync Lag Telemetry:** Monitor the time offset between the write database transaction timestamp and the read database sync timestamp, triggering alerts if lag exceeds SLAs (e.g., lag >5 seconds).

## 5. Common Mistakes / Anti-Patterns

- **Querying the Write Database for Reports:** Allowing complex business intelligence tools to run queries against active OLTP write databases.
- **Synchronous Dual-Writes:** Writing to read and write models synchronously in the same thread.
- **No Idempotency in Sync Workers:** Failing to handle duplicate sync messages, creating duplicate records.
- **Ignoring Eventual Consistency:** Designing frontend UIs that crash or display errors if a newly written record does not appear in search results instantly.

## 6. Security Considerations

- **Access Policy Mirroring:** Ensure Row-Level Security policies active on the write database are replicated or enforced on the denormalized read database to prevent unauthorized access to query models.

## 7. Performance Considerations

- **Denormalization Storage Overhead:** Denormalizing data increases disk storage consumption on read nodes. Accept the storage cost as a trade-off for millisecond read query return times.

## 8. Scalability Considerations

- **Independent Scaling:** Scale the read database cluster horizontally by adding read nodes or replicas to handle heavy search traffic without scaling the write database, optimizing infrastructure costs.

## 9. How Major Companies Implement It

- **Stripe:** Implements CQRS by executing financial changes on normalized PostgreSQL databases and streaming transactions via CDC pipelines to denormalized Elasticsearch indexes to serve merchant query dashboards.
- **Netflix:** Deploys write paths to Cassandra registers and streams updates to read-optimized document models to render video feeds with sub-10ms latency.

## 10. Decision Checklist (CQRS Architecture Mapping)

Select the database architecture:

- Use **Single Shared Database (No CQRS)** when:
  - System scale is low (<1,000 requests/second).
  - Business queries are simple CRUD actions.
  - Development speed and low infrastructure cost are prioritized.
- Use **CQRS Architecture** when:
  - Read traffic scales independently and dominates write traffic (e.g. 100:1 read-to-write ratio).
  - Complex analytical queries or fuzzy text searches are required on active data.
  - Read-write resource contention is causing transaction timeouts.
  - The business can tolerate eventual consistency (read model lag <500ms).

## 11. AI Coding-Agent Implementation Guidelines

- Never write application routes that query the primary transaction database for complex reports.
- Always recommend asynchronous CDC (e.g., Debezium) or event buses to sync read databases.
- Always configure read database roles as read-only for query services.
- Never implement concurrent synchronous writes to both models in transactional scripts.
- Always include idempotency upsert templates in read model sync handlers.

## 12. Reusable Checklist

- [ ] Command (Write) model and Query (Read) model separated physically
- [ ] Write model schema normalized (3NF) to guarantee transactional integrity
- [ ] Read model schema denormalized (e.g. single document arrays) to eliminate joins
- [ ] Data sync between write and read databases decoupled asynchronously (CDC/Events active)
- [ ] Read database configured with read-only database permissions for query APIs
- [ ] Idempotent upsert logic configured in read model sync consumers
- [ ] Synchronization lag monitored and alert thresholds set
- [ ] Client applications designed to support eventual consistency read states
