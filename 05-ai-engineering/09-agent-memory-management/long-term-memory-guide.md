# Long-Term Memory

## 1. Definition & Core Concepts
Long-Term Memory is the persistent storage of user preferences, historical patterns, and system interactions that span across multiple independent sessions, allowing agents to maintain continuity over time.

## 2. Why It Exists / What Problem It Solves
Session memory is transient and limited. Long-term memory stores facts (e.g. "user prefers python", "company uses AWS") in database tables, letting agents personalize interactions without bloating active prompt context windows.

## 3. What Breaks in Production Without It
- **Repetitive Onboarding:** Chat systems ask users to re-define preferences at the start of every new session.
- **Context Bloat:** Prompts become saturated with historical transcripts, inflating token bills.
- **Diverging Agent Tone:** Agents forget user preferences, leading to generic and unaligned responses.

## 4. Best Practices
- **Implement Background Memory Extractors:** Use background prompts to extract facts from chat logs, saving them as structured metadata columns.
- **Enforce GDPR Deletion Compliance:** Provide API endpoints to let users view, edit, or delete their profile memory records.
- **Use Key-Value Stores:** Store structured user profiles in fast databases (like Redis or DynamoDB).

## 5. Common Mistakes / Anti-Patterns
- **Unstructured text dumps:** Appending a raw, growing text block of user facts to every prompt.
- **No data expiration:** Retaining stale profiles indefinitely.

## 6. Security Considerations
- **PII Scrubbing:** Ensure private details (SSNs, passwords) are filtered before writing to long-term memory.

## 7. Performance Considerations
- **Async Execution:** Run profile extraction scripts in background queues to avoid adding latency to chat routes.

## 8. Scalability Considerations
- **Storage Limits:** Set size limits on user memory profiles to control database growth.

## 9. How Major Companies Implement It
- **ChatGPT:** Extracts user preferences (e.g. "prefers concise answers") from chat logs, storing them in profile databases.
- **Mem.ai:** Indexes user notes and calendars to dynamically assemble context.

## 10. Decision Checklist (Memory Selection)
- Use **Structured User Profiles** when:
  - Facts are explicit, categorizable, and easy to classify (e.g., preference tags).
- Use **Vector Databases** when:
  - Memory context is unstructured text transcripts.

## 11. AI Coding-Agent Guidelines
- Always implement GDPR-compliant deletion hooks for all long-term memory profile tables.

## 12. Reusable Checklist
- [ ] User preferences schema defined and active
- [ ] Background workers manage profile extraction asynchronously
- [ ] GDPR delete/edit endpoints implemented
- [ ] PII scrubbers active on memory inputs
- [ ] Memory profile size limits enforced (prevent bloat)
- [ ] Integration tests verify metadata updates
