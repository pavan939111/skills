# Application Services

## 1. Definition & Core Concepts
An Application Service is an orchestrator pattern in DDD that sits outside the domain core. It acts as a gateway that parses requests, initiates transactions, loads domain entities from databases, coordinates domain service runs, and executes infrastructure alerts (e.g. sending emails, logging events).

## 2. Why It Exists / What Problem It Solves
Domain models should remain pure and unaware of databases or mailing APIs. Application services act as the glue code, fetching entities from repositories, directing them to execute business logic, saving states, and triggering notifications.

## 3. What Breaks in Production Without It
- **Infrastructure Leakage:** Domain models import mailing APIs or database packages, making them impossible to run or test in isolation.
- **Transaction Splitting:** Database updates and notification alerts are decoupled, leading to emails being sent for transactions that failed database commits.

## 4. Best Practices
- **Enforce Transaction Boundaries:** Start and commit database transactions inside the application service method scope.
- **Do Not Include Domain Rules:** Application services should coordinate steps, not calculate business math. Push calculations into domain entities.
- **Inject Infrastructure Gateways:** Depend on interface abstractions (e.g. IMailer) to send notifications, decoupling concrete APIs.

## 5. Common Mistakes / Anti-Patterns
- **Writing business logic in application services:** Calculating interest rates or checking age rules in the orchestrator instead of the domain model.
- **Exposing web-specific models:** Returning HTTP response objects from application services.

## 6. Security Considerations
- **Credential Propagation:** Inject security user contexts into application services to verify permission checks before loading database records.

## 7. Performance Considerations
- **Eager Loading:** Configure repository fetches inside application services to eager-load relations required for the workflow, avoiding N+1 database queries.

## 8. Scalability Considerations
- **Stateless Orchestration:** Keep orchestrators stateless to support horizontal container replicas.

## 9. How Major Companies Implement It
- **Fintech platforms:** Structure payment pipelines using application services that coordinate entity loading, balance updates, database commits, and webhook alerts.

## 10. Decision Checklist (Service Layer Roles)
- Use **Application Service** when:
  - You need to load entities, coordinate transactions, write database records, and call external notification APIs.
- Use **Domain Service** when:
  - You need to calculate domain math or check rules involving multiple entities, without infrastructure actions.

## 11. AI Coding-Agent Guidelines
- Write application services that orchestrate repository fetches, domain logic triggers, save updates, and invoke abstract notification gateways.

## 12. Reusable Checklist
- [ ] Application service handles orchestration, not business calculations
- [ ] Database transaction boundaries managed at the method level
- [ ] Entities loaded from repositories before domain logic execution
- [ ] Infrastructure clients called via abstraction interfaces (e.g. IMailer)
- [ ] Service returns DTOs or primitive values, hiding internal domain entities
- [ ] Unit tests mock repositories and gateways to verify orchestration steps
