# Hybrid Patterns

## 1. Definition & Core Concepts
Hybrid Patterns are advanced AI architectures that combine multiple distinct design patterns (such as combining deterministic state workflows with autonomous ReAct agent nodes, or running multi-agent supervisor systems inside a larger RAG pipeline) to build robust systems.

## 2. Why It Exists / What Problem It Solves
No single design pattern can solve all the requirements of a complex enterprise product. A system might need the absolute predictability of a state-based workflow for user onboarding, the deep retrieval capabilities of RAG for document processing, and the flexible problem-solving of a coding agent for custom configurations. Hybrid patterns integrate these models to optimize reliability, cost, and capacity.

## 3. What Breaks in Production Without It
- **Inefficient Architectures:** Teams attempt to solve all product features using a single pattern (e.g. building a pure autonomous agent), leading to high costs, latency, and unpredictable behaviors.
- **Data Siloing:** Inability to pass state variables cleanly between RAG pipelines and coding agent components, resulting in fragmented workflows.

## 4. Best Practices
- **Define clear boundary interfaces:** Use strict schemas (like JSON/Pydantic) to govern how data passes between different pattern components.
- **Segregate State Contexts:** Keep the global workflow state separate from the local reasoning memory of sub-agents to prevent context corruption.
- **Optimize Resource Allocation:** Run cheap models in deterministic routing and preprocessing nodes, reserving expensive reasoning models only for high-value agent nodes.

## 5. Common Mistakes / Anti-Patterns
- **Nesting agents too deeply:** Creating complex, multi-layered hierarchies of agents that call other agents, which leads to untraceable latency bottlenecks and high costs.
- **Using agents where rules suffice:** Replacing simple, reliable code logic with expensive, slow LLM agent calls.

## 6. Security Considerations
- **Boundary Privileges Propagation:** Ensure that user permission tokens are explicitly validated at every transition point between RAG, workflow, and tool-use nodes.

## 7. Performance Considerations
- **Caching at Pattern Boundaries:** Implement semantic and prompt caching at the boundaries between different systems to minimize redundant model evaluations.

## 8. Scalability Considerations
- **Independent Microservices Deployment:** Host heavy agent components, vector search endpoints, and workflow runners on separate microservices that can scale independently.

## 9. How Major Companies Implement It
- **Intuit:** Combines deterministic financial calculation code with conversational RAG and tax planning agents to provide accurate, verified tax preparation advice.

## 10. Decision Checklist (Hybrid Design Selection)
- Use **Hybrid Patterns** when:
  - The application requires both absolute procedural constraints (e.g., following a checkout flow) and open-ended text processing (e.g., answering customer questions).
- Use a **Single Pattern** when:
  - The task is narrow, well-defined, and fully satisfied by one technique (like simple search retrieval).

## 11. AI Coding-Agent Guidelines
- Write modular orchestrator scripts that treat agents, RAG searchers, and state machines as independent classes that interact via standardized input/output interfaces.

## 12. Reusable Checklist
- [ ] Boundary interfaces between patterns schema-validated (Pydantic/Zod)
- [ ] Global workflow state isolated from local sub-agent memories
- [ ] Cheap models route inputs before forwarding to expensive agents
- [ ] Deep nesting of agents restricted to prevent latency and cost spikes
- [ ] User role permissions validated at every pattern transition point
- [ ] Performance logs track sub-component execution durations separately
