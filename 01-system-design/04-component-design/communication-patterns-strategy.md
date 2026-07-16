# Communication Patterns

## 1. What Question This Answers
"What communication protocols and patterns (REST, gRPC, WebSockets, Message Queues) are used for service-to-service and client-to-service interactions, and how are sync vs. async boundaries defined?"

## 2. Why It Matters at the System-Design Stage
Selecting the wrong communication pattern is a major cause of latency and availability outages. If service interactions are synchronous (blocking HTTP calls) on high-throughput paths, a failure in one service halts the entire request chain. Defining communication patterns ensures that:
- Core user-facing writes are decoupled asynchronously using event brokers.
- Fast, internal RPC hops (gRPC) are used where synchronous reads are mandatory.
- WebSockets or Server-Sent Events (SSE) are configured for real-time channels.

## 3. Methodology / How to Work Through It
1. **Identify Synchronous Paths:** Locate read-only or transactional operations requiring immediate, consistent responses. Standardize on REST (simple, HTTP-based) or gRPC (binary, low latency).
2. **Identify Asynchronous Paths:** Locate write-heavy or long-running tasks. Standardize on publish-subscribe event streams (Kafka) or task queues (RabbitMQ).
3. **Establish Real-Time Channels:** Choose WebSockets (two-way communication) or Server-Sent Events (one-way server-to-client updates) if real-time push is required.
4. **Define Payload Formats:** Standardize serialization methods: JSON (human-readable, standard for public APIs) or Protocol Buffers/Avro (binary, schema-enforced, standard for internal RPC/event streams).
5. **Formulate the Communication Architecture:** Document the routing protocol for each service boundary.

## 4. Inputs Needed
- Latency budgets from Latency Requirements.
- Service boundaries maps.

## 5. Outputs Produced
- Feeds into [API Strategy](../../13-architecture-decision-records/index.md) and [Message Queue Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Notification & Delivery System)
- **Client to API Gateway:** HTTP/REST (JSON payload) for checkout writes and order reads.
- **Service to Service (Sync):** `OrderService` queries `CatalogService` via gRPC (Protocol Buffers) to keep internal network latency <5ms.
- **Service to Service (Async):** `OrderService` publishes `order.paid` event to RabbitMQ. `NotificationService` and `ShippingService` consume the event asynchronously, executing downstream tasks.
- **Service to Client (Real-time):** `NotificationService` pushes delivery status updates to the client app via Server-Sent Events (SSE).

## 7. Common Mistakes
- **HTTP Polling for Real-Time:** Using frequent HTTP pings from client apps to check for data updates, saturating database connections.
- **Synchronous Chains for Transactions:** Blocking checkout threads while calling slow external shipping APIs synchronously.
- **Unstructured JSON Event streams:** Streaming loose JSON payloads on event topics without schema validation, causing consumer parsing crashes during deployments.

## 8. AI Coding-Agent Guidelines
1. **Enforce Async for Writes:** Recommend message broker events for secondary, non-ACID write tasks.
2. **gRPC for Internal Reads:** Recommend gRPC over HTTP for synchronous service-to-service reads.
3. **Use SSE/WebSockets for Push:** Prevent HTTP polling; specify real-time push channels.
4. **Produce Communication Patterns Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Communication Protocols & Patterns: [System Name]

### 1. Protocol Selection Matrix
| Path / Connection | Interaction Style | Protocol | Serialization |
|---|---|---|---|
| **Client to API Gateway** | Synchronous Request | HTTP/REST | JSON |
| **Service to Service (Read)** | Synchronous RPC | gRPC | Protocol Buffers |
| **Service to Service (Write)** | Asynchronous Event | Pub/Sub (Kafka) | Apache Avro (Schema Registry) |
| **Server to Client (Alerts)** | Real-Time Push | Server-Sent Events | JSON |

### 2. Synchronous Latency SLA
- **gRPC Timeout Limit:** [e.g. Max 100ms timeout on internal RPC calls, followed by circuit breaker fallbacks.]
- **REST Gateway Timeout:** [e.g. Gateway drops connection after 5 seconds.]

### 3. Asynchronous Broker Safety
- **Schema Validation:** [e.g. Avro schemas enforced at Kafka gateway; schema registry monitors compatibility.]
- **Idempotency Strategy:** Every message payload includes a unique `event_id` GUID.
```
