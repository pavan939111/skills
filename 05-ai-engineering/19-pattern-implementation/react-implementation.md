# ReAct (Reasoning & Acting) Pattern

## 1. Definition & Core Concepts
The ReAct (Reasoning and Acting) Pattern is an agent execution loop that interleaves reasoning thoughts, tool actions, and environment observations. For each step, the model writes a Thought (reasoning about the current state), executes an Action (calling a tool), and receives an Observation (tool output), continuing this sequence until it can generate a final answer.

## 2. Why It Exists / What Problem It Solves
Traditional prompt pipelines separate model reasoning from action execution. ReAct integrates them, allowing models to think dynamically about what tools to run, analyze tool outputs in real-time, modify strategies, and handle unexpected API responses or missing data.

## 3. What Breaks in Production Without It
- **Rigid Execution Failures:** Agents execute a fixed chain of tool calls that crash because they cannot adapt to intermediate tool output variations.
- **Hallucinations on Tool Missing States:** The model runs a tool, receives a blank or error output, but proceeds to hallucinate a false answer because it lacks a reasoning phase to evaluate the tool output.

## 4. Best Practices
- **Use Structured ReAct Prompts:** Standardize the prompt pattern using strict, parser-friendly markers (e.g. `Thought:`, `Action:`, `Observation:`, `Final Answer:`).
- **Graceful Observation Injection:** Wrap tool executions in error handlers that translate exceptions into structured text observations (e.g., "Error: Database table not found").
- **Implement Iteration Limits:** Limit the maximum number of ReAct loops (e.g. max 5 to 10 turns) to prevent infinite agent executions and high token charges.

## 5. Common Mistakes / Anti-Patterns
- **Omitting the Thought Phase:** Forcing the model to output tool calls without first generating reasoning tokens, which decreases tool parameter accuracy.
- **Allowing Unlimited Loops:** Leaving ReAct agents to run without step limit controls, allowing them to iterate indefinitely on errors.

## 6. Security Considerations
- **Indirect Prompt Injection in Observations:** Attackers place instructions in database records or websites that the agent reads as an observation, hijacking the next ReAct thought cycle. Implement input sanitization on observations.

## 7. Performance Considerations
- **Sequential Latency:** The ReAct pattern is highly sequential, as each step depends on the previous model generation and tool execution. Use fast models and compile tools locally to minimize lag.

## 8. Scalability Considerations
- **Token Accumulation:** As the ReAct loop continues, the entire execution history (thoughts, actions, observations) is appended to the prompt context, increasing cost and processing times. Prune intermediate steps when possible.

## 9. How Major Companies Implement It
- **LangChain:** Integrates the ReAct framework as the core execution logic in standard agent templates, routing outputs to tool executors and returning observations.

## 10. Decision Checklist (ReAct Loop Control)
- Enforce **ReAct Loop Execution** when:
  - Designing open-ended assistants, dynamic debuggers, database search agents, or API integration wrappers that require multi-step diagnostics.
- Use **Linear Workflows (e.g., Chain of Thought)** when:
  - Executing tasks with predictable, step-by-step structures that do not require external tool actions.

## 11. AI Coding-Agent Guidelines
- Write loop parsing controllers that parse `Action:` blocks, call the corresponding tools, and append results back to the prompt window under `Observation:` headers.

## 12. Reusable Checklist
- [ ] Prompt template uses explicit Thought, Action, Observation, and Final Answer tags
- [ ] Parser cleanly extracts tool names and arguments from Action blocks
- [ ] Tool execution exceptions caught and formatted as Observations
- [ ] Max ReAct loop iteration counter enforced per request
- [ ] Observations sanitized of indirect prompt injection vectors
- [ ] History pruning implemented to prevent prompt window bloat
