# Key-Value Database

## 1. Definition & Core Concepts

A Key-Value Database is a NoSQL database store that maps unique, searchable keys to arbitrary data payloads (values). Values are typically opaque strings, serialized objects, or structured data types (e.g., hashes, lists, sets).

Core pieces:
- **In-Memory Storage:** Storing dataset primarily in RAM (e.g., Redis, Memcached) to achieve sub-millisecond read and write latency.
- **Data Structures (Redis):** Native support for specialized memory types: Hashes, Lists, Sets, Sorted Sets (ZSET), HyperLogLogs, and Bitmaps.
- **Eviction Policies:** Algorithms that define which keys to delete when the database reaches maximum memory capacity (e.g., LRU - Least Recently Used, LFU - Least Frequently Used).
- **Persistence Mechanisms:** Techniques to save memory data to disk:
  - *RDB (Redis Database Snapshot):* Point-in-time snapshotting at set intervals.
  - *AOF (Append Only File):* Logging every write command to disk sequentially.

*(Boundary Note: Memory-cache library adapters, caching middleware configurations, and connection setup in application code belong in `backend-development/`. This document covers database-engine selection, memory parameters, persistence strategies, and command usage rules.)*

## 2. Why It Exists / What Problem It Solves

Relational and Document databases must read from disks and execute complex parse routines (joins, index lookups), which limits latency to milliseconds. Key-Value databases store data directly in memory and route queries using simple key lookups, enabling sub-millisecond execution times and supporting high-throughput workloads (like session stores, rate limiters, and real-time leaderboards) that would overwhelm traditional databases.

## 3. What Breaks in Production Without It (or When Misapplied)

- **OutOfMemory (OOM) Crashes:** Writing keys to memory without eviction policies or TTL bounds. The database consumes all host RAM and crashes.
- **Production Freezes from Blocking Commands:** Running O(N) blocking commands (e.g. `KEYS *`, `FLUSHALL`, `HGETALL` on massive tables) on a single-threaded engine (like Redis), freezing all application requests.
- **Silent Data Loss on Reboot:** Relying on in-memory databases for primary storage without configuring persistent disk synchronizations (RDB/AOF), resulting in data erasure on server crash.
- **Cache Stampede Cascades:** Hot keys expire simultaneously. Thousands of concurrent requests hit the primary database to recalculate the key, exhausting database connections and causing a cascading outage.

## 4. Best Practices

- **Always Configure Maxmemory Limits:** Define a strict maximum memory allocation limit (e.g. `maxmemory 2gb`) in the configuration files to prevent the database from exhausting server RAM.
- **Configure an Eviction Policy:** Set a clean eviction policy (e.g. `volatile-lru` or `allkeys-lru`) so the database drops older cached keys automatically when capacity limits are reached.
- **Default to Key Expirations (TTL):** Ensure every key write (except static configurations) includes an explicit TTL duration to prevent dead memory accumulation.
- **Rename or Disable Dangerous Commands:** Rename administrative commands (e.g. `KEYS`, `FLUSHALL`, `SHUTDOWN`, `CONFIG`) in the configuration to prevent developers or attackers from running blocking operations in production.
- **Use Hashes for Object Storage:** Use native hash structures (`HSET`) instead of serializing entire JSON strings, allowing fields to be updated individually without rewriting the entire payload.

## 5. Common Mistakes / Anti-Patterns

- **Treating Cache as Primary Database:** Storing critical, non-reconstructible financial or audit logs in ephemeral databases without persistent write confirmation.
- **Using `KEYS` for Pattern Matching:** Querying `KEYS prefix:*` to search databases in production. Use `SCAN` instead, which parses keys incrementally without blocking execution.
- **Large Value Payloads:** Storing files or objects larger than 1MB in values, which degrades network throughput and CPU performance of single-threaded engines.
- **No Connection Pooling:** Opening and closing client connections for every key lookup instead of using a connection pool.

## 6. Security Considerations

- **Strict Network Isolation:** Key-value databases (especially Redis) optimize for performance and have minimal default access controls. Never expose ports (e.g. `6379`) to the public internet; place databases inside private VPC subnets.
- **Enforce Command Authentication:** Configure robust passwords (`requirepass` or ACL users) and encrypt client traffic using TLS (`rediss://`).

## 7. Performance Considerations

- **Single-Threaded Limitations:** Redis is single-threaded. Avoid running complex transactions or Lua scripts that execute slowly.
- **Pipelining:** Use pipelining clients to batch multiple operations into a single network packet, saving round-trip network latency.

## 8. Scalability Considerations

- **Sentinel vs. Cluster:**
  - *Redis Sentinel:* Provides high availability via automatic primary failover in Active-Passive setups.
  - *Redis Cluster:* Scales write and storage capacities horizontally by partitioning keys across 16,384 hash slots distributed across multiple nodes.

## 9. How Major Companies Implement It

- **Stripe:** Uses Redis clusters for rate limiting. They execute highly optimized Lua scripts inside Redis to decrement token buckets atomically, managing millions of requests per minute with minimal latency.
- **Netflix:** Relies on memcached-based architectures (EVCache) to store user recommendation metadata and playback histories, serving highly cached catalog files at regional edges.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Key-Value Databases (Redis, Memcached)** when:
  - Sub-millisecond response latency is critical (caching, sessions).
  - Data consists of key-based lookups with simple structures.
  - You need specialized structures like Rate Limiters, pub/sub messaging, queues, or leaderboards.
- Use **Alternative Databases** when:
  - Complex SQL joins, aggregations, or multi-row transactions are required.
  - Storage volume exceeds cost-effective RAM pricing tiers.
  - Data must remain highly persistent with zero loss tolerance.

## 11. AI Coding-Agent Implementation Guidelines

- Always specify an explicit TTL (Time-To-Live) parameter when writing keys.
- Never write code that executes blocking commands (`KEYS *`, `FLUSHALL`, `SMEMBERS` on large sets) in production paths. Use `SCAN` instead.
- Always retrieve only required fields using hash commands (`HGET`, `HMGET`) rather than downloading complete serialized JSON values.
- Never use key-value stores for primary data persistence unless write replication and disk sync (AOF/RDB) are explicitly configured.
- Always configure client libraries to use connection pooling and TLS endpoints.

## 12. Reusable Checklist

- [ ] Maxmemory limit configured in database properties
- [ ] Eviction policy (e.g., `allkeys-lru`) active
- [ ] Explicit TTL set on all dynamic write commands
- [ ] Dangerous commands (`KEYS`, `FLUSHALL`, `CONFIG`) disabled or renamed in config
- [ ] Database ports isolated inside private VPC subnets (not publicly accessible)
- [ ] Password authentication (`requirepass` or ACLs) and TLS active
- [ ] Scanning operations use incremental cursors (`SCAN`, `HSCAN`) instead of blocking calls
- [ ] Objects stored using Hashes (`HSET`) rather than serialized JSON strings where possible
- [ ] Connection pool limits set on the client library settings
