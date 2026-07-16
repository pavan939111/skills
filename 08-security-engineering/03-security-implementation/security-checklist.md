# Security Checklist

## 1. Backend Application Context
The Security Checklist is an audit tool used to verify that SQL parameter binding, sanitizers, CORS controls, rate limits, and encryption algorithms are configured securely.

## 2. Backend-Specific Pitfalls
- **Signing off checks without verifying test scripts:** Skipping validation tests on authentication paths.

## 3. Code-Shape Example
`markdown
### Security PR Review Guidelines:
- [ ] All database queries parameterized to block SQL injection
- [ ] CORS whitelists block origin wildcard headers (* with credentials)
- [ ] Dynamic rate limiters verify client IPs in Redis caches
- [ ] Password strings hashed using Argon2id or bcrypt
- [ ] Content validation headers reject payloads exceeding size limits
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../security-fundamentals-policy.md)
