# 12 — AI Security

Beyond traditional cybersecurity — attack surfaces unique to LLMs and agents. Standard 12-section template (see `../README.md`).

## Topics

| # | Topic | File | Status |
|---|-------|------|--------|
| 01 | Prompt Injection | `prompt-injection-implementation.md` | done |
| 02 | Jailbreaks | `jailbreaks-implementation.md` | done |
| 03 | Tool Security | `tool-security-implementation.md` | done |
| 04 | PII Protection | `pii-protection-implementation.md` | done |
| 05 | Secret Protection | `secret-protection-implementation.md` | done |
| 06 | Output Filtering | `output-filtering-implementation.md` | done |
| 07 | Permission Models | `permission-models-implementation.md` | done |
| 08 | AI Security Checklist | `ai-security-checklist.md` | done |

> `pii-protection-implementation.md` covers PII leaking *through model output or prompts* — mechanically different from `../../04-database-design/07-security/pii-protection-strategy.md` (data-at-rest) or `../../03-backend-development/10-configuration-management/configuration-management-strategy.md` (secrets in config). `secret-protection-implementation.md` here covers secrets accidentally exposed to a model via context or tool calls, not general secrets management.
