# Supervisor Agent Pattern

## 1. Definition & Core Concepts
The Supervisor Agent Pattern is an agent architecture where a centralized "Supervisor" agent manages, directs, coordinates, and audits a team of specialized "Worker" agents. The supervisor analyzes the user goal, decomposes the task, delegates sub-tasks to specific workers, resolves conflicts in worker outputs, and decides when the overall task is complete.

## 2. Why It Exists / What Problem It Solves
As agent workflows grow, single agents suffer from cognitive overload when forced to manage dozens of tools and rules. The supervisor pattern applies organizational structure, grouping tools into specialized worker agents (e.g. Writer, Coder, Researcher). The supervisor agent acts as a manager, keeping workers focused on single tasks and coordinating their work.

## 3. What Breaks in Production Without It
- **Tool Selection Confusion:** A single agent with 50 tools selects incorrect parameters or runs the wrong tool because it cannot reason about too many options at once.
- **Cascading State Corruption:** Worker agents run tools and update a single global state without supervision, leading to conflicting data edits and state corruption.

## 4. Best Practices
- **Use High-Reasoning Supervisors:** Assign the supervisor role to advanced reasoning models (e.g. Claude 3.5 Sonnet, GPT-4o), while using smaller, faster models for worker tasks.
- **Implement Structured Delegation:** Enforce structured messaging schemas (e.g., using JSON keys) for how the supervisor formats assignments to workers.
- **Enable Worker Communication via Supervisor:** Prevent workers from communicating directly with each other. Route all worker communications through the supervisor to maintain a clean central state.

## 5. Common Mistakes / Anti-Patterns
- **Micro-managing workers:** Writing supervisor prompts that direct workers on every single tool execution step rather than letting workers manage their own tool-use loops.
- **Flat agent hierarchies:** Grouping too many workers under a single supervisor, recreating cognitive overload at the supervisor tier. Use nested hierarchies instead.

## 6. Security Considerations
- **Supervisor-enforced Least Privilege:** Restrict workers' API keys and tool permissions to the absolute minimum necessary, using the supervisor as the gatekeeper.

## 7. Performance Considerations
- **Parallel Worker Invocations:** Instruct the supervisor to dispatch independent sub-tasks to multiple worker agents concurrently to minimize execution delays.

## 8. Scalability Considerations
- **Graph State Serialization:** Persist the supervisor network's state (using engines like LangGraph) to support long-running tasks and allow safe pause-and-resume workflows.

## 9. How Major Companies Implement It
- **Microsoft AutoGen:** Implements group chat orchestrators where a supervisor agent dynamically directs conversation flow, deciding which agent should speak next based on the task state.

## 10. Decision Checklist (Orchestrator Selection)
- Use **Supervisor Agent Pattern** when:
  - Tasks require distinct expertise layers (e.g. writing, executing code, searching databases, formatting text) that can be isolated into separate agents.
- Use **Linear Chain Workflows** when:
  - Tasks follow a rigid, predictable step sequence that does not require dynamic delegation decisions.

## 11. AI Coding-Agent Guidelines
- Write orchestrator graphs where a central Supervisor node routes to worker nodes, aggregating results in a central state before determining task completion.

## 12. Reusable Checklist
- [ ] Central supervisor agent runs on a high-reasoning model
- [ ] Workers are specialized agents with isolated tools and system rules
- [ ] Task assignments and worker returns use structured schemas (JSON)
- [ ] Multi-worker communication is routed through the supervisor
- [ ] Parallel worker execution active for independent tasks
- [ ] Graph state is persisted to database storage for recovery
