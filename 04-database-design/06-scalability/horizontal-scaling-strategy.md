# Horizontal Scaling (Scale-Out Architecture)

## 1. Definition & Core Concepts

Horizontal Scaling (Scale-Out) is the scalability practice of expanding database capacity (both storage and transaction throughput) by adding more server nodes to a network cluster, utilizing a shared-nothing architecture.

Core concepts:
- **Shared-Nothing Architecture:** An architecture where each database node in the cluster has its own independent CPU, RAM, and disk storage. No memory or disk storage is shared across nodes.
- **Partitioning / Sharding:** Distributing logical table rows across different nodes based on partition key hashes or ranges.
- **Consensus Algorithms:** Protocol networks (e.g., Raft, Paxos) used to manage cluster state, elect leaders, and guarantee consistency across distributed nodes.
- **Database Routing Proxies:** Middleware layers that intercept queries and route them to the specific nodes containing the targeted data.
- **Rebalancing:** The process of redistributing data partitions across nodes when new servers are added or removed from the cluster.

*(Boundary Note: Application container auto-scaling (e.g. Kubernetes HPA), network routing proxy code, and load-balancer hardware setup are out of scope. This document covers database-level clustering, consensus algorithms, partition routing, and rebalancing trade-offs.)*

## 2. Why It Exists / What Problem It Solves

Single database servers, regardless of how much CPU and RAM are added (Vertical Scaling), eventually hit hardware limits: disk I/O limits, memory bandwidth ceilings, and network card saturation. Horizontal scaling allows databases to bypass single-node limits by distributing data across a cluster of servers, enabling linear capacity and transaction throughput scaling.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Cluster Meltdown during Node Addition (Rebalancing Saturation):** Adding a new node to a distributed cluster. The database engine automatically begins rebalancing data partitions across the network. The data transfer consumes all network bandwidth and disk IOPS, causing active client queries to time out and taking the system offline.
- **Split-Brain Cluster Corruption:** A network partition splits a 5-node cluster into two sub-clusters (one with 2 nodes, one with 3). If no consensus protocol (like Raft) is active, both sides may elect leaders and accept writes, corrupting the database.
- **Distributed Query Latency Spikes:** Writing queries that require data from multiple nodes (scatter-gather / cross-node joins). The query must execute network round-trips to compile results, slowing down performance.
- **Hot Partition Disk Exhaustion:** Selecting a poor partitioning key, causing all writes to route to a single node in the cluster, crashing it under load.

## 4. Best Practices

- **Scale Vertically First:** Vertical scaling (adding CPU/RAM to a single node) is simpler and cheaper than horizontal scaling. Exhaust vertical limits and optimize indexing before adopting complex horizontal architectures.
- **Use Consensus-Backed Databases:** Deploy distributed databases that utilize standard consensus protocols (Raft/Paxos) to manage cluster state and prevent split-brain issues (e.g., CockroachDB, TiDB, Cassandra).
- **Select High-Cardinality Partition Keys:** Ensure partition keys distribute data evenly across all cluster nodes to prevent hotspots.
- **Schedule Node Scaling Off-Peak:** Add nodes to the cluster during low-traffic hours to prevent rebalancing traffic from impacting production queries. Limit rebalancing bandwidth.
- **Use Stateless Routing Proxies:** Route application queries through a proxy layer (like Vitess for MySQL) to handle routing, hiding cluster complexity from the application code.

## 5. Common Mistakes / Anti-Patterns

- **Premature Horizontal Scaling:** Scaling out too early for small datasets (<1TB) that could run on a single vertically scaled instance.
- **Cross-Node Joins:** Writing queries that join tables sharded on different partition keys, forcing the database to transfer massive datasets over the network.
- **No Majority Quorum:** Deploying an even number of database nodes (e.g. 2 or 4) without a tiebreaker node, preventing consensus protocols from resolving partition splits. Always deploy odd-numbered clusters (e.g., 3, 5, 7).
- **Ignoring Rebalancing Costs:** Assuming adding nodes instantly increases performance, ignoring the network cost of redistributing data.

## 6. Security Considerations

- **Inter-Node TLS Encryption:** Enforce mutual TLS (mTLS) for all inter-node communication (gossip protocol, consensus voting, data replication) to prevent packet sniffing and spoofing inside the database subnet.

## 7. Performance Considerations

- **Network Hop Latency:** Every distributed query that hops across nodes adds network latency. Design data models to keep transactions local to single nodes (single-shard queries).

## 8. Scalability Considerations

- **Linear Scalability Limits:** Evaluate database engines for linear scalability: doubling the number of nodes should ideally double write/read throughput capacity, though consensus overhead limits this in practice.

## 9. How Major Companies Implement It

- **Uber:** Scaled their MySQL databases horizontally by deploying Vitess, routing queries to sharded clusters using a custom database proxy layer.
- **Apple:** Deploys Cassandra clusters across thousands of nodes globally to store iCloud user files, utilizing masterless peer-to-peer scaling to handle petabytes of data.

## 10. Decision Checklist (Horizontal Scaling Matrix)

Scale out the database when:

- **Write volume** exceeds the capacity of the largest single primary server node.
- **Data storage size** exceeds 2TB and continues to grow.
- **High availability** requires surviving complete data center or AZ outages without data loss.
- **Multi-region data residency** requires storing user data locally in specific geographic regions.

## 11. AI Coding-Agent Implementation Guidelines

- Never recommend horizontal sharding or distributed databases for datasets estimated to stay under 1TB.
- Always recommend odd-numbered node configurations (3, 5, 7) for distributed clusters to ensure majority quorum.
- Always enforce mutual TLS (mTLS) configuration parameters for inter-node communication.
- Never write distributed queries that require cross-node joins — recommend denormalization or routing keys.
- Always configure rebalancing bandwidth limits in cluster setup scripts.

## 12. Reusable Checklist

- [ ] Vertical scaling options (larger instance, optimized indexes) exhausted first
- [ ] Distributed cluster utilizes Raft or Paxos consensus protocol
- [ ] Odd-numbered node topology (3, 5, 7) deployed to ensure write quorum
- [ ] Partition key has high cardinality (even data distribution)
- [ ] Mutual TLS (mTLS) active for all inter-node communication
- [ ] Replication rebalancing bandwidth throttled in cluster settings
- [ ] Database routing proxy layer abstracting cluster topology
- [ ] No cross-node joins exist in database query scripts
