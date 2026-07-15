# Cache Invalidation Strategy

### 1. The Question Decided
"How does the system invalidate stale cache records, and what patterns (Time-To-Live, active eviction, write-through sync) resolve the 'two hardest problems' in CS?"

### 2. Options Compared
| Invalidation Mode | Time-To-Live (TTL) | Active Eviction (Publish event) | Full Purge |
|---|---|---|---|
| **Data Consistency**| Medium (Stale until TTL expires) | High | High |
| **Complexity** | Low | High (Application hooks) | Low |
| **DB Load** | High (Periodic re-queries) | Low | High (Massive hit spike) |
| **Fail-Safe** | High (Will recover eventually) | Low (Missed events leave stale data) | High |

### 3. Decision Rule
- **Choose Time-To-Live (TTL) if:** Business rules can tolerate stale reads for a set period of time (e.g. product catalogs static for 5 minutes), providing a fail-safe backup.
- **Choose Active Eviction if:** Real-time data consistency is required across all reads, and we can configure transactional hooks (e.g., outbox events) to delete keys instantly on mutations.

### 4. Red Flags to Revisit
- Customers see outdated product descriptions indefinitely because write actions fail to publish cache deletion events.
- Cache nodes run out of memory because keys are created without TTL parameters, bypassing LRU cleanups.

### 5. Where to Go Next
- For implementing cache-aside invalidation blocks, evictions hooks, and dynamic TTL calculations, see [Caching Implementation Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/01-caching-implementation.md).
