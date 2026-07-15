# SOLID Principles

## 1. Definition & Core Concepts

SOLID is five object-oriented design principles (Robert C. Martin) for writing code that is easy to extend, maintain, and test:

- **S — Single Responsibility Principle (SRP):** A class/module should have one, and only one, reason to change.
- **O — Open/Closed Principle (OCP):** Software entities should be open for extension, closed for modification — add new behavior without editing existing, tested code.
- **L — Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types without breaking correctness.
- **I — Interface Segregation Principle (ISP):** Clients shouldn't be forced to depend on methods they don't use — prefer many small interfaces over one large one.
- **D — Dependency Inversion Principle (DIP):** High-level modules shouldn't depend on low-level modules; both should depend on abstractions. Depend on interfaces, not concrete implementations.

This is a general OO/architecture principle — applies to any language or layer, not specific to backend or database code.

## 2. Why It Exists

As codebases grow, uncontrolled coupling and mixed responsibilities make every change risky — touching one thing breaks three others. SOLID gives concrete rules that keep change localized and predictable.

## 3. What Breaks Without It

- "God classes" that do everything — a `UserService` that handles validation, persistence, email sending, and billing — become impossible to test or safely modify (SRP violation).
- Adding a feature requires editing dozens of existing `if/else` or `switch` blocks instead of adding a new class (OCP violation).
- Subclasses that throw `NotImplementedError` or behave unexpectedly in place of their parent, breaking polymorphic code that relies on the parent's contract (LSP violation).
- Classes forced to implement irrelevant methods just to satisfy a bloated interface (ISP violation).
- Business logic directly instantiating and calling concrete infrastructure (e.g., `new PostgresUserRepository()` inside a service) — impossible to unit test or swap implementations (DIP violation).

## 4. Best Practices

- Keep classes/functions small and named after a single clear responsibility.
- Extend behavior via new classes/strategies rather than editing existing, already-tested logic.
- Design base classes/interfaces around behavior contracts that every subtype can honor.
- Split large interfaces into focused, role-specific ones.
- Inject dependencies (constructor injection) as interfaces/abstractions; wire concrete implementations at the composition root (DI container, app bootstrap).

## 5. Common Mistakes / Anti-Patterns

- Treating SOLID as a checklist to apply everywhere uniformly — over-engineering simple CRUD code with unnecessary abstraction layers.
- Confusing "one reason to change" with "one method" — SRP is about responsibility/actor, not line count.
- Creating an interface for every single class "just in case" (premature abstraction) — violates YAGNI.
- Deep inheritance hierarchies used to satisfy OCP instead of composition.

## 6. Security Considerations

- DIP-based design makes it easy to swap in a security-hardened implementation (e.g., a rate-limited API client) without touching business logic.
- SRP reduces the blast radius of a bug — a vulnerability in the "email sending" responsibility can't accidentally corrupt "payment processing" state if they're properly separated.

## 7. Performance Considerations

- Excessive abstraction (many small classes, deep interface chains) can add indirection overhead — usually negligible, but can matter in hot paths; profile before optimizing away good structure.

## 8. Scalability Considerations

- SRP and DIP are what make a codebase scale with team size — different engineers/teams can own different responsibilities/modules without stepping on each other's code.

## 9. How Major Companies Implement It

Virtually all mature backend codebases (Google's internal style guides, Uber's engineering blog on Go/Java service design, Stripe's API layering) enforce SRP-style "one purpose per module" and DIP-style "depend on interfaces" as baseline code review standards, typically enforced via linters, architecture tests (e.g., ArchUnit), and code review checklists rather than framework magic.

## 10. Decision Checklist

Apply SOLID rigorously in: core domain/business logic, anything expected to change frequently or be tested in isolation.
Apply it lightly in: throwaway scripts, simple CRUD glue code, prototypes — don't over-abstract code that will never need to vary.

## 11. AI Coding-Agent Implementation Guidelines

- When generating a class/module, give it one clear responsibility; if it's doing validation + persistence + notification, split it into separate collaborating units.
- When adding new behavior to existing code, prefer adding a new class/strategy/handler over editing a large existing conditional block.
- When a subclass is generated, ensure it honors the base class/interface contract (no throwing "not supported" for inherited methods).
- Default business/domain services to depend on interfaces/abstract types for external dependencies (DB, HTTP clients, email), and inject concrete implementations at startup — never `new` up infrastructure directly inside domain logic.
- Don't generate an interface for every class by default — only introduce one when there's a real need to swap implementations or mock in tests.

## 12. Reusable Checklist

- [ ] Each class/module has one clear, nameable responsibility
- [ ] New features added via extension (new class/strategy), not edits to existing tested logic
- [ ] Subclasses are fully substitutable for their base type
- [ ] Interfaces are small and role-specific, not one giant interface
- [ ] Business logic depends on abstractions, not concrete infrastructure classes
- [ ] No premature abstraction — interfaces/DI introduced only where variation is real
