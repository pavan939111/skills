# Security Review Checklist

## 1. Purpose
The Security Review Checklist is an audit tool used to check that endpoints enforce authentication headers, validate scopes, and limit requests.

## 2. Checklist
- [ ] API routes enforce authorization middleware checks
- [ ] Database queries filter results based on tenant sessions (no IDOR)
- [ ] Secret parameters and keys retrieved from system environment vaults
- [ ] CORS headers configure whitelist domains (no wildcard origin checks)
- [ ] Rate limit limits configured on public authentication endpoints

## 3. Cross-References
- [Security reference](../../08-security-engineering/03-security-implementation/)
- [Authentication reference](../../08-security-engineering/01-authentication/)

## 4. Sign-off Criteria
- Approved when security verification tests pass and database user permissions use least-privilege configurations.
