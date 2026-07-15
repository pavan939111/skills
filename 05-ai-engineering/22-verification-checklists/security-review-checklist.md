# Per-Change Security Review Checklist

## 1. Purpose
This checklist is used to review the security of any prompt edits, tool configuration adjustments, or model routing changes before code integration.

## 2. Checklist

### Ingress & Injection Defense
- [ ] User query delimiters (e.g. XML tags) configured to block prompt injection overrides.
- [ ] Input moderation checks cover the updated prompt paths.
- [ ] Direct merge of user variables into system prompt roles is blocked.

### Secret & PII Audits
- [ ] Prompt template reviewed to verify no API keys, corporate passwords, or config tokens are exposed.
- [ ] PII scrubbers verified to block sensitive customer values on logging channels.

### Downstream Tool Security
- [ ] New tools configure least-privilege API scopes and database read-only replica paths.
- [ ] Parameter validation constraints (Zod/Pydantic schemas) enforced.
- [ ] Automated write actions require human-in-the-loop validation checkpoints.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Tool Security](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering12-security-implementation/tool-security-implementation.md)
- [AI Security Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering12-security-implementation/ai-security-checklist.md)
- [Security Review Checklist](file:///c:/Users/mahip/OneDrive/Desktop/skills/05-ai-engineering21-readiness-audit/security-review-strategy-implementation.md)

## 4. Sign-off Criteria
The per-change security review passes when:
1. 100% of checklist validation points are verified.
2. Code review validates that no raw user parameters are executed as dynamic queries or shell lines.
3. Automated security scanners confirm zero hardcoded secrets in the updated files.
