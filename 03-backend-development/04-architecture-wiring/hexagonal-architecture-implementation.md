# Hexagonal Architecture Implementation

## 1. Definition & Core Concepts
Hexagonal Architecture (Ports and Adapters) is an architectural pattern that divides an application into an inside (domain core containing business logic) and an outside (databases, UI, APIs, messaging systems). The inside defines "Ports" (interfaces), and the outside connects via "Adapters" that implement or call those ports.

## 2. Why It Exists / What Problem It Solves
It decouples application logic from external communication technologies. This allows developers to swap a REST API for a gRPC endpoint, or PostgreSQL for DynamoDB, by simply writing a new adapter while leaving the core logic untouched.

## 3. What Breaks in Production Without It
- **Integration Rigidity:** Changing from SQL database queries to Elasticsearch index lookups requires rewrite campaigns across business classes.
- **Broken Test Mocks:** Mocking third-party API clients requires complex mock frameworks because API logic is coupled with domain models.

## 4. Best Practices
- **Explicit Ingress Ports:** Define Use Case interfaces (Driving Ports) that controllers invoke.
- **Explicit Egress Ports:** Define Database or Notification interfaces (Driven Ports) that core logic calls.
- **Keep Adapters Clean:** Adapters should only handle transport translation (e.g. converting HTTP bodies to DTOs or SQL rows to Entities).

## 5. Common Mistakes / Anti-Patterns
- **Adapter bypass:** Outer layers calling inner databases directly without going through Port interfaces.
- **Ports exposing infrastructure types:** Declaring database-specific database exceptions in driven port signatures.

## 6. Security Considerations
- **Adapter Validation:** Validate user credentials and route authorization tokens in driving adapters before invoking core use cases.

## 7. Performance Considerations
- **Serialization latency:** Ensure conversion mappers are optimized to parse adapter inputs to core entity properties quickly.

## 8. Scalability Considerations
- **Flexible Endpoint Deployments:** Deploy multiple driving adapters (e.g., CLI runner and HTTP server) referencing the same core domain library.

## 9. How Major Companies Implement It
- **Uber:** Leverages Hexagonal architecture pattern structures across Go microservices to maintain testability and support diverse database adapters.

## 10. Decision Checklist (Hexagonal Application)
- Use **Hexagonal Architecture** when:
  - Building applications with multiple external integrations (e.g. queue consumers, REST APIs, database systems) that require easy isolation.
- Use **Layered CRUD Layout** when:
  - Building simple single-database CRUD APIs with minimal external integrations.

## 11. AI Coding-Agent Guidelines
- Segregate classes into /domain (Ports and Entities) and /infrastructure (Adapters for web servers, database connections, and external APIs).

## 12. Reusable Checklist
- [ ] Domain logic isolated from input adapters (HTTP/CLI/WebSockets)
- [ ] Database drivers isolated in output adapters (SQL/ORM/DynamoDB)
- [ ] Ingress/Driving Ports define application use case interfaces
- [ ] Egress/Driven Ports define database and client gateway interfaces
- [ ] Adapters handle transport-specific serialization and error translations
- [ ] Core business code runs unit tests with mocked adapters
