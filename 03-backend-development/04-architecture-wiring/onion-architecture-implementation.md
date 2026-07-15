# Onion Architecture Implementation

## 1. Definition & Core Concepts
Onion Architecture is an architectural pattern that organizes codebases into concentric circles: Domain Model (center), Domain Services (middle), Application Services (outer middle), and Infrastructure/UI (outer ring). Dependencies flow exclusively toward the center.

## 2. Why It Exists / What Problem It Solves
Onion architecture centers the database around the domain model rather than centering the model around the database. By utilizing dependency inversion, it ensures that the domain layer is the most stable and independent part of the codebase.

## 3. What Breaks in Production Without It
- **Database coupling:** Changing tables or database engines breaks core business rules, resulting in bugs and long release delays.

## 4. Best Practices
- **Domain Model is Core:** Place central business entities and rules in the innermost circle.
- **Domain Services:** Place rules that span multiple entities in the next circle.
- **Infrastructure Outer Ring:** Place database drivers, mailers, and web servers in the outermost circle.

## 5. Common Mistakes / Anti-Patterns
- **Leaking outer logic:** Referencing framework packages or database providers inside domain service files.

## 6. Security Considerations
- **Ingress Filtering:** Verify and sanitize inputs at the outermost ring (API Controllers) before passing parameters to domain circles.

## 7. Performance Considerations
- **Optimize Object Mapping:** Minimize performance overheads when mapping database models to domain entities and API responses.

## 8. Scalability Considerations
- **Decoupled Upgrades:** Upgrade database versions, logging configurations, or API specifications independently without affecting core business models.

## 9. How Major Companies Implement It
- **Enterprise Software Teams:** Utilize Onion Architecture in large codebases (often in C# or Java) to maintain clean test suites and support continuous database migrations.

## 10. Decision Checklist (Onion Layout)
- Use **Onion Architecture** when:
  - Developing domain-driven enterprise software that prioritizes business logic stability and requires long-term maintenance.
- Use **Standard Layered Layout** when:
  - Designing simple database wrappers, scripts, or prototype services.

## 11. AI Coding-Agent Guidelines
- Ensure that the domain model folder contains only pure logic files with zero imports to outer infrastructure libraries.

## 12. Reusable Checklist
- [ ] Core domain model contains zero external library imports
- [ ] Dependencies point exclusively toward the central domain model
- [ ] Domain services implement logic checks spanning multiple entities
- [ ] Database and UI drivers reside in the outermost infrastructure ring
- [ ] Interface abstractions decouple database queries from application services
- [ ] Tests run core domain services without loading database configurations
