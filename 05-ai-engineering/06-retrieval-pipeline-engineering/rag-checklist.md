# RAG Engineering Checklist

*For details on database-level vector indexing and database deployment readiness checklists, see [Database Production Checklists](../../04-database-design/12-production-checklists/production-readiness-strategy.md).*

## 1. Definition & Core Concepts
The RAG Engineering Checklist is the validation framework used to confirm that chunking rules, retrieval models, hybrid searches, rerankers, citations, and grounding strategies are properly configured before deploying RAG systems to production.

## 2. Why It Exists / What Problem It Solves
It ensures that all components of the retrieval pipeline are optimized for speed, cost, relevance, and security.

## 3. What Breaks in Production Without It
- **Runaway API Costs:** Bloated contexts and un-cached embeddings spike billing budgets under traffic.
- **Data Access Violations:** Missing tenant metadata filters leak private data across accounts.
- **Hallucinated Answers:** Grounding failures go undetected, leading to incorrect responses.

## 4. Best Practices
- **Run the checklist during CI/CD steps:** Automate validation checks.
- **Verify tenant filters:** Confirm partition metadata is active.
- **Audit citation coverage:** Test source mapping accuracy.

## 5. Common Mistakes / Anti-Patterns
- **Ignoring chunk overlaps:** Splitting sentences in half.
- **Skipping query normalization:** Matching queries with typos or raw casing.

## 6. Security Considerations
- **Logical Security Filters:** Ensure metadata filters apply to all search routes.

## 7. Performance Considerations
- **Parallel processing validations:** Verify parallel search execution times.

## 8. Scalability Considerations
- **Storage sizing checks:** Track embedding database scale.

## 9. How Major Companies Implement It
- **Microsoft:** Requires Azure Cognitive Search templates to pass internal format checklists.
- **Google:** Enforces data ingestion safety guidelines across enterprise pipelines.

## 10. Decision Checklist (Pipeline Validation)
- Use **RAG Validation Checklist** when:
  - Designing RAG pipelines or migrating database schemas.

## 11. AI Coding-Agent Guidelines
- Review the RAG engineering checklist to confirm template and query configurations are verified.

## 12. Reusable Checklist
- [ ] Chunking strategy configured with 10%-20% overlap
- [ ] Active embedding model and dimensions standardized
- [ ] Tenant identifier filters (`tenant_id`) enforced on all query routes
- [ ] Lexical and vector searches execute in parallel
- [ ] Reciprocal Rank Fusion (RRF) algorithm configured
- [ ] Two-stage retrieval pattern (Retrieve $\rightarrow$ Rerank) active
- [ ] Citation instructions and formatting rules verified
- [ ] Grounding rules and fallback messages configured
