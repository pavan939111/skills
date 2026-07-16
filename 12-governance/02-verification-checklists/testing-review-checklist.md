# Testing Review Checklist

## 1. Purpose
The Testing Checklist is an audit tool used to check that new services contain mock assertions, database rollbacks, and contract schemas.

## 2. Checklist
- [ ] Unit tests contain no database or network dependencies
- [ ] Integration tests run database transaction rollbacks after each run
- [ ] Mock assertions verify target methods are called
- [ ] Test data factories generate unique IDs (no database collisions)
- [ ] Test coverage metrics meet organizational baselines

## 3. Cross-References
- [Testing reference](../../09-testing-quality/01-testing-verification/)
- [Unit testing](../../09-testing-quality/01-testing-verification/unit-testing-verification-guide.md)

## 4. Sign-off Criteria
- Approved when test coverage meets targets and CI pipeline tests execute successfully.
