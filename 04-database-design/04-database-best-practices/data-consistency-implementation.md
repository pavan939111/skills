# Data Consistency

## 1. Definition & Core Concepts

Data Consistency defines the rules governing how updates to a database are made visible to readers, determining the degree of synchronization across database nodes.

Core consistency models:
- **Strong Consistency (Linearizability):** Guarantees that once a write completes, all subsequent reads from any node will return the new value. Readers never see stale data.
- **Eventual Consistency:** A weak consistency model where updates propagate asynchronously across replica nodes. Nodes may be temporarily out of sync, but they will eventually converge to the same value (Replication Lag).
- **Read-Your-Writes Consistency:** A model guaranteeing that a user will always see their own updates, even if they are routed to an eventually consistent replica.
- **Causal Consistency:** Ensures that operations that are causally related are seen by every node in the same order (e.g. a comment reply must not appear before the parent comment).
- **Write Concern / Quorum:** In distributed systems, the number of nodes that must acknowledge a write before it is considered successful (e.g. `w:majority`).

*(Boundary Note: Code-level retry frameworks, client caching states, and application message queue routing are out of scope. This document covers database-level replication models, write concerns, read routing rules, and consistency boundaries.)*

## 2. Why It Exists / What Problem It Solves

Achieving strong consistency across distributed databases requires network locks and synchronization cycles, which limits write performance and availability. Eventual consistency allows databases to scale horizontally by processing writes locally and syncing replica nodes asynchronously. The goal is to define consistency boundaries based on business needs, ensuring transactional accuracy while maximizing system performance.

## 3. What Breaks in Production Without It

- **Stale Privilege Authorization Errors:** A user changes their password or updates their roles (e.g., changes status to "deactivated"). Because role checks read from an eventually consistent replica with high lag, the deactivated user can still access restricted endpoints for minutes.
- **Double-Spending under Replication Lag:** Routing balance verification reads to read replicas. If replica lag is 2 seconds, a user quickly executes two withdrawals. Both reads see the original balance because the first write has not replicated yet, letting the user withdraw more than they have.
- **Out-of-Order Feed Renders:** A user posts a message and then replies to it. Due to network partitioning or routing lag, a replica receives the reply before the main post, rendering the comment thread broken.
- **Lost Updates on Network Partitions:** A NoSQL database accepts writes on partition nodes without requiring quorum writes (`w:1`). When the network heals, conflicting writes overwrite each other, causing silent data loss.

## 4. Best Practices

- **Route Critical Reads to the Primary Node:** If an operation requires absolute, real-time correctness (e.g. checking account balances, processing billing, verifying credentials), always route the SELECT query to the primary write database. Never read this data from replicas.
- **Configure Read-Your-Writes for User Content:** Route user profile and dashboard reads to the primary node for a short duration after a write, or use sticky sessions, ensuring users see their own updates instantly.
- **Use Quorum Writes for Critical NoSQL Data:** In distributed NoSQL databases, configure write concerns to require a majority of nodes to acknowledge writes (e.g. `w:majority`, `LOCAL_QUORUM`) to prevent data loss.
- **Monitor Replication Lag continuously:** Configure alerting thresholds for replica synchronization lag. If lag exceeds a threshold (e.g., >5 seconds), automatically route traffic away from the stale replica.
- **Enforce Invariant Safety at the Primary:** Enforce domain rules (e.g. uniqueness, balance boundaries) on the primary write database using transactions and constraints, letting replicas handle read-only reporting workloads.

## 5. Common Mistakes / Anti-Patterns

- **Reading Balances from Replicas:** Routing billing check queries to eventually consistent read replicas to "reduce load on primary," leading to data inconsistencies.
- **Assuming Replicas are Instantly Synced:** Designing application features assuming replication is instantaneous, leading to race condition bugs.
- **Using w:1 in Distributed Environments:** Configuring NoSQL writes to return success after writing to a single node, risking data loss during node failures.
- **No Replication Lag Fallbacks:** Failing to handle replica lag in client application interfaces, confusing users with stale states.

## 6. Security Considerations

- **Credential Replications Lag:** Password changes and token revocations must propagate immediately. Design authorization systems to query the primary database when validating sensitive session state changes.

## 7. Performance Considerations

- **The Consistency vs. Latency Trade-off:** Strong consistency requires synchronous writes across multiple nodes (reducing write speed and availability). Eventual consistency allows fast local writes (increasing performance but permitting stale reads). Choose consistency settings matching data priority.

## 8. Scalability Considerations

- **Horizontal Read Scaling:** Eventual consistency allows scaling read capacity linearly by adding read replica nodes, as queries do not need to lock the primary database.

## 9. How Major Companies Implement It

- **Netflix:** Stores user movie recommendations and view history using eventual consistency (temporary stale states do not impact user experience), but uses strong consistency relational engines for subscription billing transactions.
- **Stripe:** Routes all merchant ledger calculations and payouts to the primary PostgreSQL database to guarantee strong consistency, utilizing replicas solely for read-only historical search queries.

## 10. Decision Checklist (Consistency Selection)

- Use **Strong Consistency (Primary Read Routing)** when:
  - Financial, billing, or ledger calculations are processed.
  - Authentication, password changes, and security permissions are validated.
  - The business cannot tolerate any stale data reads.
- Use **Eventual Consistency (Replica Read Routing)** when:
  - Scaling read throughput is the primary system bottleneck.
  - Temporary stale data reads are acceptable (e.g., social media feeds, catalog views).
  - High availability and low read latency are critical.

## 11. AI Coding-Agent Implementation Guidelines

- Always route critical transactional queries (billing, auth) to the primary database connection.
- Never write database configuration setups that use eventually consistent replicas for authorization checks.
- Always require majority write concerns (`LOCAL_QUORUM` / `w:majority`) in NoSQL cluster configurations.
- Never assume that a read replica is in sync with the primary database.
- Always implement monitoring loops to verify replication lag metrics.

## 12. Reusable Checklist

- [ ] Critical transactional reads (billing, auth) routed explicitly to the primary node
- [ ] Read replicas used only for read-tolerant queries (reports, catalogs)
- [ ] NoSQL write concern set to majority (`LOCAL_QUORUM` / `w:majority`)
- [ ] Replication lag monitored and alerts configured
- [ ] Read-Your-Writes consistency pattern implemented for user-created content updates
- [ ] System handles eventual consistency states in the client API response designs
- [ ] Password updates and token revocations query the primary database during validation
- [ ] Consistency choices align with the CAP theorem requirements of each domain
