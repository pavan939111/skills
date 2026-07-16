# Multi-Tenancy Implementation

## 1. Definition & Core Concepts
Multi-tenancy is an architectural model where a single running instance of a software application serves multiple distinct client organizations (tenants). The implementation focuses on isolating tenant workspaces, configuration states, and database schemas.

Isolation models:
- **Logical Separation (Shared Database):** All tenants share database tables. Isolation is enforced via a mandatory tenant filter column (e.g. `tenant_id`).
- **Schema Separation (Separate Schemas):** Tenants share the database server but have dedicated namespaces or schemas.
- **Physical Separation (Separate Databases):** Tenants have completely independent database servers, maximizing security boundaries.

## 2. Why It Exists / What Problem It Solves
It optimizes infrastructure cost and operational overhead. Hosting a separate application container and database instance for every customer is operationally complex and financially prohibitive. Multi-tenancy allows hundreds of customers to share the same resources.

## 3. What Breaks in Production Without It
- **Cross-Tenant Data Leaks:** A developer writes a new database query but forgets to include a `tenant_id = :current_tenant_id` filter clause, exposing customer A's private records to customer B.
- **Noisy Neighbor Outages:** A single active tenant triggers heavy analytics queries, exhausting the shared database connection pool and taking down the service for all other tenants.
- **Regulatory Penalties:** Enterprise clients discover their data is stored in the same physical tables as competitors without encryption, violating data residency audits.

## 4. Best Practices
- **Extract Tenant at the Boundary:** Resolve the tenant ID at the API Gateway or authentication middleware layer (e.g., from validated JWT claims), storing it in thread-local storage or request context.
- **Automate Query Filtering:** Use database ORM interceptors or Row-Level Security (RLS) to inject tenant filter clauses automatically on all database commands.
- **Enforce Tenant-Aware Connection Pools:** If using schema isolation, dynamically route connections to correct schema pools using tenant routing datasources.

## 5. Common Mistakes / Anti-Patterns
- **Passing Tenant ID in Query Parameters:** Relying on clients to pass `?tenantId=123` on write APIs, exposing the system to parameter tampering.
- **Hardcoding Schema Names:** Writing static raw SQL queries (e.g., `SELECT * FROM tenant_a.orders`) instead of injecting table prefixes dynamically.
- **Shared Memory Leaks:** Caching tenant-specific data in shared static variables without segregating cache keys by tenant ID.

## 6. Security Considerations
- **Strict User-Tenant Binding Check:** Validate that the authenticated user actually belongs to the resolved tenant ID before executing any domain action.
- **Tenant-Specific Encryption Keys:** Utilize tenant-specific KMS keys to encrypt sensitive columns at rest, preventing index leaks.

## 7. Performance Considerations
- **Index Tuning on Shared Tables:** Always build composite indexes starting with the tenant filter column (e.g., `INDEX idx_orders_tenant_user (tenant_id, user_id)`) to keep query scans fast.
- **Resource Quotas (Rate Limiting):** Configure API rate limits per tenant to prevent a single customer from exhausting thread pools.

## 8. Scalability Considerations
- **Tenant Migration Tooling:** Write automated scripts to easily migrate a fast-growing tenant's data from a shared database to a dedicated physical server without downtime.

## 9. How Major Companies Implement It
- **Salesforce:** Operates massive multi-tenant database clusters, relying on custom metadata directories to route and isolate tenant queries dynamically on shared tables.
- **Slack:** Manages tenant isolation by routing users to specific regional clusters, utilizing isolated databases to secure messages.

## 10. Decision Checklist (Tenant Routing)
- Use **Logical Shared DB** when:
  - Operating small-to-mid SaaS platforms where hosting costs must be low and setup must be fast.
- Use **Schema/Physical Isolation** when:
  - Working with healthcare or financial clients requiring strict data residency (HIPAA/GDPR) and dedicated encryption bounds.

## 11. AI Coding-Agent Guidelines
- Always write data repositories that fetch tenant IDs from context wrappers, automatically appending tenant filters to all query calls.

## 12. Reusable Checklist
- [ ] Tenant ID resolved securely from JWT claims in auth middleware (no query params)
- [ ] Thread-local/request context stores active tenant ID during request execution
- [ ] Database query interceptor automatically injects tenant_id filter clauses
- [ ] Tenant rate-limiting thresholds active at the gateway layer
- [ ] Database indexes on shared tables begin with tenant_id prefix
- [ ] Data migration scripts verified to isolate, export, and import tenant data\n