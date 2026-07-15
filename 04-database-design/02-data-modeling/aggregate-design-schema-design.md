# Aggregate Design

## 1. Definition & Core Concepts

Aggregate Design is the database practice of grouping related entities into transactional units called **Aggregates**, controlled by a single master entity known as the **Aggregate Root**. It defines consistency boundaries and transaction locks.

Core concepts:
- **Aggregate Root (AR):** The entry point entity of the aggregate cluster. External entities can only reference the AR's primary key; they cannot reference internal child entities directly.
- **Transaction Boundary:** The database scope where all mutations within the aggregate must succeed or fail together, protecting business invariants.
- **Optimistic Concurrency Control (OCC):** Resolving write conflicts using a version column (e.g., `version_id`) on the Aggregate Root, failing updates if the version has changed since it was read.
- **Pessimistic Concurrency Control:** Locking rows explicitly (`SELECT ... FOR UPDATE`) during a transaction to prevent concurrent processes from modifying the aggregate root.

*(Boundary Note: Code-level aggregate models, domain event dispatchers, and application lock managers belong in `backend-development/`. This document covers database-level transaction limits, locking SQL structures, and partition bounds.)*

## 2. Why It Exists / What Problem It Solves

If multiple concurrent requests modify related database rows (like adding items to an order while calculation runs), the system suffers from race conditions. Business constraints (invariants) get violated (e.g. booking more seats than are physically available). Aggregate design establishes the Aggregate Root table as the single transactional gatekeeper, locking the parent row to ensure all updates occur sequentially and atomically.

## 3. What Breaks in Production Without It

- **Race Condition Invariant Violations:** A bank account balance drops below zero because two concurrent threads read a `$100` balance and both withdraw `$90` simultaneously.
- **Deadlock Outages:** Concurrent transactions lock child tables in different orders (Transaction A locks `OrderItem` then `Order`; Transaction B locks `Order` then `OrderItem`), causing the database engine to abort queries and crash threads.
- **Bloated Transactions & Thread Starvation:** Wrapping multiple unrelated domain tables in a single massive database transaction, keeping database connection locks open too long and exhausting connection pools.
- **Dangling Orphans:** Deleting or orphan-updating a child row directly because it lacks database-level foreign key cascading links to the parent root.

## 4. Best Practices

- **Design Small Aggregates:** Keep aggregate boundaries as small as possible (ideally a root table and a few dependent child tables). Large aggregates increase transaction lock times and cause lock contention.
- **Use Optimistic Locking (OCC) by Default:** Add a `version` integer column to the Aggregate Root table. Write update statements that verify the version: `UPDATE orders SET status = 'paid', version = version + 1 WHERE id = :id AND version = :current_version`.
- **Use Pessimistic Locking for High Contention:** Use `SELECT FOR UPDATE` only when write contention is extremely high and retry overhead is costly. Ensure queries request locks in a consistent order.
- **Reference by ID Only Across Aggregates:** Never join or nest objects across different aggregates. Reference external aggregate roots using their primary key ID only, promoting loose coupling.
- **Enforce Referential Cascade Rules:** Configure `ON DELETE CASCADE` on child tables to ensure deleting the Aggregate Root purges all child records, protecting against orphan data.

## 5. Common Mistakes / Anti-Patterns

- **Bloated Aggregates:** Grouping unrelated entities into a single massive aggregate (e.g., making all user posts, comments, and settings children of a single `User` aggregate), leading to heavy lock conflicts.
- **Cross-Aggregate Synchronous Transactions:** Modifying three distinct aggregates in a single synchronous SQL transaction block, increasing lock duration. Use eventual consistency and message queues instead.
- **Bypassing the Root Key:** Executing direct `UPDATE` statements on child tables (like `order_items`) without modifying or updating the parent `orders` record.
- **No Versioning Control:** Omitting version tracking columns on tables that require concurrent safety checks, letting the last write win silently.

## 6. Security Considerations

- **Lock Exhaustion Attacks:** Attackers trigger slow, pessimistic-locking queries repeatedly to exhaust database threads. Prevent this by enforcing short query timeouts and avoiding pessimistic locks where possible.

## 7. Performance Considerations

- **Optimistic Retry Overhead:** In high-concurrency environments, optimistic locking can trigger frequent retry loops in application code. Profile the collision rates; if write conflict rates exceed 10%, consider partition key splitting or pessimistic locking.

## 8. Scalability Considerations

- **Distributed Database Partitioning:** Align aggregate boundaries with database partitioning keys. Ensure all data within an aggregate is stored on the same physical database node to avoid slow, distributed cross-node transactions.

## 9. How Major Companies Implement It

- **Stripe:** Implements strict version-based optimistic locking on ledger accounts. Payouts and charges must match the current ledger version ID, preventing duplicate balance mutations.
- **Amazon:** Groups orders and items into isolated DynamoDB documents (aggregates), ensuring that checkout transactions execute atomically on single database partitions.

## 10. Decision Checklist (when to use / when NOT to use)

- Define an **Aggregate Boundary** when:
  - Business rules demand immediate transactional consistency across multiple rows (invariants).
  - Child records cannot exist without the parent root.
- Use **Optimistic Concurrency Control (OCC)** when:
  - Read volume is high, and write collisions are infrequent (low contention).
- Use **Pessimistic Locking (SELECT FOR UPDATE)** when:
  - Write contention is high, and failing transactions requires expensive recalculations.

## 11. AI Coding-Agent Implementation Guidelines

- Always add a `version` column to tables defined as Aggregate Roots.
- Never write DML statements that update child records without updating or locking the parent Aggregate Root.
- Always wrap mutations targeting a single aggregate in atomic transaction blocks.
- Never execute multi-aggregate updates in a single synchronous database transaction — use event-driven CDC sync instead.
- Always configure foreign keys of child tables with `ON DELETE CASCADE` linked to the aggregate root.

## 12. Reusable Checklist

- [ ] Aggregate Root table identified with a dedicated `version` or update-timestamp column
- [ ] Child tables configure `ON DELETE CASCADE` linked to the Aggregate Root
- [ ] Optimistic locking (`WHERE version = :current_version`) implemented on update paths
- [ ] Transaction boundaries cover only a single aggregate (no multi-aggregate locks)
- [ ] Cross-aggregate references use IDs only (no database-level cross-aggregate joins)
- [ ] Locking queries (`SELECT FOR UPDATE`) request locks in a consistent, defined table order
- [ ] Transactions are kept short to prevent connection pool starvation
- [ ] No direct updates allowed on child tables bypassing the root record
