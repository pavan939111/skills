# Security Review Checklist

## 1. Purpose
This checklist acts as a production readiness gate to review prompt injection defenses, jailbreak mitigations, input/output content filtering, PII and secret data protections, and least-privilege tool security policies.

## 2. Checklist

### Ingestion & Moderation
- [ ] Ingress moderation filters active on all user input queues (e.g. Llama Guard, regex checkers).
- [ ] System prompts structure user data inside distinct, schema-enforced XML delimiters to prevent prompt injections.
- [ ] Egress content filtering active to block toxic, biased, or restricted responses before client delivery.

### Data Protection & PII
- [ ] PII scrubbing middleware redacts customer details from prompts before logging or sending data to APIs.
- [ ] Secrets scanners verify that no API keys or application passwords are leaked in prompt context logs.
- [ ] Communication with external models encrypted using TLS v1.3.

### Tool & Execution Security
- [ ] Filesystem and shell tools execute in isolated sandboxes with strict CPU/memory limits.
- [ ] Database tools run on read-only replicas with scoped Row-Level Security (RLS) constraints.
- [ ] Agent write tools require manual human-in-the-loop (HITL) authorization gates.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Prompt Injection](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering12-security-implementation/prompt-injection-implementation.md)
- [PII Protection](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering12-security-implementation/pii-protection-strategy.md)
- [Adversarial Testing (Red Teaming)](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering14-testing-verification/adversarial-testing-verification-guide.md)
- [Responsible AI](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering18-compliance-governance/responsible-ai-guideline.md)

## 4. Sign-off Criteria
The security review passes when:
1. 100% of checklist validation points are verified.
2. Penetration red-team tests verify that the system blocks 100% of standard jailbreaks and prompt injections.
3. System logs verify that PII details (SSN, phone numbers, passwords) are scrubbed from 100% of logged prompt history blocks.
