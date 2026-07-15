# Write-Through Caching Strategy

### 1. The Question Decided
"Should the database/application layer write data synchronously to both the caching tier and primary data store (Write-Through), and what write latency is accepted?"

### 2. Options Compared
| Dimension | Write-Through | Cache-Aside (Lazy Load) | Write-Back (Deferred) |
|---|---|---|---|
| **Write Latency** | High | Low | Extremely Low |
| **Data Consistency**| Very High (Cache always fresh) | Medium (Stale until evicted) | Low (Temporary drift) |
| **Complexity** | High | Low | Very High |
| **Safety** | High (No loss on crash) | High | Low (Loss on cache crash) |

### 3. Decision Rule
- **Choose Write-Through if:** Fresh read data consistency is critical for newly written rows, write QPS is low to moderate, and we want to avoid query delays (cache misses) on first reads.
- **Avoid Write-Through if:** The application is highly write-heavy, where blocking writes to verify cache updates slows system throughput.

### 4. Red Flags to Revisit
- Write API request times increase because the server must wait for both the network database commit and the caching node write before returning.
- Cache memory is filled with cold, rarely read records because every write is automatically pushed to the cache.

### 5. Where to Go Next
- For configuring cache adapters and sync writing policies, see [Caching Architecture & Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/01-caching-implementation.md).
