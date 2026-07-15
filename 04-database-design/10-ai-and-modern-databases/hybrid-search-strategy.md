# Hybrid Search (Combining Semantic & Keyword Search)

## 1. Definition & Core Concepts

Hybrid Search is the database querying pattern that combines keyword-based lexical search (e.g. BM25 / TF-IDF) with vector-based semantic search (Approximate Nearest Neighbor) to produce a single, unified set of search results that maximize both precision and recall.

Core concepts:
- **Lexical (Keyword) Search:** Finding documents using exact term matching, stemming, and tokenization (e.g. standard SQL text search or BM25). (Excellent for exact terms, names, and product serial codes).
- **Semantic (Vector) Search:** Finding documents based on meaning and context (distance calculations). (Excellent for conceptual matches and synonyms).
- **RRF (Reciprocal Rank Fusion):** An algorithm that merges the ranked lists of lexical and semantic searches by summing the reciprocals of their ranks, completely independent of raw score scales:
  $$RRF\_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$
  (where $k$ is a constant, e.g. 60, and $r_m(d)$ is the rank of document $d$ in system $m$).
- **Linear Score Combination:** Normalizing and weighting raw lexical and semantic scores to compute a combined score (e.g. $Score = 0.3 \times BM25 + 0.7 \times Cosine$). (Requires continuous tuning).

*(Boundary Note: Code-level frontend search bars, client-side NLP parsers, and UI rank sorting belong in `backend-development/`. This document covers database-level hybrid search schemas, RRF SQL functions, BM25 indexing, HNSW indexes, and query execution.)*

## 2. Why It Exists / What Problem It Solves

Keyword search matches exact terms but fails on synonyms (e.g., searching "how to fix phone" misses a document titled "smartdevice troubleshooting guide"). Conversely, semantic search matches meaning but fails on exact keywords, numbers, or brand names (e.g., searching for "Model X100" might return generic devices instead of the exact product code). Hybrid search combines the strengths of both, providing high precision for exact terms and high recall for conceptual queries.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Failed Merges from Skewed Scores:** Adding BM25 scores directly to Cosine Similarity scores. BM25 is unbounded (can be >100), while Cosine is bounded between -1 and 1. The keyword score completely dominates the vector score, neutralizing the semantic search benefits.
- **Double Query Execution Latency:** Executing a keyword search query against a relational database and a separate vector search query against an isolated vector store, then merging them in application code. The network chatter and serial database execution double API latency.
- **Low Query Throughput from Multi-Index Scans:** Running hybrid search on high-write systems without configuring index parameters. The database CPU saturates attempting to rebuild both B-Tree text indexes and HNSW graph indexes simultaneously.
- **Orphaned Results on Join Limits:** Merging lexical and semantic queries using inner joins. If a relevant document ranks high in semantic search but does not contain the exact keyword, it is filtered out completely, dropping search recall.

## 4. Best Practices

- **Use Reciprocal Rank Fusion (RRF) to Merge Results:** Use RRF to fuse rankings instead of adding raw scores. RRF is scale-agnostic and guarantees consistent merges without needing parameter tuning.
- **Run Lexical and Semantic Searches in a Unified Database:** Deploy databases that natively support both index types (e.g., Elasticsearch, OpenSearch, or PostgreSQL with pg_trgm and pgvector) to execute hybrid search in a single query planner cycle.
- **Index Both Search Columns Appropriately:**
  - Enforce full-text search indexes (GIN/BM25) on text columns.
  - Enforce vector graph indexes (HNSW) on embedding columns.
- **Pre-Filter Queries to Limit Rank Merging Costs:** Apply metadata filters (like `tenant_id` or `status`) first to restrict the search space before running RRF calculations, protecting database CPU.
- **Implement a Tunable Weighting Parameter:** If using linear combination, expose weights (e.g., `alpha` slider) in the query parameters, allowing dynamic adjustment of keyword vs semantic search balance.

## 5. Common Mistakes / Anti-Patterns

- **Raw Score Addition:** Adding BM25 and vector distance scores directly without normalization.
- **Application-Layer RRF Loops:** Pulling thousands of rows from two databases to run RRF in application code instead of executing the merge database-side.
- **Unindexed Keyword Columns:** Running hybrid search queries where the text search column lacks index coverage, forcing slow sequential table scans.
- **Strict Inner Joins for Merging:** Filtering out documents that do not appear in both search lists. Use Union joins and RRF sorting.

## 6. Security Considerations

- **Unified Security Boundary Filtering:** Ensure that both the lexical query and the semantic query apply the same row-level security constraints before merging ranks, preventing unauthorized documents from appearing in fused results.

## 7. Performance Considerations

- **Dual-Index Overhead:** Maintaining both keyword and vector indexes increases memory consumption and write amplification. Restrict hybrid search to primary searchable tables (e.g., articles, products), leaving logs and telemetry unindexed for search.

## 8. Scalability Considerations

- **Distributed Rank Fusing:** In sharded architectures, rank scoring must be executed locally on each shard first. The routing proxy then aggregates the top $N$ results from each shard to perform the final RRF merge, minimizing network traffic.

## 9. How Major Companies Implement It

- **Stripe:** Uses hybrid search in documentation and support portals, combining BM25 exact matching for API error codes with semantic search to identify conceptual issues.
- **Netflix:** Combines movie name keyword matches with semantic genre recommendations to return personalized movie lists to users.

## 10. Decision Checklist (Hybrid Search Implementation)

Select the hybrid search configuration:

- Use **Reciprocal Rank Fusion (RRF)** when:
  - You want a stable, scale-agnostic ranking merge without manual scoring calibration.
  - Lexical and semantic search scores cannot be normalized to a shared scale.
- Use **Linear Combination (Weighted Scoring)** when:
  - You have representative training data and can tune weights (e.g. 70% semantic, 30% lexical) to optimize results.
  - Both scores are normalized between 0 and 1.
- Never use **Independent Multi-Database Queries** when:
  - Search query throughput is high, and latency SLAs require sub-50ms query returns.

## 11. AI Coding-Agent Implementation Guidelines

- Never merge lexical and semantic search scores by direct addition in SQL statements.
- Always recommend database engines that support native hybrid indexing (e.g. pgvector + GIN).
- Always apply metadata filters (like `tenant_id`) first in hybrid search queries.
- Never use inner joins to merge keyword and vector search results — use UNION merges.
- Always include RRF SQL templates for merging ranked lists database-side.

## 12. Reusable Checklist

- [ ] Hybrid search strategy combines BM25 lexical index and HNSW vector index
- [ ] Reciprocal Rank Fusion (RRF) or normalized linear combination used to merge rankings
- [ ] Lexical and semantic searches executed in a single, unified database engine
- [ ] Text search columns covered by GIN or full-text indexes
- [ ] Row-Level Security (RLS) filters applied to both search channels before rank merges
- [ ] Pre-filtering active to prune search space using metadata keys (tenant/status)
- [ ] Unified database query returns top consolidated results in a single round-trip
- [ ] Writing and indexing performance profiled under concurrent query loads
