# Logging Checklist

## 1. Backend Application Context
The Logging Checklist is an audit tool used to verify that logs are structured as JSON, log levels are set correctly, PII is redacted, and correlation IDs are forwarded across boundaries.

## 2. Backend-Specific Pitfalls
- **Signing off checklist with plain-text logs active:** Permitting unstructured console logs to bypass build gates.

## 3. Code-Shape Example
`markdown
### Logging PR Review Guidelines:
- [ ] Logs written as structured JSON to stdout/stderr (no file writes)
- [ ] Passwords, credit cards, and authorization tokens redacted from logs
- [ ] Correlation IDs generated in middleware and passed downstream
- [ ] Log levels conform to rules (DEBUG for detail, INFO for status, ERROR for failures)
- [ ] Third-party libraries configured to suppress noisy debug outputs
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Logging](logging-checklist.md)
