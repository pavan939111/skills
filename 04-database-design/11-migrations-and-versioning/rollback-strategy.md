# Rollback Strategy

## 1. Definition & Core Concepts

A Database Rollback Strategy is the set of engineering procedures and scripts used to revert schema structures (DDL) and data modifications (DML) to a stable, previous state when a migration fails or introduces critical performance issues in production.

Core rollback concepts:
- **Roll Forward (Preferred):** Fixing a migration issue by writing and applying a new, versioned corrective migration (e.g. `V4__fix_indexes.sql`), rather than undoing the previous script.
- **Roll Backward (Undo Migration):** Reverting the database state by executing a matching "Down" script (e.g. dropping a table created in an "Up" script).
- **Destructive Rollback:** A rollback operation that results in data loss (e.g., dropping a newly created column that has already accepted user data in production).
- **Idempotent Rollback:** A rollback script written so that it can execute multiple times without throwing errors, ensuring the database transitions safely to the target recovery version.

*(Boundary Note: Code-level application rollback triggers (e.g., Git revert pipelines), server orchestration rollbacks, and CDN rollback configurations belong in devops and backend-development. This document covers database-level DDL drop rules, backup restore points, destructive rollback avoidance, and rollback transaction blocks.)*

## 2. Why It Exists / What Problem It Solves

Database migrations are tested in staging, but production environments can still fail due to locking conflicts, data volume mismatches, or unexpected query performance. When a migration causes outages, the team must recover. If no rollback strategy is defined, developers make arbitrary decisions (like manually dropping columns or restoring ancient backups), which can lead to permanent data loss and extended downtime. A rollback strategy provides a safe recovery path.

## 3. What Breaks in Production Without It

- **Catastrophic Data Loss via Destructive Rollbacks:** A migration adds a new column, `user_preferences`. The deployment has a minor bug. The team runs the automated rollback script, which executes `ALTER TABLE user_account DROP COLUMN user_preferences`. This deletes all customer preference data written by users since the deployment, causing permanent data loss.
- **Code-Schema Mismatch Outages:** Rolling back the application code to version 1.0, but leaving the database at schema version 1.1. The old code attempts to execute queries that do not match the database schema, throwing runtime exceptions.
- **Out of Memory during Full Backups Restores:** Reverting a minor migration bug by executing a full database backup restore (e.g. restoring a 2TB backup) instead of running a fast rollback script, increasing downtime from minutes to hours.
- **Orphaned Outbox States:** Failing to rollback the outbox table entries when rolling back transactional data, causing sync workers to publish stale records to search databases.

## 4. Best Practices

- **Prioritize Rolling Forward:** For production SQL databases, roll forward by deploying a hotfix migration script instead of rolling backward. Undoing DDL changes on live databases is high-risk.
- **Never Execute Destructive Rollbacks on Live Data:** If a migration added a column, and the column has accepted data in production, never roll back by dropping the column. Keep the column active, roll back the application code (which is backward-compatible), and drop the column later in a planned maintenance window.
- **Test Rollbacks ("Down" Scripts) in Staging:** Always write and test both the "Up" (migration) and "Down" (rollback) scripts in staging. Verify that the rollback script executes cleanly and leaves the database identical to the pre-migration state.
- **Create Storage Restore Points Before Migrations:** For major schema changes, capture a storage volume snapshot or database restore point immediately before running the migration, allowing fast recovery if the migration fails.
- **Verify Idempotence of Rollback Scripts:** Write rollback scripts using defensive SQL syntax:
  - *Example:* `ALTER TABLE user_account DROP COLUMN IF EXISTS temp_token;`

## 5. Common Mistakes / Anti-Patterns

- **Automated Column Drops on Rollback:** Running automated "Down" scripts that delete columns containing live production data.
- **Not Testing the Rollback Path:** Testing only the migration path in staging, leaving the rollback path untested until a production emergency.
- **Restoring Full Backups for Schema Recovery:** Restoring a multi-terabyte database backup to fix a single column index issue, prolonging downtime.
- **Mismatched Deployment Rollbacks:** Rolling back database schemas before the application code has been reverted, causing active queries to crash.

## 6. Security Considerations

- **Auditing Rollback Execution:** Access permissions to execute database rollbacks or restore snapshots must be restricted to authorized database administrators (DBAs) and require multi-factor approvals, preventing unauthorized database rollbacks.

## 7. Performance Considerations

- **Locking Overhead of Rollbacks:** Reverting schema changes (e.g. dropping indexes or tables) requires exclusive locks on catalog tables. Ensure rollback scripts configured with lock timeouts to prevent connection queuing.

## 8. Scalability Considerations

- **Coordinating Rollbacks in Distributed Shards:** If a sharded database migration fails on shard 8 of 10, ensure the rollback orchestrator rolls back the schema changes across all shards consistently to maintain schema parity.

## 9. How Major Companies Implement It

- **Stripe:** Never executes automated database rollbacks in production. If a migration introduces a bug, they roll back the application code (which is always designed to be backward-compatible with the new schema) and deploy a "roll-forward" database fix.
- **GitHub:** Uses partition management and online schema tools to test migrations on copies, ensuring rollback is as simple as reverting the table metadata pointer.

## 10. Decision Checklist (Rollback Execution Rules)

Select the recovery strategy when a migration fails:

- Use **Roll Forward (Hotfix Migration)** when:
  - The migration has completed, and the database has accepted new customer data (prevents data loss).
  - The bug is minor and can be fixed by writing a new DDL/index script.
- Use **Roll Backward (Undo SQL Script)** ONLY when:
  - The migration failed mid-execution and left the schema in a dirty state.
  - The database has not accepted any new data, and the change is non-destructive (e.g., reverting an unused table creation).
- Use **Storage Snapshot Restore (Restore Point)** when:
  - The migration corrupted the database catalog or primary tables, and standard SQL rollbacks fail.

## 11. AI Coding-Agent Implementation Guidelines

- Never generate rollback scripts that drop columns containing user data.
- Always include `IF EXISTS` constraints in rollback SQL templates (idempotence).
- Always recommend rolling forward using corrective migrations for live databases.
- Never write database configuration files that execute automated rollback scripts in CI/CD without human-in-the-loop validation.
- Always ensure rollback scripts are wrapped in transaction blocks.

## 12. Reusable Checklist

- [ ] Rollback scripts ("Down" SQL) written and version-controlled for every migration
- [ ] Rollback scripts tested in staging to verify they execute without errors
- [ ] Rollback strategy prioritizes rolling forward for tables containing live data
- [ ] No destructive SQL commands (`DROP COLUMN` / `DROP TABLE`) exist in automated rollback paths
- [ ] Database restore points or snapshots captured immediately before major migrations
- [ ] Rollback scripts wrapped in `BEGIN` and `COMMIT` transaction blocks
- [ ] Rollback operations configured with lock timeouts to prevent connection queuing
- [ ] Application code rollback verified to be backward-compatible with database schema states
