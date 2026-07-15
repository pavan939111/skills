# Embedding Storage

## 1. Definition & Core Concepts

Embedding Storage is the database schema design and configuration practice of storing, typing, and organizing high-dimensional vector arrays and their corresponding metadata payloads to enable efficient disk storage and fast query retrievals.

Core concepts:
- **Native Vector Datatypes:** Specialized column types (e.g., `vector(N)` in PostgreSQL's `pgvector` extension) designed to store binary floats compactly on disk.
- **Dimensionality (Dimension Width):** The length of the vector array (e.g., 384, 768, or 1536 dimensions) which must be declared statically in the schema definition.
- **Vector Normalization:** Adjusting a vector so its length (magnitude) equals 1. Normalizing vectors allows the database engine to use fast Dot Product calculations instead of Cosine Similarity.
- **Vertical Payload Segregation:** Splitting wide vector columns into a separate, dedicated table linked by a foreign key, keeping the primary metadata table narrow.

*(Boundary Note: Code-level ML model configurations, text embedding API orchestration, and client-side vector array parsing belong in `backend-development/`. This document covers database-level vector datatypes, dimension configurations, vertical table splits, and block storage footprints.)*

## 2. Why It Exists / What Problem It Solves

Vector embeddings are large data payloads. A single 1536-dimension float32 vector consumes 6KB of disk space. Storing millions of these vectors as plain JSON or text string arrays bloats database tables. This pollutes memory caches and slows down standard SQL queries. Embedding storage defines native datatypes and schema designs to compress vectors on disk and isolate their storage footprint from operational transactional tables.

## 3. What Breaks in Production Without It

- **Buffer Cache Exhaustion from Wide Rows:** Storing wide vector columns directly in the primary `user` or `document` table. When the database runs a standard SELECT query to read metadata (like title or username), it must load the massive vector floats into RAM, displacing hot page caches and slowing queries.
- **SQL Parsing Outages from String Storage:** Storing vectors as text strings (e.g., `'[0.12, 0.45, ...]'`) and parsing them back to arrays inside SQL queries. The parsing CPU overhead spikes latency to seconds under concurrent load.
- **Index Failures from Dimension Mismatches:** Failing to enforce strict dimension limits in the schema. An application writes a 768-dimension vector to a column where the index was built on 1536-dimension vectors, causing index traversal crashes.
- **Disk Out-of-Space from Raw Float Bloat:** Storing un-quantized raw float32 vectors for millions of documents without compression, exhausting storage capacity.

## 4. Best Practices

- **Use Native Vector Extensions and Types:** Always use native vector extensions (e.g. `pgvector` in PostgreSQL) and declare the dimension size statically:
  - *Example:* `CREATE TABLE document_embedding (id UUID REFERENCES document(id), embedding vector(1536));`
- **Isolate Embeddings using Vertical Partitioning:** Store the vector columns in a separate table (e.g. `document_embedding`) linked via a foreign key to the parent metadata table (e.g. `document`). This keeps the parent table narrow and optimized for standard queries.
- **Normalize Vectors Before Storage:** Enforce client-side or database-side vector normalization to enable fast inner-product (dot product) searches, which are faster to compute than cosine calculations.
- **Store Metadata Locally for Fast Filtering:** Keep critical query filters (like `tenant_id` or `created_at`) in the same table as the vectors to allow the optimizer to run metadata filtering *before* executing the similarity search.
- **Leverage Binary Vector Compression:** If using embedding models that support binary quantization (e.g., Cohere embeddings), store vectors using binary types (e.g., `bit` fields or native binary vectors) to reduce disk usage by 32x.

## 5. Common Mistakes / Anti-Patterns

- **Vector Storage in JSONB/Text:** Storing vector arrays as raw text or JSON fields.
- **Polishing Tables with Embedded Vectors:** Keeping vectors in high-frequency update tables, generating high WAL write amplification.
- **Ignoring Dimension Verification:** Defining open-ended vector columns without static dimension constraints.
- **Separating Metadata entirely from Vectors:** Storing vectors in an isolated vector DB and metadata in a separate SQL DB with no direct index link, forcing slow cross-database joins.

## 6. Security Considerations

- **Row-Level Security (RLS) on Vector Tables:** Ensure the RLS policies defined on parent metadata tables are also configured on the associated vector tables to prevent users from bypassing document security boundaries via vector similarity queries.

## 7. Performance Considerations

- **Disk Page Footprint:** Keep vector rows narrow to maximize the number of rows stored per disk page, reducing the number of physical disk page reads required to execute search queries.

## 8. Scalability Considerations

- **Metadata Filtering Performance:** Large-scale vector stores must scale metadata filtering. Index metadata columns (like `tenant_id`) alongside the vector indexes to allow the database to prune the search space early.

## 9. How Major Companies Implement It

- **Stripe:** Stores financial document embeddings in dedicated, vertically partitioned PostgreSQL tables, linking embeddings to metadata tables and running pgvector HNSW search indexes.
- **Netflix:** Stores video and customer recommendation embeddings in isolated Cassandra and vector nodes, ensuring search indexes are updated asynchronously.

## 10. Decision Checklist (Embedding Storage Layout)

Select the embedding storage layout:

- Use **Vertical Partitioning (Separate Vector Table)** when:
  - Designing relational database schemas (PostgreSQL pgvector).
  - The parent table contains wide columns (e.g., full text, description) or has high write traffic.
  - Standard metadata queries must remain optimized.
- Use **Inline Vector Storage (Same Table)** ONLY when:
  - The table contains almost no other columns except the ID and the vector.
  - The database is a dedicated, single-purpose vector index store.
- Use **Binary/Bit Vector Storage** when:
  - The embedding model natively outputs binary/bit vectors.
  - Minimizing memory and disk storage costs is the primary constraint.

## 11. AI Coding-Agent Implementation Guidelines

- Never store vector embeddings in `JSONB`, `TEXT`, or raw string columns.
- Always declare static dimensions on vector column definitions (e.g., `vector(1536)`).
- Always recommend vertical partitioning to separate vector columns from primary operational tables.
- Never write vector search queries that lack metadata filters (like `tenant_id`).
- Always configure row-level security policies directly on vector tables in multi-tenant schemas.

## 12. Reusable Checklist

- [ ] Native database vector extensions (e.g. pgvector) and types used
- [ ] Static dimension sizes declared on all vector columns
- [ ] Vector tables vertically partitioned (isolated from metadata tables)
- [ ] Embeddings normalized before insertion to enable dot product search
- [ ] RLS policies configured on vector tables matching parent table security
- [ ] Metadata filters (tenant keys, dates) indexed alongside vector columns
- [ ] Binary quantization used for compatible models to compress vector size
- [ ] Vector index built asynchronously to prevent transaction timeouts
