# Reranking (Two-Stage Retrieval)

## 1. Definition & Core Concepts

Reranking is the search optimization practice of using a secondary, highly accurate machine learning model (typically a Cross-Encoder) to re-evaluate and re-order the top candidate documents returned by a first-stage search (vector or hybrid search), maximizing result relevance before passing data to an LLM.

Core reranking concepts:
- **Two-Stage Retrieval:**
  - *Stage 1 (Retrieval):* A fast, low-cost search (vector/hybrid) designed to retrieve a medium-sized pool of candidates (e.g., top 50–100 documents) from millions of rows ($O(\log N)$).
  - *Stage 2 (Reranking):* A slower, high-cost comparison (Cross-Encoder) that evaluates the exact query and document text together, generating a precise relevance score ($O(K)$ where $K$ is the candidate pool size).
- **Cross-Encoder vs. Bi-Encoder:**
  - *Bi-Encoder (Vector search):* Computes query and document embeddings independently. (Fast, but ignores token-to-token interactions).
  - *Cross-Encoder (Reranker):* Processes the query and document text simultaneously through attention layers. (Highly accurate, but computationally expensive).
- **Relevance Score Filtering:** Discarding documents whose reranked relevance score falls below a defined quality threshold (e.g., score < 0.7).

*(Boundary Note: Code-level ML cross-encoder models initialization (e.g., Cohere Rerank SDK / HuggingFace pipelines), backend LLM prompt context injection, and client search inputs belong in `backend-development/`. This document covers database query limits for Stage 1, candidate pool size targets, RRF/score normalization interfaces, and search latency analysis.)*

## 2. Why It Exists / What Problem It Solves

Vector search (Bi-Encoder similarity) is fast and scales horizontally, but it struggles with keyword specificity, sentence structure, and complex negation (e.g., matching "not allowed to refund" with "allowed to refund" due to high vocabulary overlap). A reranker model acts as a second-pass filter. By executing token-to-token comparisons on a small subset of candidate documents, it ensures that the most relevant documents are positioned at the top, improving RAG accuracy.

## 3. What Breaks in Production Without It (or When Misapplied)

- **API Outages from Reranker Overload:** Attempting to rerank too many documents (e.g., sending 1,000 candidate documents to a Cross-Encoder model). Rerankers are computationally heavy; processing large pools saturates database server CPU or exhausts third-party API rate limits, crashing the query path.
- **Search Latency Spikes:** Running Stage 2 reranking synchronously on search paths without configuring pool limits, increasing search API response times from 30ms to over 800ms.
- **LLM Context Hallucinations:** The first-stage vector search returns semantically similar but irrelevant documents at the top of the search pool. Without a reranker, these irrelevant documents are fed to the LLM, leading to inaccurate answers.
- **No Relevance Score Throttling:** Passing low-relevance documents to the LLM when no relevant matches exist, forcing the LLM to generate answers based on irrelevant context.

## 4. Best Practices

- **Implement a Strict Candidate Pool Limit (Stage 1 Limit):** Restrict the first-stage vector/hybrid database query to return a maximum of 50 to 100 candidate documents.
  - *SQL Example:* `SELECT doc_id, text FROM document_chunk WHERE tenant_id = :tenant LIMIT 50;`
- **Restrict Reranker Inputs to Top 10–20:** Send only the top 10 to 20 reranked documents to the LLM to minimize prompt token usage and prevent "Lost in the Middle" LLM context degradation.
- **Enforce Relevance Score Threshold Filters:** Discard any document whose post-reranking relevance score falls below a minimum threshold (e.g., score < 0.65). If no documents pass, return an empty search state to prevent LLM hallucinations.
- **Run Rerankers in Dedicated Micro-Services:** Do not run CPU-heavy Cross-Encoder calculations on the main database server node. Offload reranking to dedicated GPU-backed workers or serverless model endpoints.
- **Cache Reranked Results:** Cache the final reranked document arrays for high-frequency user search queries using TTL-capped memory tables to avoid redundant CPU loops.

## 5. Common Mistakes / Anti-Patterns

- **Sending the Entire Database to the Reranker:** Attempting to use a Cross-Encoder as the primary search engine, which does not scale.
- **No Limit on Stage 1 Queries:** Pulling thousands of rows from the database into application memory for reranking.
- **Ignoring Network Hop Latency:** Using remote, third-party reranking APIs for real-time auto-complete search fields, adding WAN network delay.
- **No Quality Threshold Checks:** Passing low-score, irrelevant text chunks to the LLM.

## 6. Security Considerations

- **PII Leakage to Third-Party Rerankers:** If utilizing third-party hosted reranker API endpoints (e.g., Cohere/OpenAI), document text is sent over the internet. Verify that data processing agreements are in place, or run local, private Cross-Encoder models inside your secure VPC.

## 7. Performance Considerations

- **The Latency-Accuracy Trade-off:**
  - Reranking increases search accuracy (recall) but adds 50ms–200ms of latency depending on model size and candidate count. Keep candidate pools small ($K \le 50$) on latency-sensitive APIs.

## 8. Scalability Considerations

- **Parallel Candidate Retrieval:** Scale Stage 1 retrieval by adding read replicas or sharded vector databases, allowing candidate retrieval to run in parallel before consolidation at the reranker gateway.

## 9. How Major Companies Implement It

- **Stripe:** Applies two-stage retrieval to support query portals, retrieving candidates via pgvector search and reranking them using local Cross-Encoder models to prioritize exact developer syntax matches.
- **Google:** Employs multi-stage ranking pipelines in search engines, combining fast retrieval indices with heavy transformer models to finalize search result positioning.

## 10. Decision Checklist (Reranker Sizing Matrix)

Select the reranking configuration:

- Use **Two-Stage Retrieval (with Reranker)** when:
  - Designing RAG pipelines where LLM accuracy depends on highly relevant context documents.
  - Users search using complex, natural language questions (where vector similarity might miss context).
  - Search latency budgets allow for a 50ms–150ms processing window.
- Use **Stage-1-Only Search (Vector/Hybrid Only)** when:
  - Latency is the primary SLA bottleneck (e.g. real-time auto-suggest search fields, sub-20ms target).
  - The first-stage hybrid search has high accuracy for the target domain (e.g. structured e-commerce catalog).
  - Compute budgets cannot support GPU-backed Cross-Encoder hosting costs.

## 11. AI Coding-Agent Implementation Guidelines

- Always require a `LIMIT` constraint (max 50-100) on first-stage candidate database queries.
- Never write search templates that pass all retrieved database records directly to a Cross-Encoder.
- Always implement a post-reranking relevance score threshold filter.
- Never run CPU-heavy reranking models directly on the primary database server instance.
- Always recommend caching strategies for common search queries.

## 12. Reusable Checklist

- [ ] Two-stage retrieval pattern active (fast retrieval → precise reranking)
- [ ] First-stage database candidate retrieval limited to a maximum of 50–100 rows
- [ ] Reranking models executed on dedicated GPU instances or serverless endpoints (not on primary DB)
- [ ] Minimum relevance score threshold configured to filter out low-quality matches
- [ ] Reranked output limited to the top 10–20 documents before passing to the LLM
- [ ] Common search query results cached in memory (TTL active)
- [ ] Data security checked if third-party reranker APIs are utilized (PII checks)
- [ ] Search API latency measured with and without the reranking stage
