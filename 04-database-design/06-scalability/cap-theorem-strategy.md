# CAP Theorem (PACELC & Distributed Trade-offs)

## 1. Definition & Core Concepts

The CAP Theorem states that a distributed data store can simultaneously guarantee at most two out of the following three properties:
- **Consistency (C):** Every read receives the most recent write or an error. (All nodes see the same data at the same time).
- **Availability (A):** Every non-failing node returns a non-error response without guarantee that it contains the most recent write. (System remains open for writes/reads).
- **Partition Tolerance (P):** The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes.

Core PACELC extension:
- **PACELC Theorem:** Extends CAP by defining trade-offs during normal operations: If there is a **P**artition, how does the system choose between **A**vailability and **C**onsistency; **E**lse (when the system is running normally), how does it choose between **L**atency and **C**onsistency?

*(Boundary Note: Code-level retry frameworks, client session caching, and application message queue routing belong in `backend-development/`. This document covers database-level CAP boundaries, PACELC parameters, and consistency/availability trade-offs.)*

## 2. Why It Exists / What Problem It Solves

Network partitions (network drops, hardware switches failing, fiber lines cut) are inevitable in distributed systems. When a partition occurs, some database nodes cannot communicate with others. A database must choose how to respond to client writes:
- *Accept the write on the partition node:* Prioritizes **Availability**, but causes **Inconsistency** as other nodes cannot see the write (AP System).
- *Reject the write:* Prioritizes **Consistency** at the cost of **Availability** (CP System).
The CAP and PACELC theorems define these physical boundaries, helping architects select databases based on business risk.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Double-Spending in AP Payment Ledgers:** Storing account balances in an AP database. During a network partition, Node A and Node B cannot communicate. A user withdraws their balance from Node A and Node B concurrently. Both nodes accept the write, resulting in double-spending because they cannot verify consistency.
- **Transactional Outages in CP Systems during Network Drops:** Operating a CP database (like CockroachDB). A network drop isolates a subset of database nodes. Because they cannot reach a majority quorum, the database rejects all writes, taking the checkout API offline.
- **High Read Latency on Normal Operations (PACELC Else-C):** Configuring a NoSQL database for strong consistency during normal operations. Every SELECT query must verify data state across multiple nodes, adding network latency to every read.

## 4. Best Practices

- **Choose CP for Financial & Identity Data:** Select Consistent/Partition Tolerant (CP) configurations for transactions where correctness is a strict requirement (e.g. payment ledger, user authentication).
- **Choose AP for Telemetry & User Feeds:** Select Available/Partition Tolerant (AP) configurations for high-volume logs, social media feeds, and shopping carts where uptime is more critical than real-time correctness.
- **Analyze PACELC "Else" Trade-offs:**
  - If latency is critical (e.g. real-time bidding), choose **PC/EC** (Latency over Consistency).
  - If data accuracy is critical, choose **PC/ES** (Consistency over Latency).
- **Design Client Code to Handle Write Failures:** In CP databases, ensure the client application handles write rejection errors gracefully, utilizing retry loops with exponential backoff.
- **Enforce Strict Tenant Routing in AP Stores:** When using AP databases, group data by partition keys (e.g., Workspace ID) to minimize the probability of cross-node consistency conflicts during partitions.

## 5. Common Mistakes / Anti-Patterns

- **Assuming "No Partition" Scenarios:** Designing systems assuming network connections are 100% reliable, leading to system lockups when network drops occur.
- **Using AP for Transaction Ledgers:** Choosing AP databases for transactional business domains to get "infinite write speed," resulting in data corruption.
- **Ignoring the PACELC Latency Penalty:** Configuring NoSQL databases to use global synchronous reads during normal operations, slowing down query speeds.
- **Assuming Databases are Static CAP Categories:** Believing a database is strictly CP or AP. Most databases (like MongoDB or Cassandra) are configurable: you can change their CAP behavior by adjusting read/write consistency settings (e.g. `w:majority` vs `w:1`).

## 6. Security Considerations

- **Authorization Replication Lag during Partitions:** During partition events, security permission updates (like token revocations) may fail to propagate to AP nodes. Design security checks to query CP databases to prevent access bypasses.

## 7. Performance Considerations

- **Network Quorum Latency:** Writing to CP databases requires achieving quorum, adding network round-trip latency to every write. Keep write-critical consensus nodes physically close to minimize latency.

## 8. Scalability Considerations

- **AP Scaling Advantages:** AP databases scale writes horizontally because individual nodes can accept writes independently without coordinating locks, maximizing throughput at the cost of consistency.

## 9. How Major Companies Implement It

- **Amazon:** Uses DynamoDB in an AP configuration for shopping cart databases. Amazon prioritizes availability (accepting sales even during network partitions), resolving conflicting cart versions in the application layer.
- **Google:** Designed Google Spanner as a CP database. To mitigate the availability penalty of CP systems, Google built private, highly redundant fiber network paths globally, making partition events rare.

## 10. Decision Checklist (CAP Selection Framework)

Select database configurations based on the following:

- Use **CP Database Configuration** when:
  - Data correctness is a strict requirement (billing, auth).
  - Stale reads or write skew anomalies cannot be tolerated.
  - Quorum-based write rejection is acceptable during network drops.
- Use **AP Database Configuration** when:
  - System uptime (availability) is the primary SLA priority (telemetry, feeds).
  - Data updates can propagate asynchronously (eventual consistency).
  - Business rules can resolve conflict anomalies in code.

## 11. AI Coding-Agent Implementation Guidelines

- Always default to CP database configurations for financial transactions, billing, and security models.
- Never write application queries that assume immediate consistency when reading from AP databases.
- Always implement client-side write retry policies with exponential backoff for CP systems.
- Never deploy distributed systems without defining the CAP and PACELC trade-off profiles of each service database.
- Always require majority write concerns for CP data validation paths.

## 12. Reusable Checklist

- [ ] CAP boundaries defined for each application business domain
- [ ] CP database configuration selected for transactional systems (billing, auth)
- [ ] AP database configuration selected for high-availability systems (telemetry, feeds)
- [ ] Client applications handle write rejection errors during partition events
- [ ] PACELC latency vs consistency trade-off configured for normal operations
- [ ] Odd-numbered node configurations deployed to ensure CP write quorum
- [ ] User authentication checks route to CP databases (preventing lag bypasses)
- [ ] Conflict resolution rules defined for AP database write paths
