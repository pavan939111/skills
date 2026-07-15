# Distributed Databases

## 1. Definition & Core Concepts

A Distributed Database is a database system where data is stored across multiple physical nodes (servers) located in different racks, availability zones, or regions, presenting a single logical database view to the application.

Core distributed concepts:
- **NewSQL / Distributed SQL:** Modern relational databases (e.g., CockroachDB, YugabyteDB, Google Spanner) that scale writes horizontally like NoSQL while preserving ACID transactions and SQL query compatibility.
- **Consensus Replication:** Protocols (Raft, Paxos) that require a majority of nodes (quorum) to agree on a write before committing, preventing data loss and split-brain scenarios.
- **TrueTime / Atomic Clocks:** Hardware-backed synchronization systems (used by Google Spanner) that bound clock drift to a few microseconds, enabling globally consistent distributed transactions.
- **Replication Factor (RF):** The number of physical copies of data stored in the cluster (typically RF=3 or RF=5 to allow majority quorum).
- **Logical Clocks (Hybrid Logical Clocks - HLC):** Software-based clock synchronization algorithms that track the order of events across nodes when hardware clocks drift.

*(Boundary Note: Code-level distributed transaction libraries, RPC network client settings, and load-balancer configurations belong in networking and `backend-development/` books. This document covers distributed SQL engines, consensus quorum, clock synchronization, and replication factors.)*

## 2. Why It Exists / What Problem It Solves

Traditional relational databases require manual sharding at the application layer to scale writes horizontally. Sharding introduces complex query routing, prevents cross-shard joins, and breaks multi-table transactions. Distributed databases build horizontal scaling and consensus replication directly into the database engine catalog. They automate data partitioning, shard routing, and transactions across nodes, providing infinite horizontal scaling with SQL safety.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Write Blockages from Clock Drift:** In distributed databases like CockroachDB that rely on synchronized node clocks. If NTP (Network Time Protocol) clock drift between servers exceeds a threshold (e.g., >500ms), the database blocks write transactions on the out-of-sync nodes to prevent data corruption.
- **Consensus Latency Outages:** Placing distributed nodes in high-latency network zones (e.g., distributing a 3-node cluster across US, Europe, and Asia). Every write transaction requires a consensus round-trip between nodes, slowing write latency to hundreds of milliseconds.
- **Quorum Loss Shutdowns:** Deploying a 3-node cluster with a replication factor of 3. If two nodes crash simultaneously, the cluster loses majority quorum (only 1 node left), blocking all write transactions to protect consistency.
- **Distributed Query Planning Failures:** Queries executing joins on large, un-co-located tables across nodes, forcing massive data transfers over the network, saturating switch cards.

## 4. Best Practices

- **Enforce Strict NTP Synchronization:** Configure all cluster nodes to sync system clocks using high-quality NTP pools (e.g., chrony daemon) with low drift thresholds.
- **Deploy Odd-Numbered Nodes for Quorum:** Always deploy clusters in odd-numbered node configurations (3, 5, 7) to ensure a majority tiebreaker is available during consensus votes.
- **Minimize Network Distance for Consensus Nodes:** Place the majority of consensus nodes in close network proximity (e.g., different Availability Zones within the same region) to keep write round-trips under 5ms, using remote regions solely for passive disaster recovery replicas.
- **Use Co-Location Schema Declarations:** Configure table schemas to store parent-child rows together on the same physical shard node (e.g., using `INTERLEAVE IN PARENT` syntax in Spanner) to eliminate network hops during joins.
- **Monitor the Replication Factor:** Ensure RF=3 is the default minimum for production clusters, upgrading to RF=5 for high-availability systems that must survive concurrent node failures.

## 5. Common Mistakes / Anti-Patterns

- **High-Latency Cluster Layouts:** Spanning consensus nodes across continents for low-volume CRUD applications, bottlenecking write performance.
- **Even Node Counts:** Deploying a 4-node cluster. If a network partition splits it 2-2, neither side can reach a majority (requires 3 votes), taking the entire cluster offline.
- **Assuming Zero Latency Penalty:** Expecting distributed SQL writes to perform as fast as single-node local PostgreSQL writes. Consensus round-trips add a latency penalty to every write.
- **No Clock Drift Alerts:** Failing to configure system alerts for NTP daemon failures, leading to unexpected database node shutdowns.

## 6. Security Considerations

- **Secure Node Join Certificates:** Enforce PKI-based authentication for cluster membership. Require new nodes to present cryptographically signed TLS certificates to join the distributed network, preventing rogue nodes from joining and reading data.

## 7. Performance Considerations

- **Write Latency vs Read Latency:** Reads in distributed SQL databases are fast because they can be served by local leaseholders. Writes are slower because they require a network round-trip to achieve consensus quorum.

## 8. Scalability Considerations

- **Elastic Scale-Out:** Distributed SQL databases scale horizontally by adding nodes. The engine automatically splits data partitions (ranges) and migrates them to the new node in the background, balancing storage.

## 9. How Major Companies Implement It

- **Google:** Developed Spanner, utilizing GPS receivers and atomic clocks installed in data centers to achieve globally consistent distributed transactions at scale.
- **Financial Services (Neobanks):** Deploy CockroachDB clusters across multiple availability zones to handle ledger transactions, ensuring high availability with strict ACID correctness.

## 10. Decision Checklist (Distributed Database Sizing)

Choose the distributed model:

- Use **Distributed SQL (CockroachDB, YugabyteDB, Spanner)** when:
  - Database write volume and storage size exceed single-node limits.
  - Strict ACID transaction consistency across multiple tables is a requirement.
  - The business requires zero data loss failovers (RPO = 0) and high availability (RTO < seconds).
- Use **Traditional Relational (PostgreSQL, MySQL)** when:
  - The dataset size is small (<1TB) and writes can scale vertically.
  - Sub-millisecond write latency is required (bypasses consensus round-trips).
- Use **Distributed NoSQL (Cassandra, DynamoDB)** when:
  - Write volume is extremely high, and immediate consistency can be traded for eventual consistency (BASE model).

## 11. AI Coding-Agent Implementation Guidelines

- Always recommend odd-numbered node configurations (3, 5, 7) for distributed database clusters.
- Never write DDL schemas for distributed SQL that join large tables without defining co-location rules.
- Always include NTP clock synchronization validation checks in database deployment playbooks.
- Never deploy distributed database clusters without enabling PKI certificate authentication for node membership.
- Always specify a replication factor of at least 3 for production clusters.

## 12. Reusable Checklist

- [ ] Cluster node count is odd-numbered (3, 5, 7) to ensure majority quorum
- [ ] Replication factor set to at least 3 for production datasets
- [ ] NTP daemon (chrony) active and clock drift alerts configured (<500ms threshold)
- [ ] Consensus nodes placed in low-latency network ranges (same region, different AZs)
- [ ] Node membership authenticated via mutual TLS (mTLS) certificates
- [ ] Schema designs use co-location declarations to prevent cross-node network joins
- [ ] Inter-node gossip and consensus traffic isolated on private subnets
- [ ] Client applications designed to handle consensus write latency profiles
