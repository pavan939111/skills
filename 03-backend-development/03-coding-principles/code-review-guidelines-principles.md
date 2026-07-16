# Code Review Guidelines in Backend Development

## 1. Backend Application Context
Code reviews verify that incoming pull requests conform to style guides, security baselines, and database performance limits:
- **Review Database Migrations:** Check new table schemas for indexes, column restrictions, and foreign key rules.
- **Audit API Schema Changes:** Verify that route updates are backward-compatible and do not break integration clients.
- **Verify Error Handling:** Check that all new controller functions catch exceptions and log details using correlation IDs.

## 2. Backend-Specific Pitfalls
- **Focusing on formatting only:** Wasting review time on brackets and spaces rather than inspecting thread blocking, database transaction limits, or security token verification.
- **Skipping test validations:** Merging code changes that lack corresponding unit or integration test assertions.

## 3. Code-Shape Example
`markdown
### Backend PR Review Checklist Template:
- [ ] Database migrations include indexes on search/foreign key columns
- [ ] API changes are backward-compatible (no broken JSON contracts)
- [ ] Direct SQL queries use parameterized arguments (no sql injection)
- [ ] New routes include unit or integration test files
- [ ] Environment variable changes documented in .env.example
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- Code Review Practices
