# Backend Framework Selection

## 1. Definition & Core Concepts
Backend Framework Selection is the evaluation and picking of specific web frameworks (e.g. FastAPI, NestJS, Spring Boot, ASP.NET Core) to implement the runtime strategy determined during system design.

## 2. Why It Exists / What Problem It Solves
A framework provides the structure, routing, HTTP request/response handling, middleware parsing, dependency injection, and utility libraries for the application. Choosing the right framework ensures compatibility with developers, ecosystem libraries, performance targets, and cloud environments.

## 3. What Breaks in Production Without It
- **Performance bottlenecks:** Using heavy, blocking frameworks for high-concurrency real-time features, leading to high CPU usage.
- **Maintenance deficits:** Selecting a niche, undocumented framework, making it difficult to hire developers or resolve library bugs.
- **Ecosystem incompatibility:** Framework cannot integrate easily with standard enterprise monitoring or database connection pools.

## 4. Best Practices
- **Align with team expertise:** Prioritize frameworks that align with current engineering skills unless performance requirements dictate otherwise.
- **Match performance profile:** Use fast, asynchronous runtimes (FastAPI, NestJS, Go/Gin) for low-latency APIs, and robust, typed frameworks (Spring Boot, ASP.NET Core) for large corporate transactions.
- **Audit community maturity:** Verify active library updates, repository star counts, and package download metrics before committing.

## 5. Common Mistakes / Anti-Patterns
- **Selecting by hype:** Using a new, unproven framework because it is trendy, risking security vulnerabilities and missing documentation.
- **Over-engineering:** Choosing a massive framework (like Spring Boot) for a simple, single-purpose lambda function.

## 6. Security Considerations
- **Built-in Protections:** Select frameworks with active community auditing and built-in CSRF, CORS, and SQL injection protections (e.g. Django, ASP.NET Core).

## 7. Performance Considerations
- **Asynchronous Execution:** Configure non-blocking HTTP servers (using ASGI/UVicorn for python, Node event loops for NestJS, or Go routines) to maximize query capacities.

## 8. Scalability Considerations
- **Stateless Architectures:** Ensure the framework runtime remains stateless to allow horizontal container scaling (replicas).

## 9. How Major Companies Implement It
- **Uber:** Relies on Go/Micro and Node.js for high-throughput, low-latency microservices, ensuring fast, standardized API response metrics.

## 10. Decision Checklist (Framework Selection)
- Use **Node/NestJS or Python/FastAPI** when:
  - Designing low-latency web microservices, real-time gateways, or team integrations with rapid prototyping needs.
- Use **Spring Boot or ASP.NET Core** when:
  - Building large, complex enterprise software with strict database transaction controls and typed safety requirements.

## 11. AI Coding-Agent Guidelines
- Review structural conventions and dependency injection patterns of the chosen framework before drafting API controllers or middleware routers.

## 12. Reusable Checklist
- [ ] Framework performance profile matches product latency requirements
- [ ] Active community and robust documentation verified
- [ ] Framework supports dependency injection and structured middleware
- [ ] Built-in security controls (CORS, CSRF, XSS) checked
- [ ] Runtime containerization support validated (stateless running)
- [ ] Library compatibility checked for vector search and DB pools
