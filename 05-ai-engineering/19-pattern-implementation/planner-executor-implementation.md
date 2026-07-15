# Planner-Executor Pattern

## 1. Definition & Core Concepts
The Planner-Executor Pattern is an agent architecture that decouples the planning of tasks from their execution. A centralized "Planner" model analyzes the user goal and generates a step-by-step execution plan, which is then processed sequentially by one or more "Executor" agents that run tools and return results to the planner for validation.

## 2. Why It Exists / What Problem It Solves
Single-turn models struggle to solve complex, multi-step tasks (e.g. "Research competitor pricing, write a markdown summary, and email it to the team"). If a model tries to plan and execute in a single step, it often gets lost, misses steps, or halts prematurely. The Planner-Executor pattern splits the cognitive load into separate planning and action phases.

## 3. What Breaks in Production Without It
- **Runaway Agent Failures:** The agent tries to execute tools without a roadmap, leading to circular tool loops and task failure.
- **Inability to Recover:** If a tool call fails, the agent lacks a baseline plan to reference and correct, causing it to crash or give up.

## 4. Best Practices
- **Use High-Quality Models for Planning:** Assign planning tasks to reasoning-capable models (e.g. GPT-4o, Claude 3.5 Sonnet), while using faster, cheaper models for execution.
- **Maintain a Plan State:** Keep the step-by-step plan in a shared workflow state, allowing executors to update step statuses (e.g., pending, completed, failed).
- **Implement Re-planning Nodes:** If an executor fails or returns unexpected data, return to the Planner to generate an updated plan based on the new state.

## 5. Common Mistakes / Anti-Patterns
- **Static Planning:** Creating a plan at the start and executing it blindly without checking intermediate outputs or re-planning when errors occur.
- **Overcomplicating simple tasks:** Using a multi-step Planner-Executor pattern for basic Q&A queries that require a single model call.

## 6. Security Considerations
- **Boundary Checks on Plans:** Validate the generated plan steps before sending them to executors to ensure the planner has not generated steps that violate safety boundaries (e.g. querying private folders).

## 7. Performance Considerations
- **Execution Latency:** decamping planning and execution adds steps. Cache plans, run executor tasks in parallel where possible, and stream progress to the user.

## 8. Scalability Considerations
- **State Serialization:** Save the execution plan and run states in persistent database stores (e.g., Redis, PostgreSQL) to support long-running tasks that span hours.

## 9. How Major Companies Implement It
- **Devin (Cognition Labs):** Uses a sophisticated planner-executor model that generates a nested directory plan, runs commands in terminal executors, and dynamically updates its plan based on test errors.

## 10. Decision Checklist (Architectural Choice)
- Use **Planner-Executor** when:
  - Tasks are complex, involve multiple API/tool steps, and benefit from sequential verification (e.g., automated code migration, multi-source research).
- Use **Direct Action (ReAct)** when:
  - Tasks are shorter, dynamic, and tool calls are largely independent of each other.

## 11. AI Coding-Agent Guidelines
- Implement graph schemas where a Planner node generates a structured step list, routing sequentially to Executor nodes with error callback paths.

## 12. Reusable Checklist
- [ ] Central planner model writes structured step-by-step plans
- [ ] Executor agents process steps independently and update plan states
- [ ] Re-planning logic triggers dynamically when executors return failures
- [ ] Safe step boundary checks active before executors run tools
- [ ] Long-lived plan states persisted in transaction databases
- [ ] Plan progress streams to client interfaces progressively
