# Sharding (Scaling Strategy & Trade-offs)

## 1. Definition & Core Concepts

Sharding as a scaling strategy is the architectural practice of scaling database write and storage capacities horizontally by distributing data partitions across a shared-nothing network of independent database server nodes.

Core sharding concepts:
- **Consistent Hashing:** An algorithm that maps shard keys to a virtual ring of partition slots, ensuring that adding or removing a shard node requires moving only a minimal fraction of data across the network ($1/N$ of keys).
- **Shard Routing Proxy:** A stateless middleware layer (e.g. Vitess, ProxySQL, or custom routers) that maintains a shard metadata catalog, parsing incoming SQL queries and directing them to the target shard nodes.
- **Resharding (Rebalancing):** The process of splitting an existing, overloaded shard into two or more new shards, migrating data partitions across the network.
- **Cross-Shard Transactions (Distributed commits):** Transactions that update rows on multiple physical shards, requiring distributed lock managers and two-phase commit protocols (2PC).

*(Boundary Note: Schema-level composite keys DDL, lookup table schemas, and foreign key limitations are covered in `03-schema-design/`. This document covers consistent hashing rings, resharding operational load, routing layers, and cross-shard latency.)*

## 2. Why It Exists / What Problem It Solves

Single database servers have physical ceilings for write throughput. When a database exhausts SSD write IOPS and CPU transaction capacity, the only way to scale is horizontally. Sharding divides write workloads across a cluster of servers. By routing queries using a high-cardinality shard key (e.g., `workspace_id`), write operations run in parallel across nodes, allowing the data layer to scale capacity.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Resharding Outages (Rebalance Storms):** A shard node runs out of disk space. A developer adds a new shard node to split the load. The database automatically begins migrating terabytes of data across the network. The transfer saturates the network cards of both nodes, causing active API transactions to fail and taking the system offline.
- **Distributed Lock Deadlocks (2PC Latency):** Executing queries that perform transactional writes across different shards (e.g. transfer money between user accounts stored on separate nodes). The system must run Two-Phase Commit (2PC) blocks, keeping network locks open. If the network drops mid-commit, the database locks rows indefinitely, freezing writes.
- **Router Metadata Drift:** The routing proxy's shard mapping catalog falls out of sync with the physical partition layout, routing writes to incorrect nodes, leading to data divergence.
- **Pre-mature Sharding Complexity:** Sharding a small database (<1TB) too early, adding significant operational complexity with no performance benefit.

## 4. Best Practices

- **Use Consistent Hashing Rings:** Deploy consistent hashing algorithms to allocate shard partitions, minimizing the network overhead of redistributing data when nodes are added.
- **Limit Cross-Shard Transactions:** Structure schemas and routing keys to ensure that 99% of transactions run on a single shard. Use asynchronous compensation events (Sagas) rather than synchronous 2PC for cross-shard updates.
- **Throtle Resharding Traffic:** When resharding or splitting shards in production, configure strict rate limits (e.g., limit data transfer speeds to 50MB/s) to ensure migration traffic does not saturate database disks or network bandwidth.
- **Deploy Redundant Routing Proxies:** Run multiple stateless routing proxy instances behind a load balancer to ensure high availability of the query entry path.
- **Perform Resharding with Dynamic Replication:** Split shards by setting up a replica node for the target shard, letting it sync via standard replication, and then promoting it with minimal write lock windows.

## 5. Common Mistakes / Anti-Patterns

- **Sharding Prematurely:** Implementing sharding for small databases that could scale vertically on a single managed SQL server.
- **Uneven Shard Distribution (Low-Selectivity Keys):** Sharding on columns like `status` or `country`, causing write hotspots on single nodes.
- **Synchronous Cross-Shard Joins:** Joining tables sharded on different keys, forcing the routing proxy to perform slow in-memory merges of datasets pulled over the network.
- **No Resharding Plan:** Deploying sharding without verifying how the database will split shards when storage capacity limits are reached.

## 6. Security Considerations

- **Shard Subnet Isolation:** Place all individual shard database nodes inside private, isolated subnets. Block all direct network access to shard nodes, allowing connections only from the authorized routing proxies.

## 7. Performance Considerations

- **Scatter-Gather Latency Cost:** Queries that omit the shard key must query all shards. The query latency scales with the slowest responding node in the cluster. Ensure all operational query paths filter on the shard key.

## 8. Scalability Considerations

- **CAP Theorem Boundaries:** Sharded systems must balance consistency and availability during network partition events. Ensure routing proxies are configured to reject writes on partitioned shards to prevent data divergence (CP configuration) if consistency is the priority.

## 9. How Major Companies Implement It

- **Slack:** Shards database clusters by workspace ID. Because workspaces are independent, queries run locally on single database shards with zero cross-shard join overhead.
- **Uber:** Developed Vitess to shard MySQL database systems, scaling write transactions horizontally by abstracting routing logic using stateless proxies.

## 10. Decision Checklist (Sharding Operational Framework)

Audit sharding scalability using the following:

- Shard the **Database** when:
  - Database write volume exceeds the capacity of the largest vertically scaled primary server.
  - Data storage size exceeds 2TB and continues to grow.
  - Core tables can be partitioned around a clean, high-cardinality routing key.
- Keep a **Single Database Instance** when:
  - The dataset size is small (<1TB) and writes can scale vertically.
  - Queries require complex, ad-hoc joins across all tables.
  - Financial transactions require synchronous ACID guarantees across all entities.

## 11. AI Coding-Agent Implementation Guidelines

- Never recommend sharding if the database size is estimated to stay under 1TB.
- Always recommend consistent hashing algorithms for distributed shard key routing.
- Never write DML statements that execute synchronous cross-shard transactions — recommend event-driven Sagas.
- Always place shard database nodes inside private subnets, allowing access only via routing proxies.
- Always configure rate-limiting parameters for resharding and rebalancing scripts.

## 12. Reusable Checklist

- [ ] Database write volume or size (>2TB) justifies sharding
- [ ] Consistent hashing algorithm configured for shard partition routing
- [ ] Related tables sharded on the same key to enable local joins
- [ ] Routing proxy layer deployed behind load balancers (high availability)
- [ ] Resharding rate limits (bandwidth throttling) configured in cluster settings
- [ ] Shard nodes isolated inside private subnets (no direct public access)
- [ ] Cross-shard transactions replaced with asynchronous event-driven patterns (Sagas)
- [ ] All operational queries filter on the shard key to prevent scatter-gather scans
