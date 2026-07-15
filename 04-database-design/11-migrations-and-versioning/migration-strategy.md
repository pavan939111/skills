# Migration Strategy

## 1. Definition & Core Concepts

A Database Migration Strategy is the systematic process of evolving database schema structures (DDL) and transforming existing data (DML) safely across environments, maintaining schema consistency and preventing service disruption.

Core migration concepts:
- **DDL (Data Definition Language) Migrations:** Schema changes that modify catalog definitions (e.g., `CREATE TABLE`, `ALTER TABLE`, `ADD COLUMN`, `CREATE INDEX`).
- **DML (Data Manipulation Language) Migrations:** Data mutations that update record values or backfill tables to align with schema updates (e.g. data conversions, backfilling default values).
- **Migration-Based (Incremental) Versioning:** Tracking schema state as a chronological list of versioned delta files (e.g., `V1__init.sql`, `V2__add_email.sql`) applied sequentially.
- **State-Based Migrations:** Describing the target database state in a single definition file (e.g., schema declarative models) and letting a comparison tool generate diff migrations.
- **Migration Transaction Blocks:** Wrapping migration scripts in `BEGIN ... COMMIT` blocks to ensure if a step fails, the entire change rolls back, preventing half-migrated corrupt states.

*(Boundary Note: Code-level migration framework configurations (like Flyway, Liquibase, or Prisma settings), application ORM schema generators, and CI/CD runner pipelines belong in `backend-development/`. This document covers SQL-level migration file rules, transaction blocks, DDL/DML segregation, and lock limits.)*

## 2. Why It Exists / What Problem It Solves

If databases are updated manually using raw ad-hoc SQL statements, different environments (development, staging, production) drift. A query that passes in staging fails in production because a column or index is missing (Schema Drift). Furthermore, running untracked schema updates on active databases risks locking critical tables, causing timeouts. A migration strategy version-controls schema updates, ensuring identical, tested transitions across all servers.

## 3. What Breaks in Production Without It

- **Schema Drift Outages:** Deploying new backend code that queries a column that staging had, but production lacks. The API instantly throws SQL exceptions, causing outages.
- **Corrupted Half-Migrated Databases:** Running a multi-step migration script. Step 3 fails due to a syntax error. Because the script was not wrapped in a database transaction block, steps 1 and 2 remain saved on disk, leaving the database in an inconsistent, half-migrated state that blocks application code.
- **Database Lockouts from Blended Migrations:** Combining heavy DDL schema updates and DML data backfills in a single migration file. The script holds metadata locks on tables during the slow data backfill, blocking API reads and writes and exhausting connection pools.
- **OutOfMemory Errors during Migrations:** Running migration runners that attempt to load massive tables into memory to perform data conversions instead of executing native SQL batch queries database-side.

## 4. Best Practices

- **Wrap Migrations in Transaction Blocks:** Ensure all migration scripts are wrapped in SQL transaction blocks. If any statement fails, the database rolls back to the pre-migration state.
  - *Example:* `BEGIN; ALTER TABLE user ADD COLUMN status VARCHAR(20); COMMIT;`
  - *(Note: Some DDL commands, like PostgreSQL `CREATE INDEX CONCURRENTLY`, cannot run inside transactions. Separate these commands into dedicated migration steps).*
- **Segregate DDL and DML Migrations:** Never combine table schema changes (DDL) and data backfills (DML) in the same migration file. Run DDL first, deploy application code changes, and then run DML migrations in slow, independent batches.
- **Enforce Idempotence in Scripts:** Write migration scripts so they can be run multiple times without causing errors (e.g., using `CREATE TABLE IF NOT EXISTS` or checking for column presence).
- **Enforce Strict Version Control:** Store all migration files in the same git repository as the application code, ensuring schema changes deploy in sync with matching backend code.
- **Audit Lock Durations before Release:** Run migration scripts against a staging database containing production-scale data clones. Monitor metadata lock durations to ensure DDL changes execute in milliseconds, not minutes.

## 5. Common Mistakes / Anti-Patterns

- **Ad-Hoc Manual Production Schema Changes:** Executing raw DDL commands directly on production databases without version tracking.
- **Combining DDL and DML:** Blending column creation and millions of rows updates in a single migration step.
- **Ignoring Non-Transactional DDL constraints:** Running commands like `CREATE INDEX` inside transactions on databases where it blocks table writes.
- **Bypassing Migration Tools:** Allowing backend developers to modify database schemas directly through ORM auto-sync settings in production.

## 6. Security Considerations

- **Least-Privilege Migration Roles:** Restrict the database user credentials used by the migration runner (e.g., in CI/CD pipelines) to have DDL execution rights, blocking superuser privilege access.

## 7. Performance Considerations

- **Metadata Locks:** Executing DDL commands requires acquiring exclusive AccessExclusiveLocks on catalog tables, blocking all concurrent read and write operations. Keep DDL statements short and fast.

## 8. Scalability Considerations

- **Distributed Migration Synchronization:** In sharded architectures, use migration coordinators that apply DDL modifications to all shard instances sequentially or in isolated groups, preventing schema skew across the cluster.

## 9. How Major Companies Implement It

- **Stripe:** Enforces a strict, multi-phase database migration pipeline. Schema changes (DDL) are applied first, followed by application code rollouts, and finally data backfills (DML) executed in rate-limited background workers.
- **GitHub:** Utilizes online schema migration tools (like gh-ost) to execute DDL migrations on MySQL primaries without holding table locks, maintaining high availability.

## 10. Decision Checklist (Migration Mode Selection)

Select the migration strategy:

- Use **Incremental Migration-Based Files (Flyway/Liquibase/SQL files)** when:
  - Designing production-grade databases with strict audit requirement histories.
  - Teams write explicit, optimized DDL and DML SQL files.
  - You need to track exactly when and how the schema transitioned across environments.
- Use **Declarative State-Based Migrations** ONLY when:
  - Operating early-stage, rapid-prototyping environments where schema structures change constantly.
  - Tooling (e.g., Prisma, Atlas) can safely calculate and apply automated diffs.
  - No complex DML data transformations are required during migrations.

## 11. AI Coding-Agent Implementation Guidelines

- Always wrap generated SQL migration templates in explicit `BEGIN` and `COMMIT` transaction blocks.
- Never combine DDL (schema changes) and DML (data changes) in the same generated file.
- Always recommend incremental, version-controlled migration files (e.g., `V1__desc.sql`).
- Never generate migrations that run blocking DDL commands on high-volume production tables.
- Always include idempotence checks (`IF NOT EXISTS`, `IF EXISTS`) in SQL migration templates.

## 12. Reusable Checklist

- [ ] Schema changes version-controlled as chronological, incremental migration files
- [ ] DDL (schema) and DML (data backfills) segregated into separate migration files
- [ ] Migration SQL scripts wrapped in `BEGIN` and `COMMIT` transaction blocks
- [ ] Non-transactional DDL commands (e.g., `CREATE INDEX CONCURRENTLY`) isolated in separate steps
- [ ] Idempotent SQL checks (`IF NOT EXISTS`) active on table and column creations
- [ ] Migration runner database role restricted to DDL privileges (no superuser access)
- [ ] DDL scripts tested on production-scale staging databases to verify lock durations
- [ ] Database schema auto-generation settings (auto-sync) disabled in production
