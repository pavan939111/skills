# Agent Reflection

## 1. Definition & Core Concepts
Agent Reflection is the design pattern where an agent evaluates its past actions, outputs, or reasoning traces to check for errors, bias, or quality issues, correcting its behavior before final output.

## 2. Why It Exists / What Problem It Solves
Generative models output the first probable tokens. Reflection forces the agent to review its work (e.g. evaluating code syntax, checking if facts align with context) to correct mistakes.

## 3. What Breaks in Production Without It
- **Code Syntax Violations:** Generative agents suggest code containing syntax errors that local compiler checks would catch.
- **Fact Hallucinations:** RAG outputs contain details not present in source documents.
- **Violating Format Rules:** JSON blocks miss required fields.

## 4. Best Practices
- **Implement Self-Reflection Prompts:** Add instructions like: "Review your previous output. Identify any logical inconsistencies or syntax issues. Correct the output if needed."
- **Use compiler/linter tools:** Run code or outputs through local test checkers, sending results back to the agent for correction.
- **Set iteration limits:** Cap reflection cycles to 2-3 runs to prevent latency bottlenecks.

## 5. Common Mistakes / Anti-Patterns
- **Infinite reflection loops:** Allowing agents to reflect endlessly on minor issues, inflating costs.
- **Ignoring tool validators:** Relying on LLM self-checks instead of utilizing fast, deterministic regex/schema validators.

## 6. Security Considerations
- **Output Sanitization:** Ensure the corrected output is sanitized to prevent XSS or injection issues.

## 7. Performance Considerations
- **Latency delays:** Reflection adds extra model cycles, increasing execution time. Run these tasks in background worker queues.

## 8. Scalability Considerations
- **Token overhead:** Plan context sizes to accommodate historical reflection steps.

## 9. How Major Companies Implement It
- **GitHub:** Employs compiler loops in Copilot workspaces to test code suggestions and correct compile errors.
- **Harvey AI:** Uses reflection loops to verify contract summarization facts.

## 10. Decision Checklist (Reflection Rules)
- Use **Reflection Prompts** when:
  - Task requires high precision (e.g., code generation, SQL creation).
  - Out-of-process test runners (compilers, linters) are available.
- Avoid **Reflection Prompts** when:
  - Latency is critical, and task is simple (e.g. user greetings).

## 11. AI Coding-Agent Guidelines
- Programmatically connect compiler output files to reflection prompts to help agents correct errors.

## 12. Reusable Checklist
- [ ] Self-reflection instructions configured in agent prompts
- [ ] Compiler/schema validation checks integrated into the loop
- [ ] Maximum reflection cycles capped (default: max 2-3 runs)
- [ ] Reflection latency and token consumption metrics logged
- [ ] Validated outputs sanitized before UI display
- [ ] Test cases verify reflection escapes on persistent errors
