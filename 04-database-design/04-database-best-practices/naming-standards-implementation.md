# Naming Standards (Database Object Naming)

## 1. Definition & Core Concepts

Database Object Naming Standards define the rules for naming secondary database assets (indexes, foreign keys, unique constraints, check constraints, triggers, database schemas, database views, and table partitions) to ensure uniformity across the storage tier.

Core naming patterns:
- **Primary Key Constraints:** Prefix `pk_` followed by the table name (e.g., `pk_user_account`).
- **Foreign Key Constraints:** Prefix `fk_` followed by the child table name and parent table name (e.g. `fk_order_user_account`).
- **Unique Constraints:** Prefix `uq_` followed by the table name and column names (e.g., `uq_user_account_email`).
- **Check Constraints:** Prefix `chk_` followed by the table name and columns (e.g., `chk_order_price_positive`).
- **Secondary Indexes:** Prefix `idx_` followed by the table name and column names (e.g., `idx_user_account_created_at`).
- **Table Partitions:** Suffix table names with the boundary values of the partition range (e.g., `order_p2026_07` for July 2026 orders).

*(Boundary Note: Code-level classes casing, ORM field-to-column mapper naming configs, and API variable transformations are out of scope. This document covers database-native object naming, constraint prefixes, DDL script parameters, and migration name rules.)*

## 2. Why It Exists / What Problem It Solves

If database constraints and indexes are not explicitly named in DDL scripts, database engines auto-generate names using random hashes (e.g., `SYS_C001893` or `user_email_key1`). If an application write fails due to a validation check, the error log prints the cryptic constraint name, leaving developers unable to diagnose which rule was violated. Furthermore, inconsistent index names lead to errors in schema migration scripts when dropping or modifying indexes.

## 3. What Breaks in Production Without It

- **Untraceable Diagnostics in Incident Logs:** A checkout request throws a `500` error. The database error trace reads `violates constraint SYS_C009823`. Because the name is auto-generated, the engineer on call cannot identify which check constraint failed, increasing MTTR.
- **Migration Script Collisions:** A migration script attempts to update a foreign key constraint. Because different developers run different database engines locally, the constraint has different auto-generated names across environments, causing the migration script to fail in production.
- **Accidental Index Dropping:** A developer attempts to drop a redundant index. Due to inconsistent naming patterns, they drop the wrong index, triggering a full table scan and slowing down production APIs.

## 4. Best Practices

- **Explicitly Name Every Constraint in DDL:** Never allow the database engine to auto-generate names for constraints. Declare names explicitly using the `CONSTRAINT` keyword in SQL.
- **Enforce Consistent Constraint Prefixes:**
  - `pk_[table_name]`
  - `fk_[child_table]_[parent_table]`
  - `uq_[table_name]_[column_name]`
  - `chk_[table_name]_[constraint_logic]`
  - `idx_[table_name]_[column_name(s)]`
- **Name Composite Indexes by Columns:** Incorporate all indexed columns in the index name in order (e.g. `idx_order_tenant_created_at` for a composite index on `(tenant_id, created_at)`).
- **Label Partition Tables with Ranges:** Use standardized time formatting suffixes (e.g., `_y[Year]_m[Month]` or `_p[Year]_[Quarter]`) to indicate partition ranges clearly.
- **Prefix Database Views:** Prefix virtual views with `v_` or `vw_` (e.g. `v_active_merchant_summary`) to distinguish them from physical tables in query logs.

## 5. Common Mistakes / Anti-Patterns

- **Auto-Generated Constraint Names:** Leaving out the `CONSTRAINT` label in SQL, allowing engines to assign random identifiers.
- **Generic Index Names:** Naming an index simply `index1` or `temp_idx`, leading to name conflicts and confusion.
- **Renaming Columns Without Renaming Constraints:** Modifying a column name (e.g. renaming `customer_id` to `client_id`) but leaving the associated index named `idx_order_customer_id`, causing documentation drift.
- **Exceeding Identifier Length Limits:** Creating extremely long names that exceed database engine character limits (e.g., PostgreSQL's 63-byte identifier limit), causing the engine to silently truncate names.

## 6. Security Considerations

- **Audit Trail Traceability:** Uniform naming of check constraints ensures that security audit logs clearly record which access policy or data validation rule blocked a write attempt.

## 7. Performance Considerations

- Naming standards have zero impact on database runtime execution speed. Prioritize clarity and diagnostic traceability.

## 8. Scalability Considerations

- **Distributed Schema Orchestration:** Uniform, explicit naming of indexes and constraints is mandatory when managing database migrations across distributed shards to ensure DDL changes apply consistently without naming errors.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict naming conventions on all database keys and indexes. Automated CI linters parse DDL files and reject pull requests if any index or constraint lacks a standardized prefix.
- **Google:** Mandates style guidelines across all Spanner and Cloud SQL schemas, blocking migrations that contain auto-generated constraint definitions.

## 10. Decision Checklist (when to use / when NOT to use)

- Enforce **Standard Database Object Naming Rules** on: All production database schemas, DDL scripts, index creations, constraints, views, and migrations.
- Allow **Default Engine Naming** ONLY when: Spinning up temporary scratch tables or throwaway database mocks in local testing environments.

## 11. AI Coding-Agent Implementation Guidelines

- Always write explicit `CONSTRAINT` labels with standard prefixes in DDL declarations.
- Never write database migrations that create indexes or keys without defining their names.
- Always check that identifier names stay within the target engine's character limit (e.g. 63 bytes for PostgreSQL).
- Never rename table columns in DDL without writing corresponding steps to rename their associated indexes and foreign keys.
- Always use the `idx_`, `fk_`, `pk_`, `uq_`, and `chk_` prefix system.

## 12. Reusable Checklist

- [ ] Every constraint (PK, FK, Unique, Check) explicitly named in DDL scripts
- [ ] Primary keys use the `pk_` prefix pattern
- [ ] Foreign keys use the `fk_` prefix pattern, listing child and parent tables
- [ ] Unique constraints use the `uq_` prefix pattern, specifying key columns
- [ ] CHECK constraints use the `chk_` prefix pattern, describing the validation logic
- [ ] Secondary indexes use the `idx_` prefix pattern, listing indexed columns in order
- [ ] View schemas prefixed with `v_` or `vw_`
- [ ] Table partitions suffixed with defined range markers (e.g., `_p2026_07`)
- [ ] All identifier names stay within the database engine's character limits (e.g., 63 bytes)
