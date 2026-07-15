# Memory Testing

## 1. Definition & Core Concepts
Memory Testing is the process of verifying that an agent's memory configurations (working caches, episodic logs, user profiles, semantic vector tables) store, retrieve, update, and prune data correctly.

## 2. Why It Exists / What Problem It Solves
Memory systems must persist details accurately. Testing ensures that information is not lost during transitions, old logs expire under TTL rules, and queries retrieve the correct user profiles.

## 3. What Breaks in Production Without It
- **Memory Loss on Crashes:** Reboots wipe active variables, forcing restarts.
- **Runaway Database Growth:** Old sessions logs are never pruned, inflating costs.
- **Permission Leaks:** Search queries retrieve records from other tenant accounts.

## 4. Best Practices
- **Enforce Tenant Filters:** Ensure queries validate user permissions tags before retrieval.
- **Implement TTL Rules:** Set automatic expiration policies on volatile tables (e.g. 30 days).
- **Run concurrency audits:** Verify row locking on write paths.

## 5. Common Mistakes / Anti-Patterns
- **In-memory states sharing:** Passing local objects between threads.
- **No data retention limits:** Sating disk capacity with old log databases.

## 6. Security Considerations
- **GDPR Compliance:** Ensure memory tables support user deletion endpoints.

## 7. Performance Considerations
- **Lookup Latency:** Keep profile lookups under 10ms.

## 8. Scalability Considerations
- **Storage Limits:** Track disk capacity.

## 9. How Major Companies Implement It
- **Confluence:** Uses state machine structures to manage page review pipelines.
- **Stripe:** Enforces strict state machines on invoice payment pathways.

## 10. Decision Checklist (Memory Testing)
- Use **Memory Validation Checklists** when:
  - Deploying new memory schemas, sync pipelines, or pruning cron tasks.

## 11. AI Coding-Agent Guidelines
- Programmatically configure TTL values in database table definitions to automate record pruning.

## 12. Reusable Checklist
- [ ] Ephemeral working memory cleared on loop exit
- [ ] Episodic traces schema active and stored out-of-process
- [ ] PII scrubbers active on memory ingestion paths
- [ ] User memory profiles support GDPR-compliant deletion rules
- [ ] Row locks prevent concurrent writes to shared states
- [ ] Auto-pruning retention limits configured on log tables
- [ ] Search queries enforce tenant identifier filters (`tenant_id`)
- [ ] Trace dashboards capture memory retrieval steps
