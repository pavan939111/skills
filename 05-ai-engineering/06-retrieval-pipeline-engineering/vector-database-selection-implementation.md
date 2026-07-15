# Vector Database Selection for RAG

*For details on database-level vector indexing structures and database selections, see [Vector Database Selection Mechanics](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/01-database-selection/vector-database-decision-matrix.md).*

## 1. Definition & Core Concepts
Vector Database Selection is the decision framework used to choose the optimal vector storage engine (dedicated vector databases vs vector extensions for relational databases) based on scaling targets, permission models, and deployment setups.

## 2. Why It Exists / What Problem It Solves
Selecting a vector database without evaluating project constraints can lead to high hosting costs, complex sync pipelines, or weak security boundaries. This framework matches search use cases to their correct database classes.

## 3. What Breaks in Production Without It
- **Permission Bypass Failures:** Replicating relational tables to dedicated vector databases without synchronizing user role permissions tables, allowing data leaks.
- **Sync Drift Issues:** Search queries return stale data because the sync script connecting SQL tables to vector indexes failed.
- **Runaway hosting budgets:** Deploying expensive, always-on vector instances for low-volume features.

## 4. Best Practices
- **Use extensions for simplicity:** If the database contains relational schemas, use extensions (e.g. `pgvector` in PostgreSQL) to run vector searches inside standard transactions.
- **Use dedicated engines for scale:** Deploy dedicated vector databases (e.g., Pinecone, Qdrant) only when vector scale exceeds tens of millions of records.
- **Configure HNSW/IVF indexing:** Optimize search latency by matching index configurations to database scale.

## 5. Common Mistakes / Anti-Patterns
- **Unnecessary multi-DB architectures:** Spinning up dedicated vector databases for under 10,000 document records when simple SQL extensions are more reliable.
- **Ignoring backup strategies:** Failing to schedule snapshots on standalone vector databases.

## 6. Security Considerations
- **Logical Security Filters:** Restrict vector search outputs to files the active user has permissions to view by applying metadata filters.

## 7. Performance Considerations
- **Index Build Times:** Building large HNSW indices is CPU-heavy. Plan index rebuild schedules during off-peak hours.

## 8. Scalability Considerations
- **RAM sizing:** Vector index algorithms (like HNSW) keep indexes in memory; ensure database RAM allocations can host total index sizes.

## 9. How Major Companies Implement It
- **Stripe:** Uses `pgvector` in PostgreSQL databases to maintain strict ACID properties and permission filters for customer search vectors.
- **Notion:** Leverages dedicated vector database clusters to scale workspace searches across millions of active user pages.

## 10. Decision Checklist (Database Selection)
- Use **Relational Vector Extensions (e.g. pgvector)** when:
  - Vector record count is under 5 million.
  - Queries require strict transactional consistency or complex relational joins.
- Use **Dedicated Vector Databases (e.g. Qdrant / Pinecone)** when:
  - Vector scale exceeds 5-10 million records.
  - High QPS search throughput ($>100\text{ QPS}$) is required.

## 11. AI Coding-Agent Guidelines
- Always implement pgvector first for SQL-based applications; only propose dedicated vector databases if QPS or record volume projections demand it.

## 12. Reusable Checklist
- [ ] Vector database scale limits defined
- [ ] Database selection aligns with relational joins and ACID constraints
- [ ] B-Tree index coverage configured for metadata filters
- [ ] Database memory (RAM) sized to host total HNSW indexes
- [ ] Automated snapshot and backup rules active
- [ ] Sync pipelines monitored for lag metrics
