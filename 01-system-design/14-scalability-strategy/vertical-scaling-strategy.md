# Vertical Scaling Strategy

### 1. The Question Decided
"When is vertical scaling (scaling up instance hardware) the preferred scaling method, and what bounds dictate its limits?"

### 2. Options Compared
| Dimension | Vertical Scaling (Scale Up) | Horizontal Scaling (Scale Out) |
|---|---|---|
| **Complexity** | Low (Zero code changes needed) | High |
| **Data Consistency**| High (Single memory space) | Low (Distributed synchronization needed) |
| **Downtime Risk** | High (Requires reboot on upgrades) | Low (Rolling updates) |
| **Availability** | Low | High |

### 3. Decision Rule
- **Choose Vertical Scaling if:** Operating relational databases (SQL) with complex join workloads, or running single-threaded batch workers where data partitions are complex to implement.
- **Avoid Vertical Scaling if:** Compute workloads can be partitioned easily (e.g. stateless web APIs, use horizontal scaling instead).

### 4. Red Flags to Revisit
- The primary database instance crashes during upgrades because resizing the virtual machine requires taking the server offline (downtime).
- Hardware scaling is exhausted because the system has been scaled up to the largest VM type available on the cloud provider.

### 5. Where to Go Next
- For database-specific vertical scaling, memory buffer allocations, and SSD IOPS tuning guides, see Vertical Database Scaling.
- For general VM scaling parameters, see Scalability Implementation Guide.
