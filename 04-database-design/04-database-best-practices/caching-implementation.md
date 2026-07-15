# Caching (Database-Tier Caching)

## 1. Definition & Core Concepts

Database-Tier Caching refers to the memory allocation and indexing strategies used by database engines to keep frequently accessed data in RAM, avoiding slow disk I/O operations.

Core concepts:
- **Shared Buffers / InnoDB Buffer Pool:** The primary RAM block allocated by database engines (PostgreSQL `shared_buffers`, MySQL `innodb_buffer_pool_size`) to cache table pages and index pages.
- **Query Cache (Deprecated):** An engine-level feature that stored the raw results of SQL queries. (Deprecated in most modern engines due to global lock contention during writes).
- **Cache Invalidation:** The process of removing or updating cached database pages when mutations occur, ensuring data remains accurate.
- **Cache Warming:** Pre-loading critical indexes and table pages into database memory during startup or off-peak hours before production traffic hits.

*(Boundary Note: Application-side Redis caching middleware, ORM L2 cache configs, and frontend cache controls belong in `backend-development/`. This document covers database-native engine buffers, database query cache lockups, and database-level invalidation structures.)*

## 2. Why It Exists / What Problem It Solves

Reading data from physical disks (even NVMe SSDs) is significantly slower than reading from RAM. If every SELECT query forces the database to read files from disk, transaction latency spikes and disk I/O queues saturate. Database-tier caching configures the engine to store active tables and indexes in RAM, allowing queries to retrieve data in microseconds (Cache Hit) rather than milliseconds (Cache Miss).

## 3. What Breaks in Production Without It (or When Misapplied)

- **Disk I/O Saturation Outages:** Configuring database memory buffer allocations (e.g. `shared_buffers` or `innodb_buffer_pool_size`) too low (e.g. default system settings). The database must read data from disk for almost every query, saturating disk I/O queues and causing database connections to hang.
- **Global Lockups from Query Caches:** Enabling SQL Query Caches in high-write environments. Every write to a table invalidates all cached queries for that table, forcing global lock contentions that freeze all concurrent SELECT queries.
- **Cold Boot Performance Degradation:** Restarting a database server during peak hours. Because the memory buffers are empty (cold cache), initial queries must read from disk, slowing performance and causing API timeouts until the cache warms up.
- **Out of Memory (OOM) Crashes:** Allocating too much memory to the database buffer pool, leaving no RAM for OS processes or client connection threads, causing the OS to terminate the database.

## 4. Best Practices

- **Allocate 25% to 80% of RAM to Buffer Pools:**
  - In *PostgreSQL*, set `shared_buffers` to roughly 25% of total system RAM (leaving the rest for the OS page cache).
  - In *MySQL (InnoDB)*, set `innodb_buffer_pool_size` to 50% - 80% of total system RAM.
- **Disable SQL Query Caches:** Ensure engine-level query caching is disabled in write-heavy OLTP databases to prevent lock contention. Use application caching instead.
- **Implement Cache Warming Scripts:** Configure database startup scripts to pre-warm the cache by running dummy queries that load critical indexes and configuration tables into memory.
- **Index for Cache Hit Optimization:** Design indexes so that frequently queried data blocks fit entirely in memory, avoiding disk reads.
- **Monitor Cache Hit Ratios:** Continuously track the database cache hit ratio ($Hit\ Ratio = Reads\ from\ Cache / Total\ Reads$). Target a ratio of >99% for operational OLTP databases.

## 5. Common Mistakes / Anti-Patterns

- **Default Memory Configurations:** Running database servers in production using default installation memory settings (which are typically low for safety).
- **Enabling Deprecated Query Caching:** Bypassing warnings and enabling query caches on high-write databases.
- **OOM Over-Allocation:** Allocating 90% of system memory directly to the database buffer pool, leaving no RAM for OS kernel execution.
- **Ignoring the OS Page Cache:** Failing to leave enough free system RAM for the operating system to cache index files on disk.

## 6. Security Considerations

- **Memory Scraping Prevention:** Ensure database host memory is isolated. If attackers exploit host vulnerabilities, they can read sensitive data directly from unencrypted memory buffers. Apply host-level kernel isolation patches.

## 7. Performance Considerations

- **Cache Hit vs Cache Miss Latency:**
  - *Cache Hit (RAM):* < 0.1 milliseconds.
  - *Cache Miss (Disk):* 1 - 10 milliseconds.
  Configure memory settings to maximize cache hits on hot tables.

## 8. Scalability Considerations

- **Horizontal Read Cache Scaling:** Deploy read replicas. Replicas maintain their own memory buffer pools, allowing you to scale overall system cache capacity horizontally.

## 9. How Major Companies Implement It

- **Stripe:** Optimizes PostgreSQL memory buffers, configuring `shared_buffers` to keep hot payment ledgers in RAM and monitoring buffer pools to prevent disk lookups.
- **Netflix:** Uses automated cache warming routines during database failover rollouts to pre-populate replica buffers before routing production traffic.

## 10. Decision Checklist (Buffer Sizing Framework)

Set memory buffer allocations based on server resources:

- Use **25% System RAM (shared_buffers)** when:
  - Operating PostgreSQL, allowing the OS Page Cache to handle the remaining memory allocation.
- Use **70% - 80% System RAM (innodb_buffer_pool_size)** when:
  - Operating MySQL InnoDB, which manages its own memory caching.
- Never use **Engine-Level Query Caching** on:
  - Operational OLTP databases with write-heavy workloads.

## 11. AI Coding-Agent Implementation Guidelines

- Always check database configuration files for custom memory buffer settings (`shared_buffers` or `innodb_buffer_pool_size`).
- Never recommend enabling deprecated query caches in MySQL/PostgreSQL.
- Always recommend index structures that optimize memory buffer cache hit ratios.
- Never allocate more than 80% of system RAM directly to database buffers.
- Always include cache warming strategies in database maintenance runbooks.

## 12. Reusable Checklist

- [ ] Database memory buffers (`shared_buffers` / `innodb_buffer_pool_size`) configured based on RAM allocation rules
- [ ] Engine-level SQL Query Cache disabled (prevents lock contention)
- [ ] Cache Hit Ratio monitored and target set to >99%
- [ ] Active indexes size fits within database RAM allocation
- [ ] OS Page Cache allocated sufficient free RAM (20% - 50%)
- [ ] Cache warming scripts active for database startup
- [ ] Read replicas deployed to scale cache memory capacity horizontally
- [ ] No volatile staging tables polluting the main transactional buffer pool
