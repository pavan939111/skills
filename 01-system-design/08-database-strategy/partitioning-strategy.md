# Partitioning Strategy

### 1. The Question Decided
"Should high-volume tables use database-native partitioning (e.g. range partitioning by date), and what is the partition pruning criteria?"

### 2. Options Compared
| Dimension | Single Unpartitioned Table | Range Partitioning (e.g. by Date) | List Partitioning (e.g. by Region) |
|---|---|---|---|
| **Cost (Compute)** | Low | Low | Low |
| **Query Performance** | Slow (Table scans on large tables) | Fast (Pruned scans) | Fast (Pruned scans) |
| **Complexity** | Low | Medium | Medium |
| **Vacuum/Maintenance**| Slow / High bloat risk | Fast (Drop old partition tables) | Fast |
| **Index Size** | Large (Fits out of RAM) | Small (Fits in RAM per partition) | Small |

### 3. Decision Rule
- **Choose Range Partitioning if:** Tables grow continuously (e.g. logs, events, metrics) and older records are regularly archived or dropped, keeping the active table size fixed.
- **Avoid Partitioning if:** Total table row counts are projected to stay under 10 million rows, where index coverage is sufficient.

### 4. Red Flags to Revisit
- Database vacuum processes run endlessly, locking tables and exhausting CPU cycles.
- Index lookup latencies increase because B-Tree indexes grow too large to fit in server RAM.

### 5. Where to Go Next
- For database-level partitioning syntax, schema designs, and pruning configurations, see [Database Table Partitioning Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/06-scalability/partitioning-strategy-implementation.md).
- For data retention and archiving lifecycles, see [Data Retention Policies](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/09-data-governance/data-retention-strategy.md).
