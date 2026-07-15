# Long-Term Context Management

## 1. Definition & Core Concepts
Long-Term Context is the management of persistent user profile data, organizational knowledge databases, and historical trends that span across multiple independent sessions.

## 2. Why It Exists / What Problem It Solves
Session memory is volatile and limited. Long-term context lets applications remember user preferences, recurring topics, and factual data over months without bloating the active prompt context window.

## 3. What Breaks in Production Without It
- **Repetitive Onboarding:** Systems ask users to re-define preferences at the start of every new session.
- **Context Bloat:** Prompts become saturated with historical transcripts, inflating token bills and latency.
- **Data Silos:** Relevant facts from previous chats are forgotten, leading to generic responses.

## 4. Best Practices
- **Implement Profile Extractors:** Use background workers to identify and extract user preferences (e.g. "prefers dark mode") from chat histories, saving them as metadata tags.
- **Layer Vector Databases:** Store raw transcripts as vector logs; query vectors dynamically via semantic search when queries match.
- **Configure Memory Pruning:** Periodically archive or delete old, unused long-term records.

## 5. Common Mistakes / Anti-Patterns
- **Unstructured Text Buffers:** Storing user preferences as a raw, growing text block that is appended to every prompt.
- **Ignoring GDPR Compliance:** Keeping user memory profiles indefinitely without offering "forget me" actions.

## 6. Security Considerations
- **PII Scrubbing:** Ensure PII (passwords, SSNs) is filtered from chat histories before saving them to long-term memory.

## 7. Performance Considerations
- **Asynchronous Extraction:** Run user profile extraction prompts in background queues to avoid slowing user chat loops.

## 8. Scalability Considerations
- **Vector Database Sizing:** Scale vector indices (HNSW) to handle long-term log histories across millions of users.

## 9. How Major Companies Implement It
- **ChatGPT:** Deploys a "Memory" feature that extracts facts (e.g., "user has a dog") from chats, storing them in structured user profile databases.
- **Mem.ai:** Indexes user notes and histories into vector stores, dynamically assembling context based on active topics.

## 10. Decision Checklist (Long-Term Storage)
- Use **Structured Metadata Tables** when:
  - Facts are distinct, explicit, and easy to classify (e.g., user preferences).
- Use **Vector Databases** when:
  - Context is unstructured text transcripts or documentation.

## 11. AI Coding-Agent Guidelines
- Never store long-term context records without configuring GDPR-compliant deletion endpoints for user profiles.

## 12. Reusable Checklist
- [ ] User preferences extracted and stored in structured metadata columns
- [ ] Historical transcript logs indexed in vector databases
- [ ] Background worker queues configured for profile extraction tasks
- [ ] PII filter rules active for long-term memory logs
- [ ] GDPR-compliant "delete user history" endpoints implemented
- [ ] Vector search retrieval thresholds optimized for relevance
