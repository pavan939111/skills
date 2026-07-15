# Supervisor Pattern

## 1. Definition & Core Concepts
The Supervisor Pattern is a multi-agent design pattern where a single centralized agent (the supervisor) orchestrates task execution by dynamically delegating sub-tasks to specialized worker agents, collecting results, and deciding the next step.

## 2. Why It Exists / What Problem It Solves
Single agents with access to too many tools become confused, make mistakes, and exhaust context windows. The supervisor pattern delegates tasks to specialized workers that only have access to their specific tools, keeping contexts small and success rates high.

## 3. What Breaks in Production Without It
- **Task Deadlocks:** A worker gets stuck, and because there is no supervisor overseeing the process, the loop hangs indefinitely.
- **Accidental State Mutates:** Workers perform actions out of order due to lack of supervisor coordination.
- **High latency profile:** Parallelizable tasks run sequentially because the system lacks supervisor scheduling.

## 4. Best Practices
- **Implement a Central Supervisor Router:** Use a router to select which worker agent to call based on task description.
- **Isolate Worker Contexts:** Enforce that worker agents only see inputs relevant to their sub-task.
- **Standardize Worker Output Formats:** Require workers to return structured outputs (like JSON schemas) to the supervisor.

## 5. Common Mistakes / Anti-Patterns
- **Workers calling other workers directly:** Creating un-coordinated loops instead of routing calls through the supervisor.
- **Supervisors doing worker tasks:** Writing raw task logic inside the supervisor prompt.

## 6. Security Considerations
- **Boundary Controls:** Ensure the supervisor validates worker output data schemas before passing it to downstream tools.

## 7. Performance Considerations
- **Parallel worker runs:** Run independent worker sub-tasks (e.g. document analysis) in parallel to speed up the loop.

## 8. Scalability Considerations
- **Worker pool scaling:** Distribute worker agents across stateless worker queues (e.g., Celery).

## 9. How Major Companies Implement It
- **Microsoft:** Uses supervisor patterns in Semantic Kernel orchestrators to coordinate support query routing.
- **CrewAI:** Provides built-in supervisor delegation managers to orchestrate task queues.

## 10. Decision Checklist (Supervisor Setup)
- Use **Supervisor Pattern** when:
  - Task requires combining multiple distinct domains (e.g. searching, writing code, and calling APIs).
  - Worker tools must be kept isolated for security or context sizing rules.
- Avoid **Supervisor Pattern** when:
  - Task is a simple linear sequence that can be handled by a single state machine.

## 11. AI Coding-Agent Guidelines
- Programmatically map supervisor routing enums to worker instances, ensuring route schemas match definitions.

## 12. Reusable Checklist
- [ ] Central supervisor router configured
- [ ] Worker contexts isolated (no tool leaking)
- [ ] Standard JSON output schemas defined for worker returns
- [ ] Parallel worker execution active for independent steps
- [ ] Loop timeout limits configured on supervisor router
- [ ] Tracing dashboards capture task delegation maps
