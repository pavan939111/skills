# Retrieval Optimization for RAG

## 1. Definition & Core Concepts
Retrieval Optimization is the set of techniques used to refine the search phase of RAG pipelines, including query expansion, parent-child chunk relations, and hierarchical retrieval.

## 2. Why It Exists / What Problem It Solves
Raw user queries are often short or poorly phrased, leading to low-quality vector search matches. Retrieval optimization translates or expands queries to improve matching precision.

## 3. What Breaks in Production Without It
- **Low Match Accuracy:** Queries fail to retrieve relevant documents because the user used different terms than those in the index.
- **Lost Context Details:** Small retrieved chunks lack the surrounding context the model needs to understand them.
- **Prompt Bloat:** Retrieving large, redundant document sections.

## 4. Best Practices
- **Implement Query Expansion:** Use a lightweight LLM step (e.g. Query2Doc or HyDE) to generate hypothetical answers or synonyms, using the expanded text to run the vector search.
- **Use Parent-Child Chunking:** Store small child chunks (e.g., sentences) for vector matching, but retrieve and feed their larger parent chunks (e.g., paragraphs) to the LLM.
- **Standardize Query Routing:** Route queries to specific indexes (e.g., documentation vs code) based on intent.

## 5. Common Mistakes / Anti-Patterns
- **Searching raw queries directly:** Running vector searches on short user inputs (like "help") without expansion or filtering.
- **Excessive HyDE loops:** Running heavy expansion prompts for simple searches, increasing latency and cost.

## 6. Security Considerations
- **Scope Verification:** Ensure query expansion steps do not inject search terms that bypass database filters.

## 7. Performance Considerations
- **Parallel Search Paths:** Run query expansion and vector searches in parallel where possible to optimize latency.

## 8. Scalability Considerations
- **Index partitioning:** Partition vector indexes by metadata categories to limit search candidate pools.

## 9. How Major Companies Implement It
- **Microsoft:** Uses query translation and rewrite steps in Bing chat services to match search indexes.
- **Google:** Employs dense retrieval optimizations to expand user queries semantically.

## 10. Decision Checklist (Optimization Methods)
- Use **Query Expansion (HyDE/Synonyms)** when:
  - User queries are short, conversational, or use diverse terminology.
- Use **Parent-Child Retrieval** when:
  - Retrieval requires high keyword precision but prompt generation requires broad context.

## 11. AI Coding-Agent Guidelines
- Programmatically map parent-child ID associations in RAG schemas to retrieve parent blocks during prompt generation.

## 12. Reusable Checklist
- [ ] Query expansion/rewriting pipeline active for short queries
- [ ] Parent-child chunk relationships mapped in database tables
- [ ] Query routing logic targets specific indexes by intent
- [ ] Search queries normalized (lowercase, stop-words stripped)
- [ ] Latency overhead of expansion steps monitored
- [ ] Search relevance evaluated against benchmark datasets
