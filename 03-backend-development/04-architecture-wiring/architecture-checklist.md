# Architecture Checklist

## 1. Definition & Core Concepts
The Architecture Checklist is an audit tool used to verify that a backend service has correctly implemented its target architectural layout (Layered, Clean, Hexagonal, Modular, or Event-Driven) and respects dependency rules before release.

## 2. Why It Exists / What Problem It Solves
Architectural standards decay over time as developers add features quickly. The checklist enforces consistency, preventing code bleeding (like SQL in controllers) and ensuring that dependencies flow in the correct direction.

## 3. What Breaks in Production Without It
- **Architectural Bleeding:** Business rules become tightly coupled to database drivers or web frameworks, blocking database migrations or framework upgrades.
- **Brittle Integrations:** Code modifications create unintended regressions because modules are tightly coupled.

## 4. Best Practices
- **Define Dependency Rules:** Ensure import rules are strictly validated by build tools.
- **Run automated dependency cruisers:** Integrate tools in build pipelines to map and audit dependency graphs.
- **Decouple Database Schemas:** Ensure database tables are partitioned along module boundaries.

## 5. Common Mistakes / Anti-Patterns
- **Signing off without code review:** Marking the architecture checklist complete without inspecting import chains.
- **Permissive import scopes:** Allowing helper functions to import core entities, creating circular dependencies.

## 6. Security Considerations
- **Secure Boundaries:** Confirm that authentication and authorization checks are enforced at layer boundaries.

## 7. Performance Considerations
- **Pruned Code Compilation:** Verify that modular layouts allow independent compilation, reducing build times.

## 8. Scalability Considerations
- **Microservices Path:** Ensure that module boundaries are sufficiently decoupled to support future microservice transitions.

## 9. How Major Companies Implement It
- **Spotify:** Audits new services against Backstage templates to confirm that they respect modular and clean architecture guidelines.

## 10. Decision Checklist (Architectural Sign-off)
- Approve **Architectural Release** when:
  - Code satisfies structural guidelines, imports point in the correct direction, and interfaces decouple databases.
- Reject **Architectural Release** when:
  - Circular imports exist, SQL query strings bleed into controllers, or modules are tightly coupled.

## 11. AI Coding-Agent Guidelines
- Write automated checks that verify linter rules and import constraints, reporting violations during build steps.

## 12. Reusable Checklist
- [ ] Application layout conforms strictly to the target architecture design
- [ ] Dependencies point inward toward core layers (domain/entities)
- [ ] Database client imports isolated exclusively inside repository folders
- [ ] API controllers handle transport-specific serialization and DTOs only
- [ ] Circular module imports blocked by linter rules or build checkers
- [ ] Tests run core business logic without loading database servers
