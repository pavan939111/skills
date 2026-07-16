# Redis Caching Strategy

### 1. The Question Decided
"Should the system deploy Redis as a caching layer, and what memory constraints or eviction rules dictate its configuration?"

### 2. Options Compared
| Dimension | Redis (In-Memory Key-Value) | Memcached (Simple Multi-threaded Cache) | Local In-Memory Cache (e.g. Node cache) |
|---|---|---|---|
| **Cost (RAM)** | High | High | Low |
| **Data Types** | Rich (Strings, Lists, Sets, Hashes) | Simple Strings only | Language objects |
| **Persistence**| Supported (RDB/AOF) | None | Volatile |
| **Clustering** | High (Redis Cluster) | High (Client-side sharded) | Limited to single node |
| **Complexity** | Medium | Low | Low |

### 3. Decision Rule
- **Choose Redis if:** The application needs a high-performance cache supporting rich data structures (e.g. sorted sets for leaderboards, pub-sub messaging), session persistence, or distributed locks.
- **Choose Memcached if:** The cache only needs simple, static string key-value lookups and require high multi-threaded read concurrency.

### 4. Red Flags to Revisit
- Redis RAM limits are exhausted because the team stores raw logs or files in cache keys without setting Time-to-Live (TTL) values.
- Web nodes fail to fetch keys because Redis runs single-threaded, stalling under long-running Lua script queries.

### 5. Where to Go Next
- For configuring Redis clusters, write policies, connection pools, and cache tuning parameters, see [Caching Architecture Deep Dive](../../04-database-design/04-database-best-practices/caching-implementation.md).
- For database-level caching optimizations, see [Database Caching Design](../../04-database-design/04-database-best-practices/caching-implementation.md) (once built).
