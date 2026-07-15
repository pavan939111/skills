# Write-Back Caching Strategy

### 1. The Question Decided
"Should writes be committed directly to volatile cache RAM only and queued for deferred background writing to SQL databases (Write-Back/Write-Behind), and what data loss risk is acceptable?"

### 2. Options Compared
| Dimension | Write-Back (Deferred) | Write-Through (Synchronous) | Cache-Aside |
|---|---|---|---|
| **Write Latency** | Extremely Low (<2ms) | High | Low |
| **Write Throughput**| Extremely High | Low-Medium | Medium |
| **Data Loss Risk**| High (Volatility window) | Zero | Zero |
| **Complexity** | Very High (Requires queue logic) | High | Low |

### 3. Decision Rule
- **Choose Write-Back if:** The system is subjected to massive, transient write bursts (e.g. game telemetry logging, page view tracking) where database write IOPS would be overwhelmed, and minor data loss on server crashes is acceptable.
- **Avoid Write-Back if:** Writing transactional records (e.g., wallet transfers, orders) where data loss on server crashes is unacceptable.

### 4. Red Flags to Revisit
- Data recovery audits fail because the cache node crashed before flushing the last 5 minutes of writes to disk, causing permanent loss of client logs.
- The write queue behind the cache stalls, creating a massive backlog that exhausts cache memory.

### 5. Where to Go Next
- For configuring write queues, flushing rules, and cache buffer pools, see [Caching Architecture & Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/data-and-messaging/01-caching-implementation.md).
