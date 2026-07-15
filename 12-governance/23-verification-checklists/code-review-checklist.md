# Code Review Checklist

## 1. Purpose
The Code Review Checklist is an audit tool used by PR reviewers to verify that incoming code complies with SOLID guidelines, error rules, and security baselines.

## 2. Checklist
- [ ] Business logic validation checks run before database queries
- [ ] Outbox pattern used for database + event publish workflows
- [ ] SQL queries parameterize user inputs (no dynamic strings)
- [ ] Exceptions handled cleanly using typed custom errors
- [ ] Test cases cover newly added methods and edge states

## 3. Cross-References
- [Code review guidelines](..coding-principles/code-review-guidelines-principles.md)
- [Secure coding guidelines](..17-security-implementation/secure-coding-implementation.md)

## 4. Sign-off Criteria
- Approved when reviewers complete audits, confirm test results, and approve PRs.
