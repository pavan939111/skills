# Request Validation

## 1. Definition & Core Concepts
Request Validation is the process of checking client-submitted payloads (headers, queries, parameters, bodies) against schema definitions before running business logic.

## 2. Why It Exists / What Problem It Solves
It blocks malformed or malicious payloads at the API boundary, preventing crashes and database corruption.

## 3. What Breaks in Production Without It
- **Database Failures:** Missing fields cause database constraint violations, throwing HTTP 500 errors.
- **Remote Code Executions:** Malformed strings exploit parsing libraries.

## 4. Best Practices
- **Use Declarative Validation:** Define schema validations (e.g. Zod, Class-Validator, Joi) next to input DTOs.
- **Fail Early:** Validate at the controller entry boundary, immediately returning HTTP 400 Bad Request on errors.
- **Strip Unknown Properties:** Remove parameters not explicitly defined in schemas to prevent mass assignment.

## 5. Common Mistakes / Anti-Patterns
- **Validating in business layers:** Letting invalid payloads reach service models before verifying type formats.
- **Implicit validations:** Assuming string inputs are safe for DB search statements.

## 6. Security Considerations
- **Boundary Audits:** Reject payloads exceeding size limits to prevent Denial of Service.

## 7. Performance Considerations
- **Fast Schema Parsers:** Use compiled validation engines to minimize CPU bottlenecks on hot routes.

## 8. Scalability Considerations
- **Reusable Schemas:** Share schema metadata across microservice gateways using client specifications.

## 9. How Major Companies Implement It
- **Stripe:** Automatically parses and rejects invalid parameters at API gateways before routing requests.

## 10. Decision Checklist (Validation Frameworks)
- Use **Zod / class-validator** when:
  - building typed applications requiring schema constraints and strict type casting.

## 11. AI Coding-Agent Guidelines
- Write DTO parameters with decorators matching required length, format, and type variables.

## 12. Reusable Checklist
- [ ] Schema validation runs at controller entry boundaries
- [ ] Unknown payload properties automatically stripped
- [ ] Input data cast to correct types (e.g. ports to integers)
- [ ] HTTP 400 returned with a details list on validation failures
- [ ] Size limitations enforced on incoming string parameters
- [ ] Regular expressions checked to block recursion bottlenecks
