# Planner-Worker Pattern

## 1. Definition & Core Concepts
The Planner-Worker Pattern is a multi-agent architecture where a dedicated planning agent translates a user request into a static or dynamic task graph, and a pool of specialized worker agents executes each step sequentially.

## 2. Why It Exists / What Problem It Solves
It decouples planning from execution. Execution workers do not need to understand high-level goals; they focus strictly on performing their assigned tasks, optimizing accuracy.

## 3. What Breaks in Production Without It
- **Task Order Violations:** Workers execute compile commands before dependency installations because the plan did not map dependencies.
- **Dangling threads:** Loops hang because workers get stuck on unexpected errors.
- **Accidental cost spikes:** Re-generating the full plan on every step execution.

## 4. Best Practices
- **Implement Plan Checkpointing:** Save the generated plan to a database; update step statuses (e.g. `pending`, `running`, `completed`).
- **Use local code checkers:** Verify worker output states dynamically.
- **Implement rollback paths:** If a step fails, trigger the planner to revise remaining steps.

## 5. Common Mistakes / Anti-Patterns
- **Static plan execution:** Continuing to run step 3 when step 2 failed.
- **Vague step descriptions:** The planner outputs steps without defining expected parameters.

## 6. Security Considerations
- **Boundary controls:** Restrict worker API credentials to least-privilege configurations.

## 7. Performance Considerations
- **Parallel steps execution:** Run independent worker nodes in parallel.

## 8. Scalability Considerations
- **State persistency:** Persist the plan state to PostgreSQL to allow workers to recover tasks.

## 9. How Major Companies Implement It
- **Devin:** Uses planner-worker configurations to coordinate software engineering pipelines.
- **LangGraph:** Structures plan-act patterns using state graph connections.

## 10. Decision Checklist (Pipeline Selection)
- Use **Planner-Worker** when:
  - High-level goals are complex and require multi-step, sequential execution.
- Avoid **Planner-Worker** when:
  - Workflows are simple and linear.

## 11. AI Coding-Agent Guidelines
- Programmatically map task statuses in databases, letting workers fetch and update steps.

## 12. Reusable Checklist
- [ ] Planning agent generated task graphs persisted
- [ ] Task dependency paths mapped (DAG verification)
- [ ] Worker API credentials isolated and restricted
- [ ] Planner triggered to revise plan on step failures
- [ ] Independent tasks run in parallel
- [ ] Unit tests verify plan updates on tool errors
