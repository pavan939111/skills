# Domain Services

## 1. Definition & Core Concepts
A Domain Service is a service pattern within Domain-Driven Design (DDD) that implements business logic that conceptually belongs to the domain but does not naturally fit inside a single Domain Entity (e.g. currency conversion, transferring money between accounts).

## 2. Why It Exists / What Problem It Solves
Domain Entities should encapsulate their own state and rules. However, when an operation involves multiple entities or depends on external lookups, placing that logic inside one entity violates SRP. Domain services provide a home for these multi-entity business rules.

## 3. What Breaks in Production Without It
- **Anemic Domain Models:** Entities become simple database containers, and all business rules bleed into outer application services, reducing cohesion.
- **State Pollution:** Entities query other entities' databases internally, causing coupling.

## 4. Best Practices
- **Keep Domain Services Stateless:** Do not store dynamic transaction states in domain service properties.
- **Use Domain Vocabulary:** Name domain service classes and methods using terms from the business domain (ubiquitous language).
- **Isolate from Infrastructure:** Ensure domain services contain only domain logic and have zero dependencies on web servers, frameworks, or database drivers.

## 5. Common Mistakes / Anti-Patterns
- **Confusing Domain and Application Services:** Placing application-specific workflows (like sending emails or converting JSON) inside domain services.
- **Bypassing entities:** Letting domain services modify entity properties directly instead of calling entity methods, violating encapsulation.

## 6. Security Considerations
- **Core Rule Enforcement:** Execute security and validation rules at the domain service level to ensure constraints are met regardless of the database implementation.

## 7. Performance Considerations
- **Memory Footprint:** Keep domain services focused on computational rules, avoiding heavy infrastructure object creation.

## 8. Scalability Considerations
- **Independent Testing:** Since domain services have zero infrastructure dependencies, tests run in milliseconds without databases.

## 9. How Major Companies Implement It
- **DDD Adopters:** Structure finance and booking systems with domain services that coordinate complex multi-account transactions, ensuring audit compliance.

## 10. Decision Checklist (Domain Service Selection)
- Use **Domain Service** when:
  - An operation requires coordinating multiple domain entities, depends on domain lookups, and does not logically belong inside one entity.
- Use **Entity Method** when:
  - The validation or calculation depends entirely on the state of a single entity.

## 11. AI Coding-Agent Guidelines
- Write domain services that process entity instances as parameters, executing business math and validations without importing database client packages.

## 12. Reusable Checklist
- [ ] Domain service implements logic that does not fit inside one entity
- [ ] Class is stateless and contains only domain logic
- [ ] No imports to web frameworks, databases, or infrastructure libraries
- [ ] Ubiquitous language domain terms used for class and method names
- [ ] Entities updated by calling entity methods (encapsulation respected)
- [ ] Unit tests check domain calculations using purely mock entities
