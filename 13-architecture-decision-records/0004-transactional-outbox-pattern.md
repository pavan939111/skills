# ADR 0004: Transactional Outbox Pattern

*   **Status**: Accepted
*   **Date**: 2026-07-16
*   **Deciders**: Principal Architect, Systems Engineer

---

## 1. Context & Problem Statement

When an entity was updated in the database, the application code concurrently published an event to RabbitMQ. If the network dropped or the application crashed after writing to the database but before sending the event, the messaging broker was left out-of-sync, leading to data inconsistency across downstream microservices.

---

## 2. Decision

We will adopt the **Transactional Outbox Pattern**:
1.  **Atomicity**: Instead of publishing directly to the event broker, the application writes events to an `outbox_events` database table within the same transaction scope as the primary entity update.
2.  **Outbox Poller**: A separate outbox publisher service queries the `outbox_events` table, publishes the payloads to RabbitMQ, and marks them as `processed` upon receiving an acknowledgment.
3.  **Idempotent Receivers**: Downstream receivers must validate event UUIDs against an processed cache to discard duplicates.

---

## 3. Consequences

*   **Guaranteed Delivery**: Resolves out-of-sync anomalies. Events are guaranteed to be published at least once if the database write succeeds.
*   **Database Overhead**: Increases write volume on the primary database due to the outbox inserts and updates.
*   **At-Least-Once Delivery**: Downstream services must be designed to handle duplicate events safely.
