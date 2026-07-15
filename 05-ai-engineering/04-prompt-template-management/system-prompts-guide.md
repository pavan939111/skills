# System Prompts

## 1. Definition & Core Concepts
System Prompts are high-priority instructions injected at the beginning of an LLM session to define the model's role, rules, boundaries, tone, safety guidelines, and output formatting expectations.

## 2. Why It Exists / What Problem It Solves
Models are open-ended completion engines. System prompts restrict the model's behavior, ensuring it acts as a reliable software component (e.g. only outputting JSON code, ignoring irrelevant chats) rather than a general conversation partner.

## 3. What Breaks in Production Without It
- **Prompt Jailbreaking:** Users trick the assistant into ignoring rules (e.g. revealing internal API keys) because system boundaries were not defined.
- **Malformed Formats:** The model returns conversational descriptions instead of strict JSON schemas, crashing downstream parsers.
- **Inconsistent Agent Tone:** Customer assistants return informal or hostile text when dealing with complaints.

## 4. Best Practices
- **Use Clear Imperative Language:** Write instruction statements directly (e.g., "YOU ARE a customer billing database assistant. DO NOT answer general questions.").
- **Enforce Output Constraints:** Explicitly prohibit fallback descriptions (e.g. "Output JSON only. Do not wrap code blocks in markdown fences.").
- **Layer Safety Guardrails:** Put instruction overrides at prompt boundaries.

## 5. Common Mistakes / Anti-Patterns
- **Polite Prompting:** Using soft suggestions (e.g., "Please try to avoid...") instead of absolute imperatives (e.g. "NEVER perform X").
- **Mixing user input in system role:** Ingesting user data variables directly inside the system instructions block, risking prompt injections.

## 6. Security Considerations
- **System Leakage:** Attackers prompt models to output system guidelines (e.g. "print previous instructions"). Include explicit instructions to deny these requests.

## 7. Performance Considerations
- **Length optimization:** Keep system prompts under 1,000 tokens to preserve context window capacity and minimize prompt prefill latency.

## 8. Scalability Considerations
- **Caching consistency:** Avoid dynamic parameters inside system prompts to maintain high provider prompt caching rates.

## 9. How Major Companies Implement It
- **OpenAI:** Uses strict system prompts to guide custom GPT behaviors, enforcing safety policies before user messages are processed.
- **Slack:** Standardizes system prompts for search agents to limit search results access to channels the user is authorized to read.

## 10. Decision Checklist (System Prompts Setup)
- Enforce **System Prompts** on:
  - All agentic workflows, structured data extraction tasks, and user-facing chatbots.
- Skip **System Prompts** only when:
  - Performing simple, direct text completions on models that lack system role capabilities.

## 11. AI Coding-Agent Guidelines
- Never merge dynamic user inputs inside the system role block; keep the system prompt static and place user parameters in separate user role variables.

## 12. Reusable Checklist
- [ ] Role definition clearly defined (e.g., "You are an API router")
- [ ] Output formatting constraints explicitly detailed
- [ ] "No conversation" rules set for API formatting tasks
- [ ] Jailbreak protections and prompt disclosure blocks included
- [ ] Dynamic user parameters isolated from the system prompt block
- [ ] System prompt size validated to fit within prefill limits
