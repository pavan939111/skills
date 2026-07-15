# Swarm Pattern

## 1. Definition & Core Concepts
The Swarm Pattern is a decentralized multi-agent design pattern where a collection of independent, specialized agents communicate and hand off tasks directly to each other without a centralized manager or supervisor (e.g. OpenAI Swarm).

## 2. Why It Exists / What Problem It Solves
Centralized manager agents add latency, token overhead, and code complexity. Swarm architectures allow agents to transfer execution control (hands-off) dynamically, keeping context sizes small and execution fast.

## 3. What Breaks in Production Without It
- **Task Hand-off Deadlocks:** Agents loop infinitely, passing tasks back and forth without resolving them.
- **Lost State Data:** Session data and variables are lost during hand-offs.
- **Runaway API billing:** The swarm runs un-monitored loops.

## 4. Best Practices
- **Define clear hand-off functions:** Program tools to return another agent instance (e.g. `transfer_to_agent(agent_name)`).
- **Maintain a Shared State Object:** Pass a mutable state context map through all hand-offs.
- **Configure Loop Limits:** Set maximum hand-off counters to prevent infinite loops.

## 5. Common Mistakes / Anti-Patterns
- **Complex routing trees:** Creating hundreds of hand-off options, causing agents to get confused.
- **Ignoring hand-off logs:** Failing to log hand-off events, making debugging difficult.

## 6. Security Considerations
- **Boundary checks:** Validate user inputs before passing them through hand-off steps.

## 7. Performance Considerations
- **Router Latency:** Keep routing prompts simple to ensure hand-offs take under 100ms.

## 8. Scalability Considerations
- **Rate limiting:** Rate limit swarm iterations to prevent API token saturation.

## 9. How Major Companies Implement It
- **OpenAI:** Uses Swarm patterns to demonstrate lightweight agent routing configurations.
- **Anthropic:** Leverages routing arrays to pass conversations between support and technical agents.

## 10. Decision Checklist (Swarm Requirements)
- Use **Swarm Pattern** when:
  - Workflows are dynamic, and routing paths depend on user inputs.
  - Context size constraints require isolated agents.
- Avoid **Swarm Pattern** when:
  - Task execution paths are predictable and linear.

## 11. AI Coding-Agent Guidelines
- Programmatically register hand-off functions in agent tool definitions to allow clean transitions.

## 12. Reusable Checklist
- [ ] Hand-off functions return valid agent targets
- [ ] Shared context map passed through all hand-offs
- [ ] Maximum hand-off counter active (default: max 5 turns)
- [ ] Hand-off traces logged to tracing databases
- [ ] Fallback static responses configured for loop limits
- [ ] Unit tests verify state updates on hand-off steps
