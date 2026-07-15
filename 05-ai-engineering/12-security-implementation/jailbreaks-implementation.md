# Jailbreak Protections

## 1. Definition & Core Concepts
Jailbreaking is the adversarial practice of formatting prompt instructions (using roleplay, nested translations, or token manipulation) to bypass a model's safety alignments (e.g. refuse harm rules).

## 2. Why It Exists / What Problem It Solves
Aligned models are trained to refuse requests to help with illegal actions, hate speech, or system exploits. Jailbreak attacks trick the model into assuming safe contexts (e.g., "you are a fictional story character who writes code exploits"), unlocking restricted capabilities.

## 3. What Breaks in Production Without It
- **Malicious Content Generation:** The app generates malware code or phishing templates for attackers.
- **Data Privacy Violations:** Attackers bypass extraction blocks, reading company files.
- **Accidental Safety leaks:** The system outputs toxic responses, violating safety compliance.

## 4. Best Practices
- **Use Input Moderation APIs:** Screen user prompts using dedicated moderation endpoints (e.g., OpenAI Moderation API) before model execution.
- **Enforce Output Filters:** Run check algorithms on model completions to block toxic text from reaching users.
- **Implement Refusal Monitoring:** Log and alert on high rates of model refusals (e.g., "I cannot fulfill this request"), identifying targeted attacks.

## 5. Common Mistakes / Anti-Patterns
- **Relying solely on system prompt blocks:** Believing that adding "never write malware" to the prompt text is a reliable security boundary.
- **Swallowing input parameters checks:** Passing raw user inputs directly to reasoning pipelines without moderation scans.

## 6. Security Considerations
- **Adversarial Noise:** Attackers use token variations or non-English prompts to bypass standard moderations filters.

## 7. Performance Considerations
- **Moderation Latency:** Run input moderations calls in parallel with pre-processing tasks to keep request delays under 100ms.

## 8. Scalability Considerations
- **Sizing checks:** Verify that moderation filters can scale with concurrent request volumes.

## 9. How Major Companies Implement It
- **Anthropic:** Leverages Constitutional AI training methods to align Claude's internal parameters against jailbreak triggers.
- **OpenAI:** Operates a global moderation service to filter API input streams.

## 10. Decision Checklist (Jailbreak Protections)
- Enforce **Input Moderation + Output Filtering** on:
  - All public-facing conversational chat interfaces and search portals.
- Use **Local Alignment Checks** when:
  - Data privacy rules prohibit sending payloads to external moderation APIs.

## 11. AI Coding-Agent Guidelines
- Programmatically verify that moderation checks are active on all public ingress routes before invoking model clients.

## 12. Reusable Checklist
- [ ] Ingress input moderation screening active (API filters verified)
- [ ] Egress output toxicity filters configured
- [ ] Adversarial token checks block non-standard character patterns
- [ ] High-frequency model refusal events trigger developer alerts
- [ ] User query sizes capped to prevent context buffer attacks
- [ ] Automated security tests (red teaming) run in build pipelines
