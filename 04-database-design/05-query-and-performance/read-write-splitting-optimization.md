# Read-Write Splitting

## 1. Definition & Core Concepts

Read-Write Splitting is the database architecture pattern of routing database write mutations (INSERT, UPDATE, DELETE) and transactions to a single Primary (Writer) node, while routing read-only queries (SELECT) to one or more Replica (Reader) nodes.

Core concepts:
- **Primary (Writer) Node:** The authoritative node that accepts and executes all state mutations, writing them to disk and streaming changes to replicas.
- **Replica (Reader) Nodes:** Read-only copies of the primary database that sync data asynchronously using replication streams.
- **Replication Lag:** The time delay (typically milliseconds to seconds) for updates on the primary to propagate and apply to read replicas.
- **Dynamic Routing:** The mechanism (either middleware proxies like ProxySQL or client-side drivers) that parses SQL statements and routes them to the correct database connection pool based on the query type.

*(Boundary Note: Code-level database connection pool routing configs, client-side configuration parameters, and API load balancer setups belong in `backend-development/`. This document covers database replication streams, replica lag thresholds, routing rules, and transaction boundaries.)*

## 2. Why It Exists / What Problem It Solves

Relational database engines are bottlenecked by single-node write limits. If write transactions and heavy analytical read queries run on the same physical server, they compete for CPU, memory, and lock pools. Read-Write Splitting offloads the read traffic to horizontal replicas. This keeps the primary server's resources free for write transactions, allowing the system to scale read capacity.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Out-of-Sync User Interfaces (Lag Drift):** A user updates their profile. The application routes the write to the primary and redirects the user to their profile view. The read query is routed to a replica that has a 2-second replication lag. The user sees their old profile details, assumes the update failed, and submits it repeatedly.
- **Transaction Block Routing Failures:** Routing a transaction block containing both SELECT and UPDATE statements to a read replica. The replica is read-only, causing the transaction to throw database exceptions. All queries inside a transaction block must execute on the same node.
- **Replication Loop Crashes:** Routing queries that modify data to a read replica connection by mistake, throwing `ReadOnlyDatabaseException` errors and crashing APIs.
- **Primary Overload from Misrouting:** A configuration bug routes all SELECT queries to the primary node instead of replicas, saturating the primary node's connection pool.

## 4. Best Practices

- **Pin Transactions to the Primary Node:** Ensure any query executed within a transaction block (`BEGIN ... COMMIT`) runs on the primary node, even if the individual statement is a `SELECT`.
- **Implement Read-Your-Writes Window (Sticky Writes):** When a user executes a write operation, route their subsequent read queries to the primary node for a short duration (e.g. 5 seconds) before returning to replica reads. This ensures they see their own updates instantly.
- **Configure Replica Lag Thresholds:** Monitor replica lag. If a replica's lag exceeds a threshold (e.g. `lag > 2000` ms), route queries away from it until it syncs.
- **Use Database Proxies for Routing:** Use database proxies (like ProxySQL for MySQL or MaxScale for MariaDB) to handle SQL parsing and routing. This keeps application configurations simple.
- **Enforce Read-Only Roles on Replicas:** Configure the database user credentials used for replica connections with read-only privileges (`GRANT SELECT ON ...`), preventing write queries from executing on replicas.

## 5. Common Mistakes / Anti-Patterns

- **Checking Balances on Replicas:** Routing billing check queries to eventually consistent read replicas, leading to double-spending.
- **Synchronous Replication by Default:** Enforcing synchronous replication to eliminate lag, which slows down write transactions to the speed of the slowest replica node. Use asynchronous replication and manage lag.
- **Ignoring Failover Routes:** Failing to configure client drivers to route read queries to the primary if all replicas crash.
- **Unindexed Replica Queries:** Assuming replica queries can bypass indexing because "replicas are only for reads," saturating replica CPU.

## 6. Security Considerations

- **Read-Only Privilege Enforcements:** Ensure replica connections are restricted to read-only roles, preventing SQL injection vulnerabilities on read paths from executing data deletions.

## 7. Performance Considerations

- **Network Latency between Nodes:** Place replicas in the same cloud region or availability zone as the primary to minimize replication lag. Use cross-region replicas only for disaster recovery.

## 8. Scalability Considerations

- **Horizontal Read Capacity Scaling:** Read capacity scales linearly by adding read replicas. If read traffic doubles, spin up new replicas without needing to scale the primary write node.

## 9. How Major Companies Implement It

- **Stripe:** Routes all critical checkout calculations and ledger writes to PostgreSQL primary nodes, using replicas to handle merchant analytics search queries and dashboard renders.
- **Netflix:** Deploys read replicas in multiple AWS availability zones to serve video catalog data locally with sub-millisecond latencies, isolating writes to primary hubs.

## 10. Decision Checklist (Read-Write Splitting Framework)

Configure read-write routing based on the following:

- Route to **Primary Node** when:
  - The query is a write mutation (`INSERT`, `UPDATE`, `DELETE`).
  - The query is part of a transaction block (`BEGIN ... COMMIT`).
  - The query checks critical data (e.g. billing balance, login credentials).
  - The query runs within the user's post-write consistency window (Read-Your-Writes).
- Route to **Replica Nodes** when:
  - The query is a standalone read query (`SELECT`).
  - Data lag (eventual consistency) is acceptable.
  - Running heavy reporting or analytical searches.

## 11. AI Coding-Agent Implementation Guidelines

- Always define separate connection configurations for primary (write) and replica (read) connection pools.
- Never execute transaction blocks (`BEGIN...COMMIT`) across split connections — pin the entire transaction to the primary writer connection.
- Always implement a post-write window (Read-Your-Writes) that routes reads to the primary temporarily.
- Never route security authentication or billing balance queries to read replicas.
- Always configure database replicas with read-only credentials.

## 12. Reusable Checklist

- [ ] Write connections target only the primary database writer node
- [ ] Standalone read queries (`SELECT`) routed to read replicas
- [ ] Transaction blocks (`BEGIN ... COMMIT`) execute entirely on the primary node
- [ ] Read-Your-Writes window configured to route post-write reads to the primary node
- [ ] Database credentials for replica connections restricted to read-only roles
- [ ] Replica lag thresholds monitored and alert routes configured
- [ ] Router failover configured to route reads to primary if replicas are offline
- [ ] Replicas deployed in the same availability zones/regions to minimize lag
