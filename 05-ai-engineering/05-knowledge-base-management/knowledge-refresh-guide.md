# Knowledge Refresh Strategy

## 1. Definition & Core Concepts
Knowledge Refresh is the process of updating, sync-verifying, and pruning database document segments to ensure retrieved context matches the most current real-world state.

## 2. Why It Exists / What Problem It Solves
Corporate manuals, product details, and user profiles update continuously. If the database lacks synchronization hooks, RAG pipelines return stale or conflict-ridden responses, misleading users.

## 3. What Breaks in Production Without It
- **Stale Answers:** Users receive outdated billing prices because the search database contains old 2024 documents alongside 2026 updates.
- **Dangling Vector Records:** Deleted system files are still retrieved by vector search queries because database records were not updated.
- **Storage Saturation:** The search database grows continuously because unused or duplicate files are never pruned.

## 4. Best Practices
- **Implement CDC (Change Data Capture) pipelines:** Connect database mutations (inserts/updates/deletes) to vector index synchronizers.
- **Use segment timestamp checks:** Add `last_modified` properties to vector records; discard records if the source file timestamp updates.
- **Schedule automated pruning sweeps:** Set Time-to-Live (TTL) or run checks to delete vectors of deleted documents.

## 5. Common Mistakes / Anti-Patterns
- **Rebuilding databases daily:** Dropping and re-embedding the entire database from scratch every day (expensive at high scale).
- **Ignoring document deletions:** Deleting source files from object storage but leaving their vectors active in database indices.

## 6. Security Considerations
- **Sync Drift Vulnerabilities:** Ensure updates to user permission metadata sync instantly to prevent access policy violations.

## 7. Performance Considerations
- **Incremental Index Updates:** Perform incremental vector updates in small batches to prevent database write queue bottlenecks.

## 8. Scalability Considerations
- **Index Rebuilding:** Run index optimization scripts (e.g. HNSW rebuilds) during off-peak hours.

## 9. How Major Companies Implement It
- **GitHub:** Uses repository webhooks to trigger incremental code index updates on every commit merge.
- **Intercom:** Synchronizes help articles changes instantly using webhook loops, updating the AI support database.

## 10. Decision Checklist (Sync Models)
- Use **Event-Driven Sync (Webhooks/CDC)** when:
  - Changes must reflect in search results within seconds (e.g., ticket state changes).
- Use **Batch Sync (Daily Cron)** when:
  - Source data updates are infrequent (e.g., policy manuals updates).

## 11. AI Coding-Agent Guidelines
- Ensure that any delete event on primary database tables triggers a corresponding delete event on the vector database index.

## 12. Reusable Checklist
- [ ] Database updates connected to incremental vector sync webhooks
- [ ] Deleted source files trigger vector deletes in target databases
- [ ] Document timestamp comparison checks implemented in pipelines
- [ ] Index optimization tasks scheduled during off-peak hours
- [ ] Caching layers invalidated on document updates
- [ ] Data sync drift monitors active
