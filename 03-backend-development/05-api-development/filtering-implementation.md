# Filtering

## 1. Definition & Core Concepts
Filtering is the practice of restricting database records returned by APIs to those matching specific field criteria (e.g. status, date ranges).

## 2. Why It Exists / What Problem It Solves
Clients need to view specific slices of data. Executing database-level filters saves network transfer bandwidth and server memory.

## 3. What Breaks in Production Without It
- **Memory Exhaustion:** Returning massive database tables to client responses instead of filtered subsets.

## 4. Best Practices
- **Use Parameterized Filters:** Bind client parameters to SQL inputs to prevent SQL Injection.
- **Configure Index-Aligned Columns:** Ensure filter columns have database indexes configured.
- **Define Allowlist Filters:** Restrict filter fields to pre-defined allowed columns.

## 5. Common Mistakes / Anti-Patterns
- **Dynamic SQL Concatenation:** Concatenating client filter strings directly into queries.

## 6. Security Considerations
- **Tenant Scope Filters:** Enforce tenant filters to prevent cross-tenant data leaks.

## 7. Performance Considerations
- **Index Selection:** Create compound indexes for fields commonly filtered together.

## 8. Scalability Considerations
- **API Gateways:** Enforce global filtering rules at gateways where possible.

## 9. How Major Companies Implement It
- **Stripe:** Exposes standard filter parameters on list endpoints, validating fields against allowlists.

## 10. Decision Checklist (Filter Styles)
- Use **Strict Allowlist Parameters** when:
  - Building REST APIs with predictable, standard filtering requirements.

## 11. AI Coding-Agent Guidelines
- Write validators that check if incoming filter parameters exist in the allowed list before executing database queries.

## 12. Reusable Checklist
- [ ] Sort and filter fields verified against an allowed list of columns
- [ ] Dynamic parameters bound using parameterized SQL (no query concatenation)
- [ ] Database indexes active on popular filter and sort columns
- [ ] Sorting defaults defined for list endpoints (e.g. created_at descending)
- [ ] Error handler returns HTTP 400 when invalid filter fields are requested
- [ ] Compound indexes configured for multi-field search routes
