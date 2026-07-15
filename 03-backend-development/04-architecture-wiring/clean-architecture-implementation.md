# Clean Architecture Implementation

## 1. Definition & Core Concepts
Clean Architecture is an implementation design that places core domain entities and use cases in an isolated, dependency-free core circle, routing database, API, UI, and framework integrations through outer adapter boundaries.

## 2. Why It Exists / What Problem It Solves
It decouples core business logic from framework tools and external drivers. This ensures that the code's core remains testable in isolation and is not locked into specific databases or network protocols.

## 3. What Breaks in Production Without It
- **Database Lock-in:** The company is stuck using an outdated DB engine because SQL schema dependencies are coupled with core business logic.
- **Slow and Fragile Test Suites:** Unit tests require initializing database connections because logic is not decoupled.

## 4. Best Practices
- **Inward Dependency Rule:** Dependencies must point inward toward the core domain. The domain core imports nothing from outer layers.
- **Define Ports:** Declare repository and gateway interfaces inside the core layer.
- **Implement Adapters:** Place database implementations in outer layers that satisfy core ports.

## 5. Common Mistakes / Anti-Patterns
- **Using ORM decorators in entities:** Placing SQL annotations (TypeORM, Hibernate) inside domain entity files, violating OCP.
- **Domain code calling frameworks:** Core files importing web router decorators.

## 6. Security Considerations
- **Core State Protection:** Ensure that incoming data is fully validated against use case input models before execution.

## 7. Performance Considerations
- **Mapper Processing Costs:** Clean architecture requires mapping models between database, domain, and API levels. Write fast, compiler-friendly mappers.

## 8. Scalability Considerations
- **Independent Infrastructure Swapping:** Swap microservice drivers or DB layers without modifying or re-testing core business logic code.

## 9. How Major Companies Implement It
- **Netflix:** Utilizes Onion/Clean architecture conventions for microservices, keeping business rules testable without database runners.

## 10. Decision Checklist (Clean Design Gate)
- Use **Clean Architecture** when:
  - Designing long-term enterprise applications where domain logic is complex and third-party tools are likely to evolve.
- Use **Layered CRUD Layout** when:
  - Building simple microservices with basic, predictable database mappings.

## 11. AI Coding-Agent Guidelines
- Write domain entities using native language primitives only, avoiding imports of database frameworks or third-party web helpers.

## 12. Reusable Checklist
- [ ] Domain entities contain no ORM database annotations
- [ ] Database queries declared as port interfaces inside core domain layers
- [ ] Infrastructure clients act as adapters in outer layers
- [ ] Dependencies flow exclusively inward (Entities <- Use Cases <- Adapters)
- [ ] Translation mappers map inputs and outputs across boundaries
- [ ] Core use-case tests run without database connection mocks
