# Adversarial Testing (Red Teaming)

## 1. Definition & Core Concepts
Adversarial Testing (Red Teaming) is the systematic search for security vulnerabilities, safety bypasses, prompt injections, and jailbreaks in AI systems by simulating malicious attacks.

## 2. Why It Exists / What Problem It Solves
Traditional software testing checks if code works under expected inputs. AI security requires verifying how the system behaves under hostile, unexpected instructions designed to bypass boundaries.

## 3. What Breaks in Production Without It
- **Data Leakages:** Attackers bypass database controls, querying tables they are unauthorized to read.
- **Accidental Deletions:** Hijacked agents execute destructive tools.
- **Brand Reputation damage:** Attackers force support assistants to output offensive statements.

## 4. Best Practices
- **Compile an Adversarial Dataset:** Include prompt injections (e.g. "ignore rules"), jailbreak roles, and toxic inputs.
- **Use Red Team Models:** Deploy specialized models tasked with generating diverse attack vectors against target prompts.
- **Enforce Ingress moderation checks:** Route inputs through moderation endpoints (e.g. Llama Guard).

## 5. Common Mistakes / Anti-Patterns
- **Assuming prompt rules are absolute:** Believing that instructing the model to "never ignore these rules" is sufficient protection.
- **Testing only known inputs:** Skipping testing under translated, nested, or token-manipulated prompts.

## 6. Security Considerations
- **Indirect Injections:** Attackers hide instructions inside third-party documents (e.g. white-on-white text in PDFs) that the RAG pipeline reads.

## 7. Performance Considerations
- **Ingress filtering latency:** Keep classifier steps fast (under 100ms) to preserve responsive UI loops.

## 8. Scalability Considerations
- **Quota management:** Ensure defense pipelines can handle peak traffic without crashing API limits.

## 9. How Major Companies Implement It
- **Microsoft:** Deploys Azure AI Content Safety filters to screen all Copilot inputs in real-time.
- **OpenAI:** Operates a global moderation service to filter requests.

## 10. Decision Checklist (Defense Tiers)
- Enforce **Adversarial Testing** on:
  - All public-facing conversational interfaces and search portals.
- Use **Human Approval (HITL) gates** when:
  - Workflows perform write operations or system database modifications.

## 11. AI Coding-Agent Guidelines
- Never merge dynamic inputs directly into system role templates; always structure user values inside separate, delimited variables blocks.

## 12. Reusable Checklist
- [ ] Adversarial test dataset compiled (covering success, edge, and adversarial inputs)
- [ ] Ingress moderation screening active (Llama Guard/regex checks)
- [ ] Output content toxicity filters configured
- [ ] System prompts instruct models to treat user tags as data only
- [ ] Adversarial testing automated in build pipelines
- [ ] Downstream tools scoped with least-privilege permissions
