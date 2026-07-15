# Reranking Models

## 1. Definition & Core Concepts
Reranking models are specialized cross-encoder neural networks that take a search query and a set of candidate documents and compute exact relevance scores for each pair (e.g. Cohere Rerank, BGE-Reranker).

## 2. Why It Exists / What Problem It Solves
Vector search (embeddings) is fast but can retrieve semantically related but irrelevant documents. Rerankers act as a second-stage filter, analyzing the query and retrieved documents in detail to reorder results, placing the most accurate context at the top of the RAG prompt.

## 3. What Breaks in Production Without It
- **Low RAG Accuracy:** LLMs receive irrelevant retrieved documents in their prompts, leading to incorrect or incomplete answers.
- **High Token Costs:** Passing all retrieved vector candidates directly to the prompt, inflating billing costs.
- **Lost Details:** Important context is missed because it was ranked lower in the initial retrieval stage.

## 4. Best Practices
- **Implement two-stage search:** Retrieve 25-50 candidates using fast vector search, then narrow down to the top 3-5 using a reranking model.
- **Limit candidate count:** Do not run rerankers on more than 100 documents to avoid latency overhead.
- **Deploy locally:** Use small, self-hosted cross-encoders to avoid external network API costs.

## 5. Common Mistakes / Anti-Patterns
- **Rerankers on raw databases:** Attempting to query entire databases using cross-encoder models.
- **Ignoring reranker latency:** Running reranking models on real-time web routes without setting timeouts.

## 6. Security Considerations
- **Data Filtering:** Ensure candidates passed to the reranking stage do not violate user authorization boundaries.

## 7. Performance Considerations
- **Compute overhead:** Cross-encoders are compute-heavy. Limit input sizes to minimize latency spikes.

## 8. Scalability Considerations
- **Concurrency Bottlenecks:** Scale reranker nodes independently of primary database clusters.

## 9. How Major Companies Implement It
- **Algolia:** Layers neural rerankers on top of keyword search engines to improve result accuracy.
- **Pinecone:** Integrates Cohere Rerank directly into search helper classes.

## 10. Decision Checklist (Reranker Selection)
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
