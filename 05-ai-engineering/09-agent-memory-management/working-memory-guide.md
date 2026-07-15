# Working Memory

## 1. Definition & Core Concepts
Working Memory is the short-term context state of an active agent run, containing temporary variables, tool outputs, active sub-plans, and intermediate reasoning traces for the duration of a single execution loop.

## 2. Why It Exists / What Problem It Solves
Agents need a "scratchpad" space to track what they just did and what they need to do next. Working memory provides transient, low-latency access to active variables without the overhead of writing to long-term databases.

## 3. What Breaks in Production Without It
- **Context Loss on Steps:** The agent executes a tool but forgets the output parameters in the next step, crashing downstream calls.
- **Accidental State Loops:** Getting stuck in repetitive loops due to lack of step-by-step progress tracking.
- **High VRAM Bloat:** Carrying all historical scratchpad traces into long-term databases, bloating context.

## 4. Best Practices
- **Use Ephemeral Context Maps:** Store active variables in in-memory state objects (e.g., Python dicts, Redis) during execution loops.
- **Isolate State Variables:** Clear working memory caches once the agent run completes or transitions to the next high-level task.
- **Enforce Strict Schema Types:** Validate intermediate data formats using schemas.

## 5. Common Mistakes / Anti-Patterns
- **Persisting transient scratchpads:** Saving detailed debugging traces to long-term postgres tables indefinitely, wasting disk space.
- **Ignoring intermediate tool exceptions:** Skipping error state updates in working memory, causing deadlocks.

## 6. Security Considerations
- **Scope Isolation:** Ensure working memory variables are cleared after execution to prevent tenant data leakage.

## 7. Performance Considerations
- **In-memory Lookups:** Keep working memory operations local ($<1\text{ms}$) to optimize loop execution speed.

## 8. Scalability Considerations
- **Concurrency checks:** Size server thread memory to handle active working memory maps.

## 9. How Major Companies Implement It
- **CrewAI:** structures local short-term memory registers to track active task progress.
- **LangGraph:** Uses graph state definitions to pass dynamic working states between nodes.

## 10. Decision Checklist (Memory Management)
- Use **Working Memory (In-Memory/Volatile)** when:
  - Variables are transient and only required for the active execution loop.
- Use **Durable Database Memory** when:
  - Data must persist across user sessions.

## 11. AI Coding-Agent Guidelines
- Programmatically clear working memory registers at the end of the agent loop to prevent memory leaks.

## 12. Reusable Checklist
- [ ] Working memory context maps isolated by thread/session
- [ ] Ephemeral registers cleared on loop completion/failure
- [ ] Action exceptions logged to state maps instantly
- [ ] Local memory lookups optimized for latency ($<1\text{ms}$)
- [ ] Data validation checks active on intermediate parameters
- [ ] Unit tests verify memory cleanups on exit routes
