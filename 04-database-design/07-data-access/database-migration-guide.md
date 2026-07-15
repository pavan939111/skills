# Database Migrations

## 1. Definition & Core Concepts
Database Migrations (or schema migrations) are version-controlled script files used to define, execute, and document changes to database schemas (tables, columns, indexes, constraints) over time.

## 2. Why It Exists / What Problem It Solves
Manually editing database schemas in production is error-prone, untraceable, and breaks local developer environments. Migrations treat schema updates as code, ensuring that all environments (dev, staging, prod) run on identical database schemas.

## 3. What Breaks in Production Without It
- **Out-of-sync schemas:** Staging tests pass, but production deployments crash because table modifications were never applied to production.
- **Data Loss:** Executing destructive column updates manually without backing up data or retaining version histories.
- **Deployment Downtime:** Schema updates lock tables during deployments, causing outages.

## 4. Best Practices
- **Use Version-Controlled Scripts:** Save migrations as sequential files (e.g. timestamped or numbered SQL scripts) in the project repository.
- **Implement Backward-Compatible Updates:** Avoid breaking existing API code (e.g. instead of renaming a column, add a new column, copy data, update code, and then drop the old column).
- **Always Include Rollbacks:** Write matching "down" scripts for every "up" migration to support schema reverts.

## 5. Common Mistakes / Anti-Patterns
- **Modifying existing migration files:** Editing a migration file that has already been executed in production. Create a new migration file instead.
- **Running migrations inside web containers:** Triggering migrations automatically during container starts, causing race conditions under concurrent container scaling.

## 6. Security Considerations
- **Least-Privilege Migration Keys:** Run migration pipelines using database credentials that have schema modification rights (DDL), while restricting runtime service credentials to data queries only (DML).

## 7. Performance Considerations
- **Locking Large Tables:** Adding columns or foreign keys can lock large tables, causing timeouts. Run migrations during low-traffic windows or use online schema change tools (e.g. gh-ost).

## 8. Scalability Considerations
- **Automated Migration CD Steps:** Execute migrations as dedicated, single-pod steps in CI/CD deployment pipelines before launching new application containers.

## 9. How Major Companies Implement It
- **GitHub:** Uses specialized online schema migration tools to apply schema changes to high-volume MySQL tables without locking tables or causing user-facing downtime.

## 10. Decision Checklist (Migration Deployments)
- Use **Automated CI/CD Migration steps** when:
  - Running standard application releases with backward-compatible schema modifications.
- Use **Online Schema Modification tools (e.g. gh-ost, pg-osc)** when:
  - Applying schema changes to massive production tables (millions of rows) where table locks are unacceptable.

## 11. AI Coding-Agent Guidelines
- Write migration scripts that define both up and down transitions, ensuring that indexes are added to new search columns.

## 12. Reusable Checklist
- [ ] Migration files version-controlled and sequentially numbered
- [ ] Down scripts defined for every schema up transition
- [ ] Schema changes designed to be backward-compatible with active code
- [ ] Migrations run as isolated CI/CD tasks before container rollouts
- [ ] Large table updates checked for execution locks (EXPLAIN checks)
- [ ] Migration database user restricted from standard runtime queries
