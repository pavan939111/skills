# Separation of Concerns

## 1. Definition & Core Concepts

Separation of Concerns (SoC) is a design principle that divides a computer program into distinct sections, where each section addresses a separate concern (a set of information or a specific responsibility that affects the code).

Core pieces:
- **Modular Layers:** Organizing code into distinct functional layers (e.g., Presentation/Controller, Business Logic/Service, Data Access/Repository).
- **Encapsulation:** Hiding internal details of a module or class, exposing only a clean, public interface to other modules.
- **Cross-Cutting Concerns:** System-wide features (e.g., logging, security, error handling, transaction management) that affect multiple layers. These are decoupled from core domain logic using middlewares, interceptors, or Aspect-Oriented Programming (AOP).
- **Single Responsibility (SRP) Alignment:** While SRP focuses on a single actor/reason to change, SoC focuses on separating different logical categories of work (e.g. separating UI rendering from data validation).

## 2. Why It Exists

If concerns are mixed, codebases become difficult to maintain. A change to the database schema forces developers to edit HTML rendering logic; a UI style update risks breaking payment math. Separating concerns isolates changes, ensuring you can modify how data is retrieved or rendered without affecting how business calculations are processed.

## 3. What Breaks in Production Without It

- **Indebuggable SQL Errors in Routers:** Database query execution occurs directly inside HTTP controller route handlers. If a query slows down or throws an error, the controller crashes before logging or formatting a clean API response.
- **Leaked Connection Pools:** Database transactions are started in the controller and closed in the view template. If the view fails to render due to a syntax error, the transaction remains open, exhausting the database connection pool.
- **Untestable Business Logic:** Business rules are embedded directly within HTML views or web frameworks, making it impossible to write automated unit tests without spinning up a full browser simulator.
- **Security Bypass Inconsistencies:** Authentication checks are manually coded in some controller routes and missing in others, rather than being handled globally at a dedicated middleware boundary.

## 4. Best Practices

- **Strict Layered Directory Structures:** Organize your codebase into logical layers. A standard pattern is:
  - *Controller/Router:* Parses request parameters, calls services, formats HTTP response shapes.
  - *Service/Domain:* Executes core business calculations and rules. Lacks any knowledge of HTTP, requests, or SQL queries.
  - *Repository/DAO:* Handles data persistence (SQL queries, DB updates). Lacks business logic.
- **Isolate Cross-Cutting Concerns via Middleware:** Handle authentication, log tagging, request validation, and database transactions inside global interceptors/middlewares before requests reach business logic.
- **Hide Database ORMs from Domain Logic:** Avoid passing raw ORM model records (containing active database connections) directly to UI templates. Convert data to stateless Data Transfer Objects (DTOs) first.
- **Encapsulate Module States:** Keep class properties private. Expose only narrow public methods to prevent external modules from manipulating internal states directly.

## 5. Common Mistakes / Anti-Patterns

- **SQL in Controllers:** Writing raw SQL statements or executing complex ORM queries (`User.update().where()`) directly inside API route handlers.
- **HTML in Services:** Generating HTML strings or formatting UI templates inside business calculation services.
- **Validation in Views:** Relying on frontend HTML inputs to validate data format instead of executing validation checks in the backend business layer.
- **Direct Database Mutation by External Services:** Service A directly updating Service B's database tables instead of accessing Service B via its API or event handlers.

## 6. Security Considerations

- **Vulnerability Isolation:** Separating input validation (handled at the boundary middleware) from business processing and data query execution creates defense-in-depth, reducing the risk of injection attacks.
- **Least Privilege Access:** Different modules should have access only to the concerns they manage. For instance, the UI layer has zero access to encryption keys, which are isolated inside a secure cryptographic service.

## 7. Performance Considerations

- **Indirection Latency:** Dividing code into many layers adds stack depth and execution steps. While usually negligible, for ultra-low latency hot paths (e.g., gaming engines or packet routers), flatten layers to minimize memory allocation and indirection overhead.

## 8. Scalability Considerations

- **Path to Microservices:** A codebase with cleanly separated concerns is simple to refactor. If a monolithic application needs to be split, a service concern can be extracted into a standalone microservice easily because its dependencies are bounded.

## 9. How Major Companies Implement It

- **Stripe:** Automatically separates request parsing, client authentication, API versioning, business execution, and database ledger writes into distinct middleware pipelines. This ensures that their payment controllers only process clean, validated transactional data.
- **Google:** Enforces clean separation between presentation schemas and domain servers using Protocol Buffers and gRPC, preventing serialization logic from bleeding into business calculations.

## 10. Decision Checklist

- Enforce **Separation of Concerns** on: All production applications, APIs, microservices, and databases to ensure long-term maintainability.
- Skip complex layering ONLY when: Writing single-purpose scripts, migration files, local prototypes, or developer tools.

## 11. AI Coding-Agent Implementation Guidelines

- Always organize generated code folders into logical boundaries (e.g., controllers, services, repositories).
- Never write database query statements or active ORM update chains inside HTTP route handler modules.
- Always configure authentication, session verification, and log correlation inside middleware interceptors.
- Never write UI HTML strings or template layouts inside business calculation models.
- Always communicate between layers using simple, typed parameters or Data Transfer Objects (DTOs).
- Never allow a repository/data-access class to contain business rules or validation logic.

## 12. Reusable Checklist

- [ ] Codebase organized into distinct directory layers (Controllers, Services, Repositories)
- [ ] No SQL queries or ORM updates executed inside Controller/Router classes
- [ ] Business logic classes contain zero reference to HTTP requests, status codes, or web frameworks
- [ ] Cross-cutting concerns (auth, logging, transaction) handled globally in middleware
- [ ] Data passed between layers using simple DTOs or primitive parameters
- [ ] Data access classes contain no business rules or validation decisions
- [ ] UI rendering/HTML templates have zero database direct connections
- [ ] Class properties are encapsulated (private fields with public accessors)
