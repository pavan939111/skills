# Adapter Pattern Implementation

## 1. Definition & Core Concepts
The Adapter Pattern translates the interface of a class into another interface that clients expect, allowing incompatible classes to work together.

## 2. Why It Exists / What Problem It Solves
Third-party APIs or legacy systems have unique interfaces. Adapters wrap these libraries, exposing a standard interface to the application.

## 3. What Breaks in Production Without It
- **API Lock-in:** The application is tightly coupled to a third-party SDK. If the SDK updates or changes, you must rewrite code across the application.

## 4. Best Practices
- **Define clean target interfaces:** Create target interfaces based on application needs, not third-party structures.

## 5. Common Mistakes / Anti-Patterns
- **Exposing third-party types:** Letting external SDK exceptions or models leak through the adapter.

## 6. Security Considerations
- **Input Sanitization:** Sanitize inputs before passing them to external SDKs.

## 7. Performance Considerations
- **Mapping costs:** Convert third-party models to application models efficiently.

## 8. Scalability Considerations
- **SDK Swapping:** Swap external service providers by writing a new adapter class.

## 9. How Major Companies Implement It
- **Uber:** Leverages adapters to integrate with local payment and SMS providers in different countries.

## 10. Decision Checklist (Adapter Selection)
- Use **Adapter** when:
  - Integrating with external SDKs or third-party APIs that require interface translation.

## 11. AI Coding-Agent Guidelines
- Write adapter classes that wrap third-party clients, mapping inputs and outputs to application structures.

## 12. Reusable Checklist
- [ ] Adapter wraps external SDK or third-party client
- [ ] Class implements target application interface
- [ ] Third-party model structures translated to application formats
- [ ] External exceptions caught and mapped to domain exceptions
- [ ] Application remains decoupled from external dependency details
- [ ] Tests verify the adapter using mock third-party clients
