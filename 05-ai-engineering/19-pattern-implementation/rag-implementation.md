# Retrieval-Augmented Generation (RAG)

## 1. Definition & Core Concepts
Retrieval-Augmented Generation (RAG) is an architectural pattern that retrieves relevant factual information from external knowledge sources and inserts that context directly into the LLM's prompt window before generation.

## 2. Why It Exists / What Problem It Solves
LLMs are limited by their training cutoff dates and are prone to hallucinating facts. RAG solves this by providing the model with real-time, verified domain data, bypassing the need for expensive model retraining or fine-tuning.

## 3. What Breaks in Production Without It
- **Hallucinated Responses:** Support bots invent product specifications or policy terms because they lack access to internal documents.
- **Outdated Output:** The system cannot answer queries about events or data changes that occurred after the model's training cutoff.
- **Lack of Citations:** Models generate advice but cannot point to the specific pages or database rows that justify the output.

## 4. Best Practices
- **Implement Chunking Strategies:** Break documents into semantically coherent segments (e.g. 200-500 tokens) with sliding overlaps to retain context boundaries.
- **Use Hybrid Search:** Combine dense vector search (semantic relevance) with sparse keyword search (BM25 for exact terms) to maximize retrieval precision.
- **Apply Reranking:** Fetch a broad set of candidate documents and run them through a reranking model (e.g., Cohere Rerank) to select the top 3-5 results.

## 5. Common Mistakes / Anti-Patterns
- **Feeding raw files directly:** Injecting massive unformatted documents into the prompt window, leading to context overflow and model confusion.
- **Ignoring semantic drift:** Failing to update vector database indices when master documentation files are revised.

## 6. Security Considerations
- **Row-Level Security (RLS) in Search:** Ensure that vector query operations respect user permissions so that users cannot retrieve documents they are unauthorized to read.

## 7. Performance Considerations
- **Retrieval Latency:** Embeddings generation and vector search can be slow. Build vector indices (e.g., HNSW) and run retrieval steps in parallel with query preprocessing.

## 8. Scalability Considerations
- **Vector DB Sharding:** Distribute vector indices across database shards to support millions of document chunks without latency degradation.

## 9. How Major Companies Implement It
- **Google:** Leverages grounding techniques across Workspace search engines, performing hybrid vector searches on internal cloud files to format answers.

## 10. Decision Checklist (RAG Implementation Rules)
- Enforce **Standard RAG** when:
  - Answering factual, document-bound user questions where retrieval queries can be generated in a single step.
- Enforce **Agentic RAG** when:
  - Answering complex questions requiring multi-step search, database joins, or iterative research loops.

## 11. AI Coding-Agent Guidelines
- Write modular RAG pipelines separating embedding generation, vector querying, reranking, and generation steps to facilitate testing.

## 12. Reusable Checklist
- [ ] Document parser extracts clean text, stripping headers and styling scripts
- [ ] Chunking logic splits files with semantic overlaps
- [ ] Vector database index configured with fast similarity metric (e.g. Cosine)
- [ ] Hybrid search combines dense vector and sparse keyword matching
- [ ] Reranking models sort and filter candidate context passages
- [ ] RLS policies restrict document retrieval based on user roles
