# Schema Organization

## 1. Definition & Core Concepts

Schema Organization is the practice of structuring database tables, views, types, and functions into logical namespaces (schemas) and physical storage boundaries (tablespaces/filegroups) to maintain order, isolate domain boundaries, and manage hardware allocation.

Core concepts:
- **Logical Schema Namespace:** A container within a database used to group related tables and prevent name collisions (e.g. separating the `billing` namespace from the `inventory` namespace).
- **Default (Public) Schema:** The default namespace (e.g., `public` in PostgreSQL, `dbo` in SQL Server) where tables are placed if no schema is specified.
- **Search Path:** The ordered list of schemas that the database engine searches to resolve unqualified table names (e.g. `SET search_path TO billing, public`).
- **Tablespaces / Filegroups:** Physical storage directories configured in the database engine to place tables or indexes on specific storage drives.

*(Boundary Note: Code-level folder layouts, microservice routing logic, and application deployment packaging are out of scope. This document covers database-native schemas, search path resolution, and tablespace storage routing.)*

## 2. Why It Exists / What Problem It Solves

Dumping hundreds of tables into a single default `public` schema creates a chaotic database. Developers face namespace collisions (e.g., multiple teams trying to create a table named `logs` or `metadata`), and applying clean role-based permissions becomes difficult. Organizing tables into logical schemas aligned with business domains (bounded contexts) prevents collisions, simplifies security management, and clarifies schema ownership.

## 3. What Breaks in Production Without It

- **Search Path Resolution Anomalies:** Writing unqualified queries like `SELECT * FROM config`. If the database engine's `search_path` configuration changes or drifts in production, the engine resolves the query to the wrong schema (e.g. reading `public.config` instead of `billing.config`), leading to silent logic failures.
- **Privilege Leakages:** If all tables are stored in the default public schema, developers cannot apply bulk schema-level privileges (e.g. granting read-only access to all tables in the `reporting` schema), leading to manual, error-prone column-level grant permissions.
- **Namespace Collisions during Integration:** Integrating two independent services that both utilize tables named `audit_log`, causing compilation or migration failures.
- **Disk Saturation Outages:** Storing massive historical logs and active checkout tables in the same storage directory, running the drive out of disk space and crashing transactional write databases.

## 4. Best Practices

- **Segregate by Domain Namespaces:** Group tables into logical schemas matching domain boundaries (e.g., `auth.user`, `billing.transaction`, `analytics.event`). Avoid using the default `public` schema for core tables.
- **Always Use Fully Qualified Table Names:** Write explicit, qualified schema prefixes in SQL queries (e.g. `SELECT * FROM billing.invoice` instead of `SELECT * FROM invoice`) to prevent search path resolution errors.
- **Isolate Sensitive Schemas:** Place credentials, security parameters, and audit logs in highly restricted schemas (e.g., `security.`), granting access to only specific database roles.
- **Route Storage using Tablespaces:** Allocate tablespaces physically. Route high-frequency write tables and indexes to fast NVMe SSD tablespaces, and route historical read-only tables to cheaper, high-capacity HDD tablespaces.
- **Keep System & Extension Objects Isolated:** Install database extensions (like `uuid-ossp` or `postgis`) in a dedicated extension schema (e.g. `extensions.`) to prevent system catalog pollution.

## 5. Common Mistakes / Anti-Patterns

- **Dumping Everything in Public:** Leaving all tables in the default schema, creating a bloated list of entities.
- **Unqualified Table Queries:** Relying on search path configurations to locate tables in SQL scripts.
- **Mixing OLTP and OLAP in One Schema:** Storing temporary analytical report tables directly inside active transactional schemas.
- **Sharing Schemas across Microservices:** Allowing distinct microservices to share the same schema namespace, breaking service boundaries.

## 6. Security Considerations

- **Schema Access Control Gating:** Configure database privileges on the schema level (e.g., `REVOKE ALL ON SCHEMA public FROM public; GRANT USAGE ON SCHEMA billing TO billing_service;`). This ensures services are logically locked out of schemas they do not own.

## 7. Performance Considerations

- **I/O Parallelism via Tablespaces:** By placing high-write table indexes on different physical tablespace disks from the raw tables, you parallelize disk read/write heads, improving database transaction throughput.

## 8. Scalability Considerations

- **Database Extraction Readiness:** Organizing tables into distinct schemas makes it easy to split the database. If the billing service needs to be migrated to its own database server, the entire `billing.` schema can be exported and migrated with minimal impact.

## 9. How Major Companies Implement It

- **Stripe:** Organizes transactional databases into logical schemas corresponding to financial ledgers, customer metrics, and security keys, locking down schemas via role privileges.
- **Salesforce:** Uses logical schema namespaces to partition tenant data structures, ensuring clear organization across massive enterprise schemas.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Schema Organization (Logical Schemas)** when:
  - The database schema contains more than 15-20 tables.
  - Multiple services connect to the same database engine.
  - Access control privileges must be applied in bulk across domains.
- Keep tables in the **Default Public Schema** ONLY when:
  - Building basic prototypes or single-purpose databases with fewer than 10 tables.

## 11. AI Coding-Agent Implementation Guidelines

- Always prefix table names with their schema namespaces (e.g., `billing.invoice`) in generated DDL and query scripts.
- Never write database credentials that grant global access to all schemas.
- Always isolate extension installations inside a dedicated `extensions.` schema.
- Never write queries that rely on dynamic `search_path` configurations.
- Always recommend tablespace configurations for high-write index tables.

## 12. Reusable Checklist

- [ ] Tables grouped into logical domain schemas (e.g., `billing.`, `auth.`)
- [ ] No application tables stored in the default `public`/`dbo` schemas
- [ ] Queries use fully qualified table names (schema prefix included)
- [ ] Schema-level permissions configured to restrict database roles
- [ ] Database extensions isolated in a dedicated schema (e.g., `extensions.`)
- [ ] Tablespaces configured to route tables and indexes to optimized storage drives
- [ ] Audit and security tables isolated in restricted schema namespaces
- [ ] No shared tables exist across different microservice schemas
