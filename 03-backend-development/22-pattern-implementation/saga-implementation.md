# Saga Pattern Implementation

## 1. Definition & Core Concepts
The Saga Pattern coordinates a sequence of local transactions across multiple microservices to complete a business workflow, rolling back transactions using compensating actions on failures.

## 2. Why It Exists / What Problem It Solves
In microservices, databases are isolated. Traditional two-phase commits (2PC) do not scale over networks. Sagas maintain eventual consistency across service databases without locking tables.

## 3. What Breaks in Production Without It
- **Orphaned Transactions:** A payment service charges a user, but order creation fails downstream, leaving the customer charged.

## 4. Best Practices
- **Use Orchestrator Sagas:** Deploy a central coordinator worker (like Temporal) to manage states and compensating steps.
- **Design Compensating Actions:** Ensure every step has an undo action (e.g. step: "charge card", compensating action: "refund card").
- **Enforce Idempotency:** Ensure all task handlers (Activities) can be retried safely.

## 5. Common Mistakes / Anti-Patterns
- **Cyclic dependecies in Choreographies:** Letting services trigger each other with events without coordination, creating loop states.

## 6. Security Considerations
- **Audit Trails:** Log all saga state changes and payloads in secure, persistent databases.

## 7. Performance Considerations
- **Asynchronous Execution:** Run saga steps asynchronously using event brokers.

## 8. Scalability Considerations
- **Eventual Consistency:** Accept minor sync delays, avoiding blocking client requests during processing.

## 9. How Major Companies Implement It
- **Uber / Airbnb:** Coordinate booking and billing pipelines across services using orchestrator sagas.

## 10. Decision Checklist (Saga Selection)
- Use **Sagas (Orchestrator)** when:
  - Completing multi-service workflows that require eventual consistency and compensating rollbacks.
- Use **ACID Transactions** when:
  - Modifying multiple tables inside a single relational database.

## 11. AI Coding-Agent Guidelines
- Write saga definition structures that map each execution step to its corresponding compensating rollback handler.

## 12. Reusable Checklist
- [ ] Saga coordination pattern selected (Orchestrator preferred)
- [ ] Compensating rollback actions defined for every execution step
- [ ] Task handlers designed to handle retries idempotently
- [ ] Eventual consistency latency limits monitored across services
- [ ] Saga execution states logged in persistent databases
- [ ] Outages simulated to verify compensating rollbacks run successfully
