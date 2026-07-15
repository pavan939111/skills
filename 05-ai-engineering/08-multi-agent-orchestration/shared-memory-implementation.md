# Shared Memory inside Multi-Agent Systems

## 1. Definition & Core Concepts
Shared Memory is the centralized state store (e.g. database rows, key-value stores) accessible by all agents in a multi-agent system, allowing them to read and write execution variables, planning states, and session history logs.

## 2. Why It Exists / What Problem It Solves
Agents in a swarm or crew need access to the same context. Shared memory prevents "siloing," ensuring that if Agent A extracts user details, Agent B can read those details from the shared memory without re-running tools.

## 3. What Breaks in Production Without It
- **Context Drift:** Agent B makes assumptions that contradict facts Agent A already established.
- **Race conditions:** Two agents overwrite the same session variables concurrently, corrupting state maps.
- **Runaway token usage:** Each agent executes the same database queries to fetch context, wasting tokens.

## 4. Best Practices
- **Store state out-of-process:** Use PostgreSQL or Redis to host shared contexts.
- **Implement Row Locking:** Enforce database transactions constraints to prevent write race conditions.
- **Verify data type formats:** Use strict JSON schemas to validate memory writes.

## 5. Common Mistakes / Anti-Patterns
- **In-memory dictionary sharing:** Passing local memory objects between agent threads, risking data loss on thread crashes.
- **Unstructured text blocks:** Writing all shared variables to a raw text string, causing parsing errors.

## 6. Security Considerations
- **Scope Isolation:** Ensure agents only write to memory slots they are authorized to access.

## 7. Performance Considerations
- **Connection pooling:** Use connection pooling for Redis session stores to keep lookup latency under 5ms.

## 8. Scalability Considerations
- **Data retention:** Auto-expire volatile shared memory spaces after task completion.

## 9. How Major Companies Implement It
- **Temporal:** Maintains durable execution states accessible by all workflow workers.
- **CrewAI:** Implements shared short-term and long-term memory registries across crew agents.

## 10. Decision Checklist (Memory Architectures)
- Use **Relational Database (PostgreSql)** when:
  - Memory variables are relational, persistent, and require ACID consistency.
- Use **Redis Key-Value Store** when:
  - Volatile, high-frequency updates are required.

## 11. AI Coding-Agent Guidelines
- Never share mutable state variables in local server memory; always read and write via database locks.

## 12. Reusable Checklist
- [ ] Shared memory store deployed out-of-process (Postgres/Redis)
- [ ] Database transaction locks active on write paths
- [ ] Message schema validations active on memory updates
- [ ] Memory namespaces isolated by session/tenant ID
- [ ] Data retention TTL rules set for volatile states
- [ ] Automated recovery tests verify memory access under concurrency
