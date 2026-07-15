# Reasoning Models

## 1. Definition & Core Concepts
Reasoning models are LLMs optimized for multi-step reasoning, mathematical logic, code execution, and scientific analysis (e.g. OpenAI o1/o3, DeepSeek-R1). They generate an internal chain-of-thought (thinking tokens) before outputting final answers.

## 2. Why It Exists / What Problem It Solves
Standard models output tokens instantly, failing at tasks requiring plan verification and error correction. Reasoning models allocate extra compute time ("thinking") to evaluate options, producing higher accuracy on complex logic.

## 3. What Breaks in Production Without It
- **Algorithmic Errors:** Standard LLMs write code containing subtle syntax bugs or logic flaws because they cannot review the code before outputting it.
- **Math Hallucinations:** Models make errors on simple algebra equations in data reports.
- **Agent failures:** Agents get stuck in loops because their planning capabilities are weak.

## 4. Best Practices
- **Allow sufficient max token limits:** Reasoning models consume thousands of hidden thinking tokens; set high `max_tokens` margins.
- **Do not instruct formatting inside thinking steps:** Let the model think in plaintext; enforce JSON schemas only on final response blocks.
- **Cache common reasoning contexts:** To optimize response times.

## 5. Common Mistakes / Anti-Patterns
- **Reasoning models for simple chats:** Using expensive, high-latency reasoning models to write basic email replies or greetings.
- **Restricting thinking tokens:** Setting the `max_completion_tokens` too low, cutting off the model's thinking process midway and causing low-quality answers.

## 6. Security Considerations
- **Thinking Token Visibility:** Some API providers hide thinking logs. Ensure internal prompt security controls apply to both thinking and response steps.

## 7. Performance Considerations
- **High latency profile:** Reasoning models take 5s to 30s to respond due to thinking cycles. Never run them on synchronous UI paths without streaming.

## 8. Scalability Considerations
- **Rate limits:** Providers enforce lower rate limits on reasoning models due to the high GPU compute demands of thinking steps.

## 9. How Major Companies Implement It
- **Replit:** Uses reasoning models in code generation agents to verify code correctness before suggesting changes.
- **Harvey AI:** Deploys reasoning models to review complex legal contracts, verifying statements against reference statutes.

## 10. Decision Checklist (Reasoning Selection)
- Use **Reasoning Models** when:
  - Task involves writing software code, math logic, or legal parsing.
  - Latency is secondary to accuracy (e.g., background batch processing).
- Avoid **Reasoning Models** when:
  - Task is simple conversation, extraction, or short text formatting.
  - Low latency (<1s) is required.

## 11. AI Coding-Agent Guidelines
- Never prompt reasoning models with instructions like "think step-by-step" — they are designed to allocate thinking tokens automatically.

## 12. Reusable Checklist
- [ ] Reasoning models reserved for complex logic/code/math tasks
- [ ] `max_completion_tokens` configured with sufficient thinking token margins
- [ ] User interfaces display "thinking..." loading indicators
- [ ] Traditional "think step-by-step" prompt instructions removed
- [ ] API timeouts extended to handle longer reasoning cycles (>30s)
- [ ] Performance metrics track both thinking and completion latency
