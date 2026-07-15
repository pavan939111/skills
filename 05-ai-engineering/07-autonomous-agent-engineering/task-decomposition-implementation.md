# Task Decomposition

## 1. Definition & Core Concepts
Task Decomposition is the process of breaking down a complex, high-level goal into a series of smaller, manageable, and sequential sub-tasks that can be executed independently.

## 2. Why It Exists / What Problem It Solves
Complex objectives (e.g. "deploy a website") are too broad for an LLM to resolve in one step. Breaking the goal down into tasks (e.g., step 1: write HTML; step 2: configure DNS) simplifies execution and improves success rates.

## 3. What Breaks in Production Without It
- **Context window bloat:** Attempting to solve all requirements in a single prompt, leading to truncated outputs.
- **Accidental outages:** Executing actions out of order due to lack of a structured task dependency graph.
- **Vague responses:** The model skips steps, leaving tasks incomplete.

## 4. Best Practices
- **Implement dependency mapping:** Structure sub-tasks as a directed acyclic graph (DAG) defining dependencies.
- **Evaluate outputs sequentially:** Verify each step's output before starting the next sub-task.
- **Standardize task states:** Tag sub-tasks with statuses (e.g. `pending`, `running`, `completed`).

## 5. Common Mistakes / Anti-Patterns
- **Flat plans:** Creating simple lists without defining step dependencies.
- **Ignoring sub-task failures:** Proceeding to step 2 when step 1 failed, leading to errors.

## 6. Security Considerations
- **Boundary checks:** Ensure sub-tasks do not bypass security controls configured for the primary goal.

## 7. Performance Considerations
- **Parallel execution:** Run independent sub-tasks (e.g. searching different websites) in parallel to optimize speed.

## 8. Scalability Considerations
- **Queue scaling:** Route sub-task execution to background queues.

## 9. How Major Companies Implement It
- **Devin:** Breaks software engineering tasks down into separate research, coding, testing, and deployment segments.
- **LangGraph:** Provides node-edge graphs to let developers define task decomposition steps in code.

## 10. Decision Checklist (Decomposition Methods)
- Use **Dynamic Decomposition (DAG-based)** when:
  - Task dependencies depend on execution outcomes (e.g., debugging codebase files).
- Use **Static Pipelines (Linear Steps)** when:
  - Workflow steps are predictable and constant.

## 11. AI Coding-Agent Guidelines
- Programmatically map task statuses in database tables, letting agents update step values during executions.

## 12. Reusable Checklist
- [ ] High-level goals broken down into sub-tasks
- [ ] Task dependency paths mapped (DAG configurations)
- [ ] Sub-task statuses tracked in database tables
- [ ] Independent sub-tasks run in parallel
- [ ] Execution loops check step outputs before proceeding
- [ ] Failures in critical tasks halt dependent sub-tasks
