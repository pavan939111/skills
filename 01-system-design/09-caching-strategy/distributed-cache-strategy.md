# Distributed Cache Strategy

### 1. The Question Decided
"Should caching resources be partitioned across an isolated distributed cache cluster, and what hashing/partitioning patterns prevent hotspot cache nodes?"

### 2. Options Compared
| Dimension | Single Caching Instance | Client-Side Sharded Cache | Distributed Cluster (Redis Cluster) |
|---|---|---|---|
| **Cost** | Low | Medium | High |
| **Availability** | Low (SPOF) | Medium | High (Master-replica failover) |
| **Complexity** | Low | Medium (Client must hash keys) | High (Consensus, slots mapping) |
| **Scale Ceiling** | Low (Limited to single RAM) | High | Very High (Scale RAM out) |

### 3. Decision Rule
- **Choose Distributed Cluster if:** The aggregate cache size exceeds single-node RAM capacities (e.g. >100GB of active session data) or the cache is a single point of failure (SPOF) requiring automated replication and failover.
- **Choose Single Instance if:** Caching workloads are small (<10GB) and node crashes do not break application business states.

### 4. Red Flags to Revisit
- A single node in the caching cluster crashes due to a "hot key" (e.g. popular product metadata) receiving too much read traffic, causing a cascading failure.
- Partition key changes break hash ring distributions, forcing a full cluster rebuild.

### 5. Where to Go Next
- For configuring Redis Cluster slot assignments and master-standby topologies, see [Caching Architecture & Implementation](../../04-database-design/04-database-best-practices/caching-implementation.md).
