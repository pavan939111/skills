# Replication

## 1. Definition & Core Concepts

Database Replication is the process of copying data changes from one database server (Primary) to one or more other servers (Replicas) to ensure data redundancy, high availability, and read scalability.

Core concepts:
- **Replication Modes:**
  - *Asynchronous:* The primary commits the transaction locally and returns success immediately. Logs are streamed to replicas in the background. (Fastest, but permits data loss during primary crashes).
  - *Synchronous:* The primary blocks the commit until all replicas acknowledge they have written the log. (Zero data loss, but slow writes and reduced availability).
  - *Semi-Synchronous:* The primary blocks the commit until at least one replica acknowledges receiving the log. (Balances performance and safety).
- **Logical vs. Physical Replication:**
  - *Physical (Streaming):* Shipping raw disk byte modifications (WAL blocks) directly. Fast and identical, but requires matching database versions and operating systems.
  - *Logical:* Shipping SQL-like data mutations (e.g. "insert row into table"). Allows replicating specific tables or syncing between different database versions.
- **Topologies:** Primary-Replica (Active-Passive), Multi-Primary (Active-Active), and Peer-to-Peer (Masterless).

*(Boundary Note: Code-level database connection switching, server-side failover load balancer setups, and infrastructure cloud networking belong in cloud and `backend-development/` books. This document covers database-level replication modes, replication logs, topologies, and sync latency.)*

## 2. Why It Exists / What Problem It Solves

If a database runs on a single physical server, it represents a single point of failure. If the hardware crashes, the application goes offline, and data may be lost. Replication solves this by maintaining real-time copies of the dataset across different physical locations (availability zones/regions), enabling instant failover (High Availability) and allowing read queries to scale horizontally across replica nodes.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Primary Write Lockups from Synchronous Lag:** Using synchronous replication over a high-latency network (e.g., cross-region replication). If one replica node experiences network lag, all write transactions on the primary block, taking the application offline.
- **Primary Disk Saturation from Stalled Replicas:** In PostgreSQL, using replication slots. If a replica disconnects for days, the primary database retains WAL files on disk waiting for the replica to reconnect, eventually saturating the primary's disk and crashing the server.
- **Split-Brain Write Conflicts:** In multi-primary (active-active) setups. During a network partition, both primary nodes accept writes for the same row. When the network heals, their states conflict, leading to data corruption or silent overwrites.
- **Complete Data Loss on Primary Crash:** Running asynchronous replication with zero backup nodes. When the primary disk fails, un-replicated commits are lost forever.

## 4. Best Practices

- **Use Asynchronous Replication for Performance:** Default to asynchronous replication to keep write latencies low and protect the primary node from network drops.
- **Configure Semi-Synchronous for Critical Data:** Use semi-synchronous replication for payment and ledger databases to ensure at least one standby replica has the transaction log before returning success.
- **Monitor replication slots and WAL sizes:** Set a maximum WAL size limit (e.g. `max_slot_wal_keep_size` in PostgreSQL) to force-drop disconnected replicas before they fill the primary's disk.
- **Automate Failover (Split-Brain Prevention):** Use quorum-based clustering orchestrators (like Patroni or Orchestrator) to handle failovers, ensuring a strict majority vote before promoting a replica to primary.
- **Use Logical Replication for Upgrades:** Use logical replication when migrating data between different database engine versions (e.g., PostgreSQL 12 to 16) to achieve near-zero downtime upgrades.

## 5. Common Mistakes / Anti-Patterns

- **Synchronous Replication Over WAN:** Configuring synchronous replication across distant geographical regions, causing slow write transactions.
- **No Replication Slot Monitoring:** Leaving replication slots unmonitored, allowing inactive slots to fill the primary disk.
- **Active-Active without Conflict Resolution:** Deploying multi-primary replication without defining deterministic conflict resolution rules (like Last-Write-Wins or CRDTs).
- **Ignoring Replica Indexing:** Failing to index columns on read replicas, causing them to fall behind the replication stream due to slow execution.

## 6. Security Considerations

- **Encrypt Replication Traffic:** Enforce TLS encryption for all replication traffic between nodes (gossip/log streaming) to prevent unauthorized interception of transaction data inside the VPC.

## 7. Performance Considerations

- **Log Serialization Overhead:** Physical streaming replication has lower CPU overhead than logical replication because it copies raw disk bytes directly, bypassing SQL parsing. Use physical replication for high-throughput primary-replica clusters.

## 8. Scalability Considerations

- **Linear Read Scaling:** Read capacity scales horizontally by adding read replicas. If read traffic increases, spin up new replicas in matching availability zones to distribute query loads.

## 9. How Major Companies Implement It

- **Stripe:** Uses physical streaming replication to synchronize active standby PostgreSQL nodes, ensuring sub-second failover targets with zero transaction ledger loss.
- **Netflix:** Deploys masterless peer-to-peer replication (Cassandra) globally, allowing users to write to local regional nodes while updates propagate asynchronously to other global nodes.

## 10. Decision Checklist (Replication Modes Selection)

Choose the replication mode:

- Use **Asynchronous Replication** when:
  - High write throughput and low latency are the primary requirements.
  - Minor data loss (milliseconds of updates) is acceptable during catastrophic primary failures.
  - Replicas are deployed across distant geographical regions (high WAN latency).
- Use **Semi-Synchronous Replication** when:
  - Transaction accuracy is critical (e.g., ledger balances, order records).
  - Standby replicas are in the same cloud region (low LAN latency).
  - You must guarantee zero data loss on primary failover.
- Never use **Synchronous Replication** across:
  - Distant geographic regions (high network latency).

## 11. AI Coding-Agent Implementation Guidelines

- Always default to asynchronous replication topologies for high-throughput database setups.
- Never allow replication configurations to run without configuring limits on maximum WAL retention sizes.
- Always recommend physical streaming replication instead of logical replication for high-speed primary-replica clusters.
- Never write multi-primary (active-active) configurations without specifying clear write-conflict resolution rules.
- Always configure TLS for inter-node replication connections.

## 12. Reusable Checklist

- [ ] Asynchronous replication selected for standard high-throughput databases
- [ ] Semi-synchronous replication configured for critical transactional data
- [ ] Maximum WAL retention size (`max_slot_wal_keep_size`) configured on replication slots
- [ ] Automated failover orchestrator (e.g., Patroni) configured with quorum voting
- [ ] Replication traffic encrypted via TLS between all nodes
- [ ] Read replicas used exclusively for read-only queries
- [ ] Replication lag monitored and alerts configured
- [ ] Multi-primary write conflict resolution rules explicitly defined
