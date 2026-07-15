# Migration Review Checklist

## 1. Purpose
This checklist validates that database schema deployments (DDL), version tracking table updates, rollback procedures, and data transformations (DML) can be executed in production with zero downtime and minimal locking impact. It must be run before executing any schema changes on production database instances.

## 2. Checklist

### Strategy & Validation
- [ ] Schema migrations version-controlled as sequential version SQL files.
- [ ] DDL (schema changes) and DML (data backfills) segregated into separate migration files.
- [ ] DDL commands wrapped in transactional `BEGIN ... COMMIT` blocks (where engine-supported).
- [ ] Checksums of migration files verified and matched against previous runs.

### Locking & Zero-Downtime
- [ ] Migration DDL scripts configure session-level lock timeouts (e.g. `SET lock_timeout = '2s';`).
- [ ] Database indexes built concurrently without locking writes (`CREATE INDEX CONCURRENTLY` / `ONLINE = ON`).
- [ ] Schema changes follow the backward-compatible Expand-Contract pattern (no direct table or column renames).
- [ ] Constraints (CHECK, FOREIGN KEY) added using `NOT VALID` first and validated asynchronously in background tasks.

### Rollback & Data Sync
- [ ] Rollback scripts ("Down" SQL) written, tested, and validated in staging environments.
- [ ] Rollback paths verified to be non-destructive (no automated column or table drops).
- [ ] Database restore points or snapshots captured immediately before migration runs.
- [ ] Data transformations (backfills) run in throttled batch sizes (<5,000 rows per transaction) with throttle sleeps.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Migration Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/11-migrations-and-versioning/migration-strategy-implementation.md)
- [Zero-Downtime Migrations](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/11-migrations-and-versioning/zero-downtime-migrations-strategy.md)
- [Rollback Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/11-migrations-and-versioning/rollback-strategy-implementation.md)
- [Schema Versioning](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/11-migrations-and-versioning/schema-versioning-strategy-implementation.md)
- [Data Migration](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/11-migrations-and-versioning/data-migration-strategy.md)
- [Compatibility](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/11-migrations-and-versioning/compatibility-strategy.md)

## 4. Sign-off Criteria
The migration review passes when:
1. 100% of checklist boxes are verified.
2. Migration run on staging clones completes without lock timeouts or connection pool spikes.
3. Rollback script execution successfully reverts changes to schema parity in staging.
4. Deployment pipeline verifies that the running application version remains fully compatible during the migration expand phase.
