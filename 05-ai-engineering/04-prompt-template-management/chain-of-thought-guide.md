# Chain-of-Thought Prompting

## 1. Definition & Core Concepts
Chain-of-Thought (CoT) Prompting is the technique of instructing an LLM to generate intermediate reasoning steps before returning the final answer, allowing it to break complex problems down into sequential logical segments.

## 2. Why It Exists / What Problem It Solves
Standard auto-regressive models generate tokens sequentially. If they are forced to answer immediately, they predict the next token based on assumptions, leading to errors. CoT gives the model "scratchpad" space to calculate steps, improving accuracy on math, logic, and reasoning.

## 3. What Breaks in Production Without It
- **Math Errors:** Billing assistants make calculation mistakes in user invoices.
- **Incorrect SQL Queries:** Automated report builders generate SQL joins containing semantic errors.
- **Logic Failures:** AI agents make incorrect routing decisions in workflow steps.

## 4. Best Practices
- **Use "Let's think step-by-step":** Add explicit instructions to outline the reasoning path.
- **Enforce structured thinking format:** Instruct the model to write thinking logs inside XML tags (e.g. `<thinking>...</thinking>`), separating it from the final answer.
- **Combine with Few-Shot examples:** Provide examples demonstrating the step-by-step reasoning process.

## 5. Common Mistakes / Anti-Patterns
- **Swallowing output tokens:** Truncating responses before the model completes both thinking and final answer steps.
- **CoT on simple queries:** Adding reasoning instructions to simple lookups (e.g., "what is the user's name?"), wasting tokens and latency.

## 6. Security Considerations
- **Thinking Injection:** Ensure user inputs cannot inject instructions inside thinking tags to manipulate the final output.

## 7. Performance Considerations
- **Generation Latency:** CoT increases the output token count, slowing response times. Use streaming to display text as it generates.

## 8. Scalability Considerations
- **Token overhead:** Plan context capacity limits to support additional thinking tokens.

## 9. How Major Companies Implement It
- **Google:** Uses Chain-of-Thought steps to power complex reasoning tasks in Gemini models.
- **OpenAI:** Natively integrates internal thinking loops in o-series models to verify outputs.

## 10. Decision Checklist (CoT Triggers)
- Use **Chain-of-Thought** when:
  - Task involves math calculations, code generation, or multi-step logic analysis.
  - The model does not natively support hidden reasoning tokens.
- Avoid **Chain-of-Thought** when:
  - Low latency is critical, and task is simple data retrieval.

## 11. AI Coding-Agent Guidelines
- Programmatically strip thinking tags (e.g. `<thinking>...</thinking>`) from the final response before returning it to the user interface, unless the user explicitly requests to see the thinking process.

## 12. Reusable Checklist
- [ ] Chain-of-Thought instructions configured in prompt templates
- [ ] Thinking logs enclosed in distinct tags (e.g. `<thinking>`)
- [ ] Few-shot examples include step-by-step reasoning paths
- [ ] Completion token limits extended to support reasoning text
- [ ] Parser configured to extract and strip thinking blocks from UI outputs
- [ ] Real-time token streaming active to hide generation latency
