# Strategy Pattern Implementation

## 1. Definition & Core Concepts
The Strategy Pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable, allowing clients to swap algorithms at runtime.

## 2. Why It Exists / What Problem It Solves
It avoids giant, nested conditional blocks (e.g. if (payment == 'stripe') else if (payment == 'paypal')), isolating algorithms in separate classes.

## 3. What Breaks in Production Without It
- **Fragile deployment paths:** Adding a new payment method requires editing and re-testing core checkout files.

## 4. Best Practices
- **Define a common interface:** Enforce a shared interface across all strategy classes.

## 5. Common Mistakes / Anti-Patterns
- **Strategies sharing state:** Storing client-specific transaction states in strategy properties.

## 6. Security Considerations
- **Credential Isolation:** Keep strategy-specific credentials restricted to their respective files.

## 7. Performance Considerations
- **In-Memory Strategy Maps:** Cache strategy instances in lookup maps for instant runtime access.

## 8. Scalability Considerations
- **Decoupled additions:** Add new strategies by simply writing a new class and registering it in the lookup map.

## 9. How Major Companies Implement It
- **Payment Gateways:** Standardize integrations using strategies to switch payment processors dynamically.

## 10. Decision Checklist (Strategy Application)
- Use **Strategy** when:
  - An operation can be executed using different algorithms that are selected dynamically at runtime.

## 11. AI Coding-Agent Guidelines
- Write strategy classes that implement a shared interface, registering them in a central context router.

## 12. Reusable Checklist
- [ ] Strategy algorithms encapsulated in separate classes
- [ ] Strategy classes implement a shared interface
- [ ] Strategies are stateless and reusable
- [ ] Strategy map handles dynamic lookup and routing
- [ ] Adding new strategies requires no changes to core service logic
- [ ] Unit tests validate strategy execution in isolation
