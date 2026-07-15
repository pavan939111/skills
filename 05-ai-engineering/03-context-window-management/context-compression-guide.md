# Context Compression

## 1. Definition & Core Concepts
Context Compression is the process of reducing the size of prompt payloads (removing redundant words, using semantic summaries, filtering noise) while preserving the core informational value.

## 2. Why It Exists / What Problem It Solves
Long contexts increase API costs and latency. Compressing prompts cuts out filler text (like duplicate headers, formatting structures, common stop words), saving context window space and lowering bills.

## 3. What Breaks in Production Without It
- **Runaway API token costs:** The company spends thousands of dollars hosting redundant text formatting inside LLM prompt logs.
- **Latency delays:** Large prompts take seconds to process during prefill phases, slowing down user experiences.
- **Model attention drops:** Essential rules are ignored because the prompt is bloated with low-value data.

## 4. Best Practices
- **Implement semantic summarization:** Summarize older chat turns into single sentences before appending them to current prompts.
- **Scrub structural formatting:** Convert verbose JSON or HTML blocks in prompts to compact YAML or CSV formats.
- **Use linguistic compression:** Deploy lightweight tools (like LLMLingua) to remove low-information tokens before calling APIs.

## 5. Common Mistakes / Anti-Patterns
- **Compressing instructions:** Compressing the system prompt's core instructions, causing the model to violate formatting rules.
- **Naive word slicing:** Slicing prompts character-by-character, cutting off words and breaking sentence structures.

## 6. Security Considerations
- **Information Loss:** Ensure critical security guardrails are never compressed or removed from prompts.

## 7. Performance Considerations
- **Compression latency trade-offs:** Ensure that local compression runs (e.g. running LLMLingua) do not take longer than the API time saved.

## 8. Scalability Considerations
- **Worker CPU limits:** Running local compression models increases memory requirements on compute nodes.

## 9. How Major Companies Implement It
- **Microsoft:** Integrates prompt compression tools into Copilot workflows to optimize token consumption across office apps.
- **Tencent:** Utilizes semantic summarization databases to prune customer conversation logs.

## 10. Decision Checklist (Compression Methods)
- Use **Linguistic Compression (e.g., LLMLingua)** when:
  - Prompts contain massive, noisy unstructured text logs.
- Use **Structured Simplification (e.g. JSON to YAML)** when:
  - Prompts contain structured database objects.
- Use **Semantic Summarization** when:
  - Compressing historical conversation chat turns.

## 11. AI Coding-Agent Guidelines
- Never compress system prompts or formatting instructions; only apply compression pipelines to raw user data payloads or search contexts.

## 12. Reusable Checklist
- [ ] Compression algorithm selected based on content type
- [ ] System instructions protected from compression pipelines
- [ ] JSON payloads simplified to compact YAML/CSV strings
- [ ] Compression execution times measured to ensure net latency savings
- [ ] Truncation fallbacks configured if compression fails to meet limits
- [ ] Integrity tests run to verify compressed prompts maintain semantic quality
