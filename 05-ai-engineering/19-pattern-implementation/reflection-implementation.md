# Reflection Pattern

## 1. Definition & Core Concepts
The Reflection Pattern is an agentic design pattern where a model evaluates its own generated output (or another model's output) against a set of constraints or criteria, identifies mistakes, and regenerates the content to correct those errors.

## 2. Why It Exists / What Problem It Solves
LLMs make mistakes, hallucinate facts, and generate syntax errors in code. If a model generates output and serves it directly, the user receives these errors. Reflection mimics human editing by introducing a review loop, dramatically improving code syntax compliance, text formatting, and logic accuracy.

## 3. What Breaks in Production Without It
- **Broken Code Generations:** Code assistants return code with syntax or compilation errors because the code was never run through a test-and-reflect loop.
- **Formatting Violations:** Structured data outputs (like JSON payloads) contain trailing commas or missing fields, crashing downstream database parsers.

## 4. Best Practices
- **Implement Structured Rubrics:** Provide the evaluator prompt with a clear checklist of rules (e.g. "Is the JSON valid?", "Does it use the correct API key?").
- **Iterate with Test Feedback:** When generating code, run compile scripts or unit tests and feed the raw stdout/stderr output back to the model as the reflection context.
- **Enforce Loop Breakers:** Limit reflection cycles (e.g. max 3 reviews) to prevent infinite correction loops and excessive token spend.

## 5. Common Mistakes / Anti-Patterns
- **Self-evaluating on simple tasks:** Running reflection loops on basic text generation where the model has nothing objective to measure, leading to unnecessary token waste.
- **Endless critique cycles:** A model critique prompt that is too strict, causing the generator model to continually alter stylistic choices without improving quality.

## 6. Security Considerations
- **Reflection Bypass:** Ensure that prompt injections hidden in the source context do not trick the reflector model into signing off on unsafe or toxic outputs.

## 7. Performance Considerations
- **Response Latency:** Reflection loops multiply response times. Run reflection steps in background jobs, or reserve them for non-interactive tasks where accuracy overrides latency concerns.

## 8. Scalability Considerations
- **Compute and Token Budgeting:** Track token spend per reflection iteration. Trigger alerts if user sessions consistently require maximum reflection cycles.

## 9. How Major Companies Implement It
- **GitHub Copilot Workspace:** Runs generated code modifications through compiler checks, reflecting on build output errors to auto-correct file edits.

## 10. Decision Checklist (Reflection Application)
- Enforce **Reflection Loops** when:
  - Generating computer code, complex database schema configurations, or structured document outputs where accuracy is critical.
- Use **Single-turn Generation** when:
  - Building low-latency conversational tools, casual search helpers, or style editors.

## 11. AI Coding-Agent Guidelines
- Write loop structures that execute code/validator scripts, capture stdout/stderr, and format them into correction prompts for the generator model.

## 12. Reusable Checklist
- [ ] Reflector prompt contains an objective evaluation rubric
- [ ] Compiler checks or unit tests integrated to provide execution feedback
- [ ] Maximum reflection iteration ceiling (e.g. max 3) configured
- [ ] State trackers save generation history for each iteration
- [ ] Evaluators run asynchronously to prevent client thread locks
- [ ] Prompt templates separate generation parameters from reflection rules
