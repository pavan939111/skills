# Health Checks

## 1. Definition & Core Concepts

Database Health Checks are automated, periodic diagnostic tests executed by database proxies, load balancers, or container orchestrators to determine if a database node is healthy and capable of serving read and/or write traffic.

Core concepts:
- **Liveness Probes:** Tests that verify if the database engine process is running (e.g. PostgreSQL `pg_isready`). If a liveness probe fails, the system restarts the container.
- **Readiness Probes:** Tests that verify if the database instance is fully initialized, synced, and capable of executing SQL queries. If a readiness probe fails, the load balancer stops routing query traffic to the node.
- **Synthetic Transaction (Write check):** Enforcing database write capabilities on the primary node by executing a lightweight write operation (e.g., updating a heartbeat table row) to ensure the storage volume is not read-only.
- **Read-Only Mode Detection:** Probing nodes to identify if they are running in recovery/standby mode (`pg_is_in_recovery()`), ensuring write queries are never routed to replicas.

*(Boundary Note: Container orchestration health check YAML configs (Kubernetes probe YAML), load balancer target group configuration screens, and client-side retry policies belong in cloud architecture and backend-development. This document covers database-level ping commands, status query SQL, write validation tables, and probe connection optimization.)*

## 2. Why It Exists / What Problem It Solves

If a database node crashes or runs out of storage, routing client queries to it will cause API failures. Basic ping checks only verify if the host server's network card is active; they cannot detect if the database engine is locked up, disk-read-only, or out of connections. Database-native health checks verify actual query execution capability, allowing load balancers to route traffic away from unhealthy nodes.

## 3. What Breaks in Production Without It

- **Routing Writes to Dead Primaries:** A primary database experiences disk storage issues and switches to read-only mode. Because the load balancer only pings the port (`5432`), it marks the node as healthy. The application routes write queries to the node, causing database exceptions.
- **Cascading Replica Failures (Throttling Loops):** One read replica experiences CPU saturation. The health check probe uses a heavy query that times out, causing the load balancer to remove the replica from the pool. The remaining replicas receive the redistributed read traffic, overload, fail their health probes, and crash.
- **Connection Saturation from Probes:** Probing the database too frequently (e.g. every 1 second) from hundreds of application containers without using connection pooling, exhausting all available database connection slots with health checks.
- **Incorrect Replica Write Routing:** During failover, a replica is promoted. The application continues to route write queries to the old primary because the old primary still responds to TCP probes, leading to write errors.

## 4. Best Practices

- **Differentiate Liveness and Readiness Probes:**
  - *Liveness:* Use fast engine-level ping utilities (e.g. `pg_isready -h host -p 5432`) that do not open full database connections or execute SQL.
  - *Readiness:* Execute a lightweight query (e.g., `SELECT 1`) to verify the engine can parse and run queries.
- **Verify Write Capability via Heartbeat Table:** For primary nodes, perform a synthetic write test by writing to a dedicated heartbeat table:
  `UPDATE heartbeat SET last_seen = NOW() WHERE id = 1;`
  This ensures the database file system has not switched to read-only due to disk corruption.
- **Check Replication Status on Standbys:** For read replica readiness probes, verify that the instance is in read-only recovery mode and check the replication lag. Fail the probe if lag exceeds thresholds.
  - *Example (PostgreSQL):* `SELECT pg_is_in_recovery() AND pg_last_wal_replay_lsn() IS NOT NULL;`
- **Use Dedicated Health Check Connections:** Allocate a dedicated, low-privilege database role (e.g., `db_health_check`) for health probes, restricting its privileges strictly to executing `SELECT 1` and updating the heartbeat table.
- **Set Long Probe Timeouts:** Enforce conservative probe thresholds (e.g., probe every 10 seconds, require 3 consecutive failures before marking a node as unhealthy) to prevent temporary network blips from triggering traffic re-routing loops.

## 5. Common Mistakes / Anti-Patterns

- **Heavy SQL Queries in Probes:** Running aggregate counts or table scans in health checks.
- **TCP Socket Pings Only:** Assuming that because port `5432` responds to connection attempts, the database is healthy.
- **No Connection Limits on Probes:** Running un-pooled health probes from hundreds of stateless containers, saturating the database's connection limits.
- **Probing Primaries as Replicas:** Failing to check `pg_is_in_recovery()` on readiness probes, leading to writes being routed to replicas.

## 6. Security Considerations

- **Health Check Port Isolation:** Isolate health check status endpoints on a private network segment. Ensure public internet users cannot query health endpoints to inspect database versions or connection states.

## 7. Performance Considerations

- **Health Probe Overhead:** A database probe query must execute quickly (<5ms) and consume minimal CPU. Never join tables or read variable rows during health check execution.

## 8. Scalability Considerations

- **Centralized Health Check Proxies:** In large container fleets, route health check requests through local connection proxies (PgBouncer) or cluster orchestrators to prevent health probes from consuming all database slots.

## 9. How Major Companies Implement It

- **Stripe:** Utilizes health checking daemons that execute lightweight synthetic write transactions against Postgres primaries, routing traffic away within seconds if write latency or disk writes fail.
- **Netflix:** Deploys health check micro-agents on database nodes to monitor replica state and disk capacity, communicating status to traffic routers.

## 10. Decision Checklist (Health Probe Settings)

Configure database health check parameters:

- Use **Process-Level Pings (`pg_isready` / TCP check)** when:
  - Designing liveness probes to verify the database engine is running.
- Use **Lightweight SQL Probes (`SELECT 1`)** when:
  - Designing readiness probes to verify the engine can execute read queries.
- Use **Synthetic Write Probes (Heartbeat Update)** when:
  - Verifying primary node health (ensures storage drives accept writes).
- Use **Recovery State Checks (`pg_is_in_recovery`)** when:
  - Distinguishing primary nodes from read replicas in load balancer pools.

## 11. AI Coding-Agent Implementation Guidelines

- Always require separate configurations for liveness and readiness database probes.
- Never write database health queries that perform table scans or aggregate calculations.
- Always include `pg_is_in_recovery()` checks in replica health check templates.
- Never use superuser accounts to execute database health checks — use low-privilege dedicated roles.
- Always configure database health checks to use timeouts and retry thresholds (e.g., 3 retries).

## 12. Reusable Checklist

- [ ] Liveness probe checks process status without opening database sessions (`pg_isready`)
- [ ] Readiness probe executes lightweight query (`SELECT 1`) to verify read capability
- [ ] Primary database readiness probe performs synthetic write on a heartbeat table
- [ ] Replica readiness probe checks recovery status (`pg_is_in_recovery`) and replication lag
- [ ] Low-privilege, dedicated database role (`db_health_check`) used for health check probes
- [ ] Health check connection pool configured to prevent slot exhaustion
- [ ] Probe thresholds configured (e.g., interval 10s, timeout 2s, fail count 3)
- [ ] Health check status endpoints isolated from public internet access
