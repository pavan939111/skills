# Audit Log Pattern (Data Change Tracking)

## 1. Definition & Core Concepts

The Audit Log Pattern is a database design pattern that records an immutable, chronological, and tamper-evident history of all data mutations (inserts, updates, deletes) occurring within primary database tables.

Core audit log concepts:
- **Audit Trail:** The sequential ledger of historical mutations, recording who changed what, when, and the differences between old and new row states.
- **Trigger-Based Auditing:** Database-level database triggers (e.g. `BEFORE UPDATE` or `AFTER INSERT`) that automatically write audit records to an audit table during transaction execution.
- **Application-Level Auditing:** Application code explicitly generating and inserting audit records into the database. (Vulnerable to bypasses from direct SQL runs).
- **Log Tamper-Evidence:** Security configurations that restrict or prevent modification of audit tables, guaranteeing log credibility.
- **State Diffs:** Storing mutations as JSON structures containing only the modified fields or recording full before-and-after snapshots (`old_state` vs `new_state`).

*(Boundary Note: Code-level auditing decorators, admin dashboard log UIs, and corporate compliance audit workflows belong in `backend-development/` and product analysis. This document covers database-level audit schemas, trigger functions, tamper prevention DDL, and audit table partitioning.)*

## 2. Why It Exists / What Problem It Solves

Operational databases store the current state. When records are modified (e.g. changing an invoice amount or modifying user roles), the old values are lost. Security regulations (SOX, HIPAA, PCI) and operational debugging require tracing data histories. The Audit Log pattern records these changes, allowing engineers to audit user actions, recover from corrupt updates, and trace the history of any database row.

## 3. What Breaks in Production Without It

- **Undetectable Insider Malice:** A compromised administrator logs in, executes `UPDATE user_account SET role = 'admin' WHERE id = 5`, processes a write, and reverts the role. Because no immutable database-level audit log is running, the breach is completely untraceable.
- **Storage Disk Exhaustion from Audit Bloat:** Logging every row change in a single, un-partitioned table. The audit log table expands to hundreds of millions of rows, saturating disk space and slowing down database write queries.
- **Write Latency Spikes from Synchronous Triggers:** Implementing complex, nested SQL triggers that run heavy calculations or external queries synchronously inside the write transaction block. The primary write latency triples under load.
- **Tampered Audit Trails (Log Deletions):** An attacker compromises database credentials, runs destructive updates, and deletes the corresponding rows from the audit table to hide their tracks.

## 4. Best Practices

- **Enforce a Standard Audit Schema:** Structure the audit log table to capture:
  - `audit_log`: (id [PK], table_name [Varchar], record_id [UUID/Varchar], action [Varchar: INSERT/UPDATE/DELETE], old_state [JSONB], new_state [JSONB], changed_by [Varchar], trace_id [UUID], created_at [Timestamp])
- **Revoke Update and Delete Rights on Audit Tables:** Protect the audit table from tampering. Revoke all update and delete permissions on the audit table for all application database roles, allowing only inserts:
  - *SQL Command:* `REVOKE UPDATE, DELETE ON audit_log FROM app_role;`
- **Use Partitioning by Time for Audits:** Partition the `audit_log` table by time (e.g. monthly range partitions). This allows moving old audit logs to cold storage and dropping old partition tables easily without locking active tables.
- **Leverage Asynchronous CDC for Low Overhead:** Instead of database triggers, use log-based CDC (like Debezium) to read the database transaction logs (WAL) asynchronously, shipping change events to write-locked audit storage.
- **Redact Sensitive Columns inside Triggers:** If using database triggers, ensure the trigger function filters out sensitive columns (like passwords or credit card tokens) before writing to the audit JSON payload.

## 5. Common Mistakes / Anti-Patterns

- **Allowing Updates/Deletes on Audit Logs:** Failing to restrict permissions, allowing logs to be modified.
- **Logging Sensitive PII in Plain Text:** Writing raw passwords, SSNs, or tokens into the audit JSON payloads.
- **Synchronous Complex Triggers:** Executing heavy lookups inside write-path triggers.
- **No Correlation Keys:** Storing audit logs without `trace_id` fields, making it impossible to map updates back to API logs.

## 6. Security Considerations

- **Write Once Read Many (WORM) Storage:** If compliance demands strict tamper prevention, write audit logs to S3 buckets configured with Object Lock in compliance mode, preventing any deletion or modification even by root admin keys.

## 7. Performance Considerations

- **Write Amplification:** Synchronous database-level triggers write to the audit log table within the primary transaction, doubling the number of write operations. Use partition-aligned writes and index only the `table_name` and `record_id` columns.

## 8. Scalability Considerations

- **Audit Log Sharding:** In sharded architectures, store audit records local to each shard's database, using the primary sharding key (`tenant_id`) to keep audit writes localized.

## 9. How Major Companies Implement It

- **Fintech Providers (Stripe):** Stream database transaction logs (WAL) asynchronously to secure, read-only audit databases, separating transaction operations from compliance storage.
- **Enterprise SaaS Platforms:** Utilize trigger-based partitions to record administrative data updates, ensuring compliance reviews have verified audit trails.

## 10. Decision Checklist (Audit Log Pattern Selection)

Select the auditing architecture:

- Use **Asynchronous CDC-Based Auditing** when:
  - System write throughput is high (>1,000 writes/second).
  - You want to eliminate write-path trigger latency overhead on primary transactions.
  - Audit logs are shipped to an external data warehouse or WORM storage.
- Use **Database Trigger-Based Auditing** when:
  - System size is small-to-medium and database resources are not bottlenecked.
  - Absolute transaction consistency is required (audit record must commit *in the same transaction* as the primary update).
- Never allow **Application-Level Auditing Only** on:
  - Tables containing critical user permissions, financial transactions, or security settings.

## 11. AI Coding-Agent Implementation Guidelines

- Always revoke `UPDATE` and `DELETE` privileges on audit table schemas.
- Never write database audit triggers that record plain-text sensitive fields (like passwords).
- Always include `trace_id` columns in audit tables to link database writes to API logs.
- Never suggest single-table audit storage without time-based range partitioning for tables >100,000 rows.
- Always include composite index templates on `(table_name, record_id)` in audit schemas.

## 12. Reusable Checklist

- [ ] Audit log table configured in schema with PK, table name, record ID, and JSONB states
- [ ] Database permissions update/delete revoked on the audit table (`app_role` restricted to INSERT only)
- [ ] Audit log table partitioned by time ranges (monthly partitions configured)
- [ ] Sensitive columns (passwords, tokens) redacted inside audit triggers or CDC pipelines
- [ ] Correlation ID (`trace_id` / `request_id`) present in audit log schema
- [ ] Index configured on composite keys `(table_name, record_id)` for search lookups
- [ ] Audit triggers execute lightweight inserts only (no heavy SQL inside triggers)
- [ ] Audit logs shipped to secure, isolated cold storage after active windows
