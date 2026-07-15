# Wide-Column Database

## 1. Definition & Core Concepts

A Wide-Column Store (or Column-Family Database) is a distributed NoSQL database that stores data in dynamic, multi-dimensional tables where columns are grouped into column families and stored physically by column rather than row.

Core pieces:
- **Distributed Hash Ring:** A masterless architecture (used by Cassandra/ScyllaDB) where data is partitioned and distributed across a peer-to-peer ring of nodes using consistent hashing.
- **Partition Key & Clustering Key:** The primary key is split:
  - *Partition Key:* Determines which node in the distributed ring stores the data.
  - *Clustering Key:* Determines the physical sorting order of rows *within* a partition on disk.
- **SSTables (Sorted String Tables):** Immutable files written to disk containing sorted rows.
- **MemTable & Commit Log:** Writes are recorded sequentially in a commit log (for durability) and written to an in-memory MemTable. When the MemTable fills, it flushes to disk as an immutable SSTable.
- **Compaction:** The background process of merging multiple SSTables, resolving updates, and purging deleted records.

*(Boundary Note: Client driver load-balancing settings, connection retry helper classes, and application-level pagination helpers are out of scope. This document covers database selection, physical partitioning keys, compaction strategies, and query limits.)*

## 2. Why It Exists / What Problem It Solves

Relational databases rely on a single primary node for transactions, which bottlenecks write scalability. Wide-column databases are designed for petabyte-scale data and massive write volumes (e.g. IoT telemetry, ad clicks). Their masterless, peer-to-peer structure allows adding nodes to scale write throughput and storage capacity linearly, with zero single points of failure.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Cluster Meltdown via ALLOW FILTERING:** Executing queries that search across non-partition keys in CQL (Cassandra Query Language). The engine must query every node in the cluster (using `ALLOW FILTERING`), exhausting thread pools and causing timeout outages.
- **Data Hotspots (Node Starvation):** Selecting a partition key with low cardinality (e.g., `status` or `state`). All data routes to a single database node, exhausting its disk and CPU while the rest of the cluster sits idle.
- **Read Latency Spikes from Tombstone Accumulation:** Executing high-frequency deletes. Wide-column databases write "Tombstones" to mark data as deleted rather than immediately removing it. Reading data requires parsing thousands of tombstones, leading to massive memory usage and read failures.
- **Compaction Disk Exhaustion:** Compaction requires temporary disk space. If a server's disk space exceeds 50% capacity, compaction processes fail, preventing the database from merging files and leading to performance degradation.

## 4. Best Practices

- **Enforce Query-Driven Design:** Design schemas strictly around your application's queries (one table per query type). Accept data duplication across tables to avoid joins (which do not exist).
- **Select Partition Keys with High Cardinality:** Ensure partition keys distribute data evenly across all cluster nodes (e.g., using `user_id` or `device_uuid` instead of `country_code`).
- **Use Clustering Keys for Physical Ordering:** Use clustering keys to keep related data sorted together on disk, allowing fast range queries within a partition (e.g. sorting logs by timestamp descending).
- **Set Up Tunable Consistency Levels:** Balance consistency and speed:
  - Use `LOCAL_QUORUM` for read/write consistency in multi-datacenter deployments.
  - Use `ONE` or `ANY` only for non-critical logging where speed is preferred over consistency.
- **Choose the Right Compaction Strategy:**
  - Use *SizeTieredCompactionStrategy* (STCS) for high-write, low-read workloads.
  - Use *LeveledCompactionStrategy* (LCS) for high-read, low-write workloads.
  - Use *TimeWindowCompactionStrategy* (TWCS) for time-series data with TTLs.

## 5. Common Mistakes / Anti-Patterns

- **Using Wide-Column as a Relational DB:** Trying to perform joins, multi-table transactions, or ad-hoc queries, which CQL does not support natively.
- **Deleting Data Frequently:** Running high-frequency delete statements, which generates excessive tombstones. Use TTLs instead.
- **Unbounded Partitions:** Allowing too many rows to accumulate within a single partition (e.g. storing all user events under a single `user_id` partition key over years). Keep partition sizes under 100MB.
- **Low Cardinality Keys:** Partitioning by keys that result in uneven distributions, causing hot nodes.

## 6. Security Considerations

- **Node-to-Node Encryption:** Enforce TLS encryption for inter-node communication (gossip protocol and data replication) to prevent packet sniffing inside database subnets.
- **CQL Parameter Injection:** Sanitize query variables at the boundary to prevent manipulation of CQL execution trees.

## 7. Performance Considerations

- **Write Path Speed:** Writes are append-only (Commit Log -> MemTable -> SSTable flush), which makes them extremely fast. Reads are slower because the database must check the Bloom filter, key cache, and potentially merge multiple SSTable files on disk to resolve the latest state of a row.

## 8. Scalability Considerations

- **Tunable CAP Theorem:** Wide-column stores are fundamentally AP (Available/Partition tolerant) systems. You can tune them to behave like CP (Consistent/Partition tolerant) systems by configuring consistency parameters (`Read Consistency + Write Consistency > Replication Factor`).

## 9. How Major Companies Implement It

- **Netflix:** Stores user viewing histories and movie metadata across massive Cassandra clusters deployed globally in an Active-Active multi-datacenter configuration.
- **Apple:** Operates thousands of Cassandra nodes to store and synchronize iCloud user settings, photos, and files, utilizing linear scaling capacity to handle billions of devices.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Wide-Column Databases (Cassandra, ScyllaDB, HBase)** when:
  - Write volume is extremely high (millions of writes/sec).
  - Dataset size exceeds the limits of single-primary relational databases (tens of terabytes to petabytes).
  - High availability is critical (zero downtime is a requirement).
  - You can design tables around specific, pre-determined queries.
- Use **Relational or Document Databases** when:
  - The application requires dynamic, ad-hoc queries and search filters.
  - Multi-table transactions and strict schema joins are required.
  - Datasets are small or medium-sized (<1TB).

## 11. AI Coding-Agent Implementation Guidelines

- Never write queries that require `ALLOW FILTERING` statements.
- Always define both Partition Keys and Clustering Keys in your DDL primary key declarations.
- Never write code that executes high-frequency DELETE statements — configure columns to use database-level TTLs instead.
- Always ensure partition sizes remain under 100MB by introducing synthetic bucketing keys (e.g. appending year/month to partition keys).
- Always use parameterized CQL statements.
- Never configure client connections without specifying a fallback retry policy.

## 12. Reusable Checklist

- [ ] Schema designed around specific, predefined queries (Query-Driven Design)
- [ ] Partition Keys have high cardinality, guaranteeing even node distribution
- [ ] Clustering Keys physically sort rows within partitions on disk
- [ ] No `ALLOW FILTERING` expressions used in any query code
- [ ] Deletes avoided; database-level TTLs used to expire data
- [ ] Partition sizes kept under 100MB via bucketing where required
- [ ] Consistency levels (e.g., `LOCAL_QUORUM`) configured matching write durability SLA
- [ ] Compaction strategy (STCS, LCS, TWCS) chosen based on read/write ratio
- [ ] Node-to-node and client-to-node TLS encryption active
