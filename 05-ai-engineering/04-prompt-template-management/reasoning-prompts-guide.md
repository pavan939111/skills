# Reasoning Prompts

## 1. Definition & Core Concepts
Reasoning Prompts are prompt structures designed to trigger systematic, logical analysis, verification, and planning inside LLMs before generating the final response (e.g. self-consistency, tree-of-thought, reflection).

## 2. Why It Exists / What Problem It Solves
Standard prompts push models to generate the first probable answer, leading to logical errors on complex tasks. Reasoning prompts force the model to identify assumptions, verify steps, and double-check outputs.

## 3. What Breaks in Production Without It
- **Logical Flaws in Code:** Generative agents suggest code containing edge-case bugs because they did not plan the logic beforehand.
- **Incorrect SQL Queries:** Query engines generate SQL statements with syntax errors.
- **Accidental Actions:** Systems run tasks based on miscalculated logic assumptions.

## 4. Best Practices
- **Implement reflection loops:** Instruct the model to review its initial answer and list potential flaws before outputting the final result.
- **Configure self-correction constraints:** Put validation instructions in the prompt (e.g., "Verify that the generated JSON matches the schema. Correct any syntax errors before returning.").
- **Structure query logs:** Separate reasoning logs from final output answers.

## 5. Common Mistakes / Anti-Patterns
- **Assuming reasoning on simple tasks:** Using complex reasoning prompts for basic copy-paste or translation tasks, inflating latency and cost.
- **Swallowing thinking logs:** Hiding the model's intermediate steps when debugging logical failures.

## 6. Security Considerations
- **Instruction Bypass:** Ensure that user inputs are not processed inside the reasoning loop without validation filters.

## 7. Performance Considerations
- **High latency overhead:** Reasoning prompts add seconds to completion times. Run these tasks asynchronously in background queues.

## 8. Scalability Considerations
- **VRAM limits:** Multi-step reasoning loops consume more context window capacity.

## 9. How Major Companies Implement It
- **GitHub:** Uses multi-step reflection loops inside Copilot agents to optimize code generation accuracy.
- **OpenAI:** Leverages reasoning steps in ChatGPT o-series models to verify mathematical solutions.

## 10. Decision Checklist (Reasoning Triggers)
- Use **Reasoning Prompts** when:
  - Task involves code generation, complex database query creation, or medical/legal analysis.
  - Latency is secondary to accuracy.
- Avoid **Reasoning Prompts** when:
  - Task is simple conversation or data entry.
  - Real-time low latency (<500ms) is required.

## 11. AI Coding-Agent Guidelines
- Always implement reflection loops ("Review your previous response and correct any errors") in backend code generation agents.

## 12. Reusable Checklist
- [ ] Task logic checked (confirming reasoning need)
- [ ] Reflection/verification instructions included in prompt templates
- [ ] Output formatting separate from thinking steps
- [ ] Multi-step loops decoupled from synchronous routes (async queues active)
- [ ] Intermediate thinking logs visible in developer dashboards
- [ ] Token count monitors active on reasoning contexts
