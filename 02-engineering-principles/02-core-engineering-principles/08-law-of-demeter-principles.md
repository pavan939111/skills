# Law of Demeter

## 1. Definition & Core Concepts

The Law of Demeter (LoD), or the Principle of Least Knowledge, is a software design rule that limits coupling between objects. It states: "A module should not know about the innards of the objects it manipulates."

Specifically, a method `M` of an object `O` should only invoke methods on:
1. `O` itself (self).
2. Objects passed as arguments to `M`.
3. Objects created or instantiated within `M`.
4. Immediate component/instance variables of `O`.
5. Global variables accessible by `O` (though global mutable state is discouraged).

Code should never invoke methods on objects returned by another method call (commonly summarized as: "Use only one dot" or "Don't talk to strangers").

## 2. Why It Exists

If class A navigates deep into class B's dependencies (e.g. `order.getCustomer().getAddress().getZipCode()`), class A becomes tightly coupled to the internal structure of `Customer` and `Address` classes. If the `Address` structure changes, or if the relationship between `Customer` and `Address` is modified, class A breaks. LoD preserves encapsulation and keeps coupling low.

## 3. What Breaks in Production Without It

- **Cascading NullPointerExceptions (NPEs):** Long method chains like `user.getSubscription().getPlan().getPrice()` crash the application with NPEs if the user has no subscription, or if the plan is null.
- **Fragile Refactoring Breaks:** Renaming or refactoring a nested property requires updating dozens of unrelated files that traversed the object graph.
- **Unit Test Mock Explosions:** Writing a test for a class that violates LoD requires mocking the entire chain of objects (`mockUser`, `mockSubscription`, `mockPlan`), resulting in complex, brittle tests.
- **Unintended State Mutations:** Exposing internal object graphs allows callers to modify nested data directly (e.g., `user.getAccount().setBalance(100)`), bypassing validation rules written in the parent class.

## 4. Best Practices

- **Delegate Navigation to the Friend:** If you need data from a stranger, ask your immediate friend to fetch it. Instead of `order.getCustomer().getAddress().getCity()`, write `order.getCustomerCity()`.
- **Implement Wrapper/Delegation Methods:** Add delegation helper methods to parent classes to hide internal structure.
- **Distinguish Fluent Builders from Strangers:** Method chains that return the same object type (e.g. Builder pattern like `builder.setName().setAge().build()` or stream pipelines) are *not* LoD violations. LoD is violated only when navigating across *different* types in an object graph.
- **Design Tell, Don't Ask:** Instead of querying an object's state in a chain to decide what to do, tell the object to do the work. Instead of `if (user.getRole().getName() == "Admin") { deleteUser() }`, write `if (user.isAdmin()) { deleteUser() }`.

## 5. Common Mistakes / Anti-Patterns

- **Train Wrecks:** Writing long, consecutive method calls (e.g., `a.getB().getC().getD().doSomething()`) that resemble a train wreck.
- **Getter-Heavy Data Models:** Creating domain models where every internal field is exposed via public getters, inviting callers to traverse their structures.
- **Bypassing Encapsulation via Collections:** Returning internal raw arrays or maps, allowing callers to fetch and mutate list items directly (e.g., `customer.getOrders().clear()`). Return read-only views or copy arrays instead.

## 6. Security Considerations

- **Data Privacy Violations:** Exposing nested internal structures allows developers to accidentally return complete, deep JSON models (containing passwords or PII) in API responses simply because they serialized a parent class. Keep object boundaries narrow.

## 7. Performance Considerations

- **Delegation Overhead:** Adding delegation methods adds a minor CPU instruction cost due to call forwarding. In standard software, this is negligible and JIT compilation routinely flattens these calls.

## 8. Scalability Considerations

- **Clean Domain Isolation:** Adhering to LoD isolates modules. This ensures they can be modified, refactored, or even split into independent database tables without affecting external callers that rely only on top-level APIs.

## 9. How Major Companies Implement It

- **Google's Coding Guidelines:** Enforce strict encapsulation limits. In languages like Java and Go, style checkers fail builds if classes traverse nested structures beyond their immediate dependencies, encouraging developers to write clean API interfaces.
- **Mature Domain-Driven Design (DDD) Codebases:** Implement "Aggregate Roots". External classes are prohibited from accessing child entities inside an aggregate root directly; they must interact exclusively via the root entity's public API.

## 10. Decision Checklist

- Enforce **Law of Demeter** when: Interacting with complex domain entities, business service classes, or persistence model graphs.
- Skip LoD (Allow Chaining) when: Utilizing Fluent API builders, functional streams, collection transforms (map, filter), or mapping simple, flat Data Transfer Objects (DTOs).

## 11. AI Coding-Agent Implementation Guidelines

- Never write method chaining lines that navigate across different object types (`a.getB().getC()`).
- Always implement delegation methods on parent classes to retrieve nested values.
- Never write domain models where every internal field is exposed via public write accessors.
- Always apply the "Tell, Don't Ask" pattern — tell objects to execute tasks rather than querying their state to make decisions.
- Always return read-only or copy collections from classes to prevent direct internal collection mutation.

## 12. Reusable Checklist

- [ ] Method chains navigate only fluent builders or same-type streams; no "stranger" traversal
- [ ] Nested queries replaced with delegation methods (e.g., `order.getCustomerCity()`)
- [ ] Domain models implement "Tell, Don't Ask" (logic moved to where the data lives)
- [ ] No public getters expose mutable internal collection fields (read-only collections used)
- [ ] Tests require mocking only immediate dependencies, not deep object trees
- [ ] Classes keep internal component fields private
- [ ] Code contains no nested null checks for long properties chains
- [ ] Aggregate roots gate access to internal sub-entities strictly
