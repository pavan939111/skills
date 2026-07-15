# Few-Shot Prompting

## 1. Definition & Core Concepts
Few-Shot Prompting is the technique of providing one or more input-output examples (shots) within the prompt context to guide the model's output style, formatting structure, and response logic.

## 2. Why It Exists / What Problem It Solves
Text instructions alone (zero-shot) can be interpreted in multiple ways, leading to inconsistent outputs. Examples demonstrate the exact pattern (e.g. classification labels, tone nuances, JSON formatting) the model must follow.

## 3. What Breaks in Production Without It
- **Formatting drift:** Models fail to output correct syntax structures under edge cases.
- **Inconsistent classification labels:** Text classification models return custom synonyms instead of strict category tags.
- **Tone variance:** Customer support assistants use inconsistent voices.

## 4. Best Practices
- **Use realistic examples:** Include diverse examples covering success paths and common error scenarios.
- **Maintain semantic balance:** Ensure examples do not bias the model toward a specific answer (e.g., providing only positive sentiment examples in a classifier prompt).
- **Structure example markers:** Use clear delimiters (e.g., `Input:`, `Output:`, `---`) to separate examples.

## 5. Common Mistakes / Anti-Patterns
- **Overloading examples:** Injecting 50 examples, wasting context window capacity and increasing prefill token costs (use fine-tuning if >15 examples are required).
- **Biased examples:** Providing examples that only showcase one output category, skewing the model's classification distribution.

## 6. Security Considerations
- **PII Leakage:** Ensure example inputs do not contain real customer data or private API keys.

## 7. Performance Considerations
- **Prefill Latency:** Adding many examples increases prompt token sizes, slowing down Time-to-First-Token. Use prompt caching to mitigate.

## 8. Scalability Considerations
- **Token billing optimization:** Review the cost of few-shot tokens under high concurrency.

## 9. How Major Companies Implement It
- **Anthropic:** Recommends using few-shot examples in Claude prompts to enforce complex XML formatting rules.
- **Microsoft:** Implements few-shot examples inside Copilot prompt templates to standardize code refactoring styles.

## 10. Decision Checklist (Shots Count)
- Use **Zero-Shot** when:
  - Task is simple, and instructions are clear (e.g. basic translation).
- Use **Few-Shot (1-5 examples)** when:
  - Enforcing complex formatting, specific tone styles, or multi-label classifications.
- Use **Fine-Tuning** when:
  - Task requires >15 examples to achieve target accuracy.

## 11. AI Coding-Agent Guidelines
- Programmatically format few-shot examples inside templates using structured arrays, ensuring delimiters remain consistent.

## 12. Reusable Checklist
- [ ] Few-shot examples selected to cover diverse edge cases
- [ ] Example outputs verified to match target formatting schemas
- [ ] No real-world PII or secrets present in example variables
- [ ] Classifications distributions balanced in example set
- [ ] Delimiter tags (e.g., `Input:`, `Output:`) structured consistently
- [ ] Token sizes of examples calculated and checked against caching rules
```
