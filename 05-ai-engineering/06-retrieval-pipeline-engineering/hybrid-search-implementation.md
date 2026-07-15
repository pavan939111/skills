# Hybrid Search for RAG

*For details on database-level keyword indexing and vector search integrations, see [Hybrid Search Mechanics](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/hybrid-search-strategy-implementation.md).*

## 1. Definition & Core Concepts
Hybrid Search is the combination of keyword-based lexical search (BM25) and semantic vector search (embeddings) to retrieve documents, using fusion algorithms to merge and rank results.

## 2. Why It Exists / What Problem It Solves
Vector search is excellent at understanding concepts (e.g. searching "dog" returns articles about "canines") but fails at finding specific alphanumeric codes, serial numbers, or exact keywords (e.g., searching "PR-482"). Hybrid search combines the strengths of both approaches.

## 3. What Breaks in Production Without It
- **Keyword Search Failures:** Users cannot search for specific error codes, part numbers, or exact names because the vector model misses the keyword match.
- **Low Retrieval Quality:** Search results return semantically related but contextually useless articles.
- **Broken Fusion Rankings:** Merging lexical and vector scores incorrectly, putting low-relevance results at the top of prompts.

## 4. Best Practices
- **Use Reciprocal Rank Fusion (RRF):** Combine keyword and vector rankings using the formula:
  $$RRF\_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$
  where $r_m(d)$ is the rank of document $d$ in system $m$, and $k$ is a constant (typically 60).
- **Configure index coverage:** Maintain both BM25 inverted indexes and HNSW vector indexes on document columns.
- **Normalize input queries:** Apply token filters (lowercase, stemmers) to lexical queries.

## 5. Common Mistakes / Anti-Patterns
- **Adding raw scores directly:** Summing lexical scores (which are unbounded) and vector similarity scores (which range from 0 to 1) directly, breaking ranking values.
- **Ignoring keywords indexing:** Skipping BM25 indexing configurations on text columns.

## 6. Security Considerations
- **Metadata Filters:** Ensure permission metadata rules are applied to both the lexical and vector search stages.

## 7. Performance Considerations
- **Parallel Query Execution:** Run BM25 and vector queries in parallel to keep search latency under 50ms.

## 8. Scalability Considerations
- **Memory footprints:** Inverted indexes and vector indexes both require RAM. Size database nodes accordingly.

## 9. How Major Companies Implement It
- **Algolia:** Layers vector similarity searches on top of their core keyword search engines to improve result quality.
- **Elasticsearch:** Provides native hybrid search queries combining BM25 scoring and kNN vector searches.

## 10. Decision Checklist (Search Configuration)
- Use **Hybrid Search (Lexical + Vector)** when:
  - Documents contain both structured codes (SKUs, IDs) and unstructured descriptions.
  - Search queries include exact keyword terms or product numbers.
- Use **Vector-Only Search** when:
  - Text is entirely conversational, and exact keyword matches are not required.

## 11. AI Coding-Agent Guidelines
- Programmatically implement Reciprocal Rank Fusion (RRF) in database query layers when merging raw lexical and vector search result sets.

## 12. Reusable Checklist
- [ ] BM25 inverted index active on text columns
- [ ] Vector HNSW index active on embedding columns
- [ ] Lexical and vector queries execute in parallel threads
- [ ] Reciprocal Rank Fusion (RRF) algorithm configured for ranking merges
- [ ] RRF constant parameter set (typically $k=60$)
- [ ] Alphanumeric code queries verified in retrieval tests
