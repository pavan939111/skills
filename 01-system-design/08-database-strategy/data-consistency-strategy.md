# Data Consistency Strategy

### 1. The Question Decided
"Which consistency model (Strong ACID vs. Eventual Consistency) is required for each system domain, and how do we handle data sync lag?"

### 2. Options Compared
| Dimension | Strong Consistency (ACID) | Eventual Consistency (BASE) |
|---|---|---|
| **Cost (Infrastructure)** | High (Locks, coordination) | Low |
| **Write Throughput** | Low (Blocking commits) | High |
| **Availability (Partition)**| Low (Halts writes on partition) | High (Local writes allowed) |
| **Complexity** | Low | High (Sync lag, conflict resolve) |
| **Read Latency** | High | Low |

### 3. Decision Rule
- **Choose Strong Consistency (ACID) if:** The domain manages financial balances, product seat inventories, or security credentials where reading stale states is unacceptable.
- **Choose Eventual Consistency (BASE) if:** The domain manages high-volume social feeds, log telemetries, or analytical dashboards where minor data delays are acceptable.

### 4. Red Flags to Revisit
- User checks out the same inventory item twice because eventual consistency allowed two parallel reads to see the item as available.
- Database write throughput drops to zero during minor network glitches because nodes cannot coordinate distributed locks.

### 5. Where to Go Next
- For CAP theorem analysis and trade-offs, see [CAP Theorem Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/06-scalability/cap-theorem-strategy.md).
- For implementing conflict resolution and managing sync lag, see [Eventual Consistency Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/06-scalability/eventual-consistency-strategy.md).
