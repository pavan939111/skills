# Foreign Keys

## 1. Definition & Core Concepts

A Foreign Key (FK) is a database constraint that establishes and enforces a link between data in two tables. It ensures that a value in a column (or combination of columns) matches a value in the primary key or unique index of another table.

Core concepts:
- **Referential Integrity:** The structural guarantee that a link from a child row to a parent row always points to a valid, existing parent record.
- **Referential Actions:** Rules that define what happens to child rows when a parent row is updated or deleted:
  - `ON DELETE CASCADE:` Automatically deletes child rows when the parent row is deleted.
  - `ON DELETE RESTRICT:` Prevents deleting the parent row if any child rows reference it.
  - `ON DELETE SET NULL:` Sets the child's foreign key column to NULL when the parent row is deleted (requires column nullability).
  - `ON DELETE NO ACTION:` Behaves like RESTRICT, but validations can be deferred to the end of the transaction.
- **Deferred Constraints:** A setting (in engines like PostgreSQL) allowing foreign key checks to be delayed until the transaction commits, rather than checking instantly on every write.

*(Boundary Note: Code-level relationship properties (e.g. ORM `@ManyToOne` bindings) and cascading application rules belong in `backend-development/`. This document covers database-level constraints, index requirements, and referential actions.)*

## 2. Why It Exists / What Problem It Solves

Foreign keys prevent database decay. Without database-level foreign keys, there is no enforcement of links. A buggy application loop could write an order with a non-existent `customer_id`, or delete a user account while leaving its permissions and billing records behind. Foreign keys ensure referential integrity is guaranteed by the database engine itself.

## 3. What Breaks in Production Without It

- **Orphan Records (Data Decay):** Deleting a user profile but leaving their transaction logs, billing addresses, and permission rows behind, creating zombie data that corrupts reports and wastes disk space.
- **Join Query Mismatch Failures:** Queries joining tables throw empty sets or null values unexpectedly because child rows point to invalid parent IDs.
- **Cascading Locking Deadlocks:** Executing deletes on parent rows with thousands of children (like a tenant deletion). If referential actions are unindexed or unchecked, the database locks entire child tables, causing transactional deadlocks under concurrent traffic.
- **Index Scans on Deletes:** If a child table's foreign key column is not indexed, deleting a row from the parent table forces the database to perform a slow full-table scan on the child table to verify no references exist.

## 4. Best Practices

- **Always Index Foreign Key Columns:** The database engine must search the child table whenever a parent record is deleted or updated. Every foreign key column must have an index to prevent slow sequential table scans.
- **Define Explicit Referential Actions:** Never rely on default delete rules. Always write explicit rules (e.g. `ON DELETE RESTRICT` or `ON DELETE CASCADE`) to clarify schema behavior.
- **Match Data Types Exactly:** Ensure the foreign key column has the exact same data type, precision, and sign (unsigned vs signed) as the target primary key. Inconsistent types trigger compilation failures or database conversion overhead.
- **Use CASCADE for Dependent Child Entities:** Use `ON DELETE CASCADE` for weak entities that have no logical existence without the parent (e.g. order items on an order).
- **Use RESTRICT for Core Business Entities:** Protect critical domain objects (e.g. users, accounts, invoices) using `ON DELETE RESTRICT` to prevent accidental mass deletions.

## 5. Common Mistakes / Anti-Patterns

- **Omitting Constraints for "Speed":** Disabling database-level foreign key constraints to speed up write operations, inevitably leading to data corruption and orphaned records over time.
- **Unindexed Foreign Keys:** Leaving foreign key columns unindexed, causing query slowdowns and lock contention during joins and updates.
- **Polymorphic Foreign Keys:** Attempting to point a foreign key column to different tables depending on a type string. Database engines do not support this, rendering referential integrity check rules impossible.
- **Mismatched Column Types:** Defining a primary key as `BIGINT` and the foreign key as `INT`, leading to key range conversion failures.

## 6. Security Considerations

- **Authorization Scope Enforcement:** Ensure that delete cascades do not bypass security logs or compliance trails. Audit logs and financial ledgers must never use `ON DELETE CASCADE`. Use `ON DELETE RESTRICT` to enforce soft-delete or manual archival requirements.

## 7. Performance Considerations

- **Write Verification Cost:** Every insert or update on a foreign key column requires the database to verify that the parent ID exists. While this index lookup has negligible cost, keep foreign key indexes in RAM to ensure sub-millisecond writes.

## 8. Scalability Considerations

- **Distributed Database Constraints:** In horizontally sharded databases, verifying a foreign key constraint requires the engine to perform expensive cross-node network lookups. As a result, distributed databases (like Vitess or Cassandra) do not support database-level foreign key constraints. In these systems, referential integrity must be managed in the application layer.

## 9. How Major Companies Implement It

- **Stripe:** Enforces database-level foreign key constraints across their primary PostgreSQL transactional shards, ensuring ledger integrity while using application-tier validations for cross-shard operations.
- **GitHub:** Uses index-backed foreign keys for relational mappings, configuring explicit cascading rules to ensure deleting a repository cleanly purges permissions and stars.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Database-Level Foreign Keys** when:
  - Working in standard relational databases (PostgreSQL, MySQL, SQL Server).
  - Data integrity and referential safety are critical requirements.
  - Tables are located within the same database engine and shard.
- Skip Database-Level Foreign Keys ONLY when:
  - Operating distributed, horizontally sharded, or NoSQL databases where cross-node constraints are unsupported or degrade write performance.
  - Designing decoupled microservices that communicate exclusively via APIs.

## 11. AI Coding-Agent Implementation Guidelines

- Always write DDL schema configurations containing explicit database-level Foreign Key constraints.
- Never write foreign key declarations without defining an accompanying index on the child column.
- Always declare explicit referential delete actions (`ON DELETE RESTRICT` or `ON DELETE CASCADE`).
- Never use `ON DELETE CASCADE` for security logs, financial ledgers, or compliance-critical entities.
- Always ensure column data types match exactly between the parent PK and child FK.

## 12. Reusable Checklist

- [ ] Foreign Key constraints declared at the database engine level
- [ ] Corresponding index created on every foreign key column
- [ ] Referential action (e.g. `ON DELETE RESTRICT`, `ON DELETE CASCADE`) explicitly defined
- [ ] Column data types match target primary keys exactly
- [ ] Compliance/financial tables protected using `RESTRICT` delete rules
- [ ] Optional relationships configure nullable foreign key columns with `ON DELETE SET NULL`
- [ ] No polymorphic foreign key patterns used in the database schema
- [ ] Constraints deferred (`DEFERRABLE INITIALLY DEFERRED`) only when bulk inserts require it
