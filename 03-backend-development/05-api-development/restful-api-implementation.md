# REST APIs

## 1. Definition & Core Concepts
Representational State Transfer (REST) is an architectural style for designing networked applications. It uses HTTP methods (GET, POST, PUT, DELETE) and standard status codes to perform CRUD operations on resource URLs.

## 2. Why It Exists / What Problem It Solves
REST provides a standardized, stateless, and uniform interface for web communication, making it easy for frontend clients, mobile apps, and third-party integrations to interact with backend services.

## 3. What Breaks in Production Without It
- **API Fragmentation:** Every developer designs custom routing structures (e.g., using POST /updateUser instead of PUT /users/{id}), creating unmaintainable endpoints.
- **Incorrect Client Caching:** APIs return custom success status codes inside HTTP 200 responses, causing reverse proxy servers to cache error outputs.

## 4. Best Practices
- **Use Nouns for Resources:** Define paths using plural nouns (e.g. /users, /orders) rather than verbs.
- **Leverage Standard HTTP Status Codes:** Return HTTP 200/201 for successes, 400 for bad inputs, 401/403 for authentication/authorization failures, and 404 for missing entities.
- **Maintain Stateless Routing:** Do not store client sessions in server memory; authenticate requests using JWT tokens in headers.

## 5. Common Mistakes / Anti-Patterns
- **Using HTTP GET for state changes:** Routing operations that edit data (like deletions) through GET endpoints, risking accidental modifications by web crawlers.
- **Returning verbose stack traces:** Outputting raw database connection errors in HTTP 500 responses.

## 6. Security Considerations
- **Boundary Audits:** Validate that all resource routes verify ownership (e.g., a user can query only their own /orders/{id}).

## 7. Performance Considerations
- **Payload Compression:** Configure gzip or brotli compression in reverse proxies to reduce network payload sizes.

## 8. Scalability Considerations
- **Stateless Horizontal Scaling:** Keep REST routes stateless to allow load balancers to route requests to any warm server container.

## 9. How Major Companies Implement It
- **Stripe:** Exposes a clean, standard REST API with predictable resource paths, descriptive errors, and robust JSON payload formatting.

## 10. Decision Checklist (API Protocol Selection)
- Use **REST APIs** when:
  - Building general public APIs, web client integrations, or simple database CRUD services.
- Use **gRPC** when:
  - Building high-throughput, low-latency communication networks between internal microservices.

## 11. AI Coding-Agent Guidelines
- Write controllers that map incoming requests to DTOs, execute business services, and format outputs using consistent JSON schemas.

## 12. Reusable Checklist
- [ ] Resource paths named using plural nouns (e.g. /orders)
- [ ] Standard HTTP methods (GET/POST/PUT/DELETE) define actions
- [ ] Correct HTTP status codes mapped to response states
- [ ] Endpoint structures are stateless and authenticate via headers
- [ ] Input schemas validated before business service triggers
- [ ] Public API endpoints documented in OpenAPI specifications
