# Hybrid Search Strategy

### 1. The Question Decided
"Should the search boundary combine keyword (BM25) and semantic (vector) queries into Hybrid Search, and what scoring algorithm merges results?"

### 2. Options Compared
| Dimension | Lexical Only (BM25) | Vector Only (Semantic) | Hybrid Search (BM25 + Vector) |
|---|---|---|---|
| **Cost** | Low | Medium-High | High |
| **Search Latency** | Low | Low | Medium (Requires merger step) |
| **Recall Quality** | Medium (Keyword matches only) | High (Misses exact SKU matches) | Extremely High |
| **Complexity** | Low | High | Very High (Requires Reciprocal Rank Fusion) |

### 3. Decision Rule
- **Choose Hybrid Search if:** The application has high-quality search requirements (e.g. e-commerce search or RAG assistants) where users expect matching both exact SKUs/serial numbers (lexical) and abstract conceptual questions (semantic).
- **Avoid Hybrid Search if:** Search workloads are simple primary key lookups or simple keyword filters.

### 4. Red Flags to Revisit
- Search quality drops because raw lexical BM25 scores (unbounded) and cosine similarity scores (0 to 1) are added directly without ranking normalization, causing one score to dominate.
- Latency budgets are breached because the system runs two-stage queries and heavy reranking models synchronously.

### 5. Where to Go Next
- For ranking mergers, score normalizations, and Reciprocal Rank Fusion (RRF) algorithms, see [Hybrid Search Scoring Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/hybrid-search-strategy-implementation.md).
- For semantic search models, see [Reranking and LLM Optimizations](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/reranking-strategy.md).
