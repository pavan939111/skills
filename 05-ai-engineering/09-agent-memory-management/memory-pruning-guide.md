# Memory Pruning

## 1. Definition & Core Concepts
Memory Pruning is the systematic deletion, archiving, or summarizing of old, redundant, or low-relevance memory records (chat logs, vector segments, old profiles) to prevent context bloat and control database costs.

## 2. Why It Exists / What Problem It Solves
Unmanaged databases grow continuously, slowing query speeds and increasing storage costs. Pruning cleans up old records, keeping vector search indices fast and context sizes optimized.

## 3. What Breaks in Production Without It
- **Runaway Storage Costs:** Sating disk volumes with years of redundant chat transcript vectors.
- **Slow Query Latency:** Large databases cause search index performance to degrade.
- **Attention Dilution:** The model reads stale, contradictory facts retrieved from un-pruned histories.

## 4. Best Practices
- **Define Time-to-Live (TTL) Rules:** Set automatic expiration policies on volatile chat sessions (e.g., delete history after 30 days).
- **Run Semantic Summarization:** Consolidate older chat turns into a single summary paragraph, then delete the raw message logs.
- **Archive to Cold Storage:** Export older document versions to cheap storage tiers (like S3 Glacier).

## 5. Common Mistakes / Anti-Patterns
- **Keeping raw vectors forever:** Retaining raw, high-dimensional vector representations of old sessions.
- **Deleting data without auditing:** Deleting records that contain regulatory compliance archiving requirements.

## 6. Security Considerations
- **GDPR Compliance:** Ensure pruning scripts support user "forget me" actions, deleting records across all database tables.

## 7. Performance Considerations
- **Index Optimization:** Run database cleanup and index rebuild scripts (e.g. HNSW rebuilds) during off-peak hours to avoid blocking user routes.

## 8. Scalability Considerations
- **Disk cleanups:** Schedule automated temp file deletion sweeps on worker nodes.

## 9. How Major Companies Implement It
- **ChatGPT:** Periodically consolidates older conversation turns into user profile memory entries, archiving details.
- **Intercom:** Expires resolved support chat logs after configured data retention intervals.

## 10. Decision Checklist (Pruning Rules)
- Use **TTL Expiration** when:
  - Data is volatile, transient, and has no regulatory archiving requirements (e.g. chat sessions).
- Use **Semantic Summarization** when:
  - Historical context is still useful but raw logs are too long.

## 11. AI Coding-Agent Guidelines
- Programmatically configure TTL values in database table definitions to automate record pruning.

## 12. Reusable Checklist
- [ ] TTL expiration policies active on volatile memory tables
- [ ] Semantic summarization routines active for long threads
- [ ] Inactive document vectors flagged for automated deletes
- [ ] Database index rebuilding scheduled during off-peak hours
- [ ] GDPR-compliant "delete user memory" endpoints implemented
- [ ] Storage volume alerts set for database clusters
