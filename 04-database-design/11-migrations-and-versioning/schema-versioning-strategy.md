# Schema Versioning (Migration History Tracking)

## 1. Definition & Core Concepts

Schema Versioning is the practice of tracking, recording, and managing the active schema version of a database instance directly inside the database catalog, using a dedicated history table to coordinate automated migration runners.

Core versioning concepts:
- **Migration History Table:** A database-level table (e.g., `schema_version` or `flyway_schema_history`) created and maintained by the migration runner to store the log of applied scripts.
- **Migration Checksum (Hash):** A cryptographic hash (e.g. SHA-256) of a migration file's contents computed and saved in the history table when the migration is applied.
- **Out-of-Order Migrations:** The scenario where a migration version with a lower number is applied after a higher version has already been executed (e.g. applying V2 after V3 has run, common in multi-branch git environments).
- **Migration Locking:** Enforcing a database-level lock (e.g., table-level lock or advisory lock) during migration execution to prevent concurrent application servers from running the same migration scripts simultaneously.

*(Boundary Note: Code-level migration framework configs, client-side configuration parameters, and CI/CD runner environments belong in `backend-development/`. This document covers database-level history tables, checksum validation, migration locks, and catalog versioning.)*

## 2. Why It Exists / What Problem It Solves

When multiple backend servers boot up, they must verify if the database schema is compatible with the application code. If a new schema update is pending, the servers must execute it. Without schema versioning, the server has no way of identifying which updates have already been run. Schema versioning keeps track of applied versions, enabling automated deployment pipelines to apply only the remaining pending migrations.

## 3. What Breaks in Production Without It

- **Concurrent Execution Crashes (No Migration Locks):** When deploying a new release, 5 application container replicas boot up simultaneously. All 5 instances detect a pending migration and attempt to execute `ALTER TABLE users ADD COLUMN age INT` concurrently. The database throws table lock errors, duplicate column exceptions, and crashes the deployment.
- **Un-deployable Systems from Mismatched Checksums:** A developer retroactively edits an old migration file (`V1__init.sql`) to fix a typo. The application runner boots up in production, computes the file's hash, and compares it to the hash stored in the history table. The hashes do not match, causing the migration runner to throw a checksum mismatch error and block the deployment.
- **Schema Drift from Manual History Edits:** A developer manually deletes rows from the schema history table to "retry" a failed migration, leading to schema drift where the database thinks V5 is pending when V5's columns already exist, causing subsequent runs to crash on duplicate table keys.
- **Broken Out-of-Order Merges:** Multiple developers merge distinct feature branches containing conflicting version tags (e.g., both branches create `V15__change.sql`), causing the runner to abort due to duplicate version numbers.

## 4. Best Practices

- **Enforce a Migration History Table:** Ensure all database instances maintain a dedicated history table that records:
  - `version`: The sequential version ID (e.g., `1.2`).
  - `description`: The name of the migration script.
  - `checksum`: Cryptographic hash (SHA-256) of the file content.
  - `success`: Boolean indicating if the migration succeeded or failed.
  - `installed_on`: Timestamp of execution.
- **Implement Advisory Locks for Migration Protection:** Use database-level advisory locks (e.g., `pg_advisory_lock` in PostgreSQL) or exclusive table locks on the history table during migration runs. This forces concurrent runners to wait for the lock rather than executing duplicate scripts.
- **Never Modify Applied Migration Files:** Once a migration has been deployed to production, it is immutable. If a schema change contains a bug, never edit the file; write a new, higher-version migration file to fix it.
- **Configure Out-of-Order Execution in CI/CD:** If developers merge branches out of order, configure the migration runner to accept out-of-order executions, applying missed versions safely.
- **Protect the History Table Permissions:** Restrict write permissions on the schema history table, allowing modifications only by the migration runner database role, preventing developers from manually altering history.

## 5. Common Mistakes / Anti-Patterns

- **Retroactive Migration Edits:** Changing the SQL contents of a migration file after it has already been applied.
- **No Migration Locks:** Running migration runners without advisory locks on multi-instance deployments.
- **Manual History Table Deletions:** Editing the `schema_version` table manually to resolve migration failures.
- **Missing Checksum Validations:** Disabling checksum validation in migration runners, allowing modified scripts to run undetected.

## 6. Security Considerations

- **Secure Version Metadata:** Restrict read permissions on the schema history table. The version table lists the complete history of schema modifications, exposing database structures and potential vulnerability points.

## 7. Performance Considerations

- **History Table Overhead:** The schema history table is small (typically <1,000 rows). Optimize by creating a unique index on the `version` column, keeping history check queries under 1ms.

## 8. Scalability Considerations

- **Tenant Schema Versioning:** In multi-tenant database-per-tenant architectures, the migration coordinator must loop through all tenant databases, checking and updating the local schema history table in each tenant instance sequentially.

## 9. How Major Companies Implement It

- **Stripe:** Uses strict version-controlled migration registries combined with CI checks that compute and match checksum hashes, blocking pull requests if any applied SQL file has been modified.
- **Enterprise SaaS Providers:** Orchestrate schema migrations across thousands of tenant databases using automated runners that lock and verify local schema history tables.

## 10. Decision Checklist (Versioning Framework)

Maintain schema version controls:

- Enforce **Schema History Tables & Checksums** on:
  - 100% of production database environments (relational, document, wide-column).
- Use **Database Advisory Locks (`pg_advisory_lock`)** when:
  - Deploying to multi-container environments (Kubernetes/Cloud) where multiple application instances boot concurrently.
- Never allow **Direct DML Edits** on:
  - The schema history table (e.g. `DELETE FROM schema_version`).

## 11. AI Coding-Agent Implementation Guidelines

- Always include a schema history table definition template in database setup scripts.
- Never write database configuration files that permit concurrent migration runs without advisory locks.
- Always recommend treating migration files as immutable once deployed.
- Never generate migration templates that bypass checksum validations.
- Always restrict write access on the version history table to the migration runner role.

## 12. Reusable Checklist

- [ ] Schema history table configured in database catalog to track applied versions
- [ ] Cryptographic checksums (SHA-256) of migration files saved and validated on boot
- [ ] Database advisory lock or exclusive table lock active during migration runs
- [ ] Applied migration files treated as immutable (no retroactive edits)
- [ ] Out-of-order migration execution configured in the runner settings
- [ ] History table write access restricted to the migration runner role
- [ ] Unique index configured on the version column in the history table
- [ ] CI/CD pipeline verifies that migration checksums match production records before deploy
