# Pub/Sub Messaging Strategy

### 1. The Question Decided
"Should the system adopt a Publish-Subscribe (Pub/Sub) messaging model, and how do we manage message fan-out across multiple services?"

### 2. Options Compared
| Dimension | Publish-Subscribe (SNS/PubSub) | Point-to-Point (Queue) | Request-Response (RPC) |
|---|---|---|---|
| **Topologies** | One-to-Many (Fan-out) | One-to-One | One-to-One |
| **Coupling** | Extremely Low (Publisher ignores readers) | Low | High (Sender blocks) |
| **Latency** | Low (Async delivery) | Low (Async) | High (Sync waiting) |
| **Complexity** | Medium | Low | Low |

### 3. Decision Rule
- **Choose Pub/Sub if:** A single application event (e.g. `order.paid`) must trigger actions across multiple independent systems (e.g., Shipping, Invoicing, Analytics) simultaneously.
- **Avoid Pub/Sub if:** Operations are sequential and require coordinated transactional rollback (use Saga Orchestrators instead).

### 4. Red Flags to Revisit
- Adding a new consumer service requires changing the publishing code, violating the Open-Closed principle.
- Messages are lost because a subscription queue was configured after events were published (missing history).

### 5. Where to Go Next
- For implementing pub/sub publishers and consumers in backend logic, see Message Broker Architecture & Implementation.
