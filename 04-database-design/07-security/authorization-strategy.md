# Database Authorization

## 1. Definition & Core Concepts

Database Authorization is the security control that regulates the permissions (privileges) of authenticated database users or roles to read, modify, or execute specific database objects (tables, views, columns, schemas, functions).

Core authorization concepts:
- **Role-Based Access Control (RBAC):** Grouping privileges into database **Roles** (e.g., `read_only`, `app_writer`), which are then assigned to database users.
- **Privilege Model:** SQL-native permissions that can be granted or revoked:
  - `SELECT:` Permission to read rows.
  - `INSERT:` Permission to add rows.
  - `UPDATE:` Permission to modify rows.
  - `DELETE:` Permission to physically remove rows.
  - `EXECUTE:` Permission to run stored functions and procedures.
- **Default Privileges:** Database configuration rules that automatically define what permissions are assigned to newly created tables (e.g., locking new tables down by default).
- **Least Privilege:** Enforcing that a database connection has the absolute minimum privileges required to perform its intended workload, and nothing more.

*(Boundary Note: Application-level role authorization checks (e.g., JWT role scopes verification), UI component toggles, and user permission matrices belong in `backend-development/`. This document covers database-native roles, SQL GRANT/REVOKE commands, schema ownership, and database role catalogs.)*

## 2. Why It Exists / What Problem It Solves

If an application service connects to a database as a superuser or database owner (DBO), a single compromise (like a SQL injection vulnerability) gives attackers complete control. They can drop tables, read private keys, create new admin accounts, or dump the entire database. Database authorization limits the security blast radius of any credential leak or application exploit by restricting the connection user's scope.

## 3. What Breaks in Production Without It

- **Total Database Erasure via SQL Injection:** An application connects to the database as the table owner. Attackers exploit a SQL injection bug on a search field, executing `DROP TABLE users;`. Because the application role has table drop privileges, the command succeeds, wiping out production data.
- **Unauthorized Data Dumps:** A microservice responsible only for tracking shipping updates is compromised. Because it connects using a shared database credential that has read access to the entire database, the attacker dumps the customer billing credentials table.
- **Public Schema Privilege Leakage:** In many databases (like older PostgreSQL versions), the `public` schema grants read/write permissions to all users by default. Unrestricted database users write rows to unauthorized namespaces, causing security audit failures.
- **Manual Privilege Drift:** Database administrators manually execute `GRANT` commands during deployments, leading to inconsistent permissions across staging and production environments.

## 4. Best Practices

- **Never Connect Applications as Superusers:** Prohibit the use of superuser accounts (like `postgres`, `sa`, or `root`) for normal application connections.
- **Implement Least Privilege Database Roles:** Define unique, scoped roles for different application services.
  - *Example:* The billing API should connect using a role that only has `SELECT`/`INSERT`/`UPDATE` permissions on the `billing` schema, with no access to `security` tables and no `DELETE` privileges.
- **Revoke Public Schema Permissions:** Strip default public write privileges from the default schemas during database bootstrap:
  `REVOKE ALL ON SCHEMA public FROM PUBLIC;`
- **Enforce Default Privileges on New Tables:** Configure database-level rules to ensure new tables automatically restrict access.
  - *Example:* `ALTER DEFAULT PRIVILEGES IN SCHEMA billing GRANT SELECT ON TABLES TO billing_reader_role;`
- **Manage Database Grants in Migration Version Control:** Run all database `GRANT` and `REVOKE` scripts inside version-controlled database migration files alongside DDL changes, ensuring authorization states are consistent across environments.

## 5. Common Mistakes / Anti-Patterns

- **Connecting as Database Owner (DBO):** Using the owner account of the database schema for standard application APIs.
- **Granting ALL PRIVILEGES:** Running `GRANT ALL PRIVILEGES ON DATABASE ... TO app_user;` out of convenience, bypassing authorization controls.
- **No Column-Level Restrictions:** Giving read access to an entire user table when the application only needs to read names and emails, exposing password hashes to unnecessary queries.
- **Procedural Authorization Bypass:** Granting `EXECUTE` on a stored procedure that runs with superuser privileges (definer security), allowing unauthorized users to execute admin actions.

## 6. Security Considerations

- **Invoker vs. Definer Security:**
  - *SECURITY INVOKER (Default):* Stored procedures run using the permissions of the user calling them. (Secure, least privilege).
  - *SECURITY DEFINER:* Stored procedures run with the permissions of the user who *created* the procedure. Use DEFINER carefully, as it can allow users to execute privileged queries.

## 7. Performance Considerations

- Database-native authorization checks are cached in memory within the engine's catalog tables and have zero measurable performance impact on SQL execution. Prioritize strict security boundaries.

## 8. Scalability Considerations

- **Role Synchronizations across Shards:** In sharded database clusters, ensure role configurations and permission mappings are kept synchronized across all shard nodes using automated provisioning tools.

## 9. How Major Companies Implement It

- **Stripe:** Maps distinct, highly restricted database roles to individual microservices. The microservice that processes refunds has zero database-level access to the credential management tables, preventing security escalations.
- **Amazon:** Enforces a database-per-service pattern where database access is restricted using strict IAM roles, ensuring database credentials cannot cross domain boundaries.

## 10. Decision Checklist (Database Authorization Matrix)

Design database roles based on the following:

- Use **Admin/Owner Roles** ONLY when:
  - Executing schema migrations, DDL updates, or database maintenance tasks (e.g. running migrations via CI/CD runners).
- Use **Write Scoped Roles (`SELECT`, `INSERT`, `UPDATE`)** when:
  - Connecting core application API backend services.
  - Ensure the role is restricted to specific schemas and excludes `DELETE` privileges.
- Use **Read-Only Roles (`SELECT`)** when:
  - Connecting reporting tools, business intelligence (BI) systems, or database replicas.

## 11. AI Coding-Agent Implementation Guidelines

- Never generate database setup scripts that connect application APIs using database owner or superuser credentials.
- Always include `REVOKE ALL ON SCHEMA public FROM PUBLIC;` in database initialization DDL.
- Always write explicit, version-controlled `GRANT`/`REVOKE` statements in database migration scripts.
- Never grant `DELETE` privileges to standard application connection roles.
- Always configure database stored procedures to run with `SECURITY INVOKER` properties.

## 12. Reusable Checklist

- [ ] Applications connect using custom, non-superuser database roles
- [ ] Read-only roles configured for reporting tools and BI systems
- [ ] Write-scoped roles exclude `DELETE` privileges (unless explicitly approved)
- [ ] Default public schema privileges revoked (`REVOKE ALL ON SCHEMA public FROM PUBLIC`)
- [ ] Table privileges restricted to specific domain schemas (no global wildcards)
- [ ] Database authorization changes (GRANTS/REVOKES) managed in version control migrations
- [ ] Stored procedures configure `SECURITY INVOKER` settings
- [ ] Column-level read permissions configured for tables containing password hashes or keys
