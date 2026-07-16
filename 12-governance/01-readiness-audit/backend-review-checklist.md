# Backend Review Checklist

## 1. Purpose
The Backend Review Checklist is a quality gate audit tool used to verify that the application code, package configurations, dependency trees, and class structures meet design baselines.

## 2. Checklist
- [ ] All direct dependencies locked in package manifest files
- [ ] Coding casing rules checked by linter configurations
- [ ] Class dependencies injected via constructor arguments
- [ ] Memory leak boundaries checked (no unbounded caches)
- [ ] Decoupled services contain zero direct HTTP framework imports

## 3. Cross-References
- [Folder structure reference](../../03-backend-development/02-directory-structure/)
- [SOLID compliance checklist](../../03-backend-development/03-coding-principles/solid-principles.md)

## 4. Sign-off Criteria
- Approved when all code files compile, linter checks pass, and dependency trees are audited.
