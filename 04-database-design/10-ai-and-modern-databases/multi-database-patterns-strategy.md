# Multi-Database Patterns (Syncing Vector & Relational Stores)

## 1. Definition & Core Concepts

Multi-Database Patterns are architectural and data-sync designs used when an application splits its data layer across multiple specialized database engines (e.g., relational databases for transactions, vector databases for semantic search, and search engines for text matching).

Core multi-database concepts:
- **Polyglot Persistence:** Utilizing multiple specialized database engines matching different workload types rather than forcing all data into a single general-purpose engine.
- **Dual-Writing:** The practice of an application writing to two separate databases (e.g., SQL and Vector DB) within the same API thread. (Highly vulnerable to desynchronization).
- **Transactional Outbox Pattern:** A reliability pattern where data mutations are saved to an `outbox` table in the primary relational database within the same transaction as the business update. A background worker reads the outbox and streams the changes to secondary stores.
- **Change Data Capture (CDC):** Database-native log streaming (e.g. streaming Postgres WAL via Debezium) that captures and publishes table mutations to a message broker, updating secondary search/vector engines.
- **Synchronization Lag (Eventual Consistency):** The time delay between committing a write in the primary relational database and having it reflect in secondary search/vector indexes.

*(Boundary Note: Code-level Kafka consumer configurations, backend message handlers, and API router definitions belong in `backend-development/` and operations. This document covers database-level outbox tables, CDC WAL logs, dual-write failures, replication lag parameters, and sync recovery.)*

## 2. Why It Exists / What Problem It Solves

No single database is optimal for all workloads. A relational database (PostgreSQL) guarantees transactional ACID consistency for payments but lacks the speed of Pinecone for HNSW vector searches or Elasticsearch for fuzzy keyword auto-completes. Multi-database patterns combine these specialized engines. The challenge is keeping these separate datastores synchronized and consistent.

## 3. What Breaks in Production Without It

- **Permanent Desynchronization from Dual-Writing:** An application writes to the SQL database, which succeeds, and then attempts to write to the Vector DB. The Vector DB is temporarily offline or rate-limits the write. The API thread throws an error. The SQL database has the record, but the Vector DB misses the embedding, leaving the search index permanently desynchronized.
- **Race Conditions due to Sync Lag:** A user updates their document and immediately runs a search. Because the CDC sync worker takes 500ms to update the vector index, the user's search does not return the updated document, leading to support complaints.
- **Unbounded Outbox Table Bloat:** Implementing the Transactional Outbox pattern without a pruning script. The `outbox` table grows to millions of rows, slowing down primary database writes and saturating disk space.
- **Data Leakage across Shards:** Syncing data from a sharded SQL database to a single, un-partitioned vector index, causing queries to return search results across tenant boundaries.

## 4. Best Practices

- **Never Use Synchronous Dual-Writing in Production:** Avoid writing to multiple databases in a single application API thread. If one write fails or network lags, the databases desynchronize or API threads hang.
- **Use the Transactional Outbox Pattern for Sync:** Store updates in a database outbox table within the primary transaction, and use background workers (polling or CDC) to publish updates to secondary stores.
- **Enforce CDC for High-Volume Systems:** Use Change Data Capture tools (like Debezium) to read the database transaction logs (WAL) directly, streaming modifications to Kafka/RabbitMQ to update vector and search databases asynchronously.
- **Enforce Idempotency in Secondary Consumers:** Ensure that the consumer workers updating the vector and search databases handle duplicate messages (idempotent writes) by using upsert operations based on primary keys.
- **Implement automated outbox table pruning:** Automatically delete processed records from the outbox table:
  `DELETE FROM outbox WHERE processed = true AND processed_at < NOW() - INTERVAL '1 hour';`
- **Align Sharding Keys Across Engines:** If the primary relational database is sharded, ensure the vector and search databases use matching shard keys (e.g. `tenant_id`) to maintain tenant isolation boundaries.

## 5. Common Mistakes / Anti-Patterns

- **Synchronous Dual-Writing:** Writing to SQL and Vector DBs inside the same client API request.
- **No Idempotency Keys:** Syncing updates without primary key matching, creating duplicate vectors or text indexes in secondary stores.
- **Unmonitored Outbox Queues:** Allowing outbox tables to grow indefinitely without processing or pruning.
- **Assuming Instant Sync:** Designing client UIs that assume the vector search matches SQL state immediately, without handling replica lag states.

## 6. Security Considerations

- **Sync Network Isolation:** Secure the synchronization pipeline. Ensure connection credentials for CDC tools and message brokers are stored in secrets managers, and inter-database sync traffic runs on private subnets.

## 7. Performance Considerations

- **Outbox Write Overhead:** Writing to the outbox table adds minor write overhead to the primary database transaction. Keep the outbox schema narrow (ID, aggregate type, payload string) to keep transactional writes fast.

## 8. Scalability Considerations

- **Event-Driven Scaling:** Decoupling database synchronization using message queues allows you to scale the consumer workers independently during data import spikes, preventing the primary SQL database from being overloaded.

## 9. How Major Companies Implement It

- **Stripe:** Synchronizes primary PostgreSQL transactions to Elasticsearch indices asynchronously using transactional outbox and CDC pipelines, ensuring search features remain consistent with ledger records.
- **Uber:** Streams trip logs from active transactional engines to downstream Hadoop, Elasticsearch, and analytical databases using event queues to keep secondary caches synchronized.

## 10. Decision Checklist (Sync Pattern Selection)

Select the synchronization pattern:

- Use **Transactional Outbox Pattern (Table Polling)** when:
  - Database write volume is low-to-medium (<1,000 writes/second).
  - Simplicity is preferred (no external CDC infrastructure like Debezium/Kafka).
  - Transactions must guarantee database-tier consistency.
- Use **Change Data Capture (CDC Log Streaming)** when:
  - Database write volume is high (>1,000 writes/second).
  - Near-real-time synchronization (sub-second lag) is required.
  - You want to bypass application-tier polling overhead on the primary database catalog.
- Never use **Synchronous Dual-Writing** on:
  - Production transactional database systems.

## 11. AI Coding-Agent Implementation Guidelines

- Never write API controller templates that execute synchronous writes to multiple database engines in the same thread.
- Always include Transactional Outbox table schema templates in relational database DDL setups.
- Always recommend idempotent upsert operations (`INSERT ON CONFLICT DO UPDATE`) in secondary sync consumers.
- Never allow outbox tables to exist without automated pruning routines.
- Always design client API responses to handle eventual consistency synchronization lag.

## 12. Reusable Checklist

- [ ] Multi-database synchronization decoupled asynchronously (no synchronous dual-writing)
- [ ] Transactional Outbox pattern or CDC log streaming configured for data synchronization
- [ ] Outbox table schema configured in primary relational database DDL
- [ ] Secondary sync consumers execute idempotent upserts based on primary keys
- [ ] Automated outbox table pruning scripts active (processed rows deleted regularly)
- [ ] CDC log streaming (Debezium/Kafka) isolated on private network subnets
- [ ] Synchronization lag monitored and alert thresholds configured
- [ ] Sharding keys aligned across relational, vector, and text search engines
