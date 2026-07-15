# Composition over Inheritance

## 1. Definition & Core Concepts

Composition over Inheritance (or the Composite Reuse Principle) is a software design pattern stating that classes should achieve polymorphic behavior and code reuse by containing instances of other classes (Composition: "HAS-A" relationship) rather than extending a base class (Inheritance: "IS-A" relationship).

Core pieces:
- **Inheritance (IS-A):** Class B extends Class A, inheriting all its public and protected behaviors, properties, and constraints.
- **Composition (HAS-A):** Class B contains a reference to an instance of Class C and delegates specific tasks to it.
- **Delegation:** The practice of a composed class forwarding method calls to its internal components.
- **The Fragile Base Class Problem:** A security and stability issue where modifying a method in a base class silently breaks assumptions in inherited subclasses, causing production failures.

## 2. Why It Exists

Inheritance is the tightest coupling possible in object-oriented programming. A subclass is intimately tied to the internal implementation details of its parent class. If the parent class changes, the subclass can break. Composition keeps components decoupled, letting developers swap or configure behaviors dynamically at runtime without modifying class structures.

## 3. What Breaks in Production Without It

- **The Fragile Base Class Outage:** A developer updates a core base class `BaseService` to log transaction timings. This update silently alters the execution order of database connections, causing 10 inherited subclasses to leak database connections in production.
- **Class Hierarchy Explosion:** To add features (e.g., rate limiting, logging, caching) to a repository via inheritance, you must create combinations of subclasses like `LoggedUserRepository`, `RateLimitedUserRepository`, and `LoggedRateLimitedUserRepository`. The codebase becomes unmaintainable.
- **Unexpected API Exposure:** Class B extends Class A (e.g. a `SecureStack` class extends a standard `List` class). Because it inherits all base methods, clients can call `list.removeAt(5)` directly on the stack, bypassing the secure `push`/`pop` limits and corrupting data.
- **Testing Blockades:** Mocking a subclass that inherits from a complex base class forces you to mock the entire hierarchy, leading to brittle test configurations.

## 4. Best Practices

- **Default to Composition (HAS-A):** When designing a class, construct it by composing small, focused components rather than subclassing. Instead of `class PremiumUser extends User`, use a `User` class containing a `billingPlan` object.
- **Use Strategy Pattern for Varying Behaviors:** Define algorithms or behaviors behind interfaces (e.g., `TaxStrategy`), compose them into the host class, and inject the concrete strategy at runtime.
- **Implement Explicit Delegation:** If Class B needs to expose some methods of Class C, compose Class C and write explicit wrapper methods that forward calls. Do not inherit Class C.
- **Use Small, Focused Interfaces:** Define roles using interfaces (e.g., `Loggable`, `Rentable`, `Authenitcatable`) rather than packing behaviors into fat base classes.
- **Mark Classes as Final/Sealed:** Prevent other developers from subclassing your classes by default by using language-specific keywords (e.g., `final` in Java/PHP, `sealed` in C#).

## 5. Common Mistakes / Anti-Patterns

- **Inheriting for Code Reuse Only:** Extending a class simply because you want to use its helper methods, even if the two classes represent completely different concepts (e.g., making a `BillingService` extend an `EmailService` to send receipts).
- **Deep Inheritance Trees:** Creating hierarchies deeper than two levels (e.g. `Grandparent -> Parent -> Child -> SubChild`), which makes tracking execution flow impossible.
- **Overriding Base Methods to Disable Them:** Subclassing a parent class and throwing `NotImplementedException` inside inherited methods because the subclass doesn't support those behaviors (direct violation of Liskov Substitution Principle).

## 6. Security Considerations

- **Scope Modifier Control:** Inheritance can expose base class internal state variables to subclasses. Use composition and strict access modifiers (keep fields `private`, avoid `protected`) to maintain clean security boundaries.

## 7. Performance Considerations

- **Indirection and Delegation Cost:** Composition requires calling methods on composed objects, which adds a minor indirection layer in the CPU. This overhead is negligible in business code, and JIT compilers routinely inline simple delegation calls.

## 8. Scalability Considerations

- **Runtime Configuration Flexibility:** Composition allows you to change behavior at runtime (e.g. swapping a composed `CachedReader` for a `DirectReader` when cache connections fail), which is impossible with static inheritance.

## 9. How Major Companies Implement It

- **Go Language Designers (Google):** Omitted class inheritance from the Go language completely. Go only supports struct embedding (composition) and interfaces, proving that complex production software can be built without inheritance.
- **Java/C++ Monorepos (Google/Amazon):** Internal style guidelines heavily discourage the use of `extends` for code reuse, mandating composition and constructor injection as standard design review requirements.

## 10. Decision Checklist

- Use **Composition (HAS-A)** when: Reusing code across different concepts, behaviors need to swap dynamically at runtime, or you want to combine multiple features without creating subclass combinations.
- Use **Inheritance (IS-A)** ONLY when: The subclass is a strict subtype of the parent, honors Liskov Substitution, the hierarchy is flat (1 level), and the parent class is specifically designed for extension.

## 11. AI Coding-Agent Implementation Guidelines

- Never use inheritance (`extends`) simply to reuse utility or helper methods — use composition and delegation.
- Always mark generated classes as `final` or `sealed` by default unless class extension is explicitly requested.
- Always design polymorphic behaviors using interfaces and the Strategy Pattern rather than base class method overrides.
- Never write classes that inherit from standard collection classes (e.g. extending `ArrayList` or `HashMap`) — compose the collection instead.
- Always implement explicit delegation methods when exposing composed object features.

## 12. Reusable Checklist

- [ ] "HAS-A" (Composition) used by default instead of "IS-A" (Inheritance)
- [ ] Classes marked `final` or `sealed` unless designed explicitly for inheritance
- [ ] No inheritance hierarchies exceed 2 levels of depth
- [ ] Polymorphism achieved via interfaces and Strategy/State design patterns
- [ ] Subclasses throw no `NotImplementedException` for inherited methods
- [ ] Composition delegation is explicit (no raw exposure of parent methods)
- [ ] Utility code accessed via composed helper classes, not parent classes
- [ ] Subclasses honor the Liskov Substitution Principle (LSP)
