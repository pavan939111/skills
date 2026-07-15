# Repository Pattern

## 1. Definition & Core Concepts
The Repository Pattern is a data access abstraction that sits between the domain model and the database client, managing entity collections and shielding application code from database technology details.

## 2. Why It Exists / What Problem It Solves
It decouples database query mechanics (SQL string formats, ORM sessions) from business service files. If you change database drivers (e.g. Postgres to MongoDB) or structure query caches, you update the repository adapter without modifying service layers.

## 3. What Breaks in Production Without It
- **SQL Bleeding:** SQL connection objects or query strings are written directly inside controllers, making testing or upgrading databases impossible.
- **Untestable Domain Logic:** Unit testing a business service requires active database server connections, slowing down pipelines.

## 4. Best Practices
- **Define Interface Contracts:** Declare repository methods as interfaces (e.g. UserRepository) inside the domain core.
- **Implement Concrete Adapters:** Write framework-specific repository files (e.g., PostgresUserRepository) in outer adapter layers.
- **Enforce Single Entity Scope:** Maintain one repository per aggregate root domain entity.

## 5. Common Mistakes / Anti-Patterns
- **Exposing ORM context directly:** Returning database query models or transaction context files from repositories to service layers.
- **Writing logic in repositories:** Placing business validation rules inside data queries.

## 6. Security Considerations
- **SQL Parameter Binding:** Ensure repositories use parameterized query values exclusively to block SQL injection attacks.

## 7. Performance Considerations
- **Eager vs. Lazy Loading:** Configure repository query functions to load related tables based on use case needs, preventing N+1 queries.

## 8. Scalability Considerations
- **Replica Routing:** Configure repositories to direct read queries to read-replicas and write queries to primary databases.

## 9. How Major Companies Implement It
- **Enterprise Software Teams:** Standardize on repositories to decouple applications from legacy database clusters, enabling progressive database migrations.

## 10. Decision Checklist (Repository Application)
- Use **Repository Pattern** when:
  - Building applications with complex domain logic, multiple environments, or where database drivers may change.
- Use **Direct ORM Queries** when:
  - Building simple, low-complexity CRUD services with direct data-access requirements.

## 11. AI Coding-Agent Guidelines
- Write repository classes that satisfy domain port interfaces, containing all database client driver details.

## 12. Reusable Checklist
- [ ] Database client imports isolated exclusively inside repository classes
- [ ] Repository classes satisfy interface definitions in domain core
- [ ] Direct SQL queries use parameter binding to block injection
- [ ] Transactions managed outside repositories (application services)
- [ ] Eager/Lazy loading configurations prevent N+1 query loops
- [ ] Unit tests mock repository interfaces to test services in isolation
