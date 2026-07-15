# Apache Kafka Strategy

### 1. The Question Decided
"Should the system deploy Apache Kafka as an event stream broker, and how are partitions designed to handle high-throughput sequential events?"

### 2. Options Compared
| Dimension | Apache Kafka | RabbitMQ | AWS SQS |
|---|---|---|---|
| **Cost** | High (Requires cluster management) | Medium | Low |
| **Throughput** | Extremely High (Million msgs/sec) | High | High |
| **Retention** | Infinite (Configurable log retention) | Volatile | 14 days limit |
| **Model** | Pull (Consumer loops) | Push (Broker dispatches) | Pull (Short poll) |
| **Consumer group**| Scalable (Multiple readers read log) | Limited | Single reader per message |

### 3. Decision Rule
- **Choose Apache Kafka if:** The system requires real-time, high-volume event streaming (e.g. telemetry logs, Clickstream tracks, transactional audits) where message replay history and ordered, partitioned stream processing are necessary.
- **Avoid Apache Kafka if:** Workloads are low-throughput, or require complex wildcard routing rules (use RabbitMQ instead).

### 4. Red Flags to Revisit
- Consumer group offsets lag because partition count is too low, blocking concurrent processing scaling.
- Disk storage on Kafka brokers is exhausted because log retention periods are set to infinite without size caps.

### 5. Where to Go Next
- For configuring partition keys, consumer groups, log retention rules, and offset commits, see [Message Broker Architecture & Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/02-background-jobs-messaging.md).
