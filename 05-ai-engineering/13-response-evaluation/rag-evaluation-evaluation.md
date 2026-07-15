# RAG Evaluation

## 1. Definition & Core Concepts
RAG Evaluation is the systematic testing of RAG pipelines based on the "RAG Triad": Retrieval Relevance, Groundedness, and Answer Relevance.

## 2. Why It Exists / What Problem It Solves
It isolates failures. If an answer is wrong, RAG evaluation determines if the retrieval step failed (retrieved irrelevant documents) or if the generator step failed (hallucinated details despite correct context).

## 3. What Breaks in Production Without It
- **Stale Answers:** Users receive outdated billing prices because the search database contains old 2024 documents alongside 2026 updates.
- **Dangling Vector Records:** Deleted system files are still retrieved by vector search queries because database records were not updated.
- **Storage Saturation:** The search database grows continuously because unused or duplicate files are never pruned.

## 4. Best Practices
- **Define strict metrics:**
  - *Retrieval Relevance:* Did retrieved chunks match the query?
  - *Groundedness:* Was the answer derived from the retrieved chunks?
  - *Answer Relevance:* Did the answer address the user query?
- **Use frameworks (like Ragas/Truffle):** Automate Triad evaluation runs.
- **Track user feedback:** Log thumbs up/down actions.

## 5. Common Mistakes / Anti-Patterns
- **Rebuilding databases daily:** Dropping and re-embedding the entire database from scratch every day.
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
