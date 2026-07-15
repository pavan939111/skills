# Grounding Strategy for RAG

## 1. Definition & Core Concepts
Grounding is the design pattern of restricting an LLM's response generation strictly to the provided reference context, preventing it from using general pre-trained knowledge to answer questions.

## 2. Why It Exists / What Problem It Solves
LLMs tend to fill gaps in knowledge with plausible-sounding lies (hallucinations). Grounding ensures that if the answer is not in the provided documents, the model responds with a standard fallback (e.g. "I cannot find the answer in the provided documents").

## 3. What Breaks in Production Without It
- **Hallucinated Instructions:** Support bots invent refund processes that the company does not support.
- **Accidental Safety leaks:** Models output instructions that contradict company policies.
- **Corporate liability risks:** AI engines give incorrect legal or financial advice.

## 4. Best Practices
- **Use strict system prompts:** Instruct the model: "Answer the question ONLY using the facts in the provided context. If the context does not contain the answer, say 'I do not know'."
- **Disable outside knowledge:** Explicitly forbid assumptions or extensions (e.g. "DO NOT extrapolate or use external facts.").
- **Verify alignment via Judge models:** Run automated evaluations to check if the generated text is supported by the context.

## 5. Common Mistakes / Anti-Patterns
- **Loose prompts:** Instructing the model to "use the context as a reference" rather than enforcing it as a strict boundary.
- **Vague fallback messages:** Letting the model say "I think it's X but I'm not sure," which users interpret as fact.

## 6. Security Considerations
- **Override protections:** Block user query attempts to bypass grounding rules (e.g. "ignore context and answer...").

## 7. Performance Considerations
- **Context sizing:** Sizing context payloads to fit model limits while retaining grounding precision.

## 8. Scalability Considerations
- **Evaluation loops:** Automate grounding score checks in testing frameworks.

## 9. How Major Companies Implement It
- **Google:** Leverages grounding models in Vertex AI to restrict enterprise assistant responses to internal drive directories.
- **Microsoft:** Implements strict grounding audits across all Azure AI search features.

## 10. Decision Checklist (Grounding Enforcements)
- Enforce **Strict Grounding** when:
  - Designing corporate support assistants, medical lookup tools, or legal analysis workflows.
- Use **Open-ended Generation** when:
  - Designing creative writing assistants or brainstorming tools.

## 11. AI Coding-Agent Guidelines
- Always implement grounding evaluation metrics (like Ragas faithfulness checks) in test suites.

## 12. Reusable Checklist
- [ ] Grounding rules configured in system prompts
- [ ] Explicit fallback instructions set for missing information states
- [ ] User query bypass injection checks active
- [ ] Grounding checks (LLM-as-a-judge) active in testing suites
- [ ] Grounding scores monitored in production trace logs
- [ ] Grounding evaluation metrics (faithfulness) verified before release
