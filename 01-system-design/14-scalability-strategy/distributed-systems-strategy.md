# Distributed Systems Strategy

### 1. The Question Decided
"Which distributed consensus models and transaction isolation boundaries manage state consistency across physically separated network nodes?"

### 2. Options Compared
| Dimension | Raft / Paxos (Consensus) | Two-Phase Commit (2PC) | Eventual Consistency (BASE) |
|---|---|---|---|
| **Cost (Latency)** | High (Consensus network roundtrips) | Very High (Locks held) | Low |
| **Throughput** | Medium | Low | Extremely High |
| **Consistency** | Strong (Within consensus group) | Strong (ACID across nodes) | Eventually consistent |
| **Complexity** | High | Very High | High |

### 3. Decision Rule
- **Choose Eventual Consistency if:** High write throughput and network partition availability (AP) are required, and the domain can tolerate transaction lag.
- **Choose Raft Consensus if:** Managing critical configuration mappings or master elections (e.g. Consul/ZooKeeper) requiring strong consistency (CP).

### 4. Red Flags to Revisit
- Application API handlers experience frequent timeouts because a network partition blocks database consensus loops.
- System write throughput collapses because two-phase commits hold locks on tables across multiple distributed databases.

### 5. Where to Go Next
- For distributed databases scaling, partitioning, and CAP boundaries, see [Distributed Databases Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/06-scalability/distributed-databases-strategy.md).
- For general scalability principles, see [Scalability Implementation Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/performance-and-scale/02-scalability.md).
