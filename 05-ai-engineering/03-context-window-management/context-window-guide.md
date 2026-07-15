# Context Window Management

## 1. Definition & Core Concepts
The Context Window is the maximum sequence length (measured in tokens) that an LLM can process in a single forward pass, covering both the input prompt and the generated completion.

## 2. Why It Exists / What Problem It Solves
Models have hard physical limits on how many tokens they can parse at once due to attention matrix sizes and VRAM limits. Context window management ensures prompt payloads stay within boundaries while preserving the most relevant details.

## 3. What Breaks in Production Without It
- **Context Overflow crashes:** Sending payloads that exceed model limits, causing API calls to return errors (HTTP 400).
- **"Lost in the Middle" errors:** Models ignore instructions placed in the middle of long prompts, leading to incomplete actions.
- **Runaway Token Billing:** Flooding context windows with redundant text logs, spiking execution bills.

## 4. Best Practices
- **Implement truncation logic:** Automatically slice older chat history rows if total tokens approach 80% of model capacity.
- **Place critical instructions at boundaries:** Put core rules at the very beginning or end of the prompt to maximize attention.
- **Track tokens in real-time:** Use libraries like `tiktoken` or `tokenizers` to count bytes before dispatching requests.

## 5. Common Mistakes / Anti-Patterns
- **Assuming infinite windows:** Sending entire source code files or large database dumps directly into prompts without summarization.
- **Ignoring generation tokens:** Failing to leave context window headroom for the model's output completion tokens, causing truncated answers.

## 6. Security Considerations
- **Context Injection:** Attackers inject instructions deep inside long files to bypass system boundaries unnoticed.

## 7. Performance Considerations
- **Prefill Latency:** Processing long contexts (e.g. >32k tokens) increases Time-to-First-Token (TTFT) significantly due to heavy prefill attention steps.

## 8. Scalability Considerations
- **KV Cache Saturation:** Storing long context KV matrices in GPU memory restricts query concurrency capacities.

## 9. How Major Companies Implement It
- **Cursor:** Dynamically ranks, chunks, and truncates codebase snippets to ensure prompts fit within context limits.
- **Anthropic:** Optimizes Claude's context routing by caching system prompts, cutting latency and costs on repetitive requests.

## 10. Decision Checklist (Context Limits)
- Use **Context Truncation** when:
  - Managing chat logs where older conversations are secondary to active topics.
- Use **Retrieval-Augmented Generation (RAG)** when:
  - Document databases exceed context window limits (e.g. >100,000 tokens).

## 11. AI Coding-Agent Guidelines
- Always subtract projected output tokens (`max_tokens`) from the total model context window size to calculate the exact maximum input prompt size allowed.

## 12. Reusable Checklist
- [ ] Model context window size limit defined in system configs
- [ ] Headroom reserved for target output token lengths
- [ ] Token count checked locally before dispatching API requests
- [ ] Truncation logic implemented for chat histories
- [ ] Critical instructions placed at prompt boundaries
- [ ] Prompt caching enabled for large, static system contexts
