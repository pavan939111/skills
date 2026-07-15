# Normalization

## 1. Definition & Core Concepts

Normalization is the systematic process of organizing the columns (attributes) and tables (relations) of a relational database to minimize data redundancy and prevent data anomalies.

Core Normal Forms:
- **First Normal Form (1NF):** All column values must be atomic (no arrays, comma-separated lists, or nested objects inside a single cell) and every row must have a unique identifier.
- **Second Normal Form (2NF):** Conforms to 1NF, and all non-key columns must depend on the *entire* primary key (eliminates partial dependencies on composite keys).
- **Third Normal Form (3NF):** Conforms to 2NF, and no non-key column can depend on another non-key column (eliminates transitive dependencies: "every attribute must depend on the key, the whole key, and nothing but the key, so help me Codd").
- **Boyce-Codd Normal Form (BCNF):** A stronger version of 3NF where every determinant in a table must be a candidate key.

*(Boundary Note: Application-level data mapping logic, object converters, and ORM validation annotations are out of scope. This document covers database-level normal forms, table decomposition rules, and anomaly prevention.)*

## 2. Why It Exists / What Problem It Solves

Normalization prevents database write anomalies:
- **Insertion Anomaly:** Being unable to record data because other data is missing (e.g., cannot record course details because no student has enrolled yet).
- **Update Anomaly:** Updating a value in one place but missing duplicates in other rows, leaving the database inconsistent.
- **Deletion Anomaly:** Deleting a record accidentally erases unrelated data (e.g., deleting a student registration erases the entire course description).

By decomposing fat tables into smaller, normalized tables linked by foreign keys, you ensure a single source of truth for every data attribute.

## 3. What Breaks in Production Without It

- **Data Corruption from Update Drift:** A user changes their billing address. Because the address is stored inline inside every row of the `orders` table, the application updates 49 out of 50 rows. One row remains stale, leading to billing routing failures.
- **Wasted Disk Space & I/O Bloat:** Storing redundant text strings (like product names or descriptions) repeatedly in transaction logs, causing table sizes to balloon and exhausting disk storage.
- **Array Parsing Failures:** Storing lists of tags as comma-separated strings inside a varchar column. Searching for a tag requires running slow `LIKE` string searches, which bypasses indexes and causes database CPU lockups.

## 4. Best Practices

- **Normalize Transactional (OLTP) Schemas to 3NF:** Keep your core operational tables normalized to prevent anomalies and keep writes fast.
- **Enforce Atomicity (1NF):** Store single, discrete values in columns. Use junction tables instead of string lists or JSON arrays inside relational columns.
- **Decompose Transitive Dependencies (3NF):** If column C depends on column B, which depends on primary key A (e.g., `zip_code` determines `city`), move B and C to a separate lookup table.
- **Use Synthetic Surrogate Keys:** Use UUIDs or auto-incrementing integers as primary keys to simplify foreign key links across decomposed tables.
- **Validate Constraints Database-Side:** Enforce normalization boundaries using primary keys, foreign keys, and unique checks at the engine level.

## 5. Common Mistakes / Anti-Patterns

- **CSV Strings in Columns:** Storing list values as a single comma-separated text block, making indexing and referential integrity impossible.
- **Repeating Columns:** Creating columns like `phone_1`, `phone_2`, `phone_3` instead of creating a separate `phones` table (violates 1NF).
- **Under-Normalizing for "Simplicity":** Leaving redundant attributes in tables to avoid write-joins, leading to data drift.
- **Over-Normalization:** Decomposing tables past BCNF/4NF into tiny single-column tables, creating massive join paths that degrade read query performance.

## 6. Security Considerations

- **Granular Access Control:** Normalized tables allow security administrators to apply strict access permissions (Row-Level Security / Column-Level Grant access) on sensitive tables (like `user_salaries`) without impacting permissions on public entities (like `user_profiles`).

## 7. Performance Considerations

- **Write vs. Read Trade-off:**
  - *Normalized schemas* optimize writes (updates happen in exactly one place, minimizing disk I/O).
  - However, reads require joining multiple tables, which can slow down read-heavy APIs if indexes are missing or tables grow massive.

## 8. Scalability Considerations

- **Sharding Barriers:** Normalization spreads data across tables. If you need to shard your database across servers, executing joins between tables on different shards is extremely slow. In distributed systems, some denormalization is required to keep query data local to a shard.

## 9. How Major Companies Implement It

- **Stripe:** Enforces highly normalized schemas for payment transactions. Customer names, payment card parameters, and billing address histories reside in separate tables, ensuring that updates to card values do not corrupt historical invoice states.
- **Google:** Employs normalization across internal systems to maintain a single source of truth, utilizing automated schema checkers to block code merges that introduce transitive dependencies in core schemas.

## 10. Decision Checklist (when to use / when NOT to use)

- Normalize to **3NF/BCNF** when:
  - Designing an OLTP database (transactional backend APIs).
  - Data integrity, update correctness, and write speed are the primary priorities.
  - Storage footprint must be minimized.
- Skip Normalization (Denormalize) ONLY when:
  - Designing an OLAP database (analytical data warehouse) where read scan speeds are the dominant bottleneck.
  - Sharding data across distributed NoSQL shards where cross-shard joins are impossible.

## 11. AI Coding-Agent Implementation Guidelines

- Always normalize relational schemas to 3rd Normal Form (3NF) by default.
- Never store array data, comma-separated lists, or serialized JSON payloads inside standard relational columns.
- Always decompose transitive dependencies (columns dependent on other non-key columns) into lookup tables.
- Never create numbered repeating columns (e.g. `attribute1`, `attribute2`).
- Always write explicit DDL statements that link decomposed tables via foreign keys.

## 12. Reusable Checklist

- [ ] All columns store atomic values (no lists, arrays, or CSV blocks)
- [ ] Numbered repeating columns (e.g., `phone_1`, `phone_2`) removed
- [ ] No partial dependencies (all non-key columns depend on the entire primary key)
- [ ] No transitive dependencies (no non-key column depends on another non-key column)
- [ ] Schema normalized to at least 3NF for OLTP operations
- [ ] Decomposed tables linked via database-level Foreign Keys
- [ ] Unique constraints configured on lookup keys
- [ ] Join paths between tables have matching indexed foreign keys
