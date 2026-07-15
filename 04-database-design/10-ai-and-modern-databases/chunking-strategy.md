# Chunking Strategies (Document Segmentation)

## 1. Definition & Core Concepts

Chunking is the process of breaking down large, continuous text documents into smaller, coherent segments (chunks) before generating vector embeddings, ensuring data fits within AI model context limits and preserves semantic specificity.

Core concepts:
- **Chunk Size:** The length of each text segment, measured in characters or tokens (e.g., 256 or 512 tokens).
- **Chunk Overlap:** The number of tokens shared between adjacent chunks (typically 10% to 20%), preventing context loss at segment boundaries.
- **Recursive Character Chunking:** A method that splits text using a hierarchy of separators (e.g., paragraphs, sentences, words) recursively until chunks fit target sizes, keeping sentences whole.
- **Semantic Chunking:** Splitting text based on changes in semantic meaning (measuring distance between sentences) rather than fixed token lengths.
- **Parent-Child Mapping:** A database schema pattern where small, granular "child" chunks are stored for vector searching, but map to larger "parent" documents in the database to return rich context to the LLM.

*(Boundary Note: Code-level tokenizers (e.g., TikToken, HuggingFace transformers), frontend document uploading widgets, and LLM text generation prompts belong in `backend-development/`. This document covers database-level chunk storage, parent-child relational schemas, chunk metadata tables, and index storage footprints.)*

## 2. Why It Exists / What Problem It Solves

Embedding models have strict input token limits (e.g., 512 or 8192 tokens). If a developer attempts to embed an entire 100-page manual in a single vector, two problems occur:
- The text exceeds the model's capacity limit, causing insertion errors.
- The semantic meaning of specific details is lost (diluted) in the average vector of the entire document.
Chunking divides text into optimal sizes, ensuring specific facts maintain distinct, high-fidelity vector representations.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Context Fragmentation (Broken LLM Answers):** Splitting text without chunk overlap. A critical fact is cut in half across Chunk A and Chunk B (e.g., "The server password is" in Chunk A, and "AdminSecure123!" in Chunk B). The vector search retrieves Chunk B, but because it lacks the context from Chunk A, the LLM cannot answer the user's question.
- **Semantic Dilution from Huge Chunks:** Designing chunks too large (e.g. 2000 tokens). The vector represents the general theme of the document, making it impossible for similarity searches to retrieve specific, niche paragraphs.
- **Database Storage & Index Bloat:** Designing chunks too small (e.g. 30 tokens) with high overlap. A single document generates millions of vectors, bloating the B-Tree and HNSW indexes, saturating database RAM, and slowing searches.
- **Orphaned Chunk Permissions:** A user queries the database. The vector search retrieves child chunks, but fails to check if the user has access permissions to the parent document, causing security leaks.

## 4. Best Practices

- **Use Recursive Character Chunking as Default:** Default to recursive splitting, separating by paragraphs first, then sentences, and finally words to keep logical semantic units intact.
- **Align Chunk Size with Embedding Model Limits:** Size chunks to match the embedding model's optimal input limits (typically 256 to 512 tokens for standard text retrieval models).
- **Configure 10%–20% Chunk Overlap:** Enforce a consistent token overlap (e.g., 50 tokens overlap for a 500-token chunk size) to maintain semantic continuity across boundaries.
- **Implement Parent-Child Schema Relationships:** Structure the database schema to split text:
  - Table 1: `parent_document` (stores full text, narrow metadata, strict RLS).
  - Table 2: `document_chunk` (stores child chunk text, foreign key `parent_id`, and `vector` column).
  Query the chunk table for vector similarity, but retrieve the parent text to feed the LLM.
- **Enrich Chunks with Metadata before Embedding:** Append parent document metadata (e.g., document title, section heading, author) directly to the child chunk text before generating the embedding, allowing the vector to capture data origin context.

## 5. Common Mistakes / Anti-Patterns

- **Fixed Character Splitting:** Splitting text strictly by character counts (e.g. every 500 characters), which cuts words and sentences in half.
- **No Chunk Overlap:** Splitting text without overlapping boundaries, causing context fragmentation.
- **Monolithic Table Storage:** Storing massive parent texts in the same table rows as the search vectors, causing disk buffer pollution.
- **Bypassing Parent ACLs:** Querying chunks directly without validating the user's access rights to the parent document.

## 6. Security Considerations

- **Inherited Access Control:** Always join the `document_chunk` table to the `parent_document` table in SQL query filters to inherit row-level security (RLS) policies, ensuring users only search chunks of documents they are authorized to view.

## 7. Performance Considerations

- **Index Cardinality:** B-Tree indexes on chunk tables scale with the number of chunks. Ensure `parent_id` foreign keys have indexes configured to optimize parent retrievals post-search.

## 8. Scalability Considerations

- **Asynchronous Chunking Pipelines:** Chunking and embedding are CPU-intensive operations. Perform document chunking asynchronously in background worker queues, writing the finalized child chunks and vectors to the database in batch writes.

## 9. How Major Companies Implement It

- **Stripe:** Uses parent-child database relationships to index API documentation. Search queries match specific child code snippet chunks, but the user interface displays the full parent documentation page.
- **Google:** Implements semantic segmentations across document indices, ensuring search results maintain contextual continuity.

## 10. Decision Checklist (Chunking Sizing Matrix)

Select the chunking configuration:

- Use **Recursive Character Chunking (256 - 512 tokens, 10% overlap)** when:
  - Storing standard unstructured text documents (manuals, articles, support logs).
  - You want a stable, high-performance default for RAG pipelines.
- Use **Document-Structure-Based Chunking (Markdown/HTML parsers)** when:
  - Text contains defined formatting structures (e.g., code repositories, API documentations, tables).
  - Splits should align with header structures (`#`, `##`).
- Use **Parent-Child Schema Split** on:
  - 100% of production-grade database systems built for Retrieval-Augmented Generation (RAG).

## 11. AI Coding-Agent Implementation Guidelines

- Never store large parent text documents in the same table rows as search vectors.
- Always implement a parent-child schema relationship (foreign keys) when designing vector databases.
- Always enforce recursive character chunking rules in document processing pipelines.
- Never allow child chunks to be queried without executing parent table security (RLS) joins.
- Always include chunk overlap configurations in document ingest scripts.

## 12. Reusable Checklist

- [ ] Parent-Child schema separation configured (Foreign keys active between chunks and parents)
- [ ] Document processing pipeline uses recursive character splitting (keeps sentences intact)
- [ ] Chunk size aligned with embedding model limits (typically 256–512 tokens)
- [ ] Chunk overlap configured to 10%–20% of chunk size
- [ ] Child chunks inherit access control permissions from parent tables (RLS verified)
- [ ] Index configured on the `parent_id` foreign key column in the chunk table
- [ ] Chunk text enriched with document metadata (title, header) before embedding
- [ ] Document ingest and chunking runs asynchronously in background queues
