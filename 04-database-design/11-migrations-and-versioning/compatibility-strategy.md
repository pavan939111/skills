# Compatibility (Backward Compatibility & Upgrades)

## 1. Definition & Core Concepts

Database Compatibility is the engineering practice of ensuring that schema updates (DDL) remain backward-compatible with running application code versions, and database engine upgrades (major/minor version releases) remain compatible with existing table schemas, data structures, and client connection drivers.

Core compatibility concepts:
- **Backward Compatibility (Schema):** Ensuring that older versions of the application code can read and write to the database after new migrations have been applied.
- **Forward Compatibility (Schema):** Ensuring that newer versions of the application code can run against the older database schema before migrations are executed (critical for rolling canary deployments).
- **Major Version Engine Upgrade:** Upgrading the primary database engine version (e.g., PostgreSQL 12 to 16), which can introduce query syntax changes, index layout changes, or deprecated feature removals.
- **Minor Version Engine Upgrade:** Applying security patches and bug fixes within the same major release line (e.g. PostgreSQL 15.1 to 15.2), typically backwards-compatible.
- **Driver Compatibility:** Enforcing that database connection libraries (e.g. Node.js `pg` driver, Java JDBC) are compatible with the database engine version.

*(Boundary Note: Code-level driver updates, application deployment server configuration files, and cloud target group parameters belong in `backend-development/` and devops. This document covers database-level DDL compatibility rules, engine validation scripts, major/minor upgrade procedures, and pg_upgrade.)*

## 2. Why It Exists / What Problem It Solves

During rolling deployments (canary releases or blue-green deploys), old (Version 1) and new (Version 2) application instances run concurrently, querying the same database. If a database migration breaks compatibility (e.g., dropping a column still queried by Version 1), the old application instances crash, causing partial outages. Furthermore, database engine upgrades can break query optimizers. Compatibility guidelines guarantee safe, zero-downtime updates.

## 3. What Breaks in Production Without It

- **Rolling Deployment Crashes from Dropped Columns:** Dropping a column (`email`) because the new Version 2 application code uses `contact_email`. During the deployment, Version 1 instances are still running and attempting to read `email`. They fail with SQL errors, crashing user pages.
- **Canary Failures from Non-Nullable Columns:** Adding a non-nullable column without default values. Version 1 instances attempting to write records fail because they do not know the new column exists and omit it, throwing `NotNullViolation` exceptions.
- **Failed Major Upgrades from Deprecated Features:** Upgrading PostgreSQL major versions without checking compatibility. The database fails to start, or query syntax errors occur because deprecated catalog features or data types (e.g. old datetime types) were removed.
- **Optimizer Regression Downtime:** Upgrading the database engine. The new query planner processes a query differently, choosing a sequential scan instead of an index seek, saturating CPU.

## 4. Best Practices

- **Write Backward-Compatible DDL Only:** Ensure all schema migrations are backward-compatible. Never drop columns, rename tables, or change column data types directly. Use the multi-step Expand-Contract pattern.
- **Define Default Values for Non-Nullable Columns:** If a new column must be `NOT NULL`, always configure a default value database-side so old application versions can write rows successfully without supplying the new field value.
- **Validate Engine Upgrades using Check Flags:** Before executing major database upgrades, run check validations to verify table and syntax compatibility.
  - *PostgreSQL Upgrade Check command:* `pg_upgrade --check`
- **Test Driver Compatibility in Staging:** Always verify that the application's database driver versions match the target database engine version in staging environments before rolling out upgrades.
- **Maintain Schema Version Parity:** If using read replicas, apply migrations to the primary node and verify they replicate successfully to standbys before deploying new application code.

## 5. Common Mistakes / Anti-Patterns

- **Dropping Columns in one step:** Dropping active schema columns directly, breaking backward compatibility.
- **Adding non-nullable columns without defaults:** Forcing writes to fail on older application versions.
- **Upgrading without pg_upgrade Checks:** Executing database upgrades without checking for deprecated types.
- **Ignoring Query Optimizer Changes:** Upgrading database major versions without running performance profiling checks on high-frequency query paths.

## 6. Security Considerations

- **Secure Backup generation during Upgrades:** Always generate a full, verified backup of the database immediately before executing major engine upgrades. Restrict key access to ensure backups are encrypted and restorable during recovery.

## 7. Performance Considerations

- **REINDEX post-upgrade:** Major database upgrades can change B-Tree index structures. Schedule a `REINDEX` or `ANALYZE` operation on all tables post-upgrade to rebuild indexes and update statistics for the new query planner.

## 8. Scalability Considerations

- **Rolling Database Cluster Upgrades:** In sharded or replica-backed environments, execute upgrades sequentially: upgrade read replicas first, verify query performance, execute failover, and upgrade the old primary, maintaining availability.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict backward-compatibility rules in CI/CD. Pull requests containing schema modifications are automatically parsed, blocking any migration DDL that breaks running application versions.
- **Netflix:** Upgrades database clusters sequentially across regions, profiling query performance on updated nodes before promoting them to active targets.

## 10. Decision Checklist (Compatibility Verification Rules)

Verify compatibility before deployments:

- Apply **Expand-Contract Pattern** when:
  - Table schemas are refactored (renames, column drops).
  - Older application code must continue to read and write data during rolling deploys.
- Execute **pg_upgrade --check** when:
  - Upgrading PostgreSQL major versions.
  - Validating index compatibility and checking for deprecated data types.
- Run **REINDEX / ANALYZE** when:
  - Database major version upgrades have completed (rebuilds indexes for the new optimizer).

## 11. AI Coding-Agent Implementation Guidelines

- Never generate migration templates that drop or rename columns directly.
- Always include default values for all non-nullable columns in schema expansions.
- Always recommend running `pg_upgrade --check` before major database version upgrades.
- Never write database configuration files that allow auto-upgrades of major database versions without manual validation.
- Always recommend reindexing tables post-major database upgrades to optimize the query planner.

## 12. Reusable Checklist

- [ ] Schema changes backward-compatible with running application versions (canary check)
- [ ] No direct table or column drops present in migration scripts (expand-contract checked)
- [ ] Non-nullable columns configured with default values database-side
- [ ] Database engine major upgrades validated using `pg_upgrade --check`
- [ ] Client database drivers verified to be compatible with target database engine version
- [ ] Full database backup captured and verified before major engine upgrades
- [ ] `REINDEX` and `ANALYZE` scheduled post-upgrade to optimize the query planner
- [ ] Replicas upgraded and tested before primary promotion during database upgrades
