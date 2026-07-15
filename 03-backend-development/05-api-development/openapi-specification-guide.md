# OpenAPI Specification

## 1. Definition & Core Concepts
The OpenAPI Specification (formerly Swagger) is a machine-readable API description format for REST APIs. It defines endpoints, request parameters, response schemas, authentication methods, and contact details in YAML or JSON files.

## 2. Why It Exists / What Problem It Solves
It acts as the single source of truth for the API contract. Developers, QA engineers, and client developers can reference the OpenAPI document to see exactly how to call routes, what payloads are expected, and what errors can be returned.

## 3. What Breaks in Production Without It
- **Out-of-Sync Documentation:** Manual API documents (like Wiki pages) become outdated immediately when code is updated, leading to client integration bugs.
- **Unverified API Changes:** Merging API updates that introduce breaking contract changes without team visibility.

## 4. Best Practices
- **Generate from Code:** Use library annotations (e.g. Swagger decorators, FastAPI auto-docs) to generate OpenAPI specs directly from code, keeping docs in sync.
- **Serve Interactive Docs:** Expose Swagger UI or Redoc interfaces (e.g. at /docs or /swagger) in staging environments for quick developer testing.
- **Lint the Spec:** Use linting tools (like Spectral) to verify that OpenAPI files adhere to design standards (naming casing, required tags).

## 5. Common Mistakes / Anti-Patterns
- **Writing OpenAPI specs manually:** Attempting to update a massive JSON/YAML specification file by hand, resulting in syntax errors and code mismatch.
- **Exposing dev docs in production:** Serving interactive Swagger consoles publicly on production networks.

## 6. Security Considerations
- **Restrict Access to Docs:** Enforce authentication or disable documentation endpoints entirely in production to avoid exposing route structures to attackers.

## 7. Performance Considerations
- **Build-Time Generation:** Generate the OpenAPI JSON spec during compilation or container build steps to avoid runtime generation overhead.

## 8. Scalability Considerations
- **Automated Client SDK Generation:** Use OpenAPI files to auto-generate strongly-typed client SDKs (in TypeScript, Go, Python) for integration teams.

## 9. How Major Companies Implement It
- **Stripe / GitHub:** Maintain comprehensive, machine-readable API specifications to generate developer portals, client SDK libraries, and testing suites.

## 10. Decision Checklist (Documentation Setup)
- Use **Auto-generated OpenAPI (from code annotations)** when:
  - Building fast-evolving REST APIs where documentation must stay synchronized with code updates automatically.
- Use **Design-First Spec Files (YAML)** when:
  - Multiple teams coordinate on API design before writing any code (schema-first development).

## 11. AI Coding-Agent Guidelines
- Write API controllers with clear method annotations, parameter descriptions, and return type definitions to enable clean OpenAPI document compiles.

## 12. Reusable Checklist
- [ ] OpenAPI spec generation automated from code annotations
- [ ] Interactive docs console (Swagger UI/Redoc) active in staging
- [ ] Interactive docs disabled or restricted in production settings
- [ ] Every API route has descriptions, tags, parameters, and return types
- [ ] All success and error schemas are explicitly modeled in the spec
- [ ] API contract changes verified during CI/CD pipeline builds
