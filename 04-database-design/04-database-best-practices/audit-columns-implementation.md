# Audit Columns

## 1. Definition & Core Concepts

Audit Columns are standardized metadata columns added to database tables to track the lifecycle, creation, modifications, and actors associated with each row, establishing data lineage and auditing accountability.

Core audit columns:
- **`created_at`:** Timezone-aware timestamp recording when the row was inserted.
- **`updated_at`:** Timezone-aware timestamp recording the last time the row was modified.
- **`created_by` / `created_by_user_id`:** Identifier of the user, system actor, or service account that created the record.
- **`updated_by` / `updated_by_user_id`:** Identifier of the actor who executed the most recent modification.
- **`transaction_id` / `request_id`:** Cryptographic correlation identifiers linking the row modification to application request logs or database transactions.

*(Boundary Note: Application-level log publishers, audit interceptor code, and user authentication context parsers belong in `backend-development/`. This document covers database-level column declarations, default timestamp values, and update triggers.)*

## 2. Why It Exists / What Problem It Solves

Database records are updated continuously by different actors (users, background workers, admin scripts). When data corruption occurs or a security breach is suspected, developers must identify: *Who modified this row? When did the change occur? Which system request triggered the update?* Without audit columns, database rows are silent, and reconstructing history requires parsing offline logs, increasing incident resolution times.

## 3. What Breaks in Production Without It

- **Indebuggable Data Corruption:** A customer's configuration changes in production, breaking their integration. Without audit columns, it is impossible to determine if the change was made by the customer via the API, by an automated system job, or by a support engineer running a manual SQL script.
- **Audit Compliance Failures:** Failing regulatory audits (SOC 2, HIPAA, PCI-DSS) due to lack of traceability for modifications to sensitive financial or patient records.
- **Stale Cache Synchronization:** Cache invalidation workers fail to identify which rows were updated since the last sync because tables lack a reliable, indexed `updated_at` column.
- **Inconsistent Timestamps from Application Logic:** Relying on application code to supply timestamps. If different servers have drifted system times, `updated_at` values write out of order.

## 4. Best Practices

- **Enforce Audit Columns Globally:** Add `created_at`, `updated_at`, `created_by`, and `updated_by` columns to all operational tables by default.
- **Enforce Timestamps Database-Side:** Define `created_at` using database default values (e.g. `DEFAULT CURRENT_TIMESTAMP` or `timezone('utc'::text, now())`).
- **Use Triggers to Enforce `updated_at`:** Configure database triggers to update `updated_at` automatically on every row modification, ensuring the value updates even if a developer runs a raw SQL update query.
  - *Example:* `CREATE TRIGGER set_timestamp BEFORE UPDATE ON user FOR EACH ROW EXECUTE FUNCTION update_modified_column();`
- **Store Immutable User IDs:** Use immutable user IDs (like UUIDs) for `created_by` and `updated_by` columns. Never store mutable usernames, emails, or names.
- **Include Request Correlation IDs:** Add a `request_id` or `trace_id` column. If a row is corrupted, copy this ID and search your log indexing system to view the exact HTTP query that executed the write.
- **Use UTC Timestamps:** Enforce timezone-aware UTC timestamps for all audit date fields.

## 5. Common Mistakes / Anti-Patterns

- **Application-Side Timestamps:** Writing timestamps inside application code rather than using database defaults and triggers.
- **Omitting Indexes on Timestamps:** Failing to index `updated_at` columns that are frequently targeted in sync and replication queries, leading to slow sequential scans.
- **Mutable User Descriptors:** Storing strings like `John Doe` in audit columns, which drift and duplicate data.
- **Omitting Auditing on Junction Tables:** Excluding audit columns from Many-to-Many junction tables, preventing tracking of permission changes.

## 6. Security Considerations

- **Tamper-Proof Auditing:** In high-security systems, write database triggers that block users (even the application database user) from updating the `created_at` or `created_by` columns after insertion.
- **Separation of Audit Logs:** For critical systems, audit columns are insufficient. Supplement them with write-only audit log tables (using Change Data Capture) that cannot be edited or deleted by application credentials.

## 7. Performance Considerations

- **Write Overhead:** Adding 4 audit columns adds minor storage space overhead per row. Index only the timestamp fields that are actively used for sorting or sync queries (e.g., indexing `updated_at` for replication), leaving others unindexed.

## 8. Scalability Considerations

- **Data Sync & Replication:** High-volume data warehouses and search indexes rely on `updated_at` column indexes to identify changed records and run incremental syncs, avoiding full database scans.

## 9. How Major Companies Implement It

- **Stripe:** Appends correlation IDs (`request_id`) and actor tags to metadata payloads, allowing developers to trace any payment object mutation back to a specific API request trace.
- **Financial Institutions:** Mandate that all ledger tables contain immutable audit columns, enforcing them via database triggers that cannot be disabled by standard application accounts.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Standard Audit Columns** on:
  - Every operational database table, user profile table, settings table, and junction permission table.
- Skip Audit Columns ONLY when:
  - Designing ultra-high-volume, transient staging tables, cache nodes, or throwaway raw logs where metrics speed is the only constraint.

## 11. AI Coding-Agent Implementation Guidelines

- Always include `created_at`, `updated_at`, `created_by`, and `updated_by` columns in table definitions.
- Never write application update queries that manually alter `created_at` values.
- Always implement database triggers to update `updated_at` automatically on modification.
- Never store mutable strings (like email/names) in audit actor columns — use foreign keys or UUIDs pointing to immutable identities.
- Always use timezone-aware UTC types (e.g., `TIMESTAMPTZ` in PostgreSQL).

## 12. Reusable Checklist

- [ ] `created_at` and `updated_at` columns present on all tables
- [ ] `created_by` and `updated_by` columns store immutable actor identifiers (UUIDs/BIGINT)
- [ ] `created_at` defaults configured database-side (`CURRENT_TIMESTAMP` / `now()`)
- [ ] `updated_at` auto-updates enforced via database triggers
- [ ] Timestamps use timezone-aware UTC formats (`TIMESTAMPTZ` / `timestamp with time zone`)
- [ ] Correlation IDs (`request_id` / `trace_id`) included to connect rows to application logs
- [ ] `updated_at` column indexed on tables targeted in data replication or sync queries
- [ ] Write-permissions blocked on `created_at` and `created_by` attributes during updates
