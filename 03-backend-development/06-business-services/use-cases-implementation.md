# Use Cases

## 1. Definition & Core Concepts
A Use Case (or Interactor) is an implementation pattern that represents a single, specific business action or user flow (e.g. RegisterUser, SubmitOrder). It contains the precise sequence of steps required to complete that task.

## 2. Why It Exists / What Problem It Solves
Traditional service classes often gather dozens of unrelated methods (e.g., UserService handling logins, registrations, updates, deletions). These classes grow bloated and violate SRP. Use Cases split these methods into isolated, single-responsibility classes.

## 3. What Breaks in Production Without It
- **Bloated Service Classes:** Service files grow to thousands of lines, complicating version control commits and code reviews.
- **Merge Conflicts:** Multiple developers edit the same service file to modify different actions, generating merge conflicts.

## 4. Best Practices
- **Single Responsibility:** Design each Use Case class to execute exactly one action, typically exposing a single execute() method.
- **Explicit Request/Response Schemas:** Define unique input (Request) and output (Response) DTO models for each Use Case.
- **Inject Dependencies:** Pass required repositories and gateways into the Use Case constructor using DI.

## 5. Common Mistakes / Anti-Patterns
- **Nesting Use Cases too deeply:** Letting Use Cases call other Use Cases in loops, creating untraceable dependencies.
- **Leaking HTTP details:** Referencing controller parameters in Use Case input DTOs.

## 6. Security Considerations
- **Use-Case Level Authorization:** Enforce permission and role authorization checks inside the Use Case logic to protect the transaction.

## 7. Performance Considerations
- **Pruned Memory Footprints:** Instantiating single Use Case interactors consumes less memory than initializing massive global services.

## 8. Scalability Considerations
- **Modular Monolith migration:** Decoupled Use Cases can be easily relocated to new microservices when codebase modularization is required.

## 9. How Major Companies Implement It
- **Clean Architecture Teams:** Utilize the Interactor pattern in large-scale applications to maintain small, testable, and isolated code files.

## 10. Decision Checklist (Use Case Application)
- Use **Use Case Pattern (Interactors)** when:
  - Building large applications with complex business rules where code maintainability, SRP, and clean testing are prioritized.
- Use **Standard Services** when:
  - Building small CRUD utilities with low complexity and limited methods.

## 11. AI Coding-Agent Guidelines
- Write Use Case classes that implement a single main method (e.g. execute()), taking validation DTOs as parameters.

## 12. Reusable Checklist
- [ ] Use Case class represents exactly one business action (e.g. SubmitOrder)
- [ ] Class exposes a single main execution method (e.g. execute())
- [ ] Input and output DTO schemas defined explicitly for the Use Case
- [ ] Dependencies injected via constructor parameters
- [ ] Domain-specific authorization rules validated inside the Use Case
- [ ] Unit tests validate the Use Case sequence using mock dependencies
