# Structured Output

## 1. Definition & Core Concepts
Structured Output is the capability to enforce that model completions follow a strict, predefined schema (like JSON Schema or Pydantic models), ensuring reliability in downstream application integration.

## 2. Why It Exists / What Problem It Solves
LLMs generate free-form text by default. In software pipelines, services require structured formats (JSON, XML) to parse data into databases or run logic checks. Structured outputs prevent formatting errors.

## 3. What Breaks in Production Without It
- **JSON Parsing Failures:** Application servers throw exceptions (e.g. `SyntaxError: Unexpected token`) because the model returned conversational descriptions along with the JSON code block.
- **Missing Required Fields:** Output JSON blocks skip essential fields (e.g., leaving database keys empty).
- **Data Type Mismatches:** The model returns a string representation for fields defined as numeric integers, breaking database constraints.

## 4. Best Practices
- **Use Native JSON Modes:** Enforce schema validation at the API provider level (e.g. OpenAI's Structured Outputs with `response_format: { type: "json_schema", json_schema: ... }`).
- **Define schemas via code:** Use libraries like Pydantic or Zod to declare schemas and validate model responses.
- **Implement Parser Fallbacks:** If validation fails, capture the error, format it as a prompt correction, and run a second correction query.

## 5. Common Mistakes / Anti-Patterns
- **Relying on prompt text instructions alone:** Asking the model to "output JSON" in the prompt text without using native provider schema validation APIs.
- **Overly complex schemas:** Defining nested structures with hundreds of fields, increasing latency and failure rates.

## 6. Security Considerations
- **Schema Poisoning:** Ensure schemas do not permit injecting executable code strings into database fields.

## 7. Performance Considerations
- **Latency impact:** Enforcing structured output schemas adds processing overhead on model servers, slowing generation slightly.

## 8. Scalability Considerations
- **Concurrency checks:** Validate that JSON parsing steps run asynchronously, preventing blocking CPU loops.

## 9. How Major Companies Implement It
- **OpenAI:** Uses grammar-constrained sampling to force models to output tokens that strictly follow JSON schemas during generation.
- **Zod / Pydantic:** Standardizes schema validations in TypeScript/Python, letting developers validate model inputs and outputs concurrently.

## 10. Decision Checklist (Output Formats)
- Use **Native Provider Structured Outputs** when:
  - You require 100% JSON schema compliance.
  - The model API supports schema enforcement.
- Use **JSON Mode (Prompt Enforced)** when:
  - The model does not support native schema validation APIs.

## 11. AI Coding-Agent Guidelines
- Always implement Zod or Pydantic validators on all LLM API response handlers to catch and correct formatting errors before passing data to databases.

## 12. Reusable Checklist
- [ ] Schema validation schemas defined in code (Zod/Pydantic)
- [ ] Native provider structured outputs mode enabled
- [ ] JSON syntax error validation handlers implemented
- [ ] Fallback retry loops configured for validation failures
- [ ] Schema field counts verified against context budgets
- [ ] Non-JSON characters removed from parser pipelines
