# Soft Delete (Schema-Level Soft Deletes)

## 1. Definition & Core Concepts

Soft Delete is the database modeling practice of marking records as deleted by updating a state attribute rather than physically removing the rows from disk using SQL `DELETE` commands.

Core concepts:
- **`is_deleted` (Boolean Flag):** A simple true/false flag indicating row deletion status (e.g., `is_deleted = true`).
- **`deleted_at` (Timestamp Flag):** A nullable timestamp recording when the row was deleted (e.g., `deleted_at = '2026-07-15T19:00:00Z'`).
- **Unique Constraint Conflicts:** The issue where a soft-deleted row continues to occupy unique constraint indexes (e.g. preventing a new user from registering with an email that belongs to a soft-deleted account).
- **Partial Unique Indexes:** Indexes that enforce uniqueness only on active rows (e.g., ignoring rows where `deleted_at IS NOT NULL`).

*(Boundary Note: Application-level query filters (e.g. Hibernate `@SQLDelete`), cascading soft delete code, and scheduled batch purge scripts belong in `13-design-patterns/` and `backend-development/`. This document covers database-level attributes, unique index conflicts, and DDL partial unique index syntax.)*

## 2. Why It Exists / What Problem It Solves

Physical deletes are permanent and can cause cascading deletion issues. Deleting a customer row can delete their entire invoice history due to foreign key cascades, corrupting financial metrics. Furthermore, accidental deletions by users or code bugs are impossible to restore without database backups. Soft deleting preserves data history and maintains referential integrity, allowing simple data restoration by changing a single column value.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Unique Key Collision Blockages:** A user closes their account. The database soft-deletes their row. A week later, they attempt to register a new account using the same email address. The write fails because the soft-deleted row still occupies the `uq_user_email` index, blocking new registrations.
- **Accidental Leakage of Deleted Data:** Developers write new queries but forget to append `WHERE deleted_at IS NULL` to SQL queries. The application displays deleted profiles or orders to users, exposing data and violating privacy policies.
- **Index Scan Slowdowns (Table Bloat):** Soft-deleted rows accumulate over years, representing 90% of table rows. Since standard indexes scan all rows, query performance degrades unless partial indexes are used.
- **Cascade Deletion Failure Loops:** Trying to soft-delete a parent row without soft-deleting its child tables, leaving orphan rows that are visible because their parent key is inactive.

## 4. Best Practices

- **Prefer `deleted_at` Timestamps over Booleans:** Use a nullable `deleted_at` timestamp rather than a boolean `is_deleted` flag. Timestamps capture *when* data was deleted, helping with audit trails and unique constraints.
- **Use Partial Unique Indexes to Prevent Key Collisions:** Define unique indexes to ignore soft-deleted rows, allowing new entries to reuse the unique value.
  - *Example (PostgreSQL):* `CREATE UNIQUE INDEX uq_user_email ON user_account(email) WHERE deleted_at IS NULL;`
- **Use Partial B-Tree Indexes for Queries:** Optimize index size by indexing only active rows (e.g., `CREATE INDEX idx_user_active_created ON user_account(created_at) WHERE deleted_at IS NULL`).
- **Define DB Views to Hide Deleted Rows:** Build database views (e.g., `v_active_users`) that filter out deleted records, and route standard application reads through these views to prevent accidental exposure of soft-deleted rows.
- **Implement a Hard-Delete Archival Pipeline:** Set a retention window (e.g., 90 days). After the window expires, run background workers to move soft-deleted rows to cold storage (historical tables/S3) and physically delete them from the primary OLTP tables.

## 5. Common Mistakes / Anti-Patterns

- **Simple Booleans with Unique Indexes:** Using `is_deleted` with global unique indexes, blocking reuse of emails or SKU codes.
- **Forgetting Filters in Queries:** Writing SQL queries that omit `deleted_at IS NULL` checks, exposing deleted records.
- **Indefinite Soft-Delete Storage:** Keeping petabytes of soft-deleted data in high-performance OLTP disks forever, increasing database costs.
- **Soft-Deleting Parent only:** Updating a parent row to `deleted_at = NOW()` but leaving all child lines active and visible in child table queries.

## 6. Security Considerations

- **Compliance Deletions (GDPR):** Soft deletion does not satisfy GDPR "Right to be Forgotten" requirements. If a customer requests account deletion, you must physically delete (hard delete) or anonymize their PII from all active tables and backups.

## 7. Performance Considerations

- **Index Bloat Protection:** Standard indexes include all rows. If a table contains millions of soft-deleted rows, B-Tree sizes swell. Use partial indexes (`WHERE deleted_at IS NULL`) to exclude deleted rows from indexes, keeping B-Trees small and cached in RAM.

## 8. Scalability Considerations

- **Data Life Cycle Management:** Design soft-deleted columns to support automated partition migrations, moving older deleted records to cold storage tablespaces to keep operational tables lean.

## 9. How Major Companies Implement It

- **Stripe:** Implements soft deletion across API objects. Deleting an API resource updates its active status, and partial unique indexes ensure unique namespaces (like webhook URLs) can be reused immediately by other resources.
- **Salesforce:** Uses soft deletion (the "Recycle Bin" pattern) across customer data tables, allowing users to restore deleted records within 15 days before background processes execute physical deletions.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Soft Delete (deleted_at)** when:
  - Accidentally deleted records must be restorable by users or support staff.
  - The record is referenced by critical historical transactions (e.g. sales, audit logs) that must be preserved.
  - Data privacy and referential integrity require maintaining entity links.
- Use **Physical Hard Delete (DELETE)** when:
  - Enforcing privacy regulations (GDPR) requesting complete PII removal.
  - Deleting data from temporary staging, logging, or cache tables.

## 11. AI Coding-Agent Implementation Guidelines

- Always prefer nullable `deleted_at` timestamp columns over simple boolean flags.
- Never define global unique constraints on soft-deletable tables without adding a `WHERE deleted_at IS NULL` clause.
- Always recommend creating database views that pre-filter deleted records to prevent data exposure.
- Never use soft delete for regulatory PII purging requests.
- Always use partial indexes to exclude soft-deleted rows from operational search indexes.

## 12. Reusable Checklist

- [ ] Nullable `deleted_at` timestamp column added to soft-deletable tables
- [ ] Unique constraints configured as partial indexes (`WHERE deleted_at IS NULL`)
- [ ] Active queries filter out deleted rows using `WHERE deleted_at IS NULL`
- [ ] Database views hide deleted records from standard reporting
- [ ] Search indexes configured as partial indexes to exclude soft-deleted rows
- [ ] Data lifecycle policy defined to hard-delete or archive old records after a set window
- [ ] Soft deletion verified to update related child records (cascade soft-delete logic)
- [ ] GDPR data deletion paths execute physical hard deletes on PII columns
