# Modular Monolith Implementation

## 1. Definition & Core Concepts
A Modular Monolith is a deployment architecture where an application is compiled and run as a single process (monolith), but the codebase is structured into strictly isolated, decoupled modules that communicate via clean APIs or event buses.

## 2. Why It Exists / What Problem It Solves
Microservices introduce high operational complexity (network lag, distributed transactions, deployment overhead). A modular monolith provides the code organization benefits of microservices (decoupling, clear team boundaries) with the operational simplicity of a single database and process.

## 3. What Breaks in Production Without It
- **Distributed Transaction Failures:** Teams adopt microservices prematurely and face network connection timeouts and database synchronization issues.
- **The Spaghetti Monolith:** Traditional monolith codebases decay into tightly coupled spaghetti code where a change in one file breaks unrelated features.

## 4. Best Practices
- **Strict Module Boundaries:** Restrict modules from importing other modules' internal database models or classes.
- **Expose Public APIs:** Require modules to interact only through declared public interface methods.
- **Use Memory Event Buses:** Publish and consume events locally (in-memory) to decouple modules without the overhead of network brokers (like RabbitMQ).

## 5. Common Mistakes / Anti-Patterns
- **Bypassing APIs:** Querying another module's database tables directly from SQL code.
- **Circular Module Dependencies:** Module A imports module B, which imports module A, creating compilation loops.

## 6. Security Considerations
- **Internal Authentication Propagation:** Validate user permissions and access rights at module boundaries to prevent lateral code privileges abuse.

## 7. Performance Considerations
- **In-Memory Speed:** Take advantage of fast, in-memory function calls between modules, avoiding the latency of microservice HTTP/gRPC network hops.

## 8. Scalability Considerations
- **Path to Microservices:** Keep modules strictly decoupled. If a module requires independent scaling, move its folder into a separate microservice.

## 9. How Major Companies Implement It
- **Shopify:** Successfully operates a modular monolith containing thousands of modules, utilizing custom tooling to enforce module import boundaries at build time.

## 10. Decision Checklist (Monolith vs Microservices)
- Use **Modular Monolith** when:
  - Building medium-to-large business platforms where operational simplicity is key, but code decoupling and team boundaries are required.
- Use **Microservices** when:
  - Different modules have conflicting scaling needs (e.g. CPU-heavy vs memory-heavy) or are maintained by separate large engineering divisions.

## 11. AI Coding-Agent Guidelines
- Restrict cross-module imports to only reference functions and classes explicitly exported in the target module's public API file.

## 12. Reusable Checklist
- [ ] Codebase organized into strictly decoupled modules
- [ ] Modules interact exclusively via public API interfaces or local events
- [ ] Cross-module database table queries are forbidden
- [ ] Local, in-memory event bus handles decoupled messaging
- [ ] Build tools or linter rules block circular module imports
- [ ] Monolithic deployment runs as a single stateless process
