# Soft Delete Pattern

## 1. Definition & Core Concepts

The Soft Delete Pattern is a database design pattern where records are flagged as "deleted" rather than being physically erased from disk (hard delete) during delete transactions. This flags records as inactive, hiding them from standard queries while preserving historical data and referential integrity.

Core soft delete concepts:
- **Logical Deletion:** Flagging a row as inactive (e.g., setting `is_deleted = true` or `deleted_at = TIMESTAMP`).
- **Physical Deletion (Hard Delete):** Running DML `DELETE` statements that permanently erase row data blocks from disk storage.
- **Partial Unique Indexes:** Indexes that enforce uniqueness constraints only on active rows, preventing collisions with deleted rows.
- **De-noising Filters:** Automatically appending `WHERE deleted_at IS NULL` to read queries to filter out inactive rows.

*(Boundary Note: Code-level application query filters, ORM soft delete plugins (e.g. Prisma/Sequelize soft-delete hooks), and client UI recycle bin screens belong in `backend-development/`. This document covers database-level unique constraints, partial indexes, index size, and hard delete pruner cron scripts.)*

## 2. Why It Exists / What Problem It Solves

If an application executes physical `DELETE` statements, two problems occur:
- If a user deletes their account accidentally, recovering the data requires executing database rollbacks from backup files, causing service disruption.
- Deleting rows violates referential integrity. If an order references a deleted user ID, either the order is dropped (`ON DELETE CASCADE`), or the write fails due to foreign key violations.
Soft deletion hides records from users, allows recovery, and maintains relational integrity.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Unique Constraint Collisions:** A user registers, deletes their account (soft delete), and attempts to re-register with the same email. The registration fails because the unique index `UNIQUE(email)` blocks the write, detecting the soft-deleted row.
- **GDPR Erasure Violations (PII Retention):** Storing customer personal details in soft-deleted rows indefinitely. Under data privacy laws, soft deletion does not satisfy data erasure rules, risking regulatory fines.
- **Query Performance Collapse (Index Bloat):** A table has 10M rows, but 9M are soft-deleted. Standard queries scan B-Tree indexes containing all 10M rows. Because indexes lack partial filters, reads slow down.
- **Stale Data Leaks (Missing Filters):** A developer writes a raw SQL join query and forgets to append `WHERE deleted_at IS NULL`. The API displays "deleted" items to active users, exposing stale data.

## 4. Best Practices

- **Use `deleted_at` Timestamps instead of Booleans:** Use a nullable timestamp (`deleted_at TIMESTAMP NULL`) instead of `is_deleted BOOLEAN`. A timestamp logs *when* the deletion occurred and supports unique constraint indexing.
- **Configure Partial Unique Indexes:** To prevent unique constraint collisions, enforce uniqueness only on active rows by defining partial indexes:
  - *PostgreSQL SQL:*
    ```sql
    CREATE UNIQUE INDEX uq_user_email_active ON user_account (email) 
      WHERE (deleted_at IS NULL);
    ```
  - *(For MySQL, which lacks partial indexes, use a composite unique index on `(email, deleted_at)`, where `deleted_at` defaults to a dummy value like `'1970-01-01 00:00:00'` and is updated to the current time on deletion).*
- **Optimize Search using Partial Indexes:** Create partial indexes for common query filters to exclude soft-deleted rows, reducing index storage size and speeding up lookups:
  - *Example:* `CREATE INDEX idx_product_active ON product (category_id) WHERE (deleted_at IS NULL);`
- **Automate Hard Delete Pruning Pipelines:** Set up background cron jobs (e.g., pg_cron) to physically erase (hard delete) or anonymize soft-deleted records after a retention period (e.g. 30 days):
  - *SQL Command:* `DELETE FROM user_account WHERE deleted_at < NOW() - INTERVAL '30 days';`
- **Audit Referential Deletions:** When soft-deleting a parent record, ensure dependent tables are either soft-deleted or updated to handle the inactive status.

## 5. Common Mistakes / Anti-Patterns

- **Boolean Flags for Unique Keys:** Using `is_deleted = true`, causing duplicate registration failures.
- **Permanent Soft Deletion:** Storing soft-deleted rows indefinitely, violating data privacy compliance.
- **Querying without Filters:** Forgetting to filter out deleted rows in raw SQL statements.
- **Index Bloat:** Indexing all table rows instead of using partial indexes to exclude soft-deleted records.

## 6. Security Considerations

- **Anonymization post-soft delete:** If data must be kept for analytics but PII must be scrubbed, configure the hard delete pruner script to overwrite name and address fields with nulls or hashes instead of running physical deletes.

## 7. Performance Considerations

- **Table and Index Bloat:** Soft-deleted rows still occupy disk blocks. Regularly run autovacuum or database rebuilds to optimize storage pages after pruner scripts execute hard deletes.

## 8. Scalability Considerations

- **Partitioning Deleted Rows:** If soft-deleted row volumes are high, use list partitioning based on status or range partitioning based on time to isolate deleted rows in separate tablespaces, keeping active partitions lean.

## 9. How Major Companies Implement It

- **Stripe:** Implements soft deletion using partial unique indexes, ensuring merchants can close accounts and re-open new profiles under the same email while preserving transaction logs.
- **Netflix:** Moves soft-deleted profiles to archive databases, updating primary indexes asynchronously.

## 10. Decision Checklist (Soft Delete Selection)

Choose the deletion pattern:

- Use **Soft Delete (with Partial Indexes & Pruners)** when:
  - Accidentally deleted data must be recoverable.
  - Foreign key constraints must be preserved for historical reporting.
  - Unique keys must allow re-use after logical deletions.
- Use **Physical Hard Delete** when:
  - Table volume is small, and no historical referential integrity is required.
  - Strict data erasure compliance (GDPR/HIPAA) demands immediate erasure from disk.
  - Data is transactional log telemetry with no recovery use cases.

## 11. AI Coding-Agent Implementation Guidelines

- Never write unique constraints without using partial index constraints on tables containing soft delete columns.
- Always recommend `deleted_at TIMESTAMP` columns instead of simple booleans.
- Always include automated hard delete pruner cron templates in environment setups.
- Never write search queries that omit `deleted_at IS NULL` filters on soft-deleted tables.
- Always use partial indexes (`WHERE deleted_at IS NULL`) for active query routes.

## 12. Reusable Checklist

- [ ] Table schema configured with nullable `deleted_at TIMESTAMP` column (no boolean flags)
- [ ] Partial unique index configured on logical keys (`WHERE deleted_at IS NULL`)
- [ ] Active read queries append `deleted_at IS NULL` filter constraints
- [ ] Partial indexes configured for active query routes to exclude deleted rows
- [ ] Automated background pruner script active to hard delete rows after retention limits
- [ ] PII data anonymized or physically erased during hard deletes (GDPR check)
- [ ] Soft delete triggers or cascade updates update dependent child table states
- [ ] Disk defragmentation (vacuum/rebuild) scheduled to run after pruner scripts
