# Semantic Memory inside AI Agents

## 1. Definition & Core Concepts
Semantic Memory is the structured representation of concepts, facts, domain knowledge, and organizational rules (e.g. documentation, API specs, schemas) stored in vector and graph databases.

## 2. Why It Exists / What Problem It Solves
Models lack knowledge of private business rules. Semantic memory provides a centralized, queryable knowledge repository, allowing agents to retrieve relevant facts (e.g., product details, tax rates) when processing user queries.

## 3. What Breaks in Production Without It
- **Factual Hallucinations:** The agent invents product features or pricing details because ground-truth context was missing.
- **Context window bloat:** Appending full policy manuals to every prompt, inflating token costs.
- **Inconsistent Answers:** Different agents return varying policy answers due to inconsistent search indexes.

## 4. Best Practices
- **Implement a two-stage search:** Retrieve candidates using vector similarity, then filter using BM25 lexical search.
- **Index metadata fields:** Create database B-Tree indexes on columns like `category` or `tenant_id`.
- **Verify data updates:** Connect CDC pipelines to sync vector indexes when source documentation changes.

## 5. Common Mistakes / Anti-Patterns
- **Vector search alone:** Relying solely on embeddings, missing exact alphanumeric code matches (SKUs, IDs).
- **Ignoring document versions:** Retrieving outdated files instead of active manuals.

## 6. Security Considerations
- **Scope Isolation:** Ensure search queries filter results by user permission levels.

## 7. Performance Considerations
- **Index Sizing:** Keep dimensions compact (e.g. using Matryoshka learning) to save RAM and speed up lookups.

## 8. Scalability Considerations
- **Multi-Tenant Sharding:** Partition vector tables by client tags to maintain search speed at scale.

## 9. How Major Companies Implement It
- **Confluence:** Indexes corporate pages into vector search engines, powering semantic workspace searches.
- **Amazon:** Uses graph ontologies to represent catalog relationships for AI search.

## 10. Decision Checklist (Memory Architectures)
- Use **Semantic Memory (Vector/Hybrid Search)** when:
  - Designing RAG systems where agents require access to domain documentation.
- Use **Relational Tables** when:
  - Facts are structured, numeric, and transactional.

## 11. AI Coding-Agent Guidelines
- Programmatically enforce `tenant_id` filters on all semantic search routes to ensure tenant isolation.

## 12. Reusable Checklist
- [ ] Hybrid search indexes configured (BM25 + HNSW vector)
- [ ] B-Tree index coverage active on metadata columns
- [ ] User permission filters applied on all search routes
- [ ] Ingestion updates sync automatically (CDC active)
- [ ] Caching layers check vector updates to minimize latency
- [ ] Integration tests verify metadata isolation boundaries
