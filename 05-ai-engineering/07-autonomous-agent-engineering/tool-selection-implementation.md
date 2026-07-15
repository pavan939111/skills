# Tool Selection

## 1. Definition & Core Concepts
Tool Selection is the process by which an autonomous agent evaluates an active task context and selects the most appropriate external tool (e.g. database query, web search, code compiler) to run.

## 2. Why It Exists / What Problem It Solves
AI models are static text processors. To interact with the real world, they must use tools. Tool selection translates text instructions into structured API payloads (function calling).

## 3. What Breaks in Production Without It
- **API Param Formatting Errors:** The model selects the correct tool but passes wrong data types, crashing endpoints.
- **Dangling Connections:** Selecting tool parameters that execute infinite network scans, blocking CPU threads.
- **Accidental State Mutates:** Agents selecting delete actions instead of read-only queries.

## 4. Best Practices
- **Use native Function Calling APIs:** Let model providers parse queries into JSON tool schemas.
- **Document tools in detail:** Write clear docstrings describing what the tool does and its parameter types.
- **Enforce strict parameter schemas:** Validate tool arguments using Zod or Pydantic before running logic.

## 5. Common Mistakes / Anti-Patterns
- **Ambiguous descriptions:** Providing vague descriptions for tool inputs, causing models to select the wrong function.
- **Too many tools:** Exposing dozens of tools in a single prompt context, confusing the model and wasting tokens.

## 6. Security Considerations
- **Sandboxed Execution:** Run system tools (like terminal command execution) inside secure sandboxes (e.g., Docker) to prevent host compromise.

## 7. Performance Considerations
- **Metadata sizes:** Keep tool schemas compact to minimize prompt prefill latency.

## 8. Scalability Considerations
- **API rate limits:** Rate limit tool execution paths to prevent downstream saturation.

## 9. How Major Companies Implement It
- **OpenAI:** Uses grammar-constrained sampling to ensure models select and format tool calls according to schema specifications.
- **Stripe:** Exposes payment verification tools using strict JSON schemas with input constraints.

## 10. Decision Checklist (Tool Registries)
- Use **Native Function Calling** when:
  - The model API supports structured tool calls.
- Use **Regex Parser (ReAct style)** when:
  - Deploying open-source models that lack native function calling APIs.

## 11. AI Coding-Agent Guidelines
- Never expose a tool function to an agent without validating its parameters against a strict JSON schema in code.

## 12. Reusable Checklist
- [ ] Tool schemas defined in code (Zod/Pydantic)
- [ ] Tool descriptions write clear, distinct parameters guidelines
- [ ] Argument type checks active before tool execution
- [ ] High-risk tools sandbox restrictions active
- [ ] Execution latency and rate limits monitored
- [ ] Test cases verify correct tool selection under diverse prompt queries
