# Custom Validation Rules

## 1. Definition & Core Concepts
Custom Validation Rules are domain-specific checks that cannot be validated by basic type checks (e.g. validating bank account formats or checking email domain restrictions).

## 2. Why It Exists / What Problem It Solves
It ensures that inputs comply with complex business rules before invoking services.

## 3. What Breaks in Production Without It
- **Invalid Data Accumulation:** Databases store invalid formats (like duplicate active subscriptions).

## 4. Best Practices
- **Isolate Validation Rules:** Write custom validation functions that are decoupled from controllers.
- **Keep Checks Stateless:** Avoid placing slow external network queries inside validation decorators.

## 5. Common Mistakes / Anti-Patterns
- **Writing DB queries in validations:** Querying databases inside validators, causing connection leaks.

## 6. Security Considerations
- **Replay Protection:** Verify values match secure signature formats where needed.

## 7. Performance Considerations
- **Fast Calculations:** Keep custom validation algorithms optimized to reduce CPU cycles.

## 8. Scalability Considerations
- **Shared Libraries:** Bundle custom rules in shared modules for cross-service use.

## 9. How Major Companies Implement It
- **Fintech Platforms:** Apply custom IBAN and routing code validations to prevent transaction failures.

## 10. Decision Checklist (Custom Rules)
- Use **Custom Rules** when:
  - Inputs must match specific formatting patterns or satisfy multi-field constraints.

## 11. AI Coding-Agent Guidelines
- Implement custom decorators or validator classes that return clear boolean checks and custom error messages.

## 12. Reusable Checklist
- [ ] Custom rules decoupled from HTTP controller files
- [ ] Error messages describe the exact validation failure
- [ ] External database checks avoided inside validator classes
- [ ] Input string formats verified using validated regex patterns
- [ ] Complex multi-field validations grouped in domain logic
- [ ] Unit tests validate both passing and failing custom scenarios
