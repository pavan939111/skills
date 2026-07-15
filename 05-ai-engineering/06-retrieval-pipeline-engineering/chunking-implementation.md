# Chunking Strategy for RAG

*For details on database-level storage limits and chunk schema mappings, see [Database Chunking Mechanics](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/chunking-strategy.md).*

## 1. Definition & Core Concepts
Chunking is the process of splitting input documents into smaller, semantically coherent text segments (chunks) before generating embeddings and writing to vector databases.

## 2. Why It Exists / What Problem It Solves
LLMs have context window limits, and embedding models dilute meanings when parsing very large texts. Chunking ensures that search queries retrieve small, highly focused segments, saving token costs and maximizing model attention.

## 3. What Breaks in Production Without It
- **Lost Semantic Details:** Large document embeddings fail to match search queries because fine-grained details were averaged out.
- **Context Overflows:** Retrieving massive un-chunked files fills the LLM context window, causing completions to fail.
- **Accidental information truncation:** Slicing paragraphs mid-sentence, destroying sentence contexts.

## 4. Best Practices
- **Implement Semantic Chunking:** Split text at natural document boundaries (e.g. paragraphs, headings) rather than arbitrary character offsets.
- **Configure Chunk Overlap:** Standardize on 10% to 20% overlap (e.g. 500 token chunk with 50-100 token overlap) to preserve transitions across chunk boundaries.
- **Use HTML/Markdown headers hierarchy:** Maintain parent headings context in child chunks (e.g., prefixing child chunks with their parent section titles).

## 5. Common Mistakes / Anti-Patterns
- **Fixed-character slicing:** Splitting text strictly every 1,000 characters, frequently dividing words or numbers in half.
- **Zero overlap configurations:** Preventing context flows between adjacent segments.

## 6. Security Considerations
- **Boundary Checks:** Ensure chunk extraction does not bypass document-level security access tags.

## 7. Performance Considerations
- **Token alignment:** Match chunk sizes to the embedding model's optimal input lengths to prevent token truncation.

## 8. Scalability Considerations
- **Chunk indices size:** High chunk counts increase database row sizes, requiring fast indexing (HNSW).

## 9. How Major Companies Implement It
- **Notion:** Splits user pages by block elements (paragraphs, tables) to maintain layout coherence in search indices.
- **LlamaIndex:** Standardizes chunk parser nodes that extract markdown headers and inherit parent hierarchies dynamically.

## 10. Decision Checklist (Chunking Configurations)
- Use **Semantic Layout Chunking** when:
  - Documents contain clear hierarchies, tables, or lists (e.g. markdown manuals).
- Use **Recursive Character Chunking** when:
  - Processing raw, unstructured plain-text files without formatting headers.

## 11. AI Coding-Agent Guidelines
- Never deploy a chunking pipeline without validating that split chunks preserve sentence structures and include parent heading metadata.

## 12. Reusable Checklist
- [ ] Chunking parser configured for target document layouts
- [ ] Chunk overlap margin set to 10%-20% of chunk size
- [ ] Parent heading metadata prepended to child chunks
- [ ] Special character filtering active in extraction steps
- [ ] Checksum verification rules active during re-chunking runs
- [ ] Chunk size matches embedding model limits (e.g., 512 tokens)
