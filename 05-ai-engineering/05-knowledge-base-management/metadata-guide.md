# Knowledge Metadata Engineering

## 1. Definition & Core Concepts
Knowledge Metadata Engineering is the extraction and mapping of structural properties (e.g. author, publish date, target tenant, document category, permissions) to document segments during ingestion.

## 2. Why It Exists / What Problem It Solves
Vector database searches alone lack logical filters. Metadata engineering enables two-stage searches: filtering database rows by properties (like `tenant_id` or `permission_level`) before running vector comparisons, ensuring data boundaries are respected.

## 3. What Breaks in Production Without It
- **Permission Leaks:** Users view search results from pages they are not authorized to access because the system lacks permission metadata filters.
- **Out-of-Date Answers:** RAG queries retrieve stale 2021 logs instead of 2026 manuals because date metadata was not indexed.
- **Low Relevance:** Searches return general pages when the user specifically queried a single product category.

## 4. Best Practices
- **Define strict metadata schemas:** Standardize on key fields (e.g. `document_id`, `created_at`, `category`, `security_groups`).
- **Implement automated tag extraction:** Use regex or small classifier models to extract keywords during ingestion.
- **Index metadata fields:** Create database B-Tree indexes on metadata columns to optimize filtering speeds.

## 5. Common Mistakes / Anti-Patterns
- **Dynamic schema explosion:** Allowing arbitrary metadata key creation, breaking indexing algorithms.
- **Ignoring document updates:** Failing to update metadata properties when document content changes.

## 6. Security Considerations
- **Logical Security Filters:** Always apply security metadata checks (e.g., `user_roles` matches `document_access`) inside database query filters.

## 7. Performance Considerations
- **Index Sizing:** Keep metadata fields compact (e.g. using enums or integers) to minimize memory requirements.

## 8. Scalability Considerations
- **Multi-Tenant Sharding:** Use metadata fields like `tenant_id` as sharding keys in vector databases.

## 9. How Major Companies Implement It
- **Elasticsearch:** Leverages rich keyword metadata alongside token arrays to refine query recall.
- **Box:** Automatically tags corporate documents with owner, department, and security flags on ingestion.

## 10. Decision Checklist (Metadata Filters)
- Enforce **Strict Metadata Schemas** when:
  - Designing RAG pipelines requiring multi-tenant isolation or permission filters.
- Skip **Complex Metadata** when:
  - Document databases are public, public-facing, or non-relational.

## 11. AI Coding-Agent Guidelines
- Never deploy a RAG database table schema without adding index coverage for metadata columns like `tenant_id` or `created_at`.

## 12. Reusable Checklist
- [ ] Metadata schema defined and validated
- [ ] B-Tree indexes created on metadata columns
- [ ] Tenant identifier (`tenant_id`) enforced on all database query routes
- [ ] Security classification levels mapped to document segments
- [ ] Date properties formatted consistently (ISO 8601)
- [ ] Automated metadata extraction filters tested in pipeline runs
