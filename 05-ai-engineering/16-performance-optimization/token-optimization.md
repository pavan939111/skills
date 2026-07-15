# Token Optimization

## 1. Definition & Core Concepts
Token Optimization is the technical practice of designing, structuring, and compressing context payloads and model responses to utilize the minimum number of tokens necessary to achieve the desired outcome.

## 2. Why It Exists / What Problem It Solves
LLM providers bill based on token counts, and input prompts are prefilled on GPU hardware, meaning larger inputs translate directly to higher costs and latency. Token optimization aims to remove semantic redundancy, strip formatting overhead, and restrict model outputs to save costs and speed up response times.

## 3. What Breaks in Production Without It
- **Inflated Operational Budgets:** Applications send raw HTML or uncompressed JSON payloads to the LLM, inflating monthly API spend by 2 to 3 times.
- **Context Window Exceedance:** Processing large document corpora results in frequent prompt truncations or system crashes.
- **Attention Degradation:** Models fail to reference instructions placed in long, uncompressed context blocks (lost-in-the-middle phenomenon).

## 4. Best Practices
- **Compress Data Formats:** Strip extra whitespace, comments, and long field names from input JSON/CSV strings. Use compact text representations.
- **Implement Reranking (Retrieve-then-Filter):** Query a large set of candidate documents, but run them through a lightweight reranker (e.g. Cohere Rerank) to select only the top 3-5 most relevant chunks to place in the prompt.
- **Enforce Output Token Limits:** Instruct the model to respond concisely (e.g., "Respond in one sentence") and set `max_tokens` API parameters to prevent verbose, expensive completions.

## 5. Common Mistakes / Anti-Patterns
- **Sending Raw Markup:** Appending raw HTML, XML, or markdown scraped from websites without removing navigation headers, footers, and script blocks.
- **Redundant instructions:** Stating the same system guideline multiple times in different ways within the same prompt.

## 6. Security Considerations
- **Lossy Compression Risks:** Ensure that context compression algorithms (like LLMLingua) do not accidentally remove security rules, boundary guidelines, or negative constraints.

## 7. Performance Considerations
- **Compression Overhead vs. API Latency:** Evaluate if the time spent compressing the prompt locally (e.g. running a local BERT model to prune text) is less than the time saved in API pre-fill latency.

## 8. Scalability Considerations
- **Context Caching Compatibility:** Design prompt layouts so that dynamic elements (like user queries) are placed at the very end, keeping the prefix static to trigger provider context caching.

## 9. How Major Companies Implement It
- **Notion:** Compresses page contexts before sending them to Notion AI by converting HTML to lightweight markdown and stripping out all styling and navigation metadata.

## 10. Decision Checklist (Token Optimization Strategies)
- Use **Context Compression (e.g., LLMLingua)** when:
  - Feeding highly verbose inputs (like meeting transcripts or raw customer support tickets) where semantic density is low.
- Use **Lossless Reranking** when:
  - Exact technical terminologies, legal clauses, or code syntax elements must be preserved in the prompt.

## 11. AI Coding-Agent Guidelines
- Write pre-processors that convert verbose input formats (like database rows or HTML structures) into clean, token-dense representations (like markdown tables or pruned CSVs).

## 12. Reusable Checklist
- [ ] Inputs stripped of HTML tags, comments, script blocks, and styling metadata
- [ ] JSON/CSV strings compressed to remove extra whitespace and long key names
- [ ] Rerankers select only the most relevant chunks, filtering out low-scoring data
- [ ] Prompt templates structured to place dynamic parameters at the end (for caching)
- [ ] Model system prompt is concise and free of repetitive rules
- [ ] Output `max_tokens` configured and enforced at the client SDK level
