# DRY (Don't Repeat Yourself)

## 1. Definition & Core Concepts

DRY (Don't Repeat Yourself), formulated by Andy Hunt and Dave Thomas in *The Pragmatic Programmer*, states: "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."

Core pieces:
- **Duplication of Knowledge vs. Text:** DRY is about unifying business rules and logic, not necessarily matching strings of text. If two separate functions have identical code but represent different business concepts, they are not duplicates.
- **Single Source of Truth (SSOT):** Centralizing data schemas, algorithms, and business logic so that changing a requirement requires updating only one place in the code.
- **Rule of Three:** A heuristic suggesting that you should write a piece of code three times before attempting to extract it into a reusable abstraction, preventing premature optimization.
- **Accidental Duplication:** Code that looks identical today but serves different purposes/actors and will inevitably diverge tomorrow.

*(Boundary Note: While DRY applies to databases, database normalization rules belong in `database-design/`. This document covers code-level abstraction discipline, DRY thresholds, and logic unification rules.)*

## 2. Why It Exists

As codebases grow, duplication makes them increasingly fragile. If a business rule (e.g., tax calculation or validation logic) is duplicated across five files, a developer updating that rule must locate and edit all five instances. If they miss one, the application enters an inconsistent state, leading to production bugs, data corruption, or security discrepancies.

## 3. What Breaks in Production Without It

- **Divergent Business Logic:** A discount calculation is coded separately in the checkout API and the invoice generation worker. Due to code drift, the customer is billed a different amount than displayed during checkout, leading to financial mismatch.
- **Security Vulnerability Leaks:** A security patch is applied to one copy of an input-sanitization function, but three other duplicated copies of the function across the repository remain unpatched and exploitable.
- **High Maintenance Overhead:** Small feature changes require touching dozens of files, leading to merge conflicts, slow development speeds, and increased regression rates.
- **Test Suite Bloat:** Testing the same logic in five different suites. If the behavior changes, dozens of tests fail concurrently, hiding the actual regression source.

## 4. Best Practices

- **Differentiate Concepts from Syntax:** Only unify code if the underlying business concept is identical. If two functions check for string length, but one is validating usernames and the other is validating comments, keep them separate to prevent tight coupling.
- **Enforce the Rule of Three:** Do not write abstractions at the second occurrence. Wait until the third instance to understand the shared parameters and avoid premature, rigid designs.
- **Centralize Common Calculations:** Place core formulas, state transition logic, and domain rules inside dedicated helper services or domain models.
- **Generate Schemas and Models:** Use code generation to drive API schemas and client models from a single definition (e.g., OpenAPIs or Protobufs) to avoid manually duplicating structures between frontend and backend.
- **Decouple Shared Microservice Libraries:** Avoid DRY-ing code across microservice boundaries by publishing shared logic libraries for internal database schemas, which creates deployment lockstep. Duplicating simple logic is better than introducing tight coupling between services.

## 5. Common Mistakes / Anti-Patterns

- **Premature Abstraction:** Unifying code too early, leading to complex, unreadable helper functions with dozens of conditional arguments (`if (isUser && !isAdmin || isStaging)`) as developers try to accommodate slightly different use cases.
- **The "Helper Class" Junk Drawer:** Creating a `utils.ts` or `Helpers.java` file where thousands of unrelated functions are dumped, violating Single Responsibility.
- **DRYing Accidental Duplication:** Unifying two completely different UI button styles because they share the same color and padding today, only to rewrite them when product designs change.
- **Shared DB Entity Coupling:** Forcing two distinct services to share the same database model class just because they share tables, preventing independent database migrations.

## 6. Security Considerations

- **Single Validation Path:** Enforce input validation rules (e.g., checking if password meets entropy rules) inside a single, reusable class. Never duplicate security validation regexes, as they will inevitably drift and create vulnerabilities.

## 7. Performance Considerations

- **Indirection Overhead:** Excessive levels of abstraction (delegating work through 5 nested wrapper classes to avoid repeating code) can add call-stack latency and make debugging harder. Profile code to ensure clean structures do not compromise performance-sensitive paths.

## 8. Scalability Considerations

- **Decoupled Deployments:** Balance DRY against service autonomy. In distributed architectures, duplicating small helper functions is often preferred to ensure services can be deployed and scaled independently without shared library dependencies.

## 9. How Major Companies Implement It

- **Stripe:** Standardizes their core transaction processing ledger by locking code mutations behind unified domain classes, ensuring no microservice can modify account balances using custom calculations.
- **Google:** Employs shared code generation pipelines (Protobuf) to share structural definitions across Go, Java, and C++ backends, ensuring client-server interfaces are defined in exactly one place.

## 10. Decision Checklist

- Use **DRY Abstractions** when: The underlying business rule is identical, changing the requirement demands updating all instances, and the code has been written at least three times.
- Skip Abstractions (Accept Duplication) when: The code is syntactically identical but represents different domain concepts, or unifying them introduces tight coupling across independent microservices.

## 11. AI Coding-Agent Implementation Guidelines

- Never create a new utility function for common operations without checking if a shared library or helper already exists in the repository.
- Always wait until a block of logic is repeated in at least three places before extracting it into a reusable class or function.
- Never write nested conditional flags inside a utility function to handle different caller states — split it into distinct functions if behavior diverges.
- Always keep shared utility files focused and small — do not dump unrelated logic into a single generic helper module.
- Never share business model classes between different microservices — define separate models for each service's boundaries.

## 12. Reusable Checklist

- [ ] Unification applies to business knowledge/logic, not just similar-looking syntax
- [ ] Rule of Three respected (abstractions built after 3rd occurrence)
- [ ] No monolithic "Helper" or "Utility" junk-drawer classes created
- [ ] External API/DTO structures generated from a single definition source
- [ ] Simple code duplication accepted over tight coupling between microservices
- [ ] Validation rules and security policies centralized in single source modules
- [ ] Abstractions avoid complex conditional flags and remain readable
- [ ] Unit tests test the abstracted logic directly, eliminating duplicate test suites
