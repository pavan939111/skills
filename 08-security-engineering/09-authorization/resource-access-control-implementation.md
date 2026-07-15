# Resource-Level Access Control

## 1. Definition & Core Concepts
Resource-Level Access Control (or Object-Level Authorization) is the security check that verifies whether an authenticated user has permission to access a specific instance of a resource (e.g. "User A can edit order #123, but not order #456").

## 2. Why It Exists / What Problem It Solves
Authentication verifies *who* the user is, and role checks verify *what* type of actions they can take. However, they do not verify ownership boundaries. Resource-level access control checks the relationships between users and objects to prevent unauthorized data access.

## 3. What Breaks in Production Without It
- **ID Harvesting Attacks (IDOR):** Attackers change ID variables in HTTP paths (e.g. /api/v1/invoices/100 to /api/v1/invoices/101) to view other customers' private data.
- **Cross-Tenant Leakage:** Users query databases and retrieve rows belonging to another corporate organization.

## 4. Best Practices
- **Never Rely on Client-side IDs:** Retrieve ownership identifiers from verified server-side session contexts, not query parameters.
- **Implement Row-Level Security (RLS):** Configure database schemas to automatically restrict queries based on active tenant tokens.
- **Use UUIDs instead of auto-incrementing IDs:** Use cryptographically secure UUIDs for public resource keys to prevent sequential ID harvesting.

## 5. Common Mistakes / Anti-Patterns
- **Assuming authentication guarantees authorization:** Checking if a user is logged in, but skipping ownership checks on database fetches.
- **Querying databases without filtering:** Executing SELECT * FROM invoices WHERE id = :id instead of SELECT * FROM invoices WHERE id = :id AND user_id = :current_user_id.

## 6. Security Considerations
- **IDOR Protection:** Ensure that every single database query fetching a resource includes filters mapping the resource to the authorized tenant or user ID.

## 7. Performance Considerations
- **Index-Aligned Filter Queries:** Ensure that compound database indexes include both the primary key and the ownership filter columns (e.g. (id, tenant_id)).

## 8. Scalability Considerations
- **Tenant Partitioning:** Isolate database tables by tenant ID to prevent accidental data bleed.

## 9. How Major Companies Implement It
- **Stripe:** Enforces strict resource-level controls on all APIs, restricting keys to specific organizations and validating ID parameters.

## 10. Decision Checklist (ID Conventions)
- Use **UUIDs (v4/ULID)** for:
  - All public-facing resource identifiers, API URLs, and client payloads.
- Use **Auto-Incrementing Integer IDs** for:
  - Internal database primary keys and indexing relationships, never exposing them in URLs.

## 11. AI Coding-Agent Guidelines
- Write database query methods that enforce ownership constraints by appending tenant or user ID filters to the query.

## 12. Reusable Checklist
- [ ] Database queries filter results using verified session identifiers
- [ ] Public-facing resource keys use cryptographically secure UUIDs (no integers)
- [ ] RLS policies configured on database schemas for tenant isolation
- [ ] Middleware checks resource ownership before executing updates
- [ ] API routes tested against IDOR harvesting attacks (unauthorized ID queries)
- [ ] Index configurations align with compound ownership queries (ID + Tenant)
