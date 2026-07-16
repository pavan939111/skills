# Sync vs. Async Trade-off Analysis

## 1. What Question This Answers
"When should service-to-service and client-to-service interactions be synchronous (blocking) vs. asynchronous (non-blocking), and what are the detailed architectural trade-offs?"

## 2. Why It Matters at the System-Design Stage
Synchronous calls (e.g., REST, gRPC) couple systems chronologically: if Service A calls B, Service B must be online and respond quickly, or Service A's connection thread hangs. Asynchronous calls (e.g. RabbitMQ, Kafka) decouple systems: Service A writes a message to a broker and returns immediately. Selecting the wrong interaction model can saturate threads, cause connection timeouts, and drop messages during downstream outages.

## 3. Methodology / How to Work Through It
1. **Analyze Consistency Requirements:** Does the caller need immediate confirmation of success (Sync - e.g., credit card charge confirmation), or is eventual consistency acceptable (Async - e.g., email notification)?
2. **Review Latency Budgets:** Does a synchronous call chain exceed the total P95 latency budget? If yes, decouple.
3. **Assess Service Availability Coupling:** Calculate availability:
   `Availability (Sync Chain) = Availability (Service A) x Availability (Service B) x Availability (Service C).`
   If the combined availability is too low, use asynchronous queues.
4. **Compare Operational Complexity:** Evaluate broker infrastructure costs.

## 4. Inputs Needed
- Latency budgets and SLA uptime targets from Latency Requirements.
- Workflow profiles.

## 5. Outputs Produced
- Feeds into Communication Patterns and [Message Queue Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Order Checkout Pipeline)
- **Synchronous Path (Required):**
  - *Action:* Validate user credentials, check inventory, and write pending order to SQL.
  - *Justification:* Requires real-time ACID transactions to prevent double-booking.
- **Asynchronous Path (Offloaded):**
  - *Action:* Charge card, notify shipping, generate PDF invoice, and email receipt.
  - *Justification:* These operations take seconds, involve third-party HTTP calls, and can run in background queues without blocking checkout.

## 7. Common Mistakes
- **Blocking API Thread on Emails:** Making synchronous HTTP calls to SendGrid/SES during user signup requests, causing page timeouts if the email API is slow.
- **Async for Reads:** Trying to make user profile page loads asynchronous, forcing complex UI polling structures for simple, low-latency reads.

## 8. AI Coding-Agent Guidelines
1. **Enforce Async for Writes:** Offload all secondary, non-blocking tasks to background workers.
2. **Set Connection Timeouts:** Ensure any mandatory synchronous call has strict, low timeouts.
3. **Produce Sync vs Async Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Synchronous vs. Asynchronous Analysis: [System Name]

### 1. Architectural Comparison
| Metric / Feature | Synchronous (REST/gRPC) | Asynchronous (Queue/CDC) |
|---|---|---|
| **Coupling** | High (Caller waits) | Low (Broker buffers) |
| **Response Latency** | Low (Immediate return) | High (Eventual processing) |
| **Availability Dependency**| High (Both systems must be online) | Low (Receiver can be offline) |
| **Consistency** | Strong Consistency | Eventual Consistency |
| **Transaction Pattern** | Database ACID transactions | Saga Orchestrations / Outbox |

### 2. Service Boundary Determinations
- **Path: [e.g., User Login]** $\rightarrow$ [Synchronous. Requires instant auth token generation.]
- **Path: [e.g. Invoice Emailing]** $\rightarrow$ [Asynchronous. Offloaded to SQS task queue to keep signup latency under 100ms.]
```
