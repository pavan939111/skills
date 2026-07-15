# Metadata Filtering (Pre-filtering vs. Post-filtering)

## 1. Definition & Core Concepts

Metadata Filtering is the practice of restricting vector similarity search results based on structured scalar attributes (such as `tenant_id`, `created_at`, `category`, or `is_public`) to ensure query accuracy, security isolation, and data relevance.

Core filtering strategies:
- **Post-Filtering:** The database executes the vector similarity search first, retrieves the top $K$ nearest neighbors (e.g., $K=100$), and then applies the metadata filter to discard irrelevant rows.
- **Pre-Filtering:** The database applies the metadata filter first to isolate the valid document set, and then executes the vector similarity search on only the matching rows.
- **Single-Stage (Iterative) Filtering:** The database engine traverses the vector index graph (e.g., HNSW) and evaluates metadata constraints at each node dynamically, avoiding the limitations of both pre- and post-filtering.

*(Boundary Note: Code-level query builders, application-tier filter schemas, and user UI selection widgets belong in `backend-development/`. This document covers database-level filter execution strategies, HNSW graph traversal filters, metadata index DDLs, and search recall degradation.)*

## 2. Why It Exists / What Problem It Solves

Vector indexes (like HNSW) are independent graph structures. They only understand vector distance, not metadata like tenant ownership or publication date. If a user queries "refund policies" within a specific folder, a raw vector search might return matches from outside that folder. Metadata filtering combines structured SQL-like criteria with vector search to restrict query scopes.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Recall Collapse from Post-Filtering:** Using post-filtering in multi-tenant SaaS. A query requests the top 10 matches for Tenant A. The database retrieves the top 10 vectors globally. However, 9 of them belong to other tenants and are discarded by the post-filter. The user receives only 1 search result instead of 10 (Recall Collapse).
- **Index Bypasses (CPU Spikes) from Pre-Filtering:** Using pre-filtering on engines that cannot reuse the vector graph after filtering. The pre-filter isolates a small subset of rows. Because the HNSW graph is broken for this subset, the database engine falls back to a slow, brute-force table scan (Flat Search), saturating CPU.
- **Security Leaks across Tenants:** Failing to apply strict metadata filtering on tenant boundaries, allowing users to view cached vector snippets of other customers.
- **Slow Queries from Unindexed Metadata Filters:** Filtering by unindexed metadata columns, forcing the query optimizer to perform sequential scans on large tables before executing the vector search.

## 4. Best Practices

- **Avoid Post-Filtering for Security Boundaries:** Never use post-filtering for multi-tenant isolation or critical access control lists (ACLs). Use single-stage filtering or shard databases by tenant.
- **Enforce Single-Stage (Iterative) Filtering:** Select vector engines (like pgvector, Pinecone, or Milvus) that support single-stage filtering, allowing the search to traverse the HNSW index while verifying metadata constraints at each graph node.
- **Index Metadata Columns:** Ensure all columns targeted by metadata filters (e.g., `tenant_id`, `created_at`, `status`) are indexed using standard B-Tree indexes or composite indexes.
- **Use Composite Indexes for Vector Metadata:** In PostgreSQL pgvector, create partial indexes or composite indexes that combine metadata keys with vector definitions to speed up filtered searches.
  - *Example:* `CREATE INDEX ON document_embedding (tenant_id) INCLUDE (embedding);`
- **Pre-Filter only when Selectivity is High:** If using database engines that execute pre-filtering via flat scans, apply it only when the metadata filter is highly selective (e.g. matching <1% of rows), keeping scan overhead low.

## 5. Common Mistakes / Anti-Patterns

- **Post-Filtering Multi-Tenant Data:** Using post-filtering for tenant isolation, leading to data leaks and empty result pages.
- **Unindexed Metadata Filters:** Running filtered vector searches where the scalar columns lack indexes.
- **Over-Filtering HNSW Graphs:** Applying highly restrictive pre-filters on HNSW indexes, forcing the engine to bypass the graph and execute slow flat scans.
- **Ignoring Null Filters:** Allowing null metadata values to bypass filters, exposing data.

## 6. Security Considerations

- **Row-Level Security (RLS) Integration:** In PostgreSQL, ensure RLS policies are active on both the metadata table and the vector table. The database engine automatically injects the RLS filters into the vector query plan as pre-filters, preventing unauthorized data access.

## 7. Performance Considerations

- **The Filter Selectivity Threshold:**
  - *High Selectivity (few rows match):* Pre-filtering is fast because the database only scans a few rows.
  - *Low Selectivity (many rows match):* Single-stage HNSW graph traversal is faster because it utilizes index graphs instead of scanning tables.

## 8. Scalability Considerations

- **Shard-Key Routing:** Shard the database using the primary metadata filter key (e.g. `tenant_id`). This completely isolates datasets physically, eliminating the need to execute cross-node metadata filtering.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict single-stage metadata filtering in billing search engines, ensuring that merchant queries are scoped strictly using indexed merchant IDs before vector comparisons run.
- **Salesforce:** Integrates row-level access control lists (ACLs) directly into vector search pipelines, filtering document visibility dynamically during database graph traversals.

## 10. Decision Checklist (Filtering Strategy Selection)

Choose the filtering strategy based on query requirements:

- Use **Single-Stage (Iterative) Graph Filtering** when:
  - You are operating a multi-tenant SaaS application (ensures security and high recall).
  - The vector engine natively supports metadata evaluation during HNSW traversal.
- Use **Pre-Filtering** when:
  - The metadata filter is highly restrictive (matches <5% of database rows, making flat scans fast).
- Never use **Post-Filtering** for:
  - Multi-tenant data isolation.
  - Enforcing document access privileges.
  - Queries requesting consistent Top-K result counts.

## 11. AI Coding-Agent Implementation Guidelines

- Never write vector search queries that utilize post-filtering for multi-tenant isolation.
- Always recommend database engines that support native single-stage (iterative) metadata filtering.
- Always ensure all metadata filter columns (like `tenant_id`) have corresponding B-Tree indexes.
- Never write vector queries that allow filters to bypass Row-Level Security checks.
- Always include composite index configurations in DDL schemas containing vector columns.

## 12. Reusable Checklist

- [ ] Single-stage (iterative) filtering selected for multi-tenant vector searches
- [ ] Post-filtering prohibited for security boundaries and tenant isolation
- [ ] Metadata filter columns (e.g. `tenant_id`, `created_at`) backed by B-Tree indexes
- [ ] Row-Level Security (RLS) active and verified on vector tables
- [ ] Composite/Partial indexes configured combining metadata keys with vector fields
- [ ] Vector search query planner verified to execute index seeks (no flat scans on large datasets)
- [ ] Data sanitization active to prevent SQL injection via metadata filter inputs
- [ ] Search recall measured and verified to remain high under metadata constraints
