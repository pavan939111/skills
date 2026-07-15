# Outbox Pattern Implementation

## 1. Definition & Core Concepts
The Transactional Outbox Pattern ensures reliable message publishing by saving both domain entity updates and event messages to the same database inside a single transaction, publishing events via a secondary log miner or polling publisher.

## 2. Why It Exists / What Problem It Solves
If a service saves data to a database and then publishes a message to a broker, a broker network failure leaves the database updated but no event sent. If the broker is called first, a database error creates a phantom message. Outbox guarantees exactly-once/at-least-once delivery.

## 3. What Breaks in Production Without It
- **Data Inconsistencies:** Downstream notification or billing services miss events because the message broker was offline during database commits.

## 4. Best Practices
- **Write to local Outbox Table:** Save outgoing event payloads in a dedicated outbox table inside the same transaction as entity changes.
- **Deploy decoupled publishers:** Run an independent process (like Debezium or a polling worker) to read, publish, and delete outbox rows.
- **Track published status:** Mark rows as processed only after the event broker confirms receipt.

## 5. Common Mistakes / Anti-Patterns
- **Polling databases too frequently:** Flooding the primary database with frequent poll queries. Use database change data capture (CDC) where possible.
- **Skipping indexes:** Querying outbox tables without index configurations on status and timestamp columns.

## 6. Security Considerations
- **Event Encryption:** Encrypt sensitive payload properties before saving them to the outbox database.

## 7. Performance Considerations
- **Fast Pruning:** Delete or archive processed outbox rows regularly to keep table sizes small.

## 8. Scalability Considerations
- **Distributed outbox workers:** Scale polling workers using distributed lock strategies to avoid duplicate sends.

## 9. How Major Companies Implement It
- **LinkedIn / eBay:** Rely on Change Data Capture (CDC) readers to stream database transaction logs (outbox logs) to Kafka clusters instantly.

## 10. Decision Checklist (Outbox Usage)
- Use **Transactional Outbox** when:
  - You must guarantee that database updates and message publishes execute reliably together (at-least-once delivery is required).
- Use **Direct Publish** when:
  - Message drops are acceptable (e.g. non-critical analytical metrics tracking).

## 11. AI Coding-Agent Guidelines
- Write database query methods that include insert statements to the outbox table inside entity transaction scopes.

## 12. Reusable Checklist
- [ ] Event payload saved to outbox table inside active entity transactions
- [ ] Decoupled outbox worker reads, publishes, and prunes event logs
- [ ] Event status marked as processed only after broker ack confirmations
- [ ] Database indexes active on outbox status and timestamp columns
- [ ] Processed outbox rows pruned periodically to keep tables clean
- [ ] Verification tests simulate broker outages to check outbox queuing
