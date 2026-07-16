# Scalability Review Checklist

## 1. Purpose
This checklist validates that database replication topologies, read replicas routing, partitioning bounds, and sharding layouts are optimized for horizontal scaling, preventing growth bottlenecks and high-traffic performance degradation. It should be run during system design reviews or scale upgrades.

## 2. Checklist

### Replication & Read Splitting
- [ ] Primary database routes writes; dedicated read replicas handle reporting queries.
- [ ] Application read-replica connections handle eventual consistency sync lag.
- [ ] Replication topology configured across multiple Availability Zones (multi-AZ).
- [ ] Network bandwidth can support replication stream volumes during write spikes.

### Partitioning & Lifecycles
- [ ] Time-based tables (logs, audits, events) utilize range partitioning.
- [ ] Active query paths include partitioning keys in `WHERE` clauses to enable partition pruning.
- [ ] Data lifecycle scripts drop or archive expired partitions automatically.
- [ ] Tablespaces segregated (hot data on NVMe SSD, cold data on compressed storage).

### Sharding & Distributed Design
- [ ] Sharding keys selected based on high cardinality and even write distribution (e.g. `tenant_id`).
- [ ] Sharded tables keep dependent schemas co-located on the same physical nodes to allow local joins.
- [ ] Scattered network queries across shards are minimized (no cross-shard joins).
- [ ] Cross-region database replication uses asynchronous modes to protect write latency.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Replication](../06-scalability/replication-strategy.md)
- [Read Replicas](../06-scalability/read-replicas-strategy.md)
- Partitioning
- [Sharding](../03-schema-design/sharding-schema-design.md)
- [Distributed Databases](../06-scalability/distributed-databases-strategy.md)
- [Read-Write Splitting](../05-query-and-performance/read-write-splitting-optimization.md)

## 4. Sign-off Criteria
The scalability review passes when:
1. 100% of checklist boxes are verified.
2. Query performance profile confirms partition pruning is active for high-volume searches.
3. Multi-AZ replication failover tests complete in under 30 seconds.
4. Scale-simulation tests confirm sharding keys distribute writes evenly across node partitions.
