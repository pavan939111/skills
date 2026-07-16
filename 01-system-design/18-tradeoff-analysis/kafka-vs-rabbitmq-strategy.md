# Kafka vs. RabbitMQ Trade-off Analysis

## 1. What Question This Answers
"Should the system deploy Apache Kafka or RabbitMQ as the primary asynchronous message broker, and what are the detailed architectural trade-offs?"

## 2. Why It Matters at the System-Design Stage
Selecting the wrong broker class introduces severe performance and maintenance costs. RabbitMQ is a "smart broker" optimized for complex, routing-heavy task distributions (AMQP) to transient workers, deleting messages post-ACK. Apache Kafka is a partitioned, append-only log stream broker optimized for high-throughput streaming events, allowing multiple consumers to replay logs independently. Choosing incorrectly can limit throughput or complicate routing topology.

## 3. Methodology / How to Work Through It
1. **Analyze Messaging Style:** Is the workflow event streaming (Kafka - require ordered logs history) or task queuing (RabbitMQ - requires complex routing)?
2. **Size Throughput Targets:** Will event volume exceed 50,000 messages/second? If yes, select Kafka.
3. **Compare Routing Needs:** Does the sender need dynamic routing keys (RabbitMQ exchanges), or is simple topic partitioning sufficient (Kafka)?
4. **Evaluate Data Retention:** Does the system need to replay historical messages to rebuild states (Kafka)?
5. **Compare Operational Costs:** Evaluate hosting overhead.

## 4. Inputs Needed
- Peak write throughput and data retention needs from [Workload Analysis](../01-requirement-analysis/workload-analysis.md).
- System availability requirements.

## 5. Outputs Produced
- Feeds directly into Message Queue Strategy Selection.

## 6. Worked Example (User Event Tracker vs. Order Delivery Notifications)
- **User Clickstream Tracker (Kafka Choice):**
  - *Context:* 10,000 telemetry events/second. Data must be ingested, formatted, and written to ClickHouse analytics stores. Events must be ordered by session ID.
  - *Decision:* Apache Kafka (high-throughput, partitioned log).
- **Order Delivery System (RabbitMQ Choice):**
  - *Context:* Low throughput. Orders must be routed dynamically to specific shipping carriers based on zipcode wildcards, retried on failures, and deleted upon receipt.
  - *Decision:* RabbitMQ (AMQP exchange routing).

## 7. Common Mistakes
- **Kafka for simple background tasks:** Setting up a multi-node Kafka cluster to distribute a few hundred email alerts daily, wasting infrastructure budget.
- **RabbitMQ as a Log Store:** Trying to store and query historical messaging logs inside RabbitMQ, saturating RAM and crashing the broker node.

## 8. AI Coding-Agent Guidelines
1. **Verify Throughput Triggers:** Only recommend Kafka if event streams require ordered history or throughput >15k messages/second.
2. **Enforce Idle memory check:** Recommend hosted SQS or RabbitMQ for standard, low-throughput worker pipelines.
3. **Produce Broker Comparison Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Kafka vs. RabbitMQ Trade-off Assessment: [System Name]

### 1. Comparative Analysis
| Metric / Feature | Apache Kafka (Log Stream) | RabbitMQ (Smart Broker) |
|---|---|---|
| **Interaction Model** | Pull-based (Log cursor reads) | Push-based (Exchange dispatches) |
| **Throughput Ceiling**| Extremely High (Million/sec) | High (50k/sec limit) |
| **Data Retention** | Configurable, persistent log | Ephemeral (Deleted on ACK) |
| **Routing Flexibility**| Simple topic mapping | Advanced exchanges (Direct, Topic) |
| **Ordering** | Guaranteed per partition | Guaranteed per queue |

### 2. Selection Recommendation
- **Target Selection:** [e.g. RabbitMQ]
- **Justification:** [e.g., Low-throughput billing notifications require advanced wildcard exchange routing to different vendor adapters; no message history replay needed.]
```
