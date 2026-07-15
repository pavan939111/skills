# Hierarchical Agents Pattern

## 1. Definition & Core Concepts
The Hierarchical Agents Pattern is a multi-agent architecture where agents are organized into nested layers of authority (e.g. director $\rightarrow$ manager $\rightarrow$ worker), where higher-level agents coordinate goals and lower-level agents execute tasks.

## 2. Why It Exists / What Problem It Solves
Flat agent systems struggle with task scale. Hierarchical structures partition responsibilities, letting high-level layers focus on plan verification and lower-level layers focus on tool execution.

## 3. What Breaks in Production Without It
- **Task Deadlocks:** A worker gets stuck, and because there is no director overseeing the process, the loop hangs.
- **Accidental State Mutates:** Workers update the same database records concurrently.
- **Malformed Outputs:** Final reports contain contradictory data because worker outputs were not aggregated and validated.

## 4. Best Practices
- **Define clear communication boundaries:** Higher layers delegate down; lower layers report up.
- **Isolate worker contexts:** Enforce that worker agents only see inputs relevant to their sub-task.
- **Run validation checks:** Higher-level agents must validate lower-level outputs.

## 5. Common Mistakes / Anti-Patterns
- **Workers calling directors directly:** Violating hierarchy paths and bloating contexts.
- **Directors executing code:** Writing technical task logic in director prompts.

## 6. Security Considerations
- **Credential Separation:** Enforce distinct API key permissions for each hierarchy layer.

## 7. Performance Considerations
- **Parallel processing:** Aggregate independent worker runs in parallel.

## 8. Scalability Considerations
- **State persistency:** Persist the coordination state in databases to allow workers to recover tasks.

## 9. How Major Companies Implement It
- **CrewAI:** Standardizes hierarchical crew patterns to coordinate automated workflows.
- **LangGraph:** Structures hierarchical agent loops using nested state graph connections.

## 10. Decision Checklist (Hierarchy Selection)
- Use **Hierarchical Agents** when:
  - Task execution requires coordinating multiple, distinct technical roles (e.g. writer, coder, editor) at scale.
- Avoid **Hierarchical Agents** when:
  - Workflows are simple and linear.

## 11. AI Coding-Agent Guidelines
- Programmatically map hierarchy enums to agent instances, ensuring route schemas match definitions.

## 12. Reusable Checklist
- [ ] Central hierarchy paths configured
- [ ] Worker contexts isolated (no tool leaking)
- [ ] Standard JSON output schemas defined for worker returns
- [ ] Parallel worker execution active for independent steps
- [ ] Loop timeout limits configured on director agent
- [ ] Tracing dashboards capture task delegation maps
