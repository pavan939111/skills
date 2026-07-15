# Reranking Strategy for RAG

*For details on database-level reranker index setups and score mappings, see [Reranking Mechanics](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/reranking-strategy.md).*

## 1. Definition & Core Concepts
Reranking is the second-stage process of taking candidate documents retrieved from vector or hybrid searches and scoring them using a cross-encoder model to reorder them by exact relevance.

## 2. Why It Exists / What Problem It Solves
Vector database searches (first stage) are fast but lack keyword precision, sometimes returning irrelevant results that happen to be semantically close. Rerankers verify the exact relevance of each document-query pair, ensuring the most accurate context reaches the top of the LLM prompt.

## 3. What Breaks in Production Without It
- **Low RAG Accuracy:** The LLM receives semantically related but useless documents in its prompt, leading to incorrect answers.
- **High Token Costs:** Passing all retrieved vector candidates directly to the prompt, inflating billing costs.
- **Lost Details:** Important context is missed because it was ranked lower in the initial retrieval stage.

## 4. Best Practices
- **Implement two-stage search:** Retrieve 25-50 candidates using fast vector search, then narrow down to the top 3-5 using a reranking model.
- **Set relevance thresholds:** Discard documents with reranking scores below a specific threshold (e.g., score < 0.3).
- **Measure latency impact:** Set timeouts on reranking steps to prevent blocking user routes.

## 5. Common Mistakes / Anti-Patterns
- **Reranking raw databases:** Running rerankers across thousands of database rows. Rerankers are compute-heavy and should only evaluate a small candidate list.
- **Ignoring reranker timeouts:** Running reranking calls on real-time web routes without backup configurations.

## 6. Security Considerations
- **Metadata Filters:** Ensure permission metadata rules are applied to both the lexical and vector search stages.

## 7. Performance Considerations
- **Inference overhead:** Cross-encoders take 50-200ms to process candidates. Cap candidate counts to limit latency.

## 8. Scalability Considerations
- **Scale reranker nodes:** Scale reranking compute separately from primary database clusters.

## 9. How Major Companies Implement It
- **Algolia:** Layers neural rerankers on top of keyword search engines to improve result quality.
- **Pinecone:** Integrates Cohere Rerank directly into search helper classes.

## 10. Decision Checklist (Search Configuration)
- Use **Reranking Models** when:
  - building production-grade RAG systems where retrieval accuracy is critical.
  - Initial vector search results suffer from low keyword precision.
- Avoid **Reranking Models** when:
  - Target latency is under 50ms (cross-encoders take 50-200ms).

## 11. AI Coding-Agent Guidelines
- Always implement the two-stage retrieval pattern (Vector Retrieve $\rightarrow$ Rerank $\rightarrow$ LLM Prompt) in RAG database query classes.

## 12. Reusable Checklist
- [ ] Two-stage retrieval pattern implemented
- [ ] Reranking candidate pool capped (typical limit: 25-50 documents)
- [ ] Cross-encoder model hosted locally or low-latency API configured
- [ ] Latency impact of reranking stage measured separately
- [ ] Reranked output threshold set (e.g., discard documents with score < 0.3)
- [ ] Tenant access boundaries verified before passing data to rerankers
