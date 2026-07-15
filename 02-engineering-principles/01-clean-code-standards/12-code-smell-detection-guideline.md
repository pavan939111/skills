# Code Smell Detection

## 1. Definition & Core Concepts

A Code Smell (coined by Kent Beck and popularized in Martin Fowler's *Refactoring*) is a surface-level indicator in source code that suggests a deeper design flaw, technical debt, or potential bug, without necessarily being a compile or syntax error.

Core pieces:
- **Common Code Smells:**
  - *Long Method / Large Class:* Modules that exceed size thresholds, indicating mixed concerns.
  - *Primitive Obsession:* Using basic primitives (strings, integers) to represent complex domain values (e.g. raw string for `PhoneNumber` or `EmailAddress`).
  - *Data Clumps:* Groups of variables that are always passed together (e.g., `start_date`, `end_date`) across multiple method signatures.
  - *Feature Envy:* A method in Class A that makes excessive calls to getters in Class B to execute its calculations.
  - *Speculative Generality:* Code written to support hypothetical future features (interfaces with single implementations, unused parameters).
  - *Message Chains:* Violations of the Law of Demeter (`a.getB().getC().doSomething()`).
- **Static Code Analysis:** Automated tools that scan code ASTs to identify smells and calculate technical debt ratios (e.g., SonarQube, PMD, ESLint, CodeClimate).

## 2. Why It Exists

Code smells are warning signs. They indicate that code structure has begun to decay. Left unresolved, code smells accumulate into structural rot, turning the codebase into a fragile "spaghetti" system where adding features is slow and risky.

## 3. What Breaks in Production Without It

- **Logical Validation Bypass (Primitive Obsession):** An email address is passed throughout the system as a raw string. Due to missing central validation, a malformed email is saved, crashing downstream email delivery workers.
- **Accidental State Corruption (Feature Envy):** Class A directly manipulates Class B's properties. Because logic is external, Class B's internal state constraints are bypassed, corrupting data.
- **Cascading Null Failures (Message Chains):** Long chains fail with NullPointerExceptions when a mid-level dependency is empty.
- **Unmaintainable Codebases:** The codebase becomes so filled with duplication, large classes, and dead abstractions that engineers cannot debug incidents quickly, increasing outage times.

## 4. Best Practices

- **Automate Smell Audits in CI:** Integrate static analysis tools (e.g., SonarQube, CodeClimate) in the CI/CD pipeline. Fail builds or block merges if code complexity or debt ratios exceed thresholds.
- **Refactor Primitive Obsession into Value Objects:** Instead of using a raw string for email, create a dedicated `EmailAddress` class/struct containing validation rules. Use this type in method arguments to guarantee valid data.
- **Extract Data Clumps into Parameter Objects:** If you pass `x, y, width, height` or `start_date, end_date` to multiple functions, consolidate them into a single class/struct (e.g., `DateRange`).
- **Resolve Feature Envy via Method Migration:** Move the method (or portion of the method) that has feature envy into the class that actually owns the data.
- **Prune Speculative Generality:** Delete unused abstract classes, parameters, and dead code immediately. Do not build interfaces for single implementations.

## 5. Common Mistakes / Anti-Patterns

- **Treating Smells as Strict Errors:** Blindly refactoring every warning. A code smell is a hint, not an absolute rule. Sometimes a simple switch statement is cleaner than introducing a complex factory class strategy hierarchy. Use developer judgment.
- **Ignoring Tool Warnings:** Allowing static code analysis warnings to pile up to thousands, rendering the dashboard useless. Enforce strict, zero-warning gating for critical directories.
- **Using Comments to Mask Smells:** Writing comments to explain why a 300-line function is complex instead of refactoring it into smaller pieces.

## 6. Security Considerations

- **Validating Domain Contracts:** Primitive Obsession frequently causes security validation gaps. By converting raw strings into strongly typed, validated Value Objects (e.g., creating a `UserRole` class), you enforce input validation at compile time, eliminating injection vectors.

## 7. Performance Considerations

- **Value Object Allocation Cost:** Creating wrapper classes (Value Objects) for primitives adds minor allocation overhead. In standard business logic (CRUD APIs), this cost is completely unmeasurable, and JIT compilers optimize them. Only revert to raw primitives in high-frequency numerical calculation loops.

## 8. Scalability Considerations

- **Maintainable Architectures:** Standardizing code layouts and eliminating smells ensures that as team size and codebase size grow, developers can understand and modify code safely without regressions.

## 9. How Major Companies Implement It

- **Netflix & Stripe:** Enforce static analysis gates in their development pipelines. Merges are automatically blocked if a PR introduces new code quality debt, circular imports, or violates complexity parameters.
- **Amazon:** Conducts architectural reviews focused on domain boundaries, ensuring services and code modules remain highly cohesive and loosely coupled.

## 10. Decision Checklist

- Refactor Code Smells when: The smell resides in a file that is actively being modified for a feature (Boy Scout Rule), or the smell is causing bugs/failures in production.
- Accept Code Smells when: The code runs in a non-production script, or refactoring the smell would result in premature, over-engineered abstractions (violating KISS/YAGNI).

## 11. AI Coding-Agent Implementation Guidelines

- Always run static lint and type checking tools before committing code.
- Never use raw primitives (strings/numbers) to represent complex business identifiers that require validation — use Value Objects.
- Always extract repeating parameters (Data Clumps) into parameter objects.
- Never write methods that directly query getters of another class to perform math — move the logic to the data owner.
- Always delete unused interface files and speculative code branches.
- Never write nested message chains (`a.getB().getC()`) — apply Law of Demeter wrapper methods.

## 12. Reusable Checklist

- [ ] Static analysis tools (ESLint, SonarQube, etc.) configured and active in CI
- [ ] Primitive Obsession replaced with validated Value Objects (e.g., `EmailAddress`)
- [ ] Data Clumps consolidated into Parameter Objects (e.g., `DateRange`)
- [ ] No "Feature Envy" (logic resides in the class that owns the data)
- [ ] Speculative Generality removed (no single-implementation interfaces or unused code)
- [ ] No Message Chains present (Law of Demeter respected)
- [ ] Large classes and long methods decomposed into small, cohesive modules
- [ ] Static check warnings resolved; no bypassed quality flags committed
