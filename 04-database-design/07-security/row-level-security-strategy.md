# Row-Level Security (RLS)

## 1. Definition & Core Concepts

Row-Level Security (RLS) is a database security feature that allows database administrators to define access policies on tables, restricting which rows are visible or modifiable for a given query based on the executing database user's role or session context.

Core RLS concepts:
- **Security Policies:** SQL expressions defined on tables that act as dynamic filters, automatically appending conditions (like a hidden `WHERE` clause) to all queries.
- **Tenant Context Mapping:** Passing application-level user context (e.g. tenant ID or user ID) down to the database connection session variables (e.g., using PostgreSQL `current_setting('app.current_tenant')`).
- **Policy Enforcement:** RLS applies to `SELECT`, `INSERT`, `UPDATE`, and `DELETE` commands independently.
- **RLS Enablement:** In engines like PostgreSQL, creating a policy is not enough; RLS must be explicitly enabled on the table using DDL commands.

*(Boundary Note: Code-level session setting middleware, API auth token parsers, and application-tier tenant filters are out of scope. This document covers database-level RLS policies, session variables, RLS performance optimization, and DDL enablement.)*

## 2. Why It Exists / What Problem It Solves

In multi-tenant SaaS applications, a common security vulnerability is **Cross-Tenant Data Leakage**. If a developer forgets to append a `WHERE tenant_id = :tenant_id` filter in a single SQL query, Client A will see Client B's private data. RLS acts as a defense-in-depth security layer. By enforcing row isolation in the database engine, the database blocks access even if the application code contains bugs or forgets to filter by tenant.

## 3. What Breaks in Production Without It

- **Cross-Tenant Privacy Breaches:** A developer adds a new reporting API but forgets the tenant filter. A customer accesses the endpoint and views raw transaction logs from other companies, violating privacy compliance.
- **RLS Policy CPU Saturation:** Writing RLS policies that execute complex subqueries or lookups (e.g. `WHERE EXISTS (SELECT 1 FROM permissions WHERE ...)`) inside the policy itself. The database evaluates this subquery for every single row scanned, causing CPU spikes and database timeouts.
- **Silent Policy Bypass from Missing Enablement:** A developer writes a policy in PostgreSQL: `CREATE POLICY ...`. However, they forget to execute `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`. The database silently permits unrestricted queries, leaving the table exposed.
- **Table Owner Bypasses:** Testing RLS policies using the table owner account. By default, database owners and superusers bypass RLS policies, meaning tests pass but normal application connections fail or run unrestricted.

## 4. Best Practices

- **Explicitly Enable RLS on Target Tables:** Always execute the enablement DDL after defining policies:
  `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- **Use Fast Session Settings for Tenant Context:** Pass tenant context using database session configuration variables. Ensure the session setting has a default fallback.
  - *Example Policy:* `CREATE POLICY tenant_isolation_policy ON order FOR ALL TO app_role USING (tenant_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid);`
- **Index the Policy Target Columns:** Ensure the column used to enforce RLS (typically `tenant_id` or `user_id`) has a B-Tree index to keep policy verification lookups fast.
- **Keep RLS Policies Stateless and Simple:** Avoid subqueries inside RLS policies. Enforce policies using simple, fast comparison expressions (like matching session variables) to protect query execution plans.
- **Force RLS for Table Owners if Required:** If the application connects using a highly privileged role, force RLS enforcement on table owners using:
  `ALTER TABLE table_name FORCE ROW LEVEL SECURITY;`

## 5. Common Mistakes / Anti-Patterns

- **Forgetting to Enable RLS:** Writing a `CREATE POLICY` statement but forgetting to execute the `ENABLE ROW LEVEL SECURITY` command.
- **Subqueries in Policies:** Writing complex joins or subqueries inside policies, degrading performance on table scans.
- **Testing as Superuser:** Verifying RLS policies using connection roles (like `postgres`) that bypass security checks.
- **No Index on Tenant Key:** Enforcing RLS on `tenant_id` without creating an index on that column.

## 6. Security Considerations

- **Session Variable Leaks:** Ensure that database connection pools reset session variables (`DISCARD ALL` or `RESET ALL`) when connections are returned to the pool, preventing tenant context from leaking to subsequent requests.

## 7. Performance Considerations

- **Policy Evaluation Cost:** RLS policies are executed on every row scan. If a query scans 1 million rows, the RLS policy is evaluated 1 million times. Keep policies simple and use index-covered columns to prevent query degradation.

## 8. Scalability Considerations

- **Horizontal Sharding Integration:** In sharded architectures, RLS policies should align with the shard key (e.g., using `tenant_id` as both the shard key and the RLS policy filter) to ensure queries execute locally on single shards.

## 9. How Major Companies Implement It

- **Salesforce:** Implements database-level row-level security metadata checks to isolate tenant records across their multi-tenant architectures, ensuring complete customer separation.
- **SaaS Fintechs:** Deploy PostgreSQL RLS policies on all transaction ledgers, requiring application middleware to set session tenant variables on connection lease, preventing cross-merchant balance visibility.

## 10. Decision Checklist (RLS Sizing Framework)

Enable database-level RLS when:

- **Multi-Tenant Data Isolation** must be guaranteed at the database tier.
- A compromise of application-tier code must not allow cross-tenant data leaks.
- Table structures contain a clear, logical isolation column (e.g., `tenant_id`, `user_id`).
- The database engine natively supports optimized RLS (like PostgreSQL or SQL Server).

## 11. AI Coding-Agent Implementation Guidelines

- Always append `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;` after generating RLS policies.
- Never write RLS policies that contain subqueries or multi-table joins.
- Always use indexed columns (like `tenant_id` UUIDs) as RLS comparison keys.
- Never use database superuser accounts to test RLS policy enforcement.
- Always implement connection pool reset statements (`DISCARD ALL`) to prevent session leakages.

## 12. Reusable Checklist

- [ ] Row-Level Security explicitly enabled on all target tables (`ENABLE ROW LEVEL SECURITY`)
- [ ] RLS policy columns (e.g., `tenant_id`) covered by B-Tree indexes
- [ ] Session variables used to pass user/tenant context down to database connections
- [ ] Policies contain simple, stateless boolean comparisons (no subqueries/joins)
- [ ] Connection pools execute `DISCARD ALL` or `RESET ALL` when leasing connections
- [ ] RLS policies verified to enforce security rules under non-owner application roles
- [ ] Policies explicitly defined for all DML operations (`SELECT`, `INSERT`, `UPDATE`, `DELETE`)
- [ ] Tenant database credentials restricted to prevent RLS bypasses
