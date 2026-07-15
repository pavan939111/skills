# Security Review Readiness Guide

> [!NOTE]
> [That file covers strategic security threat modeling and options; this file provides the checklist for production readiness security review.](../13-security-strategy/security-review-strategy.md)

## 1. What Question This Answers
"Does the system architecture comply with threat model boundaries, data encryption standards, and user privacy regulations before release?"

## 2. Why It Matters at the System-Design Stage
Identifying security vulnerability design flaws (e.g. missing input validation, un-encrypted credentials) before coding is significantly cheaper than post-deployment patching.

## 3. Methodology / How to Work Through It
1. **Audit Auth Protocols:** Verify authentication and authorization structures.
2. **Review Encryption Targets:** Check TLS transport and KMS disk volumes.
3. **Verify Secret Storage:** Confirm vault configurations.
4. **Execute Security Checklist:** Complete review log.

## 4. Inputs Needed
- Threat modeling parameters.
- Security strategy selections.

## 5. Outputs Produced
- Feeds into [Database Security Review](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/12-production-checklists/security-review-strategy-implementation.md).

## 6. Worked Checklist Example
- [x] Environment secrets are injected via vault managers (no plaintext files).
- [x] All APIs route through HTTPS (TLS v1.3).
- [x] Database RLS is enabled for multi-tenant tables.

## 7. Common Mistakes
- **Plaintext Secrets in Code:** Committing database credentials to git.
- **Unencrypted PII:** Storing client social numbers in plaintext database tables.

## 8. AI Coding-Agent Guidelines
1. **Enforce Least Privilege:** Restrict database connections roles privileges.
2. **Verify Secret Vaults:** Ensure no hardcoded keys exist in code.
3. **Produce Security Audit Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Security Review Log: [System Name]

### 1. Security Compliance Checks
- [ ] TLS v1.3 is configured for all ingress HTTP endpoints.
- [ ] Database credentials and keys are injected via secret vaults.
- [ ] Database tables containing PII use envelope encryption.
- [ ] API routes enforce rate limits and input validation rules.

### 2. Sign-off Status
- **Status:** [Go / No-Go]
- **Outstanding Actions:** [e.g. Set up KMS keys rotation schedule.]
```
