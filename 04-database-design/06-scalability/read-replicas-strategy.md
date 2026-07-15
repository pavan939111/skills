# Read Replicas (Scaling Read Capacity)

## 1. Definition & Core Concepts

Read Replicas are dedicated, read-only copies of a primary database instance, synchronized asynchronously, designed to scale read query capacity horizontally and provide geographic data distribution.

Core concepts:
- **Horizontal Read Scaling:** Distributing SELECT query workloads across multiple replica nodes to increase total read throughput (QPS - Queries Per Second).
- **Cascading Replication:** A replication topology where a primary node replicates to a subset of secondary replicas, which in turn replicate to tertiary sub-replicas. This protects the primary node's network bandwidth and CPU.
- **Cross-Region Read Replicas:** Deploying read replicas in distinct global cloud regions to serve local users with low latency.
- **Replica Pool Load Balancing:** Distributing read queries evenly across a group of active replicas using DNS round-robin, proxy balance algorithms, or client load balancers.

*(Boundary Note: Query routing middleware configurations, client connection pool splits, and application transaction wrappers are covered in `05-query-and-performance/` and `backend-development/`. This document covers replica topologies, cascading scaling limits, cross-region network costs, and replication lag metrics.)*

## 2. Why It Exists / What Problem It Solves

While write operations are bounded by single-node primary capacities in relational systems, read operations are not. For read-heavy applications (e.g., e-commerce stores, social feeds), routing all queries to a single primary database exhausts its CPU and disk bandwidth, causing latency spikes. Read replicas allow scaling read throughput independently, offloading read-only traffic to lightweight replica nodes.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Replica Lag Accumulation from Under-Provisioning:** Sizing read replicas smaller (e.g., using a cheap instance type) than the primary node. Replicas lack the CPU/memory capacity to process the incoming replication log (WAL) under load, falling hours behind the primary and serving stale data.
- **Primary Server Bandwidth Exhaustion:** Connecting too many direct replicas (e.g. >10) to a single primary node. The primary must stream transaction logs to all replicas in parallel, saturating its network interface card (NIC) and slowing writes.
- **Network Egress Cost Explosions:** Replicating high-write databases to cross-region read replicas. Cloud providers charge heavy network egress fees for data sent between regions, leading to unexpected monthly cloud bills.
- **Stale read cascades on failover:** A replica with high replication lag is promoted to primary during a failover, causing the database state to roll back to a stale point-in-time, violating transactional integrity.

## 4. Best Practices

- **Size Replicas Identically to the Primary:** Ensure read replica instances have the exact same CPU, RAM, and disk IOPS specifications as the primary node to prevent replication lag under write spikes.
- **Use Cascading Replication for Large Pools:** If the read pool exceeds 5 to 7 replicas, configure cascading replication (Primary -> Replicas -> Sub-Replicas) to protect the primary's network bandwidth.
- **Deploy Replicas in the Same Availability Zones:** Place read replicas in the same cloud availability zones as the application servers to minimize cross-AZ network latency and data transfer costs.
- **Implement Automated Replica Health Checks:** Configure load balancers or proxy routers to run health checks on replicas (monitoring replication lag). Automatically exclude replicas from the read pool if lag exceeds a set threshold (e.g. >1 second).
- **Track Cross-Region Egress:** Audit write volume before setting up cross-region replicas. If write frequency is high, evaluate caching strategies at the application layer to minimize replication egress costs.

## 5. Common Mistakes / Anti-Patterns

- **Under-Provisioned Replicas:** Deploying smaller replica instances to save money, causing lag.
- **Replicating from Replicas for Real-Time Data:** Using read replicas for workflows that cannot tolerate eventual consistency lag, leading to data inconsistencies.
- **Over-replication:** Attaching too many direct read replicas to the primary node, saturating its network bandwidth.
- **No Failover Routing:** Failing to configure read pools to fall back to the primary node if all replicas go offline, causing read outages.

## 6. Security Considerations

- **Data Sovereignty and Residency Compliance:** Cross-region read replicas copy the entire database to a different physical country or territory. Ensure this does not violate data residency laws (like GDPR constraints on moving EU data to non-EU regions). Use filtered or logical replication to mask sensitive tables.

## 7. Performance Considerations

- **Asynchronous Replication Lag:** Understand that read replicas are eventually consistent. Ensure the client application handles minor data lag (e.g., by displaying loading states or caching updates locally).

## 8. Scalability Considerations

- **Auto-Scaling Replica Pools:** In containerized environments, configure auto-scalers to spin up new read replicas dynamically when the read pool's average CPU utilization exceeds 70%, distributing read spikes.

## 9. How Major Companies Implement It

- **Stripe:** Scales merchant query capacity by deploying read replica pools, routing merchant dashboard searches to local region replicas to minimize latency.
- **Netflix:** Utilizes globally distributed read replica nodes to serve video catalog listings to users locally, keeping primary write databases isolated.

## 10. Decision Checklist (Read Replica Sizing Framework)

Evaluate replica sizing and topologies using:

- Use **Identically Sized Replicas** when:
  - Designing production-grade database systems under active transactional loads.
- Use **Cascading Replication** when:
  - The read pool exceeds 5 replicas and primary network bandwidth is saturated.
- Use **Cross-Region Replicas** when:
  - Users are globally distributed, and local read latency must be minimized.
  - Data residency regulations are satisfied.
- Never use **Smaller Instance Types** for:
  - Replicas under active write replication loops (prevents lag).

## 11. AI Coding-Agent Implementation Guidelines

- Always specify that read replicas must match the primary node's hardware specifications in production configurations.
- Never configure more than 5 replicas directly connected to a single primary writer node — recommend cascading topologies.
- Always include replica lag metrics monitoring in database health-check scripts.
- Never deploy cross-region replicas without verifying compliance with local data residency laws (e.g. GDPR).
- Always ensure the client read pool load balancer defaults to the primary if replicas are offline.

## 12. Reusable Checklist

- [ ] Read replicas sized identically to the primary node (CPU, RAM, IOPS matched)
- [ ] Cascading replication configured if the replica pool size exceeds 5 nodes
- [ ] Replicas deployed in the same availability zones as application nodes to minimize costs
- [ ] Load balancer excludes replicas from the pool if replication lag exceeds threshold (e.g. >1s)
- [ ] Cross-region replicas audited for GDPR and data residency compliance
- [ ] Read pool failover routes to the primary node if all replicas are offline
- [ ] Network egress costs for replication monitored and budgeted
- [ ] Replica connections use read-only database credentials
