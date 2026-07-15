# Memory Update Strategies

## 1. Definition & Core Concepts
Memory Update is the strategy used to insert, update, or prune memory records (episodic traces, semantic vectors, user profiles) to ensure state coherence and prevent information conflicts.

## 2. Why It Exists / What Problem It Solves
Factual details and preferences change. If memory updates are unmanaged, systems accumulate contradictory records (e.g. Agent A writes "user is in Paris" while Agent B writes "user moved to London"), confusing downstream reasoning.

## 3. What Breaks in Production Without It
- **Contradictory Contexts:** Prompts contain conflicting user preferences, causing the model to generate inconsistent text.
- **Dangling Vector Records:** Deleted documents remain searchable because database rows were not updated.
- **Database Saturation:** Unmanaged log growth exhausts disk capacities.

## 4. Best Practices
- **Implement CDC (Change Data Capture) pipelines:** Connect database modifications directly to vector index updates.
- **Use timestamps and version tags:** Resolve conflicts by prioritizing records with the latest timestamps.
- **Implement dynamic profile consolidation:** Run background prompts periodically to merge redundant profile tags.

## 5. Common Mistakes / Anti-Patterns
- **Rewriting indices completely:** Dropping and re-embedding entire databases to process updates.
- **Ignoring document deletes:** Leaving stale vector records active.

## 6. Security Considerations
- **Sync Drift Vulnerabilities:** Enforce immediate propagation of permission metadata updates to block unauthorized searches.

## 7. Performance Considerations
- **Incremental updates:** Run index updates in small batches to optimize write query times.

## 8. Scalability Considerations
- **Index rebuilding schedule:** Run index optimizations (HNSW rebuilds) during off-peak hours.

## 9. How Major Companies Implement It
- **GitHub:** Uses repository commit hooks to trigger incremental code searches index updates.
- **Intercom:** Syncs customer help articles using event-driven webhooks.

## 10. Decision Checklist (Sync Protocols)
- Use **Event-Driven Updates (CDC)** when:
  - Updates must reflect instantly in search queries (e.g., ticket state changes).
- Use **Batch Consolidation (Cron)** when:
  - Processing volatile profile tags or general manuals updates.

## 11. AI Coding-Agent Guidelines
- Ensure delete events in primary tables trigger corresponding delete queries in the vector index.

## 12. Reusable Checklist
- [ ] CDC webhook triggers configured for index updates
- [ ] Deletions in source tables propagate to vector indexes
- [ ] Timestamp comparison checks resolve state conflicts
- [ ] Consolidation scripts run to merge duplicate profile tags
- [ ] Database updates run asynchronously
- [ ] Sync drift metrics monitored
