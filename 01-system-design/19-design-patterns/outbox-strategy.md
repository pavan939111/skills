# Transactional Outbox Strategy

### 1. The Question Decided
"How does the system publish events to external brokers reliably, ensuring that database updates and message publishing succeed or fail together?"

### 2. Options Compared
| Dimension | Dual Write (Write DB + Publish Queue) | Transactional Outbox (Write DB outbox) |
|---|---|---|
| **Data Consistency**| Low (Network drop loses event) | Extremely High (ACID transaction) |
| **Complexity** | Low | High (Requires CDC engine/Debezium) |
| **Broker Load** | Low | Low |
| **Write Latency** | Low | Low (Single local write) |

### 3. Decision Rule
- **Standardize on Transactional Outbox if:** Operating microservices or event-driven ingestion paths where database updates (e.g. order creation) must guarantee corresponding event execution (e.g. sending receipt) without data loss.
- **Avoid Outbox if:** Event delivery does not require strict transactional consistency (e.g. tracking clicks).

### 4. Red Flags to Revisit
- A database transaction succeeds, but downstream email systems never trigger because the server network dropped the queue publish request (dual write failure).
- The outbox table grows continuously, saturating disk space because the background CDC processor stopped reading events.

### 5. Where to Go Next
- For setting up outbox tables, publisher polling schemas, and CDC engine adapters (Debezium), see Transactional Outbox Database Design.
- For tracing event chronologies, see Event Flow Design.
