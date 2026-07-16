# Multi-Region Strategy

### 1. The Question Decided
"When do we scale our application deployment from a single region to multiple active regions, and how do we coordinate traffic?"

### 2. Options Compared
| Active Model | Single Region Active | Multi-Region Active-Passive | Multi-Region Active-Active |
|---|---|---|---|
| **Failover RTO** | Hours | Minutes | Seconds |
| **Data Consistency** | Absolute (local storage) | Eventual replication | Complex sync conflict resolution |
| **Cost factor** | 1x | 1.8x | 2.5x |

### 3. Decision Rule
- Deploy **Single Region Active** by default until the cost of downtime exceeds the secondary region provisioning cost.
- Adopt **Active-Passive** for strict consistency applications where database writes must be centralized.
- Adopt **Active-Active** for high-volume public interfaces where global latency must be < 100ms.

### 4. Red Flags to Revisit
- Latency loops caused by users routed to region B while their database transaction lock is held in region A.
- Write conflict loops in multi-active databases when concurrent updates happen on the same resource.

### 5. Where to Go Next
- For load balancers configuration and geo-routing policies, see [Distributed Systems Strategy](./distributed-systems-strategy.md).
