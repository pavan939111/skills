# Sharding Strategy

### 1. The Question Decided
"Should the database be sharded horizontally across multiple physical nodes, and how do we choose the sharding partition key?"

### 2. Options Compared
| Dimension | Single Database Node (No Sharding) | Horizontal Database Sharding | Distributed SQL (e.g. CockroachDB) |
|---|---|---|---|
| **Cost (Hosting)** | Low | High (Multiple database nodes) | High |
| **Write Throughput**| Capped by single node disk IOPS | Infinite (Distributed writes) | Infinite |
| **Complexity** | Low | Very High (Custom routing / mapping) | High |
| **Cross-Shard Joins**| Native SQL | Prohibited / Manual merge | Supported natively |

### 3. Decision Rule
- **Choose Single Node if:** Total database storage is $<1\text{TB}$ and write QPS fits on a single node with provisioned SSD volumes (<2,000 writes/second).
- **Choose Horizontal Sharding if:** Storage volumes or write throughput exceed single-instance ceilings, and data can be split cleanly using high-cardinality keys (like `tenant_id` or `user_id`).

### 4. Red Flags to Revisit
- Queries run extremely slow because the application frequently executes queries that span multiple shards (cross-shard joins).
- The shard key has low cardinality (e.g. `country_code`), leading to a "hot shard" that exhausts disk space while other shards remain empty.

### 5. Where to Go Next
- For sharding mechanics, hashing algorithms, and cluster rebalancing protocols, see [Sharding Design & Sizing](../../04-database-design/03-schema-design/sharding-schema-design.md).
- For database scaling tradeoffs, see Horizontal Database Scaling.
