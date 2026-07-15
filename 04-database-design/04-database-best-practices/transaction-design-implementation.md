# Transaction Design

## 1. Definition & Core Concepts

Transaction Design is the database discipline of structuring read/write operations into atomic execution blocks, managing database concurrency controls, and setting isolation levels to preserve ACID guarantees.

Core concepts:
- **ACID Transaction Boundaries:**
  - *Atomicity:* All mutations in the transaction succeed, or all roll back.
  - *Consistency:* The database transitions only between valid schema states.
  - *Isolation:* Dictates how concurrent transaction changes are visible to others.
  - *Durability:* Committed writes survive hardware failures (written to WAL).
- **Transaction Isolation Levels:**
  - *Read Uncommitted:* Permissive; allows dirty reads (reading uncommitted changes).
  - *Read Committed:* Default for many SQL engines. Prevents dirty reads, but permits non-repeatable reads.
  - *Repeatable Read:* Guarantees reads remain constant within the transaction, but permits phantom reads (detecting newly inserted rows) and write skew.
  - *Serializable:* Maximum isolation. Simulates serial execution, blocking all concurrency anomalies at the cost of execution speed.
- **Write Skew:** A concurrency anomaly where two concurrent transactions read overlapping state, modify different tables, and violate a global invariant (e.g., checking doctor shifts).
- **Savepoints (Nested Transactions):** Markers within a transaction allowing rollback of a subset of operations without aborting the entire transaction.

*(Boundary Note: Code-level transaction decorators (e.g., Spring `@Transactional`), connection pool libraries configuration, and application retry loops belong in `backend-development/`. This document covers database isolation levels, lock contention, WAL operations, and deadlock prevention.)*

## 2. Why It Exists / What Problem It Solves

When multiple application threads read and write to the same database tables concurrently, they interfere with each other. Without transaction controls, the database suffers from race conditions: user balances update incorrectly, inventory goes negative, or half-completed writes are saved during system crashes. Transaction design ensures that data updates execute safely, maintaining a consistent state.

## 3. What Breaks in Production Without It

- **Connection Pool Exhaustion from Network I/O:** Executing third-party API calls (e.g., charging a card via Stripe API) or heavy CPU calculations *inside* a database transaction block. The database connection remains open, locking rows and quickly exhausting the application's connection pool, crashing the backend.
- **Dirty Read Corruptions:** Reading uncommitted data from Transaction A. Transaction A subsequently rolls back, but Transaction B has already processed the invalid data, resulting in corrupted state.
- **Deadlock Outages:** Concurrent transactions locking rows in opposite orders (e.g. Tx 1 locks User A then User B; Tx 2 locks User B then User A). The queries block each other, causing the database to terminate threads and throw errors.
- **Write Skew Anomalies:** Two doctors request to leave a shift. The system requires at least one doctor active. Both threads read "2 active doctors" under Repeatable Read isolation, approve both leaves concurrently, and save, leaving zero active doctors.

## 4. Best Practices

- **Keep Transactions Extremely Short:** Perform calculations, validation, and network requests *before* opening the database transaction. Open the transaction, write the updates, and commit immediately.
- **Lock Rows in a Consistent Order:** Always update rows in a defined alphabetical or numerical order (e.g., always locking the smaller user ID first) to prevent deadlocks.
- **Use the Lowest Safe Isolation Level:** Default to **Read Committed** for standard CRUD applications. Use **Serializable** only when write skew or concurrency invariants must be blocked, and implement application-level retry loops for serialization failures.
- **Avoid Nested Transactions:** Use Savepoints sparingly. Nested transactions increase lock durations and make error tracing difficult.
- **Enforce Transaction Timeouts:** Configure a strict statement timeout limit on the database engine (e.g., `statement_timeout = 5000` ms) to force-abort runaway transactions that lock tables.

## 5. Common Mistakes / Anti-Patterns

- **API Calls Inside Transactions:** Placing network requests (HTTP client calls) inside a transaction block. If the API is slow, database locks remain open, freezing other users.
- **Massive Batch Transactions:** Running a migration or data import of 1 million rows in a single database transaction, bloating the transaction log (WAL) and locking the entire table. Split bulk writes into batches of 1,000 to 5,000 rows.
- **Overusing Serializable Isolation:** Setting the global isolation level to Serializable, causing frequent serialization check failures and slowing down transaction throughput.
- **Ignoring Deadlock Exceptions:** Failing to handle deadlock errors in database connection pools, leading to unhandled runtime failures.

## 6. Security Considerations

- **Denial of Service (DoS) via Lock Exhaustion:** Attackers calling API routes that trigger long transactions, locking critical tables and taking the application offline. Enforce short timeouts and rate-limit write queries.

## 7. Performance Considerations

- **Write-Ahead Log (WAL) Congestion:** Every database write is written sequentially to the WAL before being committed. Minimize the number of separate transactions by grouping bulk writes, reducing WAL sync latency.

## 8. Scalability Considerations

- **Distributed Transactions (Sagas):** Avoid distributed multi-node transactions (2PC - Two-Phase Commit) where possible because they require network locks across servers. Use the Saga Pattern (asynchronous, event-driven compensation steps) to maintain consistency across services.

## 9. How Major Companies Implement It

- **Stripe:** Enforces a strict policy that no external API calls or network requests can be executed inside transactional blocks, keeping database lock times under 50 milliseconds across billing clusters.
- **Uber:** Uses database savepoints and short transactions to manage passenger ride fare calculations, ensuring ledger records update atomically.

## 10. Decision Checklist (Isolation Level Selection)

Choose the transaction isolation level:

- Use **Read Committed** (Default) when:
  - Designing standard CRUD applications where reading slightly delayed but committed data is acceptable.
  - Write conflicts must be minimized.
- Use **Repeatable Read** when:
  - Running reports that execute multiple reads of the same rows within a single step and require consistent values (no non-repeatable reads).
- Use **Serializable** ONLY when:
  - Concurrency invariants must be strictly enforced (e.g., preventing double-booking or write skew anomalies).
  - You have implemented application-level retry logic to handle serialization failures.

## 11. AI Coding-Agent Implementation Guidelines

- Never place network requests, HTTP client calls, or slow file I/O inside database transaction blocks.
- Always lock rows in a consistent, defined order (e.g. sorting IDs ascending) to prevent deadlocks.
- Never run massive bulk updates in a single transaction — divide data writes into batches of 1,000 to 5,000.
- Always configure database statement and transaction timeouts.
- Never recommend Serializable isolation unless transaction retry logic is explicitly implemented.

## 12. Reusable Checklist

- [ ] All database transactions are designed to execute in under 100 milliseconds
- [ ] No network I/O, API client calls, or file reads exist inside transaction blocks
- [ ] Row locking order is consistent across all queries (deadlock prevention)
- [ ] Default isolation level set to Read Committed (unless write skew protection is required)
- [ ] Serialization failures (for Serializable/Repeatable Read) handled via client retries
- [ ] Statement and transaction timeouts configured on the database engine
- [ ] Large batch writes split into smaller, independent transactions (<5,000 rows)
- [ ] No nested transaction loops present in query scripts
