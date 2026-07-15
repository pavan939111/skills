# Composite Keys

## 1. Definition & Core Concepts

A Composite Key (or Compound Key) is a primary or unique key constraint that consists of two or more columns combined to uniquely identify a row in a table.

Core concepts:
- **Composite Primary Key:** Using multiple attributes to enforce row uniqueness (e.g., `PRIMARY KEY (order_id, product_id)` in a junction table).
- **Index Order Prefix Rule:** Databases create a composite B-Tree index for composite keys. Queries must query columns from left to right (Prefix Match) to utilize the index. A query filtering on the second column alone cannot use the composite index.
- **Co-Location Mapping:** In distributed relational databases, composite keys co-locate child records physically adjacent to parent records on disk (e.g., nesting order items under the order partition block).

*(Boundary Note: Object mapping configurations for composite ID classes and application-level key concatenation utilities belong in `backend-development/`. This document covers database-level composite constraints, B-Tree index prefix rules, and key ordering logic.)*

## 2. Why It Exists / What Problem It Solves

Some data models do not have a single, natural attribute that guarantees uniqueness. For example, in a Many-to-Many association table, a row is defined entirely by the link between two entities (e.g., `user_id` and `group_id`). Adding an artificial surrogate ID column (like `id`) wastes storage and permits duplicate links. A composite key enforces uniqueness at the database level across the column combination and optimizes index size.

## 3. What Breaks in Production Without It

- **Duplicate Link Records:** In a user-role junction table without a composite primary key, the application mistakenly inserts the same link multiple times (e.g., User 1 is assigned Role 2 twice), corrupting permissions queries.
- **Index Bypasses (Slow Queries):** A composite index is defined as `(tenant_id, user_id)`. A developer writes a query filtering on `user_id` without filtering on `tenant_id`. The database engine cannot use the index, performing a slow full table scan.
- **Cascading Reference Complexity:** A parent table has a composite key containing 4 columns. Every child table referencing it must store all 4 columns as foreign keys, bloating index sizes and complicating joins.
- **Fragile Cascading Updates:** Using mutable columns (like `role_name`) in a composite key. If a name changes, the database must rewrite all child foreign keys, locking tables.

## 4. Best Practices

- **Limit Composite Keys to Junction Tables:** Default to single-column surrogate keys (like UUIDv7 or `BIGINT`) for primary entity tables. Use composite keys primarily for Many-to-Many junction tables.
- **Order Columns from Left to Right by Selectivity:** Place the most frequently filtered column leftmost (first) in the primary key declaration.
  - *Example:* If queries search by `tenant_id` first, declare `PRIMARY KEY (tenant_id, user_id)`.
- **Keep Composite Keys Narrow:** Do not use more than 2 or 3 columns in a composite key. Large keys increase the disk space required for all child foreign key indexes.
- **Ensure Column Immutability:** Only include columns whose values are immutable (never change) inside a composite key definition.
- **Match Composite Foreign Keys:** Child tables referencing a composite primary key must declare a composite foreign key containing all matching columns in the exact same order.

## 5. Common Mistakes / Anti-Patterns

- **Wrong Left-to-Right Column Ordering:** Placing columns that are rarely queried first in the key definition, preventing the database from using index prefixes.
- **Surrogate Key Overkill on Junction Tables:** Adding an auto-incrementing `id` column to a Many-to-Many table that already has a natural composite unique link, wasting index memory.
- **Mutable Columns in Composite Keys:** Including attributes that change during standard workflows (like usernames or status codes) in the key.
- **Too Many Key Columns:** Creating composite keys with 4+ columns, bloating secondary indexes.

## 6. Security Considerations

- **Tenant Isolation Integrity:** In multi-tenant databases, defining composite keys as `(tenant_id, entity_id)` guarantees that all indexes are partitioned by tenant, helping prevent cross-tenant data access leaks during query filters.

## 7. Performance Considerations

- **Left-Prefix Index Usage:** A composite index on `(col_a, col_b, col_c)` can serve queries filtering on:
  - `col_a`
  - `col_a` AND `col_b`
  - `col_a` AND `col_b` AND `col_c`
  It *cannot* serve queries filtering solely on `col_b` or `col_c`. Write separate indexes if these columns are queried in isolation.

## 8. Scalability Considerations

- **Partition Key Routing:** In distributed databases, composite keys are often used to route data. The first part of the key acts as the hash partition key (routing data to a specific server node), while the second part acts as the clustering key (sorting data on disk).

## 9. How Major Companies Implement It

- **Google (Spanner):** Uses composite keys (e.g. `PRIMARY KEY (CustomerId, OrderId)`) to ensure that all orders for a customer are physically stored on the same shard node, minimizing network latency during joins.
- **Stripe:** Implements composite primary keys on mapping tables to guarantee that account-to-merchant links remain unique and performant.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Composite Primary Keys** when:
  - Designing Many-to-Many junction tables (e.g. mapping users to groups).
  - Defining weak entities that only exist within the context of a parent entity (e.g. `InvoiceLineItem` with `(invoice_id, line_number)`).
  - Co-locating data in distributed databases.
- Use **Single Column Surrogate Keys** when:
  - Designing primary entities that require simple, single-column foreign key links.
  - The table has columns that are updated frequently.

## 11. AI Coding-Agent Implementation Guidelines

- Always use composite primary keys for Many-to-Many junction tables.
- Never add an unnecessary surrogate auto-increment `id` column to a pure junction table.
- Always order composite key columns with the most selective, frequently queried column leftmost.
- Never include mutable columns in a composite key definition.
- Always ensure composite foreign keys match the parent key columns in type, order, and number.

## 12. Reusable Checklist

- [ ] Composite primary keys used on Many-to-Many junction tables
- [ ] Columns ordered leftmost to rightmost by query filter frequency
- [ ] No mutable columns included in the composite key definition
- [ ] Composite key width kept narrow (2-3 columns maximum)
- [ ] Junction tables omit unnecessary surrogate `id` columns
- [ ] Composite foreign keys in child tables match parent columns in exact order
- [ ] Index prefix coverage verified for all search queries
- [ ] Distributed partition routing keys aligned with composite key design
