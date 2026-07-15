# Schema Validation

## 1. Definition & Core Concepts
Schema Validation is the verification of JSON/YAML data structures against defined rules, specifying types, boundaries, and required fields.

## 2. Why It Exists / What Problem It Solves
It ensures that application data matches system expectations, preventing parsing errors and logical inconsistencies.

## 3. What Breaks in Production Without It
- **Runtime Crashes:** Undefined properties cause system exceptions when accessed.

## 4. Best Practices
- **Use Standard Schemas:** Enforce rules using JSON Schema or compiler-supported validators (Zod/Joi).
- **Compile Schemas:** Pre-compile schemas during compilation or boot sequences to optimize performance.

## 5. Common Mistakes / Anti-Patterns
- **Manual Schema Checks:** Writing custom if-else logic to check for every property.

## 6. Security Considerations
- **Payload Limits:** Restrict max lengths on string schemas to prevent resource exhaustion.

## 7. Performance Considerations
- **Cached Schema Compilation:** Compile validation rules once on boot.

## 8. Scalability Considerations
- **Shared Schemas:** Distribute schema definitions across client and server packages.

## 9. How Major Companies Implement It
- **GitHub:** Uses JSON Schema to validate API payloads and webhook payloads across services.

## 10. Decision Checklist (Validation Tools)
- Use **Zod** when:
  - Building TypeScript backends with type safety.

## 11. AI Coding-Agent Guidelines
- Use schema validators to parse and cast inputs during controller entry.

## 12. Reusable Checklist
- [ ] Validation schemas define all required properties
- [ ] Type casting and default values configured in schemas
- [ ] String schemas enforce length limits and pattern checks
- [ ] Validation errors return structured details to clients
- [ ] Schemas compiled on application boot to optimize runtime
- [ ] Integration tests verify schema validation rules
