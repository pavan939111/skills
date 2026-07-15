# Engineering Governance

## 1. Definition & Core Concepts

Engineering governance at the code level is the automated enforcement of coding standards, architectural rules, security policies, and quality metrics across an organization's repositories.

Core pieces:
- **Linter & Formatter Rules:** Configuration schemas (e.g., `.eslintrc`, `pyproject.toml`, `prettier.config.js`) that enforce code style and catch syntax errors.
- **Architectural Guardrails:** Automated testing of code structure dependencies (e.g., ArchUnit) to verify architectural layering (e.g., "Repositories must never import Services").
- **Complexity Metrics:** Code-level analyzer measurements, such as cyclomatic and cognitive complexity, which calculate how difficult a function is to understand, test, and maintain.
- **Static Application Security Testing (SAST):** Automated analyzers that inspect source code for security flaws (e.g., SQL injection vectors, hardcoded secrets) before compile.
- **Pull Request Templates:** Standardized markdown files (`PULL_REQUEST_TEMPLATE.md`) that guide developers to self-assess their changes before requesting peer reviews.

*(Boundary Note: Managing engineering team structure, hiring guidelines, scrum agile meeting cadences, or developer performance criteria is out of scope. This document covers automated code quality enforcement, static validation gating, and architectural layering tests.)*

## 2. Why It Exists

As development teams grow, individual coding preferences diverge. Without automated engineering governance, codebases experience architectural decay (spaghetti code), inconsistent formatting that makes git diffs unreadable, and varying levels of security discipline. Automated governance guarantees that all code meets baseline safety and quality standards before it reaches production.

## 3. What Breaks in Production Without It

- **Spaghetti Architecture Lock-In:** Developers bypass architectural layers (e.g., importing database queries directly in UI views), tightly coupling systems and making future refactoring or database migrations impossible.
- **Git Diff Noise Pollution:** Unformatted code formatting styles (e.g., spacing, tabs, single vs double quotes) lead to massive, unreadable git diffs where real logic bugs go unnoticed during peer reviews.
- **High Cognitive Complexity Regressions:** Developers push complex, nested logical functions (e.g., 5 levels of nested `if` statements) that are impossible to unit test completely, leading to regressions during modifications.
- **Vulnerable Library Ingress:** A developer installs an outdated third-party library with critical CVE vulnerabilities, exposing the application to exploit immediately upon deployment.
- **Bypassed Security Scans:** Security rules exist as documentation guidelines rather than gates. Developers bypass checks "just for now," pushing hardcoded keys to production.

## 4. Best Practices

- **Automate Everything (If it is not automated, it doesn't exist):** Never rely on manual reviews or code guidelines documentation to enforce rules. Enforce styling, architecture, and security via automated CI pipeline gates.
- **Use Architecture Testing Tools:** Write tests using tools like ArchUnit (Java/C#), ArchUnitNET, or import-linter (Python) to assert package boundary rules programmatically as part of the test suite.
- **Configure Pre-Commit Hooks:** Use hooks (e.g., Husky, lint-staged) to run formatting and linting checks locally on the developer's machine before code can be committed to Git.
- **Enforce Cognitive Complexity Limits:** Set static analyzers to fail builds or flag warnings if a function's cyclomatic complexity exceeds a safe limit (e.g., 10 to 15) to force refactoring.
- **Implement SAST Gating:** Integrate static code analysis tools (e.g., SonarQube, Semgrep, CodeQL) in the CI/CD pipeline, and block merges that introduce new security vulnerabilities.
- **Standardize Pull Request Templates:** Require developers to complete checklists in PR templates confirming they wrote tests, ran migrations locally, verified logging, and updated runbooks.

## 5. Common Mistakes / Anti-Patterns

- **Soft Warnings That Are Ignored:** Setting CI checks to output warning messages without failing builds. Warnings are quickly ignored, leading to quality drift.
- **Custom Home-Grown Linters:** Writing proprietary scripting engines to enforce formatting rather than using standard community tools (Prettier, Black, ESLint, Rustfmt).
- **Over-Gating the local Workflow:** Running slow, heavy integration tests or SAST scans on local pre-commit hooks, causing developers to bypass hooks (`--no-verify`) because committing code takes too long. Keep pre-commit checks under 5 seconds.
- **Enforcing Guidelines Unilaterally:** Changing global linter profiles without team consensus, causing thousands of compilation errors across developer branches and stalling active sprints.

## 6. Security Considerations

- **Secret Scanning Gates:** Run secret detection tools (e.g., GitGuardian, gitleaks) in the CI pipeline to scan the entire git history of a commit branch, rejecting pushes containing password patterns or key formats.

## 7. Performance Considerations

- **Caching Lint Results:** Configure CI and local runners to cache linter states (e.g., `.eslintcache`) so they only scan modified files, preserving developer pipeline speeds.

## 8. Scalability Considerations

- **Shared Configuration Packages:** For multi-repository organizations, publish linter and formatter rules as private package dependencies (e.g., an npm package `@org/eslint-config`), allowing global updates of coding standards across repositories.

## 9. How Major Companies Implement It

- **Google:** Standardized their entire codebase format across major languages. Code is automatically reformatted on save or commit, eliminating formatting debates during reviews. They enforce strict code ownership rules, where changes to core directories must be approved by designated directory owners.
- **Netflix:** Utilizes automated guardrail checkers to inspect repository health, dependency configurations, and security compliance, flagging or auto-remediating violations using cloud automation tools.

## 10. Decision Checklist

- Implement **Automated Linters & Formatters** on: Every software project, script folder, and deployment repository from day one.
- Implement **Architectural Tests (ArchUnit)** when: The project contains multiple logical layers (e.g. Onion, Clean, Hexagonal architecture) and has multiple developers.
- Skip complex SAST gating ONLY when: Writing throwaway sandboxes or non-production local code prototypes.

## 11. AI Coding-Agent Implementation Guidelines

- Always check if linter and formatter configuration files (e.g., `.eslintrc`, `prettierrc`, `pyproject.toml`) exist, and conform generated code to their style guidelines.
- Never write code that bypasses compiler warnings, type assertions (`any` in TypeScript), or linter override comments (`eslint-disable-next-line`) without explicit justification.
- Always include a standard `PULL_REQUEST_TEMPLATE.md` inside a `.github/` or repository root folder.
- Always implement architectural layer separation (e.g., ensuring domain logic does not depend on HTTP controller structures) in directory layouts.
- Never hardcode API keys or secrets — verify that the code references configuration keys sourced from the environment.
- Always implement static code complexity limits inside linters or build configuration files where possible.

## 12. Reusable Checklist

- [ ] Formatter and Linter configurations committed to repository root
- [ ] Formatting and Lint checks run in CI and fail the build on errors
- [ ] Pre-commit hooks (e.g., Husky) configured to format and check code locally
- [ ] Architectural boundaries validated programmatically (e.g., ArchUnit tests active)
- [ ] SAST security scans (e.g., Semgrep, CodeQL) active in the build pipeline
- [ ] Secrets scanner (e.g., Gitleaks) active, scanning git push history
- [ ] `PULL_REQUEST_TEMPLATE.md` present in the repository
- [ ] Cognitive/Cyclomatic complexity limits defined and checked by analyzers
