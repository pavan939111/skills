# Agent Delegation

## 1. Definition & Core Concepts
Agent Delegation is the programmatic process by which one agent transfers a sub-task, parameters, and execution control to another specialized agent, suspending its own execution until results are returned.

## 2. Why It Exists / What Problem It Solves
No single agent can specialize in all domains. Delegation routes tasks to the best-suited agent (e.g. routing mathematical tasks to a calculator agent), ensuring accuracy and keeping context windows small.

## 3. What Breaks in Production Without It
- **Context window bloat:** Storing all tool instructions in a single agent, leading to formatting errors.
- **Accidental outages:** Agents executing wrong tools due to lack of specialized instructions.
- **Runaway API token costs:** Running general models for tasks that could run on small models.

## 4. Best Practices
- **Implement a router gate:** Use classification code to select the target agent.
- **Standardize delegation schemas:** Force enums on routing parameters (e.g., `target_agent: 'writer'`).
- **Isolate parameters:** Pass only required parameters to the delegated agent.

## 5. Common Mistakes / Anti-Patterns
- **Peer-to-peer delegation loops:** Agents delegating tasks back and forth without exit parameters.
- **Ignoring delegation logs:** Failing to track hand-off events.

## 6. Security Considerations
- **Boundary controls:** Ensure the delegated agent validates inputs before running execution tools.

## 7. Performance Considerations
- **Delegation latency:** Keep routing prompts simple to keep hand-offs under 100ms.

## 8. Scalability Considerations
- **Worker pool scaling:** Distribute task workers across queues.

## 9. How Major Companies Implement It
- **CrewAI:** Implements built-in delegation methods to pass tasks between specialized roles.
- **LangChain:** Integrates routing chains to handle task delegation.

## 10. Decision Checklist (Delegation Triggers)
- Use **Agent Delegation** when:
  - Task contains distinct segments requiring specialized tools or instructions.
- Avoid **Agent Delegation** when:
  - Task is straightforward and can be resolved in a single prompt.

## 11. AI Coding-Agent Guidelines
- Programmatically map routing parameters to agent instances, ensuring schemas match definitions.

## 12. Reusable Checklist
- [ ] Delegation routing enums configured
- [ ] Delegated agent contexts isolated (least privilege)
- [ ] Output schemas standardized for returned values
- [ ] Delegation timeouts set (prevent infinite loops)
- [ ] Hand-off traces logged to diagnostics
- [ ] Unit tests verify delegation transitions
