# Prompt Optimization

## 1. Definition & Core Concepts
Prompt Optimization is the process of editing, pruning, and structuring system prompts, context parameters, and user queries to minimize token consumption and generation latency while maintaining or improving output quality.

## 2. Why It Exists / What Problem It Solves
LLMs process tokens sequentially, and model providers charge per token. Large, unoptimized prompts containing repetitive instructions, verbose templates, or irrelevant historical context consume unnecessary window space, increase latency, and decrease answer accuracy due to "lost in the middle" retrieval issues.

## 3. What Breaks in Production Without It
- **Runaway API Costs:** Enterprise RAG systems send bloated PDF text structures directly to the model, leading to massive financial waste.
- **Latency Spikes:** Prompt-heavy API interactions result in long round-trip delays that cause users to abandon the application.
- **Degraded Accuracy:** The model fails to follow key instructions because they are buried in thousands of words of unstructured context.

## 4. Best Practices
- **Prune Verbose Context:** Use summarization, rankers, or similarity metrics to strip out non-essential text before appending data to the prompt.
- **Use Clear XML tags:** Structure inputs using clean XML delimiters (e.g. `<instructions>`, `<context>`, `<query>`) which help models parse instructions faster and with less reasoning effort.
- **Place instructions at the end:** Place core action instructions *after* context blocks. Models pay greater attention to instructions at the very beginning or end of prompts.

## 5. Common Mistakes / Anti-Patterns
- **Instruction Bloat:** Continually adding new rules to a prompt to patch edge cases rather than refactoring or splitting the prompt into sub-agents.
- **Overloading with examples (Few-Shot Bloat):** Including dozens of long few-shot examples when 2 or 3 high-quality, diverse examples are sufficient.

## 6. Security Considerations
- **Boundary leaking:** Ensure that prompt optimizations do not accidentally strip safety guidelines, system instructions, or prompt injection blocks.

## 7. Performance Considerations
- **Time to First Token (TTFT):** Long prompts take longer for the model provider's hardware to pre-fill, directly increasing the initial TTFT latency.

## 8. Scalability Considerations
- **Caching alignment:** Structure prompts to maximize provider context caching (e.g., place static system prompts and few-shot examples at the beginning of the prompt).

## 9. How Major Companies Implement It
- **Anthropic:** Optimizes developer prompts by providing automated prompt-compiler tools that analyze example test cases and rewrite prompts to be shorter and more precise.

## 10. Decision Checklist (Prompt Compression)
- Use **Retrieval Reranking and Semantic Pruning** when:
  - Feeding large datasets (e.g., PDFs, web scrapes) into context windows where token count is directly proportional to cost.
- Keep **Full Detail Prompts** when:
  - Working on complex reasoning tasks where every instruction and edge-case description is vital to prevent errors.

## 11. AI Coding-Agent Guidelines
- Write tests that check both output quality and token usage to ensure prompt changes do not introduce regressions.

## 12. Reusable Checklist
- [ ] Prompts audited to remove redundant rules and filler words
- [ ] Context inputs structured with clear XML/Markdown delimiters
- [ ] Instructions positioned to maximize model attention (beginning/end)
- [ ] Few-shot examples selected for maximum diversity and minimum length
- [ ] Input compression scripts implemented for multi-document payloads
- [ ] Prompt templates structured to enable API provider context caching
