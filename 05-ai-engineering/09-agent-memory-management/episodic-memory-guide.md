# Episodic Memory

## 1. Definition & Core Concepts
Episodic Memory is the structured storage of specific past experiences, task executions, and user interaction sessions, allowing agents to reference previous sequences of events and tool logs.

## 2. Why It Exists / What Problem It Solves
Agents need to remember their history. Episodic memory records "episodes" (e.g. "yesterday the agent failed to deploy index X due to permission error Y"), helping them avoid repeating past mistakes.

## 3. What Breaks in Production Without It
- **Repetitive Failures:** The agent encounters the same API error and runs the same failing correction path because it does not remember the previous outcome.
- **Lost Thread Context:** Chat interfaces lose conversational state when users refer to tasks completed earlier in the session.
- **Untraceable decisions:** Inability to audit why an agent chose a specific plan path.

## 4. Best Practices
- **Implement structured trace logging:** Save agent turns (Observation $\rightarrow$ Thought $\rightarrow$ Action $\rightarrow$ Result) in relational databases.
- **Index episodes by success state:** Tag records as `success` or `failure` to guide future planning.
- **Configure semantic retrieval:** Query past failures via vector similarity during planning steps.

## 5. Common Mistakes / Anti-Patterns
- **Unstructured text dumps:** Storing full interaction histories as a single string field, making it difficult to search.
- **No data retention limits:** Retaining detailed execution logs indefinitely, bloating database storage.

## 6. Security Considerations
- **PII Protection:** Scrub credentials and customer details from logs before writing to episodic tables.

## 7. Performance Considerations
- **Async Ingest:** Write execution logs to databases asynchronously via queues to keep loops fast.

## 8. Scalability Considerations
- **Index pruning:** Partition log databases by session date and archive old records.

## 9. How Major Companies Implement It
- **Langfuse:** Centralizes agent traces to capture execution paths.
- **Bloomberg:** Stores historical sentiment extraction runs to audit model behavior over time.

## 10. Decision Checklist (Memory Retrieval)
- Use **Episodic Memory Retrieval (Few-Shot Injection)** when:
  - Designing agents that must adapt plans based on previous execution successes or failures.
- Use **Standard Chat History** when:
  - System only requires conversational turns.

## 11. AI Coding-Agent Guidelines
- Programmatically map execution success state columns (`is_success: boolean`) in telemetry logs to help agents filter for positive actions.

## 12. Reusable Checklist
- [ ] Episodic traces schema defined and active
- [ ] Database updates run out-of-process (async ingestion)
- [ ] Credentials scrubbed from trace variables
- [ ] Success/failure state flags indexed in tables
- [ ] Auto-pruning retention policies active (e.g. 30 days retention)
- [ ] Unit tests verify search queries on trace indices
