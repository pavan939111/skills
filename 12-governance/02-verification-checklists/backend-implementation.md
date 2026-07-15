# Backend Implementation Checklist

## 1. Purpose
The Backend Implementation Checklist is a recurring developer check used to verify that code structure, files, variables, and dependencies comply with coding standards on every PR.

## 2. Checklist
- [ ] Class dependencies are constructor-injected (no hardcoded imports)
- [ ] New modules export clean public interfaces (no internal bleeding)
- [ ] Casing of directories and files uses kebab-case
- [ ] Dynamic loops do not execute database queries (no N+1 queries)
- [ ] Variable names match domain terms and are descriptive

## 3. Cross-References
- [Naming conventions](..02-directory-structure/naming-conventions-implementation.md)
- [Dependency Injection](..coding-principles/dependency-injection-principles.md)

## 4. Sign-off Criteria
- Approved when the developer compiles code locally, runs linter checks, and verifies naming casing.
