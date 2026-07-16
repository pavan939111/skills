# Interceptor Pattern Implementation

## 1. Definition & Core Concepts
The Interceptor Pattern (often implemented via Aspect-Oriented Programming - AOP) allows application builders to intercept, inspect, and mutate method invocations, message queues, or RPC network calls dynamically. Unlike HTTP middleware, interceptors operate at arbitrary system boundaries (e.g., repository calls, service layers, RPC connections) to apply generic logic before and after execution.

Key elements:
- **Join Point:** The specific execution point (e.g., method call) being intercepted.
- **Invocation Metadata:** Payload containing the target class name, method arguments, and thread execution context.
- **Proceed Delegate:** The execution handler that triggers the original method call, returning control back to the interceptor wrapper.

## 2. Why It Exists / What Problem It Solves
It decouples internal system boundaries from operational concerns like query retry loops, transaction audits, performance metrics, and caching. Instead of mixing retry loops inside database repository queries, developers apply a clean interceptor annotation to handle errors dynamically.

## 3. What Breaks in Production Without It
- **Distributed Trace Loss on RPCs:** gRPC microservice calls fail to pass context correlation data, rendering Jaeger/OpenTelemetry call graphs incomplete.
- **Transaction Leakages:** Database modifications skip rollback sequences during unhandled runtime exceptions because transactions were managed via manual try-catch wrappers.
- **Performance Blindspots:** Lack of standardized execution metrics leaves slow method calls unlogged.

## 4. Best Practices
- **Maintain Context Propagation:** Always capture and forward metadata headers (such as trace states and tenant contexts) across RPC boundaries.
- **Write Safe Exceptions Wrappers:** Catch internal exceptions inside interceptor blocks and convert them to standard network status codes (e.g. gRPC `Status` codes or custom domain exceptions).
- **Ensure Idempotency on Retries:** Only trigger interceptor retries for safe, idempotent read queries or queued tasks.

## 5. Common Mistakes / Anti-Patterns
- **Adding Heavy Business Validations:** Writing core business workflows inside interceptors, scattering domain logic across AOP classes.
- **Swallowing Errors silently:** Catching exceptions inside interceptors without propagating them or logging their stack traces, masking application failures.
- **Mutating Arguments Destructively:** Modifying incoming method parameters inside interceptors, causing unexpected side effects.

## 6. Security Considerations
- **Access Control Enforcement:** Apply interceptors at the service layer to validate role permissions (e.g. `@RolesAllowed("ADMIN")`), preventing access if auth context checks fail.
- **Log Masking:** Sanitize sensitive arguments (passwords, payment cards) inside parameter logging interceptors to prevent data leakage in text files.

## 7. Performance Considerations
- **Minimize Reflection Overhead:** Avoid using heavy runtime reflection inside interceptors. Prefer code generation or compiler-based aspect weaving.
- **Keep Overhead under 1ms:** Interceptors execute on every target invocation. Keep data lookups fast and memory allocations minimal.

## 8. Scalability Considerations
- **Distributed Lock Interceptors:** Use interceptors to wrap critical methods with distributed lock logic (e.g. Redlock), preventing concurrent updates across server nodes.

## 9. How Major Companies Implement It
- **Google:** Employs gRPC interceptors globally across all internal RPC call pools to enforce distributed tracing, secure authentication, and rate limiting.
- **Netflix:** Uses Spring AOP and custom interceptor aspects to manage circuit breakers, metrics collections, and caching grids.

## 10. Decision Checklist (Interceptor vs Middleware)
- Use **Interceptors** when:
  - Working with RPC protocols (gRPC, SOAP, GraphQL solvers) that bypass standard HTTP middleware chains.
  - Applying logic to internal class boundaries (e.g. wrapping database queries with transactional contexts).
- Use **HTTP Middleware** when:
  - The concern is strictly web-layer (handling cookies, raw HTTP header validation, CORS).

## 11. AI Coding-Agent Guidelines
- Ensure gRPC client and server configurations automatically register trace context propagation interceptors.
- Write interceptors that preserve the original return type of the wrapped methods.

## 12. Reusable Checklist
- [ ] gRPC Client Interceptor configured to propagate trace context metadata
- [ ] gRPC Server Interceptor configured to recover from panics and log errors
- [ ] Database transaction interceptor rolls back on runtime exceptions
- [ ] Service execution time interceptor logs calls exceeding 200ms threshold
- [ ] Sensitive payload arguments masked before printing parameter logs
- [ ] Unit tests verify interceptors propagate context across asynchronous boundaries\n