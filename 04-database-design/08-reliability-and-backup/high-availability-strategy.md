# High Availability (HA)

## 1. Definition & Core Concepts

Database High Availability (HA) is the architectural design that ensures a database system operates continuously with minimal downtime, typically targeting 99.99% ("four nines") or 99.999% ("five nines") uptime, by eliminating single points of failure and enabling automated recovery.

Core HA concepts:
- **Redundancy:** Maintaining duplicate physical database instances (primaries and standby replicas) across distinct physical infrastructures.
- **Availability Zones (AZs):** Isolated datacenters within a cloud region. Deploying HA nodes across multiple AZs protects against power, network, or cooling failures in a single datacenter.
- **Active-Passive HA:** A topology where only one primary node accepts writes while standby nodes receive replication data and remain ready for failover promotion.
- **Active-Active HA:** A topology where multiple nodes accept writes concurrently, requiring advanced conflict resolution and distributed synchronization.
- **Single Point of Failure (SPOF):** Any individual component (e.g., a network switch, database disk, or power supply) whose failure takes the entire system offline.

*(Boundary Note: Cloud load balancer setup, infrastructure networking routes, and application container orchestration belong in cloud architecture and backend-development books. This document covers database-level HA replication, AZ distribution, node sizing, and cluster coordinates.)*

## 2. Why It Exists / What Problem It Solves

If a database runs on a single server, any hardware failure, operating system crash, or physical disk corruption immediately takes the application offline. High availability mitigates this risk by ensuring that if a database component or server fails, backup nodes automatically take over the workload within seconds, keeping services online for users.

## 3. What Breaks in Production Without It

- **Total Outages from Single-AZ Outages:** Deploying all database nodes (primary and standby) in the same cloud availability zone (or the same physical server rack). A power outage in that zone takes down the entire database cluster, bypassing replication benefits.
- **Under-sized Replica Crashes (HA Cascades):** Sizing standby replicas smaller than the primary. When the primary crashes and the replica is promoted, it is instantly overwhelmed by production traffic, saturating its CPU and crashing, causing a prolonged outage.
- **Shared Storage SPOF:** Deploying primary and standby databases that share the same physical SAN (Storage Area Network) array. When the SAN controller fails, both databases lose disk access, neutralizing the redundancy.
- **Failed Failovers due to Stale Orchestrators:** The cluster orchestrator loses connection to the nodes or runs out of memory, preventing it from executing the failover when the primary crashes.

## 4. Best Practices

- **Deploy Across Multi-AZs:** Always distribute database primary and standby nodes across at least three distinct Availability Zones within a region.
- **Size Standby Nodes Identically to the Primary:** Ensure standby replicas have the exact same CPU, RAM, and disk IOPS capacity as the primary node to handle production workloads post-failover.
- **Enforce Shared-Nothing Architectures:** Ensure each database node has its own dedicated physical storage, network interfaces, and power systems. Avoid shared disk volumes.
- **Use Semi-Synchronous Replication for HA:** For high-value transactions (billing, identities), configure semi-synchronous replication to ensure at least one standby replica has written the transaction log before the primary commits.
- **Test HA Failover Regularly (Chaos Engineering):** Run automated chaos tests in staging (e.g. terminating the primary node) to verify the cluster orchestrator detects the failure, isolates the node, and promotes the replica within SLAs.

## 5. Common Mistakes / Anti-Patterns

- **Single AZ Deployment:** Placing all replicas in one datacenter.
- **Under-provisioned Standbys:** Deploying cheaper, smaller instances for standbys to save budget, causing post-failover crashes.
- **Assuming Replicas equal HA:** Setting up read replicas without configuring automated failover orchestrators (like Patroni or Consul), requiring manual intervention to promote nodes.
- **Shared Resources:** Sharing disk controllers, switches, or networks between primary and standby nodes, creating single points of failure.

## 6. Security Considerations

- **Secure Cluster Communications:** Enforce mutual TLS (mTLS) for all database replication, heartbeat, and orchestrator traffic to prevent unauthorized nodes from joining the cluster or sniffing transactions.

## 7. Performance Considerations

- **Replication Mode Latency Cost:** Semi-synchronous or synchronous replication increases write latency on the primary node as it waits for standby acknowledgments. Optimize inter-AZ network paths to keep write latency low.

## 8. Scalability Considerations

- **Quorum Scaling Limits:** As you add nodes to an HA cluster to increase durability, the consensus overhead (voting rounds) can slow down write performance. Keep HA clusters bounded to 3 or 5 nodes, offloading read-only scaling to standard asynchronous replicas.

## 9. How Major Companies Implement It

- **Stripe:** Implements multi-AZ PostgreSQL HA clusters orchestrated by Patroni, ensuring database write capability remains online even during complete datacenter zone blackouts.
- **Netflix:** Deploys active-active Cassandra ring topologies across multiple AWS regions globally, achieving high availability and low latency by allowing writes to execute locally in any region.

## 10. Decision Checklist (HA Topology Selection)

Select the HA configuration:

- Use **Multi-AZ Active-Passive HA (3+ Nodes)** when:
  - Designing core production transactional database infrastructures.
  - Downtime must be kept under 30 seconds (RTO < 30s).
  - Data loss cannot be tolerated (RPO = 0, using semi-synchronous replication).
- Use **Single-Node Database (No HA)** ONLY when:
  - Operating development, staging, or testing environments.
  - Operating non-critical internal tools where multi-hour downtime is acceptable.
- Use **Active-Active HA** when:
  - The database is globally distributed, and writes must execute in local regions with low latency.
  - The database engine natively supports write conflict resolution (like Cassandra or DynamoDB).

## 11. AI Coding-Agent Implementation Guidelines

- Always require database primary and standby nodes to be distributed across distinct Availability Zones.
- Never write database configuration files that size standby replicas smaller than the primary node.
- Always recommend shared-nothing architectures (dedicated disks for each node).
- Never deploy production database topologies without configuring automated failover orchestrators.
- Always enforce mutual TLS (mTLS) for all inter-node replication and clustering networks.

## 12. Reusable Checklist

- [ ] Database primary and standby nodes distributed across at least three distinct Availability Zones (AZs)
- [ ] Standby replicas configured with identical hardware specs (CPU, RAM, IOPS) as the primary node
- [ ] Shared-nothing architecture active (no shared SAN or physical disks)
- [ ] Automated failover orchestrator (e.g. Patroni, Orchestrator) active and monitored
- [ ] Semi-synchronous replication active for critical transactional tables (RPO = 0 validation)
- [ ] Inter-node clustering and replication traffic encrypted via mutual TLS (mTLS)
- [ ] Heartbeat probes and network timeouts configured to prevent false failovers
- [ ] HA failover procedures validated regularly using automated chaos tests
