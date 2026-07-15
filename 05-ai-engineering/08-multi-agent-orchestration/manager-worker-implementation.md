# Manager-Worker Pattern

## 1. Definition & Core Concepts
The Manager-Worker Pattern is a hierarchical multi-agent architecture where a manager agent oversees a team of workers, handles communication, aggregates outputs, and resolves conflicts, but does not execute technical tasks directly.

## 2. Why It Exists / What Problem It Solves
It divides responsibilities. The manager handles high-level goal alignment and coordination, while workers focus entirely on task execution.

## 3. What Breaks in Production Without It
- **Task Deadlocks:** Workers stall because they lack communication paths to coordinate resource locks.
- **Accidental State Mutates:** Workers update the same database records concurrently.
- **Malformed Outputs:** Final reports contain contradictory data because worker outputs were not aggregated and validated.

## 4. Best Practices
- **Implement Central Communication Channels:** Route all worker messages through the manager.
- **Enforce Output Formats:** Require workers to return structured outputs (like JSON schemas) to the manager.
- **Run validation checks:** The manager must validate worker outputs before executing downstream actions.

## 5. Common Mistakes / Anti-Patterns
- **Peer-to-peer worker messaging without manager supervision:** Causing un-coordinated state loops.
- **Managers executing tasks:** Writing code generation logic inside the manager prompt.

## 6. Security Considerations
- **Credential Separation:** Enforce distinct API key permissions for the manager and workers.

## 7. Performance Considerations
- **Parallel processing:** Aggregate independent worker runs in parallel.

## 8. Scalability Considerations
- **State persistency:** Persist the coordination state in databases to allow workers to recover tasks.

## 9. How Major Companies Implement It
- **CrewAI:** Standardizes manager-worker structures to coordinate automated customer support workflows.
- **AutoGPT:** Implements manager agents to oversee research pipelines.

## 10. Decision Checklist (Orchestration selection)
- Use **Manager-Worker** when:
  - Task execution requires coordinating multiple, distinct technical roles (e.g. writer, coder, editor).
- Avoid **Manager-Worker** when:
  - Workflows are simple and linear.

## 11. AI Coding-Agent Guidelines
- Programmatically map manager routing enums to worker instances, ensuring route schemas match definitions.

## 12. Reusable Checklist
- [ ] Manager-worker communication channels centralized
- [ ] Worker API credentials isolated and restricted
- [ ] Standard JSON output schemas defined for worker returns
- [ ] Parallel worker execution active for independent steps
- [ ] Loop timeout limits configured on manager agent
- [ ] Tracing dashboards capture task delegation maps
