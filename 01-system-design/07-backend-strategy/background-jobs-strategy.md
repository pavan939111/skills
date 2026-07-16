# Background Jobs Strategy

### 1. The Question Decided
"How are background asynchronous tasks prioritized, queued, and processed, and how do we isolate worker threads from user APIs?"

### 2. Options Compared
| Dimension | In-Process Queues (e.g. Go channels) | Database Queues (e.g. pg-boss) | Dedicated Brokers (e.g. RabbitMQ, Redis BullMQ) |
|---|---|---|---|
| **Cost** | Extremely Low | Low | Medium |
| **Durability** | Low (Loss on crash) | High (ACID backed) | High |
| **Latency** | Extremely Low | Medium (Polling overhead) | Low |
| **Complexity** | Low | Low | Medium |
| **Scale Ceiling** | Low | Medium | Very High |

### 3. Decision Rule
- **Choose Dedicated Brokers if:** Tasks are high-volume, require robust retry limits, or need to run on physically isolated worker nodes.
- **Choose Database Queues if:** Task volumes are low (<100/sec) and keeping transaction boundaries inside a single database instance is preferred.

### 4. Red Flags to Revisit
- Application crashes result in lost transaction jobs because tasks were stored in volatile in-process memory channels.
- Database locks spike because too many worker processes repeatedly poll database queue tables.

### 5. Where to Go Next
- For implementing job publishers and queue decorators in backend service code, see [Job Queues Implementation](../../03-backend-development/11-background-processing/job-queues-implementation.md).
- For deep-dives into background job architecture, see Background Jobs and Messaging.
