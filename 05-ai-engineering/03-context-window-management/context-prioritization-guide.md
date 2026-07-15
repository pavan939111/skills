# Context Prioritization

## 1. Definition & Core Concepts
Context Prioritization is the scoring and ordering of prompt components (e.g. core instructions, user query, vector context, session history) to ensure high-priority data is placed at optimal attention regions.

## 2. Why It Exists / What Problem It Solves
When context windows are large, LLMs experience "lost in the middle" phenomena, where attention is focused primarily on the beginning and end of prompts. Prioritization places critical instructions and facts at the prompt boundaries.

## 3. What Breaks in Production Without It
- **Instruction Violations:** Models ignore core output format rules because they were placed in the middle of long RAG contexts.
- **Irrelevant Responses:** High-priority user questions are ignored in favor of low-priority historical logs that saturated prompt boundaries.
- **Accidental outages:** Exceeding context budgets because low-priority text was not discarded.

## 4. Best Practices
- **Implement a Strict Prompt Layout:**
  - *Start:* Core system instructions and security rules.
  - *Middle:* Low-priority reference documents and secondary logs.
  - *End:* Active user query and formatting schema.
- **Dynamic Pruning:** Discard low-priority reference documents if total token count exceeds limits.

## 5. Common Mistakes / Anti-Patterns
- **Instructions in the middle:** Placing the system instructions block between large document chunks.
- **Equal-weight formatting:** Treating chat histories and raw document vectors with the same priority rank, resulting in poor pruning choices.

## 6. Security Considerations
- **Override Protections:** Place safety guardrails at the very end of prompts to override user injection attempts.

## 7. Performance Considerations
- **Layout consistency:** Standardize prompt structures to maximize prompt caching hit rates on providers (like Anthropic).

## 8. Scalability Considerations
- **Priority sorting compute:** Ensure sorting and ranking reference chunks by priority score does not block the primary API loop.

## 9. How Major Companies Implement It
- **Anthropic:** Recommends placing system instructions before user prompts to optimize attention and caching performance in Claude models.
- **OpenAI:** Recommends using structured system, user, and assistant roles to prioritize instruction weights.

## 10. Decision Checklist (Prioritization Framework)
- Enforce **Strict Boundary Layouts** for:
  - All prompt completions to optimize model attention.
- Apply **Dynamic Pruning** when:
  - Total aggregated context token counts exceed 80% of model limits.

## 11. AI Coding-Agent Guidelines
- Never append user inputs or document segments at the very end of prompts after the system instructions block. Keep instructions at the boundaries.

## 12. Reusable Checklist
- [ ] System instructions placed at the absolute beginning of prompts
- [ ] User query and formatting schemas placed at the absolute end of prompts
- [ ] Dynamic pruning active for low-priority document segments
- [ ] Token count validation triggers pruning before API calls
- [ ] Prompt layouts standardized to leverage provider prompt caching
- [ ] Attention evaluations run to verify model instruction compliance
