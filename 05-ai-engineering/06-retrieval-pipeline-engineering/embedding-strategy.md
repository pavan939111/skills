# Embedding Strategy for RAG

*For details on database-level vector indexing and database schemas, see [Embedding Storage Mechanics](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/embedding-storage-strategy.md).*

## 1. Definition & Core Concepts
Embedding Strategy is the process of generating semantic vector representations of text chunks and user queries using matching models to ensure search query vectors map accurately to relevant document vectors.

## 2. Why It Exists / What Problem It Solves
Vector search is only as good as the embedding representation. Strategy covers chunk embedding creation, query normalization, dimension alignment, and choosing domain-specific encoders to maximize retrieval accuracy.

## 3. What Breaks in Production Without It
- **Low Retrieval Accuracy:** Queries return unrelated context because the embedding model failed to understand domain-specific terms (e.g. medical codes).
- **Mismatched Search Indices:** Using different models for document indexing and user queries, returning corrupted search results.
- **High API costs:** Running un-cached embedding operations on repetitive search paths.

## 4. Best Practices
- **Standardize on one model:** Enforce the same embedding model and dimension size across all write and search paths.
- **Normalize vector outputs:** Ensure vectors are normalized ($L_2$ norm = 1) to allow using fast dot product distance metrics.
- **Prepend task prefixes:** Some models require adding instruction prefixes (e.g., "query:" or "passage:") before embedding.

## 5. Common Mistakes / Anti-Patterns
- **Changing models on live indexes:** Swapping the embedding model in configurations without re-indexing existing database rows.
- **Embedding raw HTML:** Retaining raw scripts and style tags, polluting vector representations.

## 6. Security Considerations
- **Vector Leakage:** Mathematical analysis of vectors can reconstruct private text; encrypt embedding tables at rest.

## 7. Performance Considerations
- **Batch embedding runs:** Group multiple text chunks into single API payloads to minimize network roundtrips.

## 8. Scalability Considerations
- **Index constraints:** Scale indexing structures (HNSW/IVF) as chunk counts grow.

## 9. How Major Companies Implement It
- **Stripe:** Uses Cohere multi-lingual embedding models to support documentation searches across international offices.
- **Notion:** Runs background embedding queues to index workspace updates in vector databases.

## 10. Decision Checklist (Embedding Selection)
- Use **General Purpose Encoders (e.g., text-embedding-3-small)** when:
  - Budget is a concern, and using dimension truncation (e.g. 512) is preferred.
- Use **Domain-Specific Encoders (e.g. PubMedBERT)** when:
  - Text contains highly specialized vocabularies.

## 11. AI Coding-Agent Guidelines
- Never deploy an embedding update without checking that the new model has a matching distance metric (e.g. cosine similarity) configured in the vector index.

## 12. Reusable Checklist
- [ ] Active embedding model name and dimensions documented
- [ ] Embedding query matches database distance metric configurations
- [ ] Batch processing active for ingestion indexing pipelines
- [ ] Task instruction prefixes (if required) prepended to query parameters
- [ ] Local embedding caching active to optimize costs
- [ ] Re-indexing playbook defined for future model upgrades
