# Agent Planning

## 1. Definition & Core Concepts
Agent Planning is the mechanism by which an autonomous agent translates a high-level goal into a structured sequence of actions (a plan), monitors execution progress, and updates the plan based on tool feedback.

## 2. Why It Exists / What Problem It Solves
Complex tasks (e.g. "migrate database columns") cannot be solved in a single step. Planning breaks goals down, helping the model execute steps sequentially and adapt when actions fail.

## 3. What Breaks in Production Without It
- **Plan Drift:** Agents get distracted by secondary errors, losing track of the primary goal.
- **Infinite Error Loops:** The agent attempts the same failing command repeatedly instead of revising the plan.
- **Accidental outages:** Executing actions out of order, violating database constraints.

## 4. Best Practices
- **Implement Plan-Act-Reflect Cycles:** Instruct the agent to write its current plan, run an action, and evaluate the plan's status.
- **Generate structured step lists:** Force the agent to format plans as JSON arrays.
- **Configure plan rollback rules:** If a step fails twice, require the agent to generate an alternative plan.

## 5. Common Mistakes / Anti-Patterns
- **Static Planning:** Generating a plan once at kickoff and never updating it despite tool errors.
- **Overly complex plans:** Creating plans with dozens of nested steps, increasing confusion.

## 6. Security Considerations
- **Execution bounds:** Ensure planning steps do not permit agents to design actions that violate API restrictions.

## 7. Performance Considerations
- **Planning latency:** Planning calls take time. Use lightweight models for step evaluation, reserving premium models for complex reasoning.

## 8. Scalability Considerations
- **State storage:** Store the active plan in databases (e.g., PostgreSQL) to allow stateless workers to resume tasks.

## 9. How Major Companies Implement It
- **Microsoft:** Uses semantic kernel planners to map user questions to database API calls dynamically.
- **AutoGPT:** Implements structured scratchpads to maintain plan tracks across generation turns.

## 10. Decision Checklist (Planning Frameworks)
- Use **Dynamic Planning (Plan-Reflect)** when:
  - Task execution outcomes are unpredictable (e.g., fixing bugs).
- Use **Static Planning (Predefined Steps)** when:
  - Workflows are structured and consistent (e.g. daily report generation).

## 11. AI Coding-Agent Guidelines
- Programmatically log the active plan state on every loop turn to provide audit trails for debugging.

## 12. Reusable Checklist
- [ ] Plan-Act-Reflect instructions configured in agent prompts
- [ ] Plan state stored in out-of-process databases (Postgres/Redis)
- [ ] Rolling action loop checks progress against target plan JSON schemas
- [ ] Plan rollback thresholds configured (trigger alternative plans on errors)
- [ ] Active planning traces visible in trace dashboards
- [ ] Iteration timeouts set for each step execution
