# Class Design

## 1. Definition & Core Concepts

Class Design is the clean-code-standards discipline of structuring object-oriented classes to be small, cohesive, and encapsulated, conforming to standard OO design principles (SOLID).

Core pieces:
- **Single Responsibility Principle (SRP):** A class should have one, and only one, reason to change (one primary responsibility).
- **High Cohesion:** The degree to which the methods of a class manipulate its instance variables. In a highly cohesive class, every method should manipulate one or more instance variables.
- **Encapsulation (Information Hiding):** Hiding a class's internal state and implementation details, exposing only a narrow, well-defined public API.
- **Smallness:** Classes should be compact. The size of a class is measured by its responsibilities, not just line count. A class with too many instance variables or public methods is likely too large.

## 2. Why It Exists

As systems grow, classes tend to accumulate responsibilities. Developers add methods for convenience, turning once-simple classes into monolithic "God classes" that are impossible to test, modify, or understand. Clean class design keeps modules small and isolated, ensuring changes remain localized and predictable.

## 3. What Breaks in Production Without It

- **God Class Outages:** A single `UserService` class contains 15,000 lines of code, managing auth, persistence, notification, and profile formatting. A developer modifies notification formatting, silently breaking the login logic and causing a production outage.
- **State Corruption (No Encapsulation):** Exposing mutable public fields (e.g., `user.status = 'active'`) allows external modules to bypass state validation rules, putting the database into inconsistent states.
- **Brittle Mocking in Tests:** A large class has 20 dependencies. Writing unit tests for it requires configuring a massive mock setup, making tests fragile and hard to maintain.
- **Circular Initialization Failures:** Classes are tightly coupled and depend on each other mutually (`ClassA` instantiates `ClassB`, which instantiates `ClassA`), causing stack overflow crashes during application boot.

## 4. Best Practices

- **Enforce Single Responsibility:** Ensure each class represents a single domain concept or task. If a class description requires the word "and" (e.g., "This class retrieves user profiles and sends notifications"), split it.
- **Expose a Minimal Public API:** Keep class properties `private` or `protected` by default. Expose only the minimum number of public methods required by callers.
- **Maximize Cohesion:** If some methods in a class only use a subset of instance variables, it indicates the class contains two separate concerns. Extract the variables and methods into a new, smaller class.
- **Implement Dependency Inversion:** Depend on interfaces rather than concrete classes. Inject dependencies via the constructor (Constructor Injection) to enable easy mocking and replacement.
- **Prefer Composition over Inheritance:** Compose behavior using strategy classes rather than building deep inheritance trees that lead to the fragile base class problem.

## 5. Common Mistakes / Anti-Patterns

- **The God Class:** Monolithic classes containing hundreds of methods and managing unrelated business tasks.
- **Anemic Domain Models:** Classes that are simple data holders with public getters and setters and zero business logic, while logic is scattered in procedural controllers.
- **Exposing Internal Arrays:** Returning references to internal mutable collections directly, allowing callers to bypass mutation constraints.
- **Static Utility Classes for Business Logic:** Writing business logic inside stateless classes filled with public static methods, preventing polymorphism and mocking.

## 6. Security Considerations

- **Data Hiding Protection:** Strict encapsulation prevents callers from modifying internal security-sensitive variables (like user roles or transaction lock flags) directly. Expose mutations only through validated public method gates.

## 7. Performance Considerations

- **Object Lifecycle Overhead:** Splitting large classes into smaller composed classes increases the number of object instantiations. In normal business code, modern garbage collectors process these lightweight objects with zero measurable performance impact. Prioritize maintainability.

## 8. Scalability Considerations

- **Decoupled Monoliths:** Codebases structured with small, cohesive classes are easy to refactor. If a service needs to be extracted into a separate container or microservice, the boundary is already clean and isolated.

## 9. How Major Companies Implement It

- **Google's Java & C++ Guides:** Enforce strict encapsulation limits. Public variables are prohibited, classes must use constructor dependency injection, and classes must be marked `final` by default to prevent uncontrolled inheritance structures.
- **Mature Domain-Driven Design (DDD) Codebases:** Organize classes into Aggregate Roots that control state access, ensuring data mutations always flow through a single authoritative class boundary.

## 10. Decision Checklist

- Enforce **Clean Class Design** on: All core business logic services, database repositories, application controllers, domain models, and external adapters.
- Use **Anemic Data Classes (DTOs)** ONLY when: Mapping simple, stateless database row variables or API JSON transport schemas.

## 11. AI Coding-Agent Implementation Guidelines

- Always limit class scopes to a single clear responsibility.
- Never declare class properties as public variables — keep fields private and expose validated methods.
- Always inject dependencies as interfaces via constructors.
- Never write classes that inherit from non-abstract base classes — default to composition.
- Always group instance variables and methods so that class cohesion remains high.
- Never return references to internal mutable collections — return read-only views or copies.

## 12. Reusable Checklist

- [ ] Class represents a single, focused responsibility (Single Responsibility Principle)
- [ ] Class properties are private, keeping internal state encapsulated
- [ ] Constructor injects dependencies as interfaces (no internal `new` overrides)
- [ ] Class cohesion is high (methods actively use the class's instance variables)
- [ ] No public setter methods exist for internal mutable arrays or lists
- [ ] Classes marked `final` or `sealed` unless designed explicitly for extension
- [ ] No circular dependencies exist between class initializations
- [ ] Class contains no reference to infrastructure details (e.g. SQL driver types) inside domain definitions
