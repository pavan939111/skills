# Event-Driven Architecture

## 1. What Question This Answers
"When and why should a system use an Event-Driven Architecture (EDA) style, and how do we design asynchronous, decoupled message channels between services?"

## 2. Why It Matters at the System-Design Stage
Synchronous architectures (HTTP/REST or gRPC) couple services: if Service A calls Service B, Service B must be online and respond quickly, or Service A's thread hangs. Event-Driven Architecture decouples services by introducing a message broker (e.g. Kafka, RabbitMQ). Service A merely publishes an event (e.g., `user.created`). Service B consumes it asynchronously. This improves write throughput, protects systems against cascading failures, and allows adding new downstream features with zero modifications to the primary publisher.

## 3. Methodology / How to Work Through It
1. **Identify Decoupling Targets:** Locate long-running or non-blocking tasks (email alerts, invoice generation, search index updates) that do not require immediate responses.
2. **Define Event Payloads:** Design clear, schema-versioned event payloads (e.g., using Avro or JSON schemas) to prevent consumer parsing errors.
3. **Select Message Brokers:** Choose between:
   - *Message Queues (RabbitMQ/SQS):* Best for simple task distribution and routing.
   - *Event Streams (Kafka/Kinesis):* Best for high-throughput, ordered log replay.
4. **Enforce Transactional Consistency (Outbox):** Prevent dual-write desynchronization by integrating outbox tables in publishing databases.
5. **Enforce Consumer Idempotency:** Ensure consumer logic handles duplicate messages safely.

## 4. Inputs Needed
- High-volume transaction write metrics and workload profiles from [Workload Analysis](../01-requirement-analysis/workload-analysis.md).
- Non-functional RTO/RPO limits.

## 5. Outputs Produced
- Feeds into [Message Queue Strategy](../../13-architecture-decision-records/index.md) and [Design Patterns](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Order Processing Pipeline)
- **Problem:** When an order is placed, the system must charge the card, update inventory, notify shipping, send an email, and update the search model. Running this synchronously causes checkout page timeouts.
- **Event-Driven Design:**
  - *Publish:* Checkout API writes order to SQL and inserts `order.placed` event to an outbox table.
  - *Broker:* Debezium CDC reads WAL, publishing the event to Kafka.
  - *Subscription:*
    - `BillingService` consumes the event, charges the card, and publishes `billing.succeeded`.
    - `EmailService` and `ShippingService` consume `billing.succeeded` in parallel, executing tasks asynchronously.
  - *Result:* Checkout completes in 30ms. If the email service goes down, orders are still processed; the email queue simply waits until the node recovers.

## 7. Common Mistakes
- **Assuming Instant Event Processing:** Designing client UIs that expect asynchronous event loops to complete instantly, leading to page reload errors.
- **Ignored Consumer Idempotency:** Failing to handle duplicate event dispatches, resulting in users being charged twice.
- **The Event Spaghetti:** Creating circular event loops (Service A publishes E1, B consumes and publishes E2, A consumes E2 and publishes E1), crashing the system.

## 8. AI Coding-Agent Guidelines
1. **Identify Async Tasks:** Recommend event-driven patterns for all secondary, non-blocking tasks.
2. **Enforce Outbox Patterns:** Never suggest direct message queue publishing inside business transaction blocks.
3. **Require Idempotence:** Ensure all event consumer templates use idempotent upsert keys.
4. **Produce Event-Driven Design page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Event-Driven Architecture (EDA) Design: [System Name]

### 1. Decoupled Event Streams & Roles
- **Publisher (e.g., Order Service):** Writes to primary tables and inserts event payload to outbox.
- **Message Broker:** [e.g. Apache Kafka (high throughput, partitioned ordering)]
- **Consumers:**
  - `ShippingService`: Subscribes to `order.paid` topic.
  - `SearchSyncService`: Subscribes to `order.paid` topic.

### 2. Transactional Event Publishing (Outbox)
- **Database Table:** `event_outbox` table handles local event commits.
- **Sync Pipeline:** CDC worker (Debezium) monitors the outbox table, streaming inserts to the broker.

### 3. Reliability & Idempotency Rules
- **Idempotency Key:** Every event contains a `uuid` field. Consumers verify `processed_events` before execution.
- **Dead Letter Queue (DLQ):** Messages failing validation or retries after 3 attempts are routed to `dlq_order_topic` for manual diagnostics.
```
