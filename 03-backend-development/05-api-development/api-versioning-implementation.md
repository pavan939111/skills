# API Versioning

## 1. Definition & Core Concepts
API Versioning is the practice of managing changes to API schemas over time, allowing developers to release updates, additions, and modifications while maintaining backward compatibility for legacy clients.

## 2. Why It Exists / What Problem It Solves
API contracts change as products evolve. If you modify a JSON key or drop a path directly in production, you break existing mobile apps, frontend clients, and third-party integrations. Versioning routes client requests to the appropriate schema handler.

## 3. What Breaks in Production Without It
- **Client App Crashes:** Mobile apps crash because the API payload structure was modified without version isolation.
- **Deployment Lock-ins:** Developers cannot release database modifications because they would break active API clients.

## 4. Best Practices
- **Use URL Versioning:** Structure versions directly inside paths (e.g. /api/v1/users, /api/v2/users) as it is highly visible and caching-friendly.
- **Deprecate Version Lifecycles:** Establish and communicate clear deprecation timelines, returning warnings in HTTP headers (e.g. Sunset).
- **Implement Version Translators:** Write translation mappers at the gateway or controller level to convert v2 payloads to v1 structures where possible.

## 5. Common Mistakes / Anti-Patterns
- **Changing schemas ad-hoc:** Modifying fields inside active endpoints without incrementing version paths.
- **Maintaining too many versions:** Keeping 10+ legacy API versions active indefinitely, bloating the codebase. Limit to the last 2-3 versions.

## 6. Security Considerations
- **Consistent Boundary Checks:** Ensure that security validations, authentication guards, and RLS checks are applied identically across all active API versions.

## 7. Performance Considerations
- **Routing Overhead:** Use fast routing rules at the API Gateway level to send versioned requests directly to respective service instances.

## 8. Scalability Considerations
- **Independent Version Microservices:** Host major API version releases (e.g. v1 and v2) as separate services to scale them independently.

## 9. How Major Companies Implement It
- **Stripe:** Implements date-based versioning (e.g., 2024-06-15), translating requests dynamically to the developer's registered version using middleware mappers.

## 10. Decision Checklist (Versioning Styles)
- Use **URL Versioning (/api/v1/)** when:
  - Building standard REST APIs requiring clear version visibility and simple caching configurations.
- Use **Header Versioning (Accept: version=2)** when:
  - You want to keep URLs clean and version changes are highly fine-grained.

## 11. AI Coding-Agent Guidelines
- Ensure that new API endpoints are nested inside designated version directories (e.g. src/api/v1/) to prevent conflict risks.

## 12. Reusable Checklist
- [ ] Versioning strategy selected (URL-based preferred)
- [ ] API routes nested inside version namespaces (e.g. /api/v1)
- [ ] Version deprecation policies defined with Sunset header warnings
- [ ] Changes to public JSON schemas require version increments
- [ ] Security rules applied consistently across all version routes
- [ ] Integration test suite validates all active API versions
