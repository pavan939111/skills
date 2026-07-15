# Tool-Use Pattern

## 1. Definition & Core Concepts
The Tool-Use Pattern (often called Function Calling) is the architectural pattern that enables LLMs to interact with external systems. The model is provided with JSON schemas describing available functions (tools) and their parameters. The model outputs a structured JSON call request specifying which tool to execute and with what arguments, which the application executes, returning the result to the model.

## 2. Why It Exists / What Problem It Solves
LLMs are isolated reasoning engines that cannot execute web requests, query databases, or access filesystems directly. The tool-use pattern bridges this gap, allowing models to perform operations on external systems, fetch real-time data, and automate actions.

## 3. What Breaks in Production Without It
- **Inability to take actions:** Agents can suggest text but cannot complete tasks like booking flights, query active databases, or edit files.
- **Flawed Parameter Formatting:** Models output arbitrary text instead of strict JSON arguments, crashing downstream integration APIs.

## 4. Best Practices
- **Write Precise Tool Descriptions:** Provide clear descriptions in function JSON schemas, detailing exactly what the tool does and what each parameter expects.
- **Implement Strict Parameter Validation:** Parse and validate model-generated tool arguments (using tools like Pydantic or Zod schemas) before execution.
- **Enforce Sandbox Restrictions:** Execute filesystem or shell tools in secure, isolated containers to prevent host network compromises.

## 5. Common Mistakes / Anti-Patterns
- **Providing too many tools:** Overloading the prompt with dozens of tools, which increases costs and causes tool selection errors. Use router agents to filter tools.
- **Synchronous Write Executions:** Running slow write-heavy tools on the main application thread, blocking event loops.

## 6. Security Considerations
- **SQL Injection and Shell Injection:** Model-generated tool arguments can contain malicious payloads. Never pass parameters directly to database queries or shell execution strings without parameterization.

## 7. Performance Considerations
- **Schema Overhead:** Large tool definition schemas increase prompt sizes and pre-fill latencies. Keep tool definitions concise.

## 8. Scalability Considerations
- **Rate-limit Downstream Systems:** Implement queues or rate limiters on tools to prevent high-frequency agent loops from overloading downstream APIs.

## 9. How Major Companies Implement It
- **OpenAI / Anthropic:** Native tool-calling API support, where models are fine-tuned to output structured JSON blocks when tools are activated, optimizing selection accuracy.

## 10. Decision Checklist (Tool Integration Modes)
- Enforce **Strict Parameter Validation & Mocking** when:
  - Allowing the agent to interface with internal APIs, databases, or production networks.
- Enforce **Manual Approval (HITL)** when:
  - Tool calls execute write operations, perform financial transactions, or delete database records.

## 11. AI Coding-Agent Guidelines
- Write wrappers that parse tool-calling responses, validate arguments against schema models, execute functions safely, and append results back to the agent session.

## 12. Reusable Checklist
- [ ] Tool definitions written in strict JSON Schema formats
- [ ] Argument parsing middleware validates inputs using Pydantic or Zod
- [ ] Safe sandbox environments isolate filesystem and CLI tools
- [ ] Human approval gates active for write or financial tools
- [ ] Error handles convert tool exceptions into structured model observations
- [ ] Rate limits configured to protect downstream integration APIs
