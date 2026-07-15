# Cache-Aside Strategy

### 1. The Question Decided
"Should the application manage caching logic using Cache-Aside (Lazy Loading) patterns, and how do we coordinate cache updates on database mutations?"

### 2. Options Compared
| Dimension | Cache-Aside (Lazy Load) | Write-Through (Inline Cache) | Write-Back (Deferred Write) |
|---|---|---|---|
| **Write Latency** | Low (Writes to DB only) | High (Writes to DB + Cache) | Extremely Low (Writes to Cache only) |
| **Complexity** | Low (Application managed) | High (Requires database plugin) | Very High (Write queue buffer needed) |
| **Stale Data Risk**| High (Eviction updates needed) | Low | High (Loss on crash) |
| **Cache Miss Penalty**| Yes (Requires fallback DB read) | No | No |

### 3. Decision Rule
- **Choose Cache-Aside if:** Read volume is significantly higher than write volume, the application can tolerate occasional stale reads, and simple, application-level caching control is preferred.
- **Avoid Cache-Aside if:** Strong, immediate data consistency is required across all reads.

### 4. Red Flags to Revisit
- The database experiences query peaks (cache stampede/thundering herd) because popular keys expire simultaneously, forcing multiple threads to read the DB.
- Application code becomes complex because cache invalidation steps are scattered across multiple controller write routes.

### 5. Where to Go Next
- For implementation code shapes of lazy loading queries, cache lookups, and SQL fallbacks, see [Caching Implementation Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/01-caching-implementation.md).
