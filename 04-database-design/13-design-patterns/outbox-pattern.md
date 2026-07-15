# Outbox Pattern (Transactional Message Queue Sync)

## 1. Definition & Core Concepts

The Transactional Outbox Pattern is a database design pattern that guarantees atomic state transitions and corresponding message event publishing across distributed microservices by writing events to a temporary `outbox` table within the same transaction as the primary database modification.

Core outbox concepts:
- **Transactional Outbox Table:** A dedicated table inside the primary database that acts as a local queue for outgoing events.
- **Dual-Write Problem:** The vulnerability where an application writes to a database and publishes an event to a message broker in separate network calls. If the second call fails, the database and event stream desynchronize.
- **Outbox Polling Publisher:** A background worker process that periodically queries the outbox table, publishes pending events to the message broker, and marks them as processed.
- **CDC-Based Outbox Publisher:** A log-based reader (e.g., Debezium) that scans database transaction logs (WAL) to detect new rows added to the outbox table, shipping them to the event bus with sub-second latencies.

*(Boundary Note: Code-level Kafka publishers, message consumer event loops, and application microservice route configs belong in `backend-development/`. This document covers database-tier outbox table schemas, transaction wraps, outbox polling queries, WAL CDC integrations, and outbox table pruning.)*

## 2. Why It Exists / What Problem It Solves

Microservices need to share state updates (e.g., when a user is created, notify the billing service to create a ledger). If the application updates the database and then pings a message queue (Kafka), the call to Kafka can fail due to network drops, leaving the user created but the billing service unaware. Conversely, if you publish to Kafka first, the database write can fail, leaving the billing service with a phantom user record. The Outbox pattern solves this by wrapping both updates in a single, local database transaction.

## 3. What Breaks in Production Without It

- **Permanent Microservice Desynchronization (Lost Events):** An application writes a checkout update to SQL and then calls RabbitMQ. The RabbitMQ broker experiences a brief failover restart and rejects the message. The application returns an error to the user, but the SQL database retains the order status as "Paid" while the fulfillment service never receives the dispatch event.
- **Phantom Events from Pre-Commit Publishing:** Publishing an event to a message queue *before* the database transaction commits. The transaction rolls back due to a constraint violation. The downstream services receive the event and process orders, but the data never physically existed in the primary database.
- **Outbox Table Storage Exhaustion:** Implementing the outbox table without a pruning script. The table grows to millions of rows, saturating disk space and slowing down primary transaction writes.
- **Race Conditions from Sync Latency:** A user updates a document, and the page redirects to a search dashboard. If the outbox worker lags, the search dashboard queries stale data, leading to page reload errors.

## 4. Best Practices

- **Enforce a Normalized Outbox Table Schema:** Structure the outbox table to capture:
  - `outbox`: (id [PK/UUID], aggregate_type [Varchar], aggregate_id [Varchar], event_type [Varchar], payload [JSONB], processed [Boolean], created_at [Timestamp], processed_at [Timestamp])
- **Commit inside the Primary Transaction Block:** Always write the outbox event row in the exact same transaction block as the business database update:
  - *Transaction Example:*
    ```sql
    BEGIN;
    UPDATE user_account SET status = 'active' WHERE id = :id;
    INSERT INTO outbox (id, aggregate_type, aggregate_type_id, event_type, payload, processed) 
      VALUES (:event_uuid, 'User', :id, 'UserActivated', :event_json, false);
    COMMIT;
    ```
- **Use CDC for Zero Polling Overhead:** Use log-based CDC (Debezium) to read the database transaction logs (WAL) to detect inserts to the outbox table. This avoids running heavy polling SELECT queries against the primary database.
- **Automate Outbox Table Pruning:** Pruning processed outbox rows is critical. Schedule an automated, database-level task to delete processed outbox rows:
  - *SQL Command:* `DELETE FROM outbox WHERE processed = true AND processed_at < NOW() - INTERVAL '1 hour';`
- **Configure Keyset Pagination for Pollers:** If using a polling worker, avoid `OFFSET` pagination. Query pending rows using:
  `SELECT * FROM outbox WHERE processed = false ORDER BY id ASC LIMIT 500 FOR UPDATE SKIP LOCKED;`
  Using `SKIP LOCKED` prevents multiple background workers from locking the same rows.

## 5. Common Mistakes / Anti-Patterns

- **Publishing Events outside Transaction Blocks:** Firing events in code before or after database commits.
- **No Outbox Pruning:** Keeping processed event rows in the outbox table indefinitely.
- **Synchronous Outbox Polling:** Querying the outbox table frequently on main transaction paths.
- **No Row-Locking on Polling:** Failing to use `FOR UPDATE SKIP LOCKED` during polling, causing duplicate event dispatches.

## 6. Security Considerations

- **Outbox Payload Encryption:** Events in the outbox contain transaction details. Ensure the outbox table uses database-tier encryption, and restrict read permissions on the outbox table to the sync publisher role only.

## 7. Performance Considerations

- **Outbox Write Overhead:** Writing to the outbox table adds minor write overhead to the primary database transaction. Keep the outbox schema narrow (ID, aggregate type, payload string) to keep transactional writes fast.

## 8. Scalability Considerations

- **Outbox Sharding:** If sharding primary databases, sharding keys must map to the outbox table (`tenant_id`). This ensures the outbox events for a tenant are written locally to the corresponding tenant shard.

## 9. How Major Companies Implement It

- **Stripe:** Uses outbox patterns to synchronize payment states to message broker networks asynchronously, ensuring ledger consistency is maintained during network failures.
- **Uber:** Relies on transaction outbox logs to propagate trip histories to downstream analytical services, avoiding dual-write failures.

## 10. Decision Checklist (Outbox Sync Selection)

Define the outbox synchronization pattern:

- Use **Transactional Outbox (with Log-Based CDC)** when:
  - Designing production-grade microservice architectures where data consistency is a strict requirement.
  - Write throughput is high (>1,000 writes/second).
  - You want sub-second replication latency to downstream services.
- Use **Transactional Outbox (with Table Polling)** when:
  - Database write volume is low-to-medium (<1,000 writes/second).
  - You want to avoid the operational cost of managing CDC platforms like Debezium/Kafka.
- Never use **Synchronous Dual-Writing** on:
  - Critical payment, identity, or ordering paths.

## 11. AI Coding-Agent Implementation Guidelines

- Never write transaction templates that publish to message queues outside local database transactions.
- Always include `outbox` table schemas in microservice database proposals.
- Always include `FOR UPDATE SKIP LOCKED` in outbox polling queries.
- Never allow outbox schemas to exist without automated pruning routines.
- Always configure composite indexes on `(processed, id)` in outbox tables.

## 12. Reusable Checklist

- [ ] Outbox table schema configured in DDL with PK, event types, payload, and processed flags
- [ ] Outbox row insert executed inside the primary transaction block (atomic commit verified)
- [ ] Polling queries use `FOR UPDATE SKIP LOCKED` to prevent worker concurrency locks
- [ ] Automated outbox table pruning task configured to delete processed rows regularly
- [ ] CDC log streaming (Debezium) configured to monitor the outbox table asynchronously
- [ ] Composite index active on `(processed, id)` in the outbox table
- [ ] Outbox payloads encrypted at rest to protect sensitive transaction details
- [ ] Event consumer workers execute idempotent upserts based on event UUIDs
