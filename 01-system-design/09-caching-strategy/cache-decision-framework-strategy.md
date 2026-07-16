# Cache Decision Framework

### 1. The Question Decided
"What is the overall structured decision path used to select caching layers, invalidation patterns, and write strategies across all application domains?"

### 2. Options Compared
| Criteria / Context | Cache-Aside (Lazy) | Write-Through | Write-Back (Deferred) |
|---|---|---|---|
| **Read-Heavy Catalog** | Best Match | Fair | Poor |
| **Consistent Inventory**| Fair | Best Match | Poor |
| **High Write Telemetry** | Poor | Poor | Best Match |

### 3. Decision Rule
- **Follow the caching choice logic tree:**
  - *If* read-heavy and eventual consistency is acceptable, *then* select **Cache-Aside** with standard TTL invalidation.
  - *If* transactional read consistency is critical, *then* select **Write-Through** synchronous cache writes.
  - *If* write throughput is extreme and data loss is acceptable, *then* select **Write-Back** deferred writing.

### 4. Red Flags to Revisit
- The caching tier causes frequent outages due to cache stampedes where expired keys force database query queues to collapse.
- Caching implementation overhead delays feature deliveries due to overly complex synchronization schemes.

### 5. Where to Go Next
- For the master resource on setting up, configuring, and writing caching logic in production, see [Caching Architecture & Practice](../../04-database-design/04-database-best-practices/caching-implementation.md).
- For database-level caching optimizations, see [Database Caching Design](../../04-database-design/04-database-best-practices/caching-implementation.md) (once built).
