# Durable Workflows

## 1. Definition & Core Concepts
Durable Workflows are execution routines that automatically persist state transitions, variable maps, and execution progress to database tables, allowing workflows to survive system failures and resume from checkpoint states.

## 2. Why It Exists / What Problem It Solves
Multi-step agent tasks take minutes or hours. Durable workflows prevent thread crashes from wiping active state maps, ensuring tasks resume from checkpoints and avoiding expensive redundant LLM API runs.

## 3. What Breaks in Production Without It
- **Memory Loss on Crashes:** A server crash wipes the memory of an active 10-step agent loop, forcing a restart and wasting API costs.
- **Accidental Repeat Mutations:** Resuming agents rerun write tools twice, creating duplicate transactions.
- **Race conditions:** Concurrent processes updating the same state variables, corrupting logs.

## 4. Best Practices
- **Implement State Checkpointing:** Save workflow snapshots before and after every tool run.
- **Use lock tags:** Enforce database row locks to prevent concurrent worker nodes from running the same loop.
- **Standardize state validation:** Enforce strict JSON schemas on workflow states using libraries like Zod.

## 5. Common Mistakes / Anti-Patterns
- **In-Memory states:** Storing workflow step details inside node memory arrays, causing data loss on server restarts.
- **Vague state transitions:** Moving states directly from `running` to `completed` without registering tool responses.

## 6. Security Considerations
- **Audit Trails:** Maintain immutable audit logs of all state changes for security reviews.

## 7. Performance Considerations
- **Parallel state lookups:** Optimize database connection pools to keep state updates fast.

## 8. Scalability Considerations
- **State Partitioning:** Partition state tables by tenant or date to maintain performance at scale.

## 9. How Major Companies Implement It
- **Temporal:** Uses event-sourcing structures to maintain workflow states, allowing runs to resume across nodes.
- **LangGraph:** Implements built-in state saver databases to checkpoint agent runs.

## 10. Decision Checklist (State Storage)
- Use **Relational Database (PostgreSql/MySQL)** when:
  - Workflows are transactional, require durability, and have strict auditing requirements.
- Use **Redis State Storage** when:
  - High QPS updates are required, and data is volatile.

## 11. AI Coding-Agent Guidelines
- Always implement state transition schemas (`pending` $\rightarrow$ `running` $\rightarrow$ `completed`/`failed`) in database tables before writing execution code.

## 12. Reusable Checklist
- [ ] Workflow state stored in out-of-process databases (Postgres/MySQL)
- [ ] Checkpoint snapshots saved before and after every tool run
- [ ] Immutable audit tables record state transitions histories
- [ ] Database row locks active to prevent concurrent executions
- [ ] State schema schema-validation active
- [ ] Automated recovery tests verify loop resumptions from checkpoints
