# Embeddings Fundamentals

## 1. Definition & Core Concepts
Embeddings are high-dimensional vector representations of text, images, or audio. They project semantic meaning into a continuous vector space where distance represents similarity. Dense vectors allow models to compare concepts mathematically rather than matching keywords.

## 2. Why It Matters for Building AI Products
Embeddings are the foundation of semantic searches, retrieval-augmented generation (RAG) pipelines, clustering models, classification tools, and recommendation engines.

## 3. How It Actually Works
- **Projection Layer:** The encoder model maps tokenized text to a dense vector (typically 256 to 3,072 dimensions).
- **Semantic Mapping:** The model is trained so that semantically similar sentences are positioned close together in the vector space.
- **Distance Metrics:** Similarity is measured using vector algorithms:
  - *Cosine Similarity:* Measures the angle between vectors (independent of length).
  - *Dot Product:* Measures directional agreement and length.
  - *Euclidean Distance:* Measures straight-line distance.

## 4. Common Misconceptions
- **Embeddings capture absolute truth:** They capture statistical correlations present in the model's training dataset, inheriting its biases.
- **Higher dimensions are always better:** Doubling dimensions increases storage and query times while offering diminishing returns on accuracy.

## 5. How It Constrains What's Possible in `05-ai-engineering/`
- **Lost Context:** Embeddings compress long paragraphs into a single vector, losing fine-grained details or ordering.
- **Dimensionality limits:** High dimensionality requires indexing (HNSW, IVF) to avoid slow database searches.

## 6. Key Terminology Glossary
- **Dense Vector:** Vector where most values are non-zero, representing rich feature spaces.
- **Cosine Similarity:** Normalized dot product, measuring directional alignment of vectors.
- **HNSW (Hierarchical Navigable Small World):** Graph-based index algorithm used for fast vector search.

## 7. Further Reading / Primary Sources
- *Efficient Estimation of Word Representations in Vector Space* (Mikolov et al., 2013)
- *Pinecone Vector Academy*

## 8. AI Coding-Agent Guidelines
- **Metric Consistency:** Always use the distance metric the embedding model was trained on (typically cosine similarity or dot product).
- **Chunk Sizing:** Limit text chunk sizes (100-500 tokens) before embedding to maintain semantic accuracy.
