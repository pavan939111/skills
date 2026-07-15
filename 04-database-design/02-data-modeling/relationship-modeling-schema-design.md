# Relationship Modeling

## 1. Definition & Core Concepts

Relationship Modeling is the practice of defining, mapping, and implementing the logical connections between different database entities (tables) using keys and constraints.

Core concepts:
- **One-to-One (1:1):** Each row in Table A connects to exactly one row in Table B (implemented via a Foreign Key in Table B with a UNIQUE constraint).
- **One-to-Many (1:N):** A single row in Table A connects to multiple rows in Table B (implemented via a Foreign Key in Table B pointing to Table A's Primary Key).
- **Many-to-Many (M:N):** Multiple rows in Table A connect to multiple rows in Table B (implemented via a **Junction/Association Table** containing two Foreign Keys).
- **Self-Referential (Recursive) Relationship:** An entity referencing itself (e.g., `Employee` table containing a `manager_id` foreign key referencing `employee_id`).
- **Identifying vs. Non-Identifying:**
  - *Identifying:* The child entity cannot exist without the parent, and the parent's PK is part of the child's PK (e.g., `OrderItem`).
  - *Non-Identifying:* The connection is optional or independent; the child has its own PK (e.g. `User` and `Workspace`).

*(Boundary Note: Code-level relationship associations (e.g., ORM `@OneToMany` or `@ManyToMany` annotations) are out of scope. This document covers database-level constraints, junction tables, and referential integrity configuration.)*

## 2. Why It Exists / What Problem It Solves

Entities do not exist in isolation; they interact. Relationship modeling translates business connections (e.g. "a customer places an order") into database-level foreign key constraints. This ensures data consistency, prevents orphaned records, and allows the query optimizer to plan efficient table join execution paths.

## 3. What Breaks in Production Without It

- **Orphaned Records:** Deleting a parent row (e.g. `User`) without updating or deleting the child rows (e.g., `UserPermissions`), leaving corrupted records in the database.
- **Index Scans on Joins:** Performing joins on tables where the foreign key columns lack indexes, causing database queries to lock up due to full table scans.
- **JSON List Splitting Failures:** Storing arrays of foreign IDs inside a single text field (e.g., storing `[1, 2, 3]` inside an `order_ids` string column). This makes joining tables impossible, breaks search indexes, and prevents database-level validation.
- **Relational Integrity Bypass:** Allowing child rows to reference non-existent parent IDs because foreign key constraints were omitted in favor of "application-level checks".

## 4. Best Practices

- **Always Index Foreign Keys:** Every column defined as a Foreign Key must have a database index to prevent slow nested-loop scans during joins.
- **Model M:N via Junction Tables:** Always use a dedicated association table with composite primary keys `(table_a_id, table_b_id)` to map Many-to-Many relationships. Never store comma-separated lists of IDs.
- **Apply UNIQUE on 1:1 Keys:** Enforce one-to-one constraints by placing a `UNIQUE` constraint on the foreign key column.
- **Configure Explicit Referential Actions:** Define what happens when a parent row is deleted or updated using constraints:
  - Use `ON DELETE CASCADE` for identifying relationships (e.g., delete order items if the order is deleted).
  - Use `ON DELETE RESTRICT` or `ON DELETE NO ACTION` to block deletion if child rows exist (e.g., block deleting a customer if they have active invoices).
  - Use `ON DELETE SET NULL` for optional connections.
- **Prevent Polymorphic Associations:** Avoid using polymorphic foreign keys (e.g. a `comments` table with `commentable_id` and `commentable_type` columns). This breaks database-level referential integrity. Use distinct junction tables instead.

## 5. Common Mistakes / Anti-Patterns

- **Comma-Separated ID Arrays:** Storing related keys as string lists in SQL columns, preventing index utilization and data integrity verification.
- **Polymorphic Foreign Keys:** Attempting to make a single foreign key column reference different tables dynamically depending on a type column, rendering database-level foreign key constraints impossible.
- **No Cascade Actions Configured:** Leaving deletes to default, which can cause SQL query errors or leave orphan rows depending on the database engine.
- **Over-use of 1:1 Tables:** Splitting tables unnecessarily without logical reasons, increasing query join overhead.

## 6. Security Considerations

- **Authorization Cascading Boundaries:** Ensure cascading delete rules do not trigger unexpected mass deletions of sensitive security logs or transaction records. Protect critical parent entities using `ON DELETE RESTRICT`.

## 7. Performance Considerations

- **Join Path Optimization:** Large junction tables can bottleneck queries. Keep junction table row sizes minimal, containing only the foreign keys. If metadata is needed, create a distinct entity table.

## 8. Scalability Considerations

- **Cross-Shard Joins:** In sharded or distributed database architectures, executing joins across tables located on different physical servers is slow. Denormalize relationship data (e.g. copying key fields) to keep queries local to a single shard, noting data sync requirements.

## 9. How Major Companies Implement It

- **Stripe:** Avoids polymorphic relationship anti-patterns. They write explicit, strongly typed association tables for linking payments, accounts, and payouts, ensuring the database engine guarantees referential completeness.
- **GitHub:** Uses indexed junction tables to map the Many-to-Many relationship between user accounts and repository access permissions, ensuring sub-millisecond authorization check queries.

## 10. Decision Checklist (when to use / when NOT to use)

- Use a **Junction Table (M:N)** when:
  - Multiple records in Table A associate with multiple records in Table B (e.g. Users and Groups).
  - You need to track metadata about the relationship itself (e.g., the date a user joined a group).
- Use a **Direct Foreign Key (1:N)** when:
  - A record in the child table associates with exactly one parent record.
- Use a **Foreign Key + UNIQUE constraint (1:1)** when:
  - Splitting table data vertically for security (e.g., User and UserCredentials) or page cache performance.

## 11. AI Coding-Agent Implementation Guidelines

- Always define database-level Foreign Key constraints for every relationship.
- Never write schemas that store foreign IDs in arrays or comma-separated strings.
- Always create database indexes on foreign key columns.
- Never implement polymorphic foreign keys — use explicit junction tables.
- Always configure explicit referential actions (`ON DELETE CASCADE` / `ON DELETE RESTRICT`) on all relationship keys.

## 12. Reusable Checklist

- [ ] All foreign key columns have dedicated database indexes configured
- [ ] Many-to-Many relationships map via a junction table with a composite primary key
- [ ] One-to-One relationships enforce uniqueness with a `UNIQUE` constraint on the FK column
- [ ] No comma-separated strings or raw array types used to store foreign keys
- [ ] No polymorphic foreign keys present in the database schema design
- [ ] Explicit referential actions (`ON DELETE CASCADE`, `ON DELETE RESTRICT`) defined on all FKs
- [ ] Parent deletion rules protect critical transactional entities using `RESTRICT`
- [ ] Recursive/self-referential relationships handle root null states gracefully
