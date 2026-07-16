# RabbitMQ Strategy

### 1. The Question Decided
"Should the system deploy RabbitMQ as an AMQP message broker, and what routing keys or exchange patterns structure the queue topology?"

### 2. Options Compared
| Dimension | RabbitMQ (Smart Broker) | Apache Kafka (Log Stream) | AWS SQS (Simple Queue) |
|---|---|---|---|
| **Cost** | Medium | High | Low (Pay-per-use) |
| **Routing** | Complex (Direct/Topic/Headers exchanges) | Simple | Simple |
| **Data Retain**| Delivers & deletes | Retains log history | Deletes on ACK |
| **Scale Ceiling**| High (10k-50k msgs/sec) | Infinite | High |
| **Ordering** | Guaranteed per queue | Guaranteed per partition | Guaranteed in FIFO queues |

### 3. Decision Rule
- **Choose RabbitMQ if:** The system requires complex routing logic (e.g. routing messages to specific queues based on wildcards, headers, or multiple rules) and simple, transactional push-based task worker distributions.
- **Avoid RabbitMQ if:** The system requires long-term message replay history (use Kafka instead) or has low-throughput workloads where hosted queues (SQS) reduce infrastructure costs.

### 4. Red Flags to Revisit
- The RabbitMQ broker crashes because queues accumulate millions of un-acknowledged messages, saturating host memory (RAM).
- Worker processes block because the exchange routing rules are too complex, slowing down message dispatching.

### 5. Where to Go Next
- For configuring AMQP exchanges, routing keys, worker configurations, and retry schedules, see Message Broker Architecture & Implementation.
