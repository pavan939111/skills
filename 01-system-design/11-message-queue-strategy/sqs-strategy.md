# AWS SQS Strategy

### 1. The Question Decided
"Should the system deploy AWS SQS as a hosted queue, and what concurrency limits or timeout parameters control queue processing?"

### 2. Options Compared
| Dimension | AWS SQS (Standard) | AWS SQS (FIFO) | RabbitMQ |
|---|---|---|---|
| **Cost** | Extremely Low (Pay-per-use) | Low-Medium | Medium (Dedicated hosting) |
| **Throughput** | Infinite | Capped (3,000/sec with batching) | High |
| **Ordering** | Best-effort (No ordering guarantee)| Strict ordering | Guaranteed per queue |
| **Delivery** | At-least-once (Duplicates possible) | Exactly-once | At-least-once |
| **Complexity** | Extremely Low (Serverless) | Low | Medium |

### 3. Decision Rule
- **Choose AWS SQS (Standard) if:** Working in AWS, task ordering is not critical, and we want a zero-maintenance, serverless queue that auto-scales to infinity.
- **Choose AWS SQS (FIFO) if:** Task execution must follow strict ordering (e.g. processing transactions in order) and throughput stays under 3,000 requests/second.

### 4. Red Flags to Revisit
- Workers double-process transaction logs because standard SQS does not guarantee exactly-once delivery, and consumer code lacks idempotency guards.
- Message processing delays occur because the visibility timeout limit is set shorter than the actual task execution time, causing SQS to dispatch tasks to a second worker before the first completes.

### 5. Where to Go Next
- For configuring queue parameters, dead letter thresholds, and visibility timeouts, see Message Broker Architecture & Implementation.
