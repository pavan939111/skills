# Clean Architecture Layout

## 1. Definition & Core Concepts
Clean Architecture Layout (similar to Hexagonal, Onion, or Ports and Adapters) is a codebase layout designed to isolate core business rules (Entities and Use Cases) from external infrastructure details (databases, web servers, UI clients, and third-party frameworks).

## 2. Why It Exists / What Problem It Solves
Frameworks and databases change (e.g. migrating from Express to NestJS, or PostgreSQL to MongoDB). Clean architecture structures code so that business rules are placed in an isolated, dependency-free core circle, while databases and frameworks are placed in outer adapter layers, making migrations easy.

## 3. What Breaks in Production Without It
- **Framework Lock-in:** The company is stuck using an outdated web framework because business logic is coupled with framework-specific APIs.
- **Test-Suite Sluggishness:** Unit tests require mocking entire database connections because queries are written inside logic functions.

## 4. Best Practices
- **Define Dependency Rule:** Dependencies must flow inward only. The core domain layer must have zero dependencies on outer adapter layers.
- **Use Ports (Interfaces):** Define database query operations as interfaces (Ports) inside the domain core.
- **Implement Adapters:** Write database client implementations (Adapters) in the outer layer that satisfy the ports' interfaces.

## 5. Common Mistakes / Anti-Patterns
- **Importing ORMs in the Domain core:** Writing database annotations (like TypeORM or SQLAlchemy models) directly inside core business entity classes.
- **Exposing core entities directly:** Returning internal entities directly to API responses, leaking domain schemas. Use DTOs.

## 6. Security Considerations
- **Infrastructure Isolation:** Protect core business logic from external injection vulnerabilities by validating data at outer adapter boundaries.

## 7. Performance Considerations
- **Data mapping overhead:** Converting database models to domain entities and then to API DTOs adds minor processing time. Keep translation mapping fast.

## 8. Scalability Considerations
- **Independent Infrastructure Upgrades:** Upgrade database clients, web servers, or external services without touching or risks to core business rules.

## 9. How Major Companies Implement It
- **Uber / Netflix:** Apply ports-and-adapters layouts across critical domain services to ensure business logic remains testable without database runs.

## 10. Decision Checklist (Clean Layout Application)
- Use **Clean Architecture Layout** when:
  - Building complex, long-term enterprise applications where business logic is core and databases/frameworks may change.
- Use **Layered CRUD Layout** when:
  - Building quick data-entry forms, micro-services, or single-purpose API endpoints.

## 11. AI Coding-Agent Guidelines
- Write domain entities and use cases with zero imports to external framework packages or database clients.

## 12. Reusable Checklist
- [ ] Core domain entities contain zero infrastructure or ORM dependencies
- [ ] Database queries represented as Port interfaces inside core layers
- [ ] Outer adapter classes implement Port interfaces using database clients
- [ ] Dependencies flow inward only (Entities <- Use Cases <- Adapters <- UI)
- [ ] Data Transfer Objects (DTOs) map input/output values across borders
- [ ] Unit tests run logic checks without database or network mock runs
