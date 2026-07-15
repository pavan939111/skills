# Connection Pooling

## 1. Definition & Core Concepts

Connection Pooling is the practice of maintaining a cache of open database connections (the pool) on the client or a proxy server, allowing database connections to be reused across multiple requests rather than opened and closed repeatedly.

Core concepts:
- **Connection Overhead:** The CPU, memory, and network cost of establishing a database connection (requires TCP handshakes, TLS negotiation, credentials validation, and backend process initialization).
- **Engine Process Models:**
  - *Process-per-Connection:* PostgreSQL spawns a separate OS process for every connection, consuming significant RAM (typically 10MB-20MB per connection).
  - *Thread-per-Connection:* MySQL spawns lightweight threads, which consumes less memory but still introduces CPU context-switching overhead under load.
- **Connection Proxies:** Database-side multiplexers (e.g., PgBouncer for PostgreSQL, ProxySQL for MySQL) that sit between application servers and the database engine, pooling and sharing connections.
- **Sizing Parameters:**
  - *Min Pool Size:* The minimum number of idle connections kept open.
  - *Max Pool Size:* The maximum number of concurrent database connections the client is allowed to open.

*(Boundary Note: Code-level database driver configuration, specific ORM pool configurations (e.g. HikariCP settings), and application framework code are out of scope. This document covers database-engine connection limits, proxy setups, sizing math, and timeout properties.)*

## 2. Why It Exists / What Problem It Solves

Opening a database connection takes time (often 10ms-100ms), which adds directly to API latency. Furthermore, database engines have a physical limit to the number of concurrent connections they can handle. If thousands of application containers open separate connections, the database server runs out of memory, spends all its CPU context-switching between processes, and crashes. Connection pooling reuses connections to reduce latency and protect database resources.

## 3. What Breaks in Production Without It

- **"Too Many Connections" Database Crashes:** During traffic spikes, the application launches new containers. Each container opens new database connections, exceeding the engine's `max_connections` limit. The database rejects new connections, taking the application offline.
- **Latency Spikes from Connection Handshakes:** Under high request volumes, APIs slow down because the application spends more time establishing new database connections than executing queries.
- **Database CPU Starvation:** Running a database with 5,000 active connections. The operating system spends 100% of its CPU time context-switching between database threads, stalling query execution.
- **Serverless Connection Floods:** Deploying serverless functions (like AWS Lambda) that connect directly to a PostgreSQL database. Since lambdas scale horizontally instantly, they open thousands of concurrent connections, instantly crashing the database.

## 4. Best Practices

- **Always Size the Pool Correctly:** Avoid setting the max pool size arbitrarily high. Use the standard PostgreSQL connection sizing formula: $Connections = ((Core\ Count \times 2) + Effective\ Spindle\ Count)$. (A small, saturated pool performs better than a bloated pool).
- **Use a Database-Side Proxy for Fleet Scale:** If connecting from thousands of containers or serverless lambdas, route traffic through a connection proxy (e.g., PgBouncer) configured in transaction pooling mode.
- **Configure Explicit Connection Timeouts:** Set a connection acquisition timeout (e.g., `connection_timeout = 2000` ms) on the client. If the pool is exhausted, fail fast rather than hanging the application thread.
- **Set Idle Connection Limits:** Configure idle timeouts to close unused connections, releasing database memory.
- **Match Max Connections to Database Capacity:** Ensure the sum of the client pool capacities does not exceed the database engine's maximum allowed connections (`max_connections` minus safety overhead).

## 5. Common Mistakes / Anti-Patterns

- **Setting Max Pool Size Too High:** Setting the max pool size to 1,000 on multiple application instances, exhausting database memory.
- **Serverless Direct Connection:** Connecting serverless functions directly to a database primary without a proxy.
- **Ignoring Connection Leaks:** Failing to close database connections in error handlers, leaving dead connections open.
- **Session Pooling for Transactions:** Using PgBouncer in session mode when transaction mode is required, wasting connections.

## 6. Security Considerations

- **Secure Proxy Connections:** Ensure connection proxies use TLS encryption for both incoming client traffic and outgoing database connections.
- **Credential Isolation:** Restrict proxy configurations to prevent credential sharing across distinct services.

## 7. Performance Considerations

- **Context-Switching Cost:** Limit active database connections to keep CPU context-switching low, maximizing query throughput.

## 8. Scalability Considerations

- **Multiplexing:** Use transaction-level pooling in proxies (like PgBouncer) to allow thousands of client connections to share a small pool of physical database connections.

## 9. How Major Companies Implement It

- **Stripe:** Routes all PostgreSQL traffic through PgBouncer instances, multiplexing thousands of container connections into a small pool of database processes.
- **Uber:** Uses ProxySQL to manage connection pools across MySQL shards, enabling connection routing and caching.

## 10. Decision Checklist (Connection Sizing Matrix)

Use the following parameters to choose connection models:

- Use **Local Client Connection Pooling** when:
  - Deploying a monolith or a small number of application instances (<10).
  - The database is a single primary SQL server.
- Use **Database-Side Connection Proxies (PgBouncer, ProxySQL)** when:
  - Deploying microservices or serverless applications that scale horizontally.
  - The total number of client connections exceeds 100.
  - Using PostgreSQL (due to its process-per-connection model).

## 11. AI Coding-Agent Implementation Guidelines

- Always recommend connection pooling in database configuration scripts.
- Never write database configuration files that allow unlimited connections.
- Always recommend database proxies (like PgBouncer) for serverless or kubernetes architectures.
- Always configure connection timeouts and statement limits.
- Never set client pool sizes without calculating total connection limits.

## 12. Reusable Checklist

- [ ] Connection pooling enabled on all database client libraries
- [ ] Database proxy (e.g. PgBouncer, ProxySQL) configured for horizontally scaled deployments
- [ ] Client pool size configured using standard CPU/Spindle formula
- [ ] Max connection limits across all clients stay within database `max_connections` bounds
- [ ] Connection acquisition timeout set (fails fast, no hanging threads)
- [ ] Idle connection timeouts configured to release memory
- [ ] TLS encryption active between client, proxy, and database nodes
- [ ] Transaction-level pooling mode selected for connection proxies
