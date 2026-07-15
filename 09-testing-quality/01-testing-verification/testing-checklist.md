# Testing Checklist

## 1. Backend Application Context
The Testing Checklist is an audit tool used to verify that unit tests, integration tests, contract checks, and mocks are structured correctly before release.

## 2. Backend-Specific Pitfalls
- **Signing off checks with zero database transaction rollbacks:** Leaving mock database test tables populated after test runs.

## 3. Code-Shape Example
`markdown
### Testing PR Review Guidelines:
- [ ] Unit tests contain zero network or database queries
- [ ] Integration tests run database rollbacks after each run
- [ ] Mock assertions verify target methods are called
- [ ] API routes tested against input validations and exceptions
- [ ] Test data factories generate unique identifier fields
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Testing Production Grade](../../production_principles/delivery-and-readiness/01-testing-production-grade-verification-guide.md)
