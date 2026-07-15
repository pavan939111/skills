# Failover

## 1. Definition & Core Concepts

Database Failover is the process of shifting active database workloads (reads and writes) from a failed primary node to a healthy standby replica in the cluster, restoring database availability.

Core concepts:
- **Unplanned Failover:** An emergency transition triggered automatically or manually when the primary database node crashes or experiences hardware failure.
- **Planned Failover (Switchover):** A controlled database migration executed for scheduled maintenance or upgrades, transitioning the primary role to a replica with zero data loss.
- **Fencing (STONITH):** A safety mechanism ("Shoot The Other Node In The Head") that physically isolates or terminates the failed primary node to ensure it cannot write to disk or accept connections post-failover.
- **Switchback:** The process of returning the primary role to the original primary server after it has been recovered and synced.
- **Split-Brain:** A corruption state where network isolation causes two nodes in a cluster to assume the primary role simultaneously, both accepting writes.

*(Boundary Note: Client-side connection retries, DNS load-balancer updates, and application framework router configs belong in `backend-development/`. This document covers database-level replication checks, primary promotion, STONITH fencing, and split-brain resolution.)*

## 2. Why It Exists / What Problem It Solves

If a primary database server crashes, all application writes fail, taking the product offline. Manual restoration (provisioning a new machine, configuring replication, promoting it) takes hours. Failover automates or coordinates this process, identifying primary failure, promoting a replica, and redirecting write traffic within seconds to keep the application available.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Split-Brain Data Corruption:** A network partition isolates the primary. The cluster manager promotes Standby A to primary. The network heals, but the original primary is still running. Now two primary nodes accept writes, generating conflicting database transactions that are impossible to merge.
- **Data Loss on Laggy Promotion:** Automatically promoting a replica that has high replication lag. The new primary accepts writes, but because it was behind, all transactions committed on the old primary during the lag window are lost.
- **Failover Cascades (Chapping):** Setting heartbeat timeouts too short (e.g. <2 seconds). A minor network drop causes the cluster manager to trigger a failover. During promotion, another drop triggers another failover, locking the database in a promotion loop.
- **Hanging Client Connections:** Application client connections lock up, waiting indefinitely on sockets connected to the dead primary because no TCP keepalive or connection timeout was configured.

## 4. Best Practices

- **Implement Quorum-Based Consensus (Patroni/Orchestrator):** Use clustering tools that require a majority quorum vote (e.g. using Raft or Consul) before promoting a replica to primary, preventing split-brain.
- **Enforce Strict Fencing (STONITH):** Configure the cluster manager to disable the network interface or shut down the server of the failed primary *before* promoting the replica.
- **Verify Replication Lag Before Promotion:** If the standby replica's lag exceeds a threshold (e.g., >10 seconds), block automated promotion to prevent data loss, requiring manual administrator intervention.
- **Route Writes via Connection Proxies:** Route application writes through a database proxy (e.g., PgBouncer, ProxySQL). During failover, the proxy updates its routing mapping instantly, avoiding the need to redeploy application configurations.
- **Disable Automatic Switchback:** When the failed primary recovers, do not allow it to automatically rejoin as primary. Force it to sync as a read replica first, verifying health before executing a planned switchover.

## 5. Common Mistakes / Anti-Patterns

- **No Fencing Controls:** Promoting replicas while the failed primary is still active, leading to split-brain.
- **Heartbeat Timeouts Set Too Low:** Triggering automated failovers on brief network hiccups. Enforce a minimum heartbeat threshold of 10 to 30 seconds.
- **Promoting Stale Standbys Automatically:** Prioritizing availability over consistency by promoting replicas with high replication lag, causing silent data loss.
- **Manual IP Configurations:** Hardcoding database primary IP addresses in application servers, requiring manual configuration updates during failover.

## 6. Security Considerations

- **Secure Failover Gossip Networks:** Ensure the inter-node consensus gossip network is encrypted via mutual TLS (mTLS) and restricted to private subnets, preventing attackers from injecting spoofed failure messages to trigger unauthorized promotions.

## 7. Performance Considerations

- **Write Block Time (RTO):** During failover, write operations are blocked until the new primary is promoted. Keep RTO low by optimizing replica catalog promotion scripts to execute in under 10 seconds.

## 8. Scalability Considerations

- **Replicas Re-routing:** When a new primary is promoted, all remaining read replicas must be re-routed to replicate from the new primary node instead of the failed node. Ensure cluster orchestrators handle this re-routing automatically.

## 9. How Major Companies Implement It

- **GitHub:** Uses Orchestrator to manage MySQL failover, utilizing consensus checks to detect primary node failures and executing automated fencing before promoting a standby.
- **Stripe:** Uses Patroni and Consul to orchestrate PostgreSQL failover, ensuring that database failovers maintain strong consistency limits and prevent split-brain.

## 10. Decision Checklist (Failover Configuration Framework)

Select the failover strategy:

- Use **Automated Failover (Consensus-Driven)** when:
  - High availability is a strict SLA requirement (uptime >99.9%).
  - The cluster is backed by a quorum-based orchestrator (Consul, Patroni, Orchestrator).
  - Strict node fencing (STONITH) is configured.
  - Replication lag is continuously monitored.
- Use **Manual Failover (Human-Triggered)** when:
  - The database is a single primary with one replica (no quorum possible).
  - Minor RTO downtime (minutes) is acceptable.
  - The business cannot tolerate any data loss (RPO = 0) and requires human verification of replication lag before promotion.

## 11. AI Coding-Agent Implementation Guidelines

- Never configure automated failovers without implementing split-brain fencing controls.
- Always recommend quorum-based consensus managers (like Patroni or Orchestrator) for multi-node clusters.
- Always verify replication lag limits before generating promotion scripts.
- Never write connection configurations that hardcode primary IP addresses — recommend DNS endpoints or database proxy routers.
- Always disable automatic switchback on recovered primary nodes.

## 12. Reusable Checklist

- [ ] Consensus-based cluster orchestrator configured with odd-numbered nodes (Raft/Paxos)
- [ ] Strict node fencing (STONITH) active to isolate failed primaries before promotion
- [ ] Replication lag checked before standby promotion (aborts if lag > threshold)
- [ ] Automated switchback disabled on recovered primary nodes (rejoin as replica first)
- [ ] Heartbeat timeouts configured conservatively (10s - 30s) to prevent false failovers
- [ ] Database connection proxy (PgBouncer, ProxySQL) dynamically routes write traffic
- [ ] Inter-node consensus gossip traffic encrypted via mutual TLS (mTLS)
- [ ] DR runbooks updated with switchback and node sync procedures
