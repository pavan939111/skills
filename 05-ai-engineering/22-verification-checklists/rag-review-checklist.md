# Per-Change RAG Review Checklist

## 1. Purpose
This checklist is used to review updates to RAG configurations, chunking parameters, embedding indexes, metadata tags, search models, or citation instructions before deployment.

## 2. Checklist

### Chunking & Retrieval
- [ ] Chunk sizes (e.g. 500 tokens) and overlaps (e.g. 50 tokens) match document structure edits.
- [ ] Metadata filters (e.g., date, organization, user access) verified to isolate queries.
- [ ] Retrieval candidates (K number) calibrated to balance context size and cost.

### Synthesis & Citation
- [ ] Citations and grounding rules instructions verified in prompts.
- [ ] Reranking models (e.g. Cohere Rerank) tested on sample queries to ensure relevance improvements.
- [ ] Fallback responses defined for empty vector database returns.

### Embedding Indexes
- [ ] Changing embedding models requires rebuild schedules for vector tables.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- Embedding Strategy
- [Retrieval Optimization](../06-retrieval-pipeline-engineering/retrieval-optimization.md)
- [RAG](../19-pattern-implementation/rag-implementation.md)

## 4. Sign-off Criteria
The per-change RAG review passes when:
1. 100% of checklist points are verified.
2. Vector query checks confirm that search results respect Row-Level Security (RLS) policies.
3. Automated RAG evaluations (Ragas faithfulness/relevance scores) confirm no degradation on the test dataset.
