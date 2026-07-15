# Naming Conventions

## 1. Definition & Core Concepts
Naming Conventions are the standardized rules for naming files, directories, classes, functions, variables, and database tables consistently across the backend codebase.

## 2. Why It Exists / What Problem It Solves
Inconsistent naming (e.g. mixing camelCase, snake_case, and kebab-case for file names) makes codebases messy, hard to read, and difficult to navigate. Consistent naming rules align code structures with developer expectations and automation tools.

## 3. What Breaks in Production Without It
- **Case-Sensitivity Build Errors:** Git is case-insensitive by default on Windows/macOS, but Linux builds are case-sensitive. Importing userController.ts as UserController.ts breaks production container builds.
- **Search Failures:** Developers cannot find relevant files using grep or search paths because of variable file names.

## 4. Best Practices
- **Standardize File Names:** Use kebab-case for file names (e.g., user-controller.ts, create-user-use-case.ts) to prevent case-sensitivity bugs.
- **Use Role Suffixes:** Suffix classes and files with their technical role (e.g., UserService, UserRepository, CreateUserDto).
- **Enforce Language Standards:** Follow language-specific guidelines (e.g., camelCase for JavaScript variables, snake_case for Python).

## 5. Common Mistakes / Anti-Patterns
- **Generic folder names:** Naming folders utils or helpers and dumping hundreds of unrelated functions inside them.
- **Cryptic abbreviations:** Naming variables with single letters (e.g. u, o, d) instead of descriptive names (user, order, database).

## 6. Security Considerations
- **No Sensitive Leakage in Names:** Ensure function or route names do not expose internal security secrets or administrative bypass coordinates (e.g. /api/v1/bypass-auth).

## 7. Performance Considerations
- **Optimized Tree Searching:** Consistent suffix naming allows file indexing tools and compilation builders to exclude testing or mock files fast.

## 8. Scalability Considerations
- **Automated Linting Rules:** Configure eslint or ruff rules to automatically enforce naming conventions during CI/CD checks.

## 9. How Major Companies Implement It
- **Google:** Publishes strict style guides for every major language, requiring all code check-ins to pass automated format checks.

## 10. Decision Checklist (Case Convention Rules)
- Use **kebab-case** for:
  - File names, directory structures, and Docker resource names.
- Use **PascalCase** for:
  - Class declarations, interface declarations, and types.
- Use **camelCase or snake_case** for:
  - Variable names, functions, parameters, and database column keys (aligning with language norms).

## 11. AI Coding-Agent Guidelines
- Inspect the codebase naming styles and follow current patterns before naming new files, variables, or functions.

## 12. Reusable Checklist
- [ ] File names use consistent kebab-case conventions
- [ ] Class and suffix names identify their structural roles (Service/Repo)
- [ ] Variable casing aligns with target language style guidelines
- [ ] Variable names are descriptive and avoid single-character shortcuts
- [ ] Linter rules configured to validate file naming conventions
- [ ] Database entities names align with SQL schema capitalization rules
