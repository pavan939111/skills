# Multi-Tenant Database Patterns

## 1. Definition & Core Concepts

Multi-Tenant Database Patterns are database architectures designed to support Software-as-a-Service (SaaS) applications where a single infrastructure instance serves multiple distinct customer organizations (tenants), separating client datasets while optimizing resource costs.

Core tenant models:
- **Database-per-Tenant (Isolated Model):** Each tenant has a physically isolated database instance or logical database. (Highest security isolation, most expensive, complex schema migrations).
- **Schema-per-Tenant (Semi-Isolated Model):** Tenants share a database instance but have separate SQL schemas (namespaces). (Medium isolation, shared resources, schema drift risks).
- **Shared-Database-Shared-Schema (Shared Model):** All tenants share the same tables, using a `tenant_id` column to partition rows logically. (Cheapest cost, easiest administration, highest risk of cross-tenant leaks).
- **Row-Level Security (RLS):** Database engine features that enforce data isolation on shared tables by automatically applying query filters based on tenant context.

*(Boundary Note: Code-level tenant routing middleware, HTTP header token parsers, and frontend tenant login portals belong in `backend-development/`. This document covers database-level RLS configurations, index design, tenant sharding, and resource isolation.)*

## 2. Why It Exists / What Problem It Solves

SaaS businesses must serve thousands of corporate clients. Provisioning a separate physical database for every client is expensive and operationally difficult to maintain. However, mixing customer data in a shared table runs the risk of security violations. Multi-tenant database design patterns balance these trade-offs, enabling cost-effective infrastructure sharing while using database-level controls to prevent data exposure.

## 3. What Breaks in Production Without It

- **Cross-Tenant Data Leaks:** A developer writes a dashboard query but forgets to include `AND tenant_id = :current_tenant`. When a user from Tenant A logs in, they see the complete invoice logs of Tenant B, leading to compliance violations and contract breaches.
- **The Noisy Neighbor Outage:** Tenant A imports millions of customer contacts, running unindexed queries. The shared database hit 100% CPU, slowing down or crashing the API for all other tenants who share the database.
- **Schema Migration Failures on Multi-Schema setups:** Running schema upgrades on a schema-per-tenant architecture with 1,000 tenants. The migration runner fails on tenant 450, leaving the remaining 550 tenants running on old schemas, causing application errors.
- **Exhausted Connection Pools:** In a database-per-tenant pattern, establishing separate connection pools for hundreds of databases, exhausting available socket connections on application servers.

## 4. Best Practices

- **Enforce Database-Tier Row-Level Security (RLS):** In shared models, enable RLS policies. The database engine automatically injects the tenant filter into all queries before execution, preventing application bugs from leaking data.
  - *PostgreSQL RLS Example:*
    ```sql
    ALTER TABLE order_invoice ENABLE ROW LEVEL SECURITY;
    CREATE POLICY tenant_isolation_policy ON order_invoice
      USING (tenant_id = current_setting('app.current_tenant_id'));
    ```
- **Index the Tenant ID Leftmost in Composite Indexes:** Always include `tenant_id` in indexes. For tables queried by tenant and filter keys, create composite indexes with `tenant_id` as the leftmost column:
  - *Example:* `CREATE INDEX ON order_invoice (tenant_id, created_at);`
- **Use Dedicated Connection Pools for Shared Models:** Map application traffic to databases using connection proxies (PgBouncer) to prevent noisy neighbor traffic from exhausting connection limits.
- **Implement tenant routing at the connection pool level:** Resolve the tenant ID in the application and assign it to connection session variables immediately after checkout from the pool.
- **Segregate Enterprise Tenants to Isolated Nodes:** For high-value enterprise clients, route them to dedicated database instances using routing catalogs, preventing noisy neighbor impacts.

## 5. Common Mistakes / Anti-Patterns

- **Application-Only Tenant Filtering:** Relying on developers to remember to append `WHERE tenant_id = ?` in every application query.
- **No Tenant ID on Foreign Keys:** Omitting the `tenant_id` column on child tables, forcing slow joins to parent tables to check tenant ownership.
- **Sharing Cache Keys across Tenants:** Storing database query cache results in Redis using keys that lack tenant prefixes, leading to cross-tenant cached reads.
- **Running Multi-Schema migrations synchronously:** Upgrading tenant schemas in synchronous loops instead of asynchronous concurrent threads, prolonging maintenance windows.

## 6. Security Considerations

- **Secure Session Variables:** When using database session variables (like `current_setting('app.current_tenant_id')`) to drive RLS policies, ensure the application connection pool resets or clears session parameters immediately on check-in to prevent tenant credential leakage.

## 7. Performance Considerations

- **Shared Buffer Cache Pollution:** High-volume tenants can fill the database buffer pool cache with their data pages, evicting the pages of smaller tenants. Implement database-level read quotas or route large tenants to dedicated read replicas.

## 8. Scalability Considerations

- **Horizontal Tenant Sharding:** When the shared database reaches storage limits, shard the tables physically across multiple database servers using `tenant_id` as the sharding partition key, keeping query routes direct.

## 9. How Major Companies Implement It

- **Salesforce:** Operates a massive shared-database shared-schema multi-tenant infrastructure, using metadata catalogs to route customer records and database-tier filters to ensure tenant isolation.
- **Stripe:** Implements tenant partition routing, ensuring merchant transaction tables are segmented and query plans isolate ledger access.

## 10. Decision Checklist (Tenant Model Selection)

Select the multi-tenant architecture model:

- Use **Database-per-Tenant** when:
  - Regulatory compliance (HIPAA, PCI) requires absolute physical data isolation.
  - Customers are high-value enterprises willing to pay for dedicated infrastructure.
  - Tenants have highly customized schema requirement needs.
- Use **Shared-Database-Shared-Schema (with RLS)** when:
  - Operating standard B2B SaaS or B2C applications with thousands of small-to-medium users.
  - Minimizing database hosting cost is the primary constraint.
  - Schema consistency across all tenants is required.
- Use **Schema-per-Tenant** when:
  - You want logical isolation but want to share database memory and disk resources (use cautiously due to migration management complexity).

## 11. AI Coding-Agent Implementation Guidelines

- Never write schemas for shared multi-tenant tables without including a `tenant_id` column.
- Always include explicit database Row-Level Security (RLS) policy definitions in Postgres schemas.
- Always structure indexes with `tenant_id` positioned leftmost.
- Never write database connection templates that allow session variables to persist across transaction check-ins.
- Always recommend database-per-tenant isolation for enterprise tier environments.

## 12. Reusable Checklist

- [ ] Multi-tenant model (shared, schema-per-tenant, database-per-tenant) selected and approved
- [ ] `tenant_id` column present in all tables containing tenant-specific data
- [ ] Database-tier Row-Level Security (RLS) active on all shared tables
- [ ] Composite indexes configured with `tenant_id` in the leftmost position
- [ ] Connection session variables cleaned on pool checkout/check-in
- [ ] Database-per-tenant migration tools run asynchronously (concurrent executions active)
- [ ] Shared database telemetry alerts on noisy neighbor CPU and disk IOPS usage spikes
- [ ] Data sanitization prevents tenant session injection via connection settings
