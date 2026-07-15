# Connection Pooling

## 1. Definition & Core Concepts
Connection Pooling is a caching technique where database connections are kept open and shared across multiple application requests, rather than opening and closing connections on every query.

## 2. Why It Exists / What Problem It Solves
Establishing a database connection requires a network round-trip, TLS handshakes, and database authentication checks, which can take 50-100ms. Connection pools eliminate this latency overhead, allowing threads to borrow existing, authenticated connections instantly.

## 3. What Breaks in Production Without It
- **API Outages Under Load:** Sudden surges in user traffic force the backend to open hundreds of new database connections, overloading the database server's process limits.
- **High Latency:** Every API request takes an extra 100ms because it must wait on TCP connection handshakes.

## 4. Best Practices
- **Define Pool Sizing Limits:** Configure optimal minimum and maximum pool connection limits (e.g. start with max_connections = 10 per application thread).
- **Configure Timeouts:** Set connection timeout values (e.g., maximum wait of 2.0 seconds) to prevent threads from hanging when pools are full.
- **Implement Idle Pruning:** Automatically close inactive database connections that exceed idle time limits to free up database resources.

## 5. Common Mistakes / Anti-Patterns
- **Setting pools too large:** Configuring connection limits that exceed the database server's max connection parameters, causing connection failures.
- **Leaking connections:** Failing to release connections back to the pool in application error handlers.

## 6. Security Considerations
- **Credential Storage:** Store pool credentials in cloud secrets managers, encrypting connection configuration paths in transit.

## 7. Performance Considerations
- **Pool Sizing Calculation:** Calibrate pool sizes based on concurrent application threads and database query response times.

## 8. Scalability Considerations
- **Database Proxies:** Deploy database proxy proxies (like PgBouncer for PostgreSQL) to pool connections globally across auto-scaled microservice pods.

## 9. How Major Companies Implement It
- **Uber:** Deploys pgBouncer proxies globally in front of PostgreSQL database clusters to manage millions of concurrent microservice database queries.

## 10. Decision Checklist (Pooling Architecture)
- Use **Client-side Connection Pooling** when:
  - Deploying a single application monolith or a small set of microservices with dedicated connection limits.
- Use **Server-side Connection Proxies (PgBouncer)** when:
  - Running auto-scaled Kubernetes pods where total container instances exceed the database connection threshold.

## 11. AI Coding-Agent Guidelines
- Write database wrappers that utilize connection pools, ensuring that connections are returned to the pool in inally execution blocks.

## 12. Reusable Checklist
- [ ] Connection pool limits (min/max size) explicitly defined
- [ ] Database timeouts configured for connection checkout checks
- [ ] Connection leaks prevented by releasing sessions in finally blocks
- [ ] PgBouncer or proxy pooling deployed for containerized deployments
- [ ] Connection credentials stored securely in encrypted vaults
- [ ] Idle connection pruning configured to release database resources
