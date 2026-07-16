# Vector Search Strategy

### 1. The Question Decided
"Should the system deploy Vector Search (semantic similarity search), and does it run on dedicated vector databases (e.g. Pinecone) or relational extensions (e.g., pgvector)?"

### 2. Options Compared
| Dimension | Relational Extension (pgvector) | Dedicated Vector DB (Pinecone/Milvus) | In-Memory Graph Index |
|---|---|---|---|
| **Cost** | Low (Shared RDS instance) | High | Low |
| **Search Latency** | Low (<15ms) | Low (<10ms) | Extremely Low |
| **Complexity** | Low (Standard SQL joins) | High (Separate SDKs and API keys) | Medium |
| **Metadata Filter**| Dynamic (Single-stage filter SQL) | Variable (Pre/Post-filtering drops recall)| Complex |
| **Scale Ceiling**| Medium (<10M vectors) | Very High (>100M vectors) | Low (RAM bound) |

### 3. Decision Rule
- **Choose Relational Extension (pgvector) if:** Vector dataset is small to moderate (<5 million vectors), metadata filtering is complex (requires SQL joins), and low operational cost is a priority.
- **Choose Dedicated Vector Database if:** Datasets scale to tens of millions of vectors, requiring specialized HNSW indexing hardware and isolated search throughput.

### 4. Red Flags to Revisit
- Vector search queries sequence scan entire tables (recall drops) because HNSW index memory requirements exceed database host RAM limits.
- Search queries return incorrect results because metadata filters are applied post-query rather than dynamically during index traversal.

### 5. Where to Go Next
- For vector index structures, dimension configurations, and chunking strategies, see [Vector Database Design](../../04-database-design/10-ai-and-modern-databases/vector-database-design-strategy.md).
- For vector index memory calculations, see [Embedding Storage Guidelines](../../04-database-design/10-ai-and-modern-databases/embedding-storage-strategy.md).
