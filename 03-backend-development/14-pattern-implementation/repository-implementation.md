# Repository Pattern Implementation

## 1. Definition & Core Concepts
The Repository Pattern manages collection operations on domain entities, isolating services from database libraries.

## 2. Why It Exists / What Problem It Solves
It decouples database query syntax from business classes, making testing and database upgrades easy.

## 3. What Breaks in Production Without It
- **SQL in controllers:** Changes to database columns break controllers directly, disrupting client services.

## 4. Best Practices
- **Implement Interfaces:** Place interface contracts in the domain core, writing database-specific implementations in adapters.

## 5. Common Mistakes / Anti-Patterns
- **Exposing DB contexts:** Returning SQLAlchemy or Hibernate sessions to application services.

## 6. Security Considerations
- **Parameterized SQL:** Parameterize all inputs.

## 7. Performance Considerations
- **Relationship Joins:** Eager-load relations to prevent N+1 query loops.

## 8. Scalability Considerations
- **Replica Routing:** Direct reads to replicas, writes to primary databases.

## 9. How Major Companies Implement It
- **Standard Teams:** Standardize on repositories to manage multi-database access.

## 10. Decision Checklist (Patterns Selection)
- Use **Repository** when:
  - Designing domain-driven applications with mockable test requirements.

## 11. AI Coding-Agent Guidelines
- Write repository classes that encapsulate all query mechanics and schema mapping steps.

## 12. Reusable Checklist
- [ ] Repository interfaces mockable for unit testing
- [ ] SQL queries parameterized (no string concatenation)
- [ ] Relationship joins prevent N+1 query loops
- [ ] Service layers access repositories via interfaces only
- [ ] Entities map cleanly across boundaries
- [ ] Database client classes isolated in infrastructure folders
