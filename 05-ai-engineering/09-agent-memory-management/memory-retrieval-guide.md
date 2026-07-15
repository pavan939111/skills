# Memory Retrieval

## 1. Definition & Core Concepts
Memory Retrieval is the programmatic process of querying, filtering, and fetching relevant context (episodic logs, semantic vectors, profile details) to assemble prompt payloads.

## 2. Why It Exists / What Problem It Solves
Unfiltered context injection wastes token limits and causes "lost in the middle" errors. Retrieval optimization ensures only high-relevance context segments reach the prompt, keeping latency and costs low.

## 3. What Breaks in Production Without It
- **Permission Leaks:** Retrieving document chunks the user is unauthorized to view.
- **Out-of-Date Answers:** RAG queries fetch old manuals instead of active revisions.
- **Prompt Bloat:** Saturating context windows with low-relevance logs.

## 4. Best Practices
- **Implement Pre-filtering:** Filter database rows by permission metadata before running vector similarity queries.
- **Use Two-Stage Retrieval:** Retrieve 25-50 candidates via hybrid search, then narrow to the top 3-5 using a reranking model.
- **Parallelize Search Queries:** Fetch user history, vector documents, and system settings concurrently.

## 5. Common Mistakes / Anti-Patterns
- **Post-filtering in code:** Retrieving vector matches and filtering by tenant in application memory, risking empty outputs.
- **Ignoring keywords indexing:** Relying solely on vector embeddings, missing exact alphanumeric code matches.

## 6. Security Considerations
- **Scope Isolation:** Enforce `tenant_id` and security permissions tags on all query routes.

## 7. Performance Considerations
- **Search Latency:** Run queries in parallel to keep retrieval steps under 100ms.

## 8. Scalability Considerations
- **Index constraints:** Index metadata filter columns to optimize database scans.

## 9. How Major Companies Implement It
- **Elasticsearch:** Combines keyword inverted indexes and vector kNN queries in single retrieval steps.
- **Pinecone:** Supports metadata namespaces to isolate client search indexes.

## 10. Decision Checklist (Retrieval Strategy)
- Use **Two-Stage Hybrid Retrieval (BM25 + Vector + Rerank)** when:
  - Designing production-grade RAG systems where precision is critical.
- Use **Simple Metadata Filtering** when:
  - Memory data is structured and key-value bound (e.g. fetching user preferences).

## 11. AI Coding-Agent Guidelines
- Programmatically implement pre-filtering constraints inside vector queries to prevent permission leakages.

## 12. Reusable Checklist
- [ ] Pre-filtering constraints active on database query routes
- [ ] Relational indexes active on all metadata filter columns
- [ ] Retrieval queries run in parallel threads
- [ ] Reranking threshold configured (e.g., discard scores < 0.3)
- [ ] Keyword BM25 indices active on text columns
- [ ] Integration tests verify multi-tenant isolation
