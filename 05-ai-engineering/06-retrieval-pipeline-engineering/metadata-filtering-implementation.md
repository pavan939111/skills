# Metadata Filtering for RAG

*For details on database-level metadata indexing schemas and partitioned indexes, see [Metadata Filtering Mechanics](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/metadata-filtering-implementation.md).*

## 1. Definition & Core Concepts
Metadata Filtering is the application of logical constraints (e.g. `WHERE tenant_id = 123`) to search queries to filter down candidate document pools before or during vector search execution.

## 2. Why It Exists / What Problem It Solves
Vector search databases return matches by proximity but do not inherently respect tenant or permission boundaries. Metadata filtering ensures queries only evaluate documents the active session is authorized to view.

## 3. What Breaks in Production Without It
- **Multi-Tenant Leakages:** Users query documents and receive search results from other customer accounts because tenant-ID filters were missing.
- **Out-of-Date Answers:** RAG queries retrieve expired policy manuals instead of active 2026 revisions.
- **Broken Permissions:** Users access search context from administrator-only channels.

## 4. Best Practices
- **Implement Pre-filtering:** Filter candidate document rows by metadata (e.g. tenant-ID, status) before running vector calculations to optimize performance.
- **Index filtering columns:** Create B-Tree indexes on all filtered metadata columns (e.g., `tenant_id`, `created_at`).
- **Enforce filters programmatically:** Append session validation checks directly to vector query structures in database classes.

## 5. Common Mistakes / Anti-Patterns
- **Post-filtering:** Retrieving 100 vector matches and then filtering by tenant-ID in code, frequently returning zero results if all matches belonged to other accounts.
- **Ignoring indexing needs:** Skipping database indexes on metadata columns, causing slow scan times under load.

## 6. Security Considerations
- **Boundary Verification:** Test metadata filtering rules against simulated injection values in automated integration tests.

## 7. Performance Considerations
- **Pre-filtering latency:** Pre-filtering reduces vector search workloads by narrowing the candidate list, improving query latency.

## 8. Scalability Considerations
- **Index constraints:** Ensure metadata indexes can host tenant maps across growing database scales.

## 9. How Major Companies Implement It
- **Pinecone:** Supports metadata index partitioning to let developers separate search databases by client tags.
- **PostgreSQL:** Combines relational B-Tree index filters and pgvector operators in single transaction paths.

## 10. Decision Checklist (Filter Implementations)
- Use **Pre-filtering (Database Level)** when:
  - Designing multi-tenant databases where customer data must remain isolated.
  - Candidate pools can be narrowed by criteria (e.g. `status = 'active'`).
- Avoid **Post-filtering (Application Level)** when:
  - Tenant scale or security boundaries require strict isolation.

## 11. AI Coding-Agent Guidelines
- Never write vector query code that lacks explicit filters for `tenant_id` and security permissions tags.

## 12. Reusable Checklist
- [ ] Tenant filters (`tenant_id`) enforced on all vector search routes
- [ ] Database indexes (B-Tree) active on all metadata filter columns
- [ ] Pre-filtering configured in database query execution plans
- [ ] Dynamic user session permissions validated before routing queries
- [ ] Inactive and expired document statuses filtered out by default
- [ ] Integration tests verify metadata isolation boundaries
