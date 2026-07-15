# Security Review Checklist

## 1. Purpose
The Security Review Checklist is an audit tool used to verify that APIs block SQL injection, escape inputs for XSS, validate origins for CORS, and hash user passwords.

## 2. Checklist
- [ ] SQL queries use parameterized bindings exclusively
- [ ] Inputs sanitized to strip HTML scripts
- [ ] CORS whitelists restrict origin access
- [ ] Passwords hashed using Argon2id or bcrypt
- [ ] Rate limit policies active on public authentication routes

## 3. Cross-References
- [Security reference](..17-security-implementation/)
- [SQL injection prevention](..17-security-implementation/sql-injection-strategy.md)

## 4. Sign-off Criteria
- Approved when security verification tests pass and database user keys use least-privilege configurations.
