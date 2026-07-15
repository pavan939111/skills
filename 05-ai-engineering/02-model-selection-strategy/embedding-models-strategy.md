# Embedding Models

## 1. Definition & Core Concepts
Embedding models are specialized neural networks (typically encoder-only architectures) that convert input text into high-dimensional numerical vectors (embeddings) representing semantic meaning (e.g. OpenAI text-embedding-3, Cohere Embed, BGE).

## 2. Why It Exists / What Problem It Solves
Standard generative models are too slow and expensive for search tasks. Embedding models compress documents into static vector tables, allowing vector databases to perform fast similarity searches (e.g., finding relevant context for RAG).

## 3. What Breaks in Production Without It
- **Slow Query Performance:** Trying to find matching documents by running LLM scans across entire tables.
- **Low Retrieval Quality:** Vector searches return irrelevant context because the chosen embedding model lacks the required vocabulary or dimension count.
- **High Vector Storage Costs:** Choosing excessively high dimensions (e.g., 3,072) for simple catalog items, bloating database costs.

## 4. Best Practices
- **Match dimensions to scale:** Use OpenAI's dimensionality reduction (Matryoshka Representation Learning) to truncate vectors (e.g. 1536 to 512) and save database storage.
- **Normalize vectors:** Ensure embedding vectors are normalized ($L_2$ norm = 1) to allow fast dot product comparisons.
- **Set chunk parameters:** Match chunk sizing to model limits (typically 512 or 8192 tokens).

## 5. Common Mistakes / Anti-Patterns
- **Using Different Models:** Generating document embeddings with one model and search query embeddings with another, breaking search results.
- **Embedding massive files:** Feeding full books into a single embedding call, losing local details.

## 6. Security Considerations
- **Vector Leakage:** Encrypt embedding tables; mathematical reconstruction can leak original text inputs.

## 7. Performance Considerations
- **Batch embedding runs:** Batch multiple text lines in single API calls to minimize network roundtrips.

## 8. Scalability Considerations
- **Index constraints:** High dimensional vectors require HNSW/IVF indexing to scale searches.

## 9. How Major Companies Implement It
- **Stripe:** Uses Cohere Embed models to power documentation searches across support platforms.
- **Notion:** Encodes user workspace pages into vector databases, enabling semantic query searches.

## 10. Decision Checklist (Embedding Selection)
- Use **Lightweight Embeddings (e.g., text-embedding-3-small)** when:
  - Storage cost is a priority.
  - Using Matryoshka learning to truncate dimension counts (e.g., 256 or 512).
- Use **Domain-Specific Embeddings (e.g., BioBERT)** when:
  - Text contains highly specialized vocabularies (e.g. medical, legal terms).

## 11. AI Coding-Agent Guidelines
- Never change the embedding model inside a production database without planning a complete re-embedding migration for all existing records.

## 12. Reusable Checklist
- [ ] Document embedding model name and dimensions documented
- [ ] Database distance metric matches model design (e.g., cosine similarity)
- [ ] Matryoshka truncation parameters set to optimize storage
- [ ] Input chunk size limits checked against model context boundaries
- [ ] Batch processing active for initial data embedding runs
- [ ] Data privacy rules verified for external embedding API integrations
