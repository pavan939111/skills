# Event Sourcing Storage Patterns

## 1. Definition & Core Concepts

Event Sourcing is an architectural pattern where application state is stored as a sequence of immutable, chronological events rather than only capturing the current state. The database that stores this sequence is called an Event Store.

Core event sourcing concepts:
- **Event Store:** An append-only database table optimized for rapid writes of immutable event payloads.
- **Event Stream:** The chronological sequence of events representing the lifetime modifications of a single entity instance (e.g. all updates to Order #105).
- **Projection (Read Model):** A pre-computed view of the current state, built by replaying and aggregating events from the stream.
- **Snapshotting:** Periodic saves of an entity's aggregated state (e.g., every 100 events). Reading state requires loading the latest snapshot and replaying only subsequent events, limiting latency.
- **Optimistic Concurrency Control (OCC):** Enforcing version increments on streams to prevent concurrent transactions from writing conflicting events.

*(Boundary Note: Code-level command handlers, aggregate route logic in backend frameworks, and Kafka event consumer loops belong in `backend-development/`. This document covers database-level event store schemas, primary keys, concurrency constraints, partition indexing, and snapshot tables.)*

## 2. Why It Exists / What Problem It Solves

Traditional databases only store the *current* state of a row (e.g. Order Status is "Shipped"). When a row is updated, the previous state is overwritten. If a business needs a complete, auditable log of how that state was reached (e.g. why order status changed from "Pending" to "Hold" to "Shipped"), developers must write complex audit triggers. Event Sourcing stores the events themselves as the source of truth, providing a complete historical ledger, time-travel capabilities, and flexible read model generation.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Slow Reads from Replay Latency (No Snapshots):** An entity (e.g. a shopping cart) has accumulated 10,000 events over a year. To load the current cart state, the application must query and replay all 10,000 events sequentially, causing page loads to take seconds.
- **Concurrent Write Collisions (No Concurrency Checks):** Two backend nodes attempt to modify the same user account concurrently. Both read version 5. Node A appends `UserEmailChanged` (version 6). Node B appends `UserPhoneChanged` (version 6). Without unique constraints on version sequences, both writes succeed, corrupting the event sequence.
- **Storage Out-of-Space from Payload Bloat:** Storing verbose, duplicated metadata inside every event JSON payload, saturating disk space on high-frequency tables.
- **Inability to Evolve Event Schemas:** Modifying the JSON payload format in new application releases, causing old event records to fail parser checks during replays.

## 4. Best Practices

- **Enforce a Structured Event Store Schema:** Design the event table using strict type definitions:
  - `event_store`: (global_sequence [BigInt PK], stream_id [UUID], stream_version [Int], event_type [Varchar], payload [JSONB], created_at)
- **Implement Optimistic Concurrency Constraints:** Configure a composite unique constraint on the stream identity and version columns:
  - *Constraint:* `UNIQUE (stream_id, stream_version)`
  - If two writes attempt to commit the same stream version, the database blocks the second write, forcing the application to retry.
- **Implement Snapshot Tables:** Create a separate `snapshot` table to store state checkpoints:
  - `snapshot`: (stream_id [PK], last_version [Int], state_payload [JSONB], updated_at)
- **Index for Fast Stream Retrievals:** Create an index on `(stream_id, stream_version)` to optimize stream query retrievals:
  - `SELECT * FROM event_store WHERE stream_id = :id AND stream_version > :snapshot_version ORDER BY stream_version ASC;`
- **Design Immutable schemas:** Never run DML update or delete queries on the `event_store` table. If an error is made, write a compensating event to correct the state.

## 5. Common Mistakes / Anti-Patterns

- **Direct Updates/Deletes on Events:** Modifying committed event rows to fix data entry bugs.
- **No Concurrency Checks:** Appending events without verifying the stream version, leading to divergent streams.
- **Synchronous Event Replays on Read Paths:** Querying the event table to rebuild state on every user request. Use pre-calculated read tables (projections) instead.
- **No Snapshotting:** Loading streams from version 1 on every read, slowing down performance as streams grow.

## 6. Security Considerations

- **Event Encryption (Crypto Shredding):** In event sourcing, deleting data for GDPR compliance is difficult because event stores are append-only. Use "Crypto Shredding": encrypt the sensitive event payloads using a unique tenant key. To delete a user's data, delete the decryption key, making the event payloads unreadable.

## 7. Performance Considerations

- **Sequential PK Allocation:** Use auto-incrementing BigInts or sequence numbers for `global_sequence` to prevent index fragmentation and ensure strict order sorting.

## 8. Scalability Considerations

- **Stream-Based Sharding:** Shard the event store across database servers using `stream_id` as the sharding key. This ensures all events for a single stream reside on the same physical database node, keeping write operations localized.

## 9. How Major Companies Implement It

- **Fintech Providers (Stripe/PayPal):** Store ledgers as immutable transaction events, ensuring auditability and preventing arbitrary database manipulations.
- **Lending/Credit Systems:** Build credit ledger states by replaying signed financial transaction streams, keeping snapshot balances updated.

## 10. Decision Checklist (Event Store Design)

Choose the event storage layout:

- Enforce **Immutable Event Store (Append-Only SQL/NoSQL)** when:
  - 100% auditable history of state modifications is required (financial logs, healthcare records).
  - Business features require temporal queries ("What did the user cart look like on Tuesday?").
  - The domain naturally fits event-driven triggers.
- Configure **Snapshotting** when:
  - Average stream length for active aggregates exceeds 50–100 events.
- Never use **Event Sourcing** when:
  - The application is a simple CRUD dashboard with low data complexity.
  - Data modifications are high-frequency but history is irrelevant (e.g. IoT telemetry sensors).

## 11. AI Coding-Agent Implementation Guidelines

- Never write schemas that allow updates or deletes on event tables.
- Always include a composite unique constraint on `(stream_id, stream_version)` in event store templates.
- Always provide matching snapshot schema configurations alongside event stores.
- Never recommend rebuilding state from raw event logs synchronously on user read paths.
- Always implement Crypto Shredding schemas for tables containing personal PII.

## 12. Reusable Checklist

- [ ] Event store table schema configured as append-only (no UPDATE/DELETE rights)
- [ ] Composite unique constraint active on `(stream_id, stream_version)` (OCC enabled)
- [ ] Index configured on `(stream_id, stream_version)` for stream retrievals
- [ ] Snapshot checkpoint table configured to store aggregated states
- [ ] Crypto Shredding (key encryption) active on event tables containing PII
- [ ] Primary keys for global sorting use sequential BigInt identifiers
- [ ] Event payloads versioned to support backward-compatible schema updates
- [ ] Read models (projections) updated asynchronously using CDC or event brokers
