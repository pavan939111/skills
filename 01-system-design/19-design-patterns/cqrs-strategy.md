# CQRS Strategy

### 1. The Question Decided
"Should the architecture separate read and write database systems (Command Query Responsibility Segregation - CQRS) to optimize query performance independently?"

### 2. Options Compared
| Dimension | Single Database Model (Shared) | CQRS Model (Split Read/Write) |
|---|---|---|
| **Write Latency** | Low | Low |
| **Read Scalability** | Low-Medium | Infinite (Scale read models out) |
| **Complexity** | Low | Very High |
| **Data Consistency**| Strong ACID | Eventually consistent |

### 3. Decision Rule
- **Choose CQRS if:** The application has extremely asymmetric read/write paths (e.g. read QPS is 1,000x write QPS), requires highly optimized, denormalized read models (e.g., dashboard feeds), and eventual consistency is acceptable.
- **Avoid CQRS if:** The domain requires immediate read-after-write consistency (e.g. money balance updates).

### 4. Red Flags to Revisit
- Customers report that newly created orders do not appear in their order history screen for several seconds, creating support tickets.
- The synchronization worker pipeline fails repeatedly, causing read and write models to drift out of sync.

### 5. Where to Go Next
- For database schemas, indexes, and replication mappings for read/write divisions, see [CQRS Database Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/13-design-patterns/cqrs-pattern.md).
- For implementing separate read/write models in backend code, see [CQRS Implementation Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/03-architecture-selection/cqrs-decision-matrix-strategy-implementation.md).
