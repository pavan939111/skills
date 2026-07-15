# Specification Pattern Implementation

## 1. Definition & Core Concepts
The Specification Pattern encapsulates business rules that check domain entity criteria into separate, reusable classes that can be combined using logical operators (AND, OR, NOT).

## 2. Why It Exists / What Problem It Solves
It avoids repeating search criteria and validation rules across controllers, services, and queries, keeping rules in reusable, testable logic blocks.

## 3. What Breaks in Production Without It
- **Rule Drift:** A customer status logic check (e.g. is_active && orders_count > 5) is updated in the billing service but forgotten in the email pipeline.

## 4. Best Practices
- **Make Specifications Reusable:** Implement standard method interfaces (e.g., isSatisfiedBy(entity) -> boolean).
- **Support Composition:** Provide logical chaining methods to combine specifications dynamically.

## 5. Common Mistakes / Anti-Patterns
- **Using specifications for simple queries:** Over-architecting simple SQL matches with nested specification classes.

## 6. Security Considerations
- **Validation Consistency:** Use the same specification classes to check validation rules during writes and filter criteria during reads.

## 7. Performance Considerations
- **SQL Translation:** Convert specification configurations to SQL query parameters where possible to execute checks database-side.

## 8. Scalability Considerations
- **Centralized Rules Libraries:** Shared specifications guarantee identical policy checks across services.

## 9. How Major Companies Implement It
- **Enterprise Software Teams:** Leverage specifications to validate complex eligibility rules (e.g. credit scores, cargo restrictions) consistently.

## 10. Decision Checklist (Specification Application)
- Use **Specification** when:
  - Business rules are complex, reused across validation and querying paths, and require logical compositions (AND/OR/NOT).
- Use **Simple In-Code Checks** when:
  - Calculations are unique to a single endpoint or class.

## 11. AI Coding-Agent Guidelines
- Write specification classes that implement validation checks, and inherit from composite bases supporting logical chaining.

## 12. Reusable Checklist
- [ ] Business criteria encapsulated in separate specification classes
- [ ] Specifications implement a standard validation method (e.g. isSatisfiedBy)
- [ ] Logical chaining operators (AND, OR, NOT) supported
- [ ] The same specification files validate inputs and filter database queries
- [ ] Unit tests check specification logic against mock entity data
- [ ] Specifications are stateless and decoupled from database clients
