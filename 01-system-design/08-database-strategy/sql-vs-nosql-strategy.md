# SQL vs NoSQL Strategy

### 1. The Question Decided
"Should the primary datastore use relational (SQL) or non-relational (NoSQL) schemas, and what transaction boundaries are required?"

### 2. Options Compared
| Dimension | Relational (SQL - e.g. Postgres) | Key-Value / Document (NoSQL) | Wide-Column (NoSQL) |
|---|---|---|---|
| **Cost** | Low-Medium | Low | High |
| **Write Latency** | Low | Extremely Low | Extremely Low |
| **Complexity** | Low | Low | High |
| **ACID consistency** | High (Multi-row transactions) | Low (Single-key ACID) | Low |
| **Scale Ceiling** | Medium (Requires sharding) | Very High | Very High |

### 3. Decision Rule
- **Choose Relational (SQL) if:** The data schema requires structured relationships, complex joins, and transactional security (ACID consistency across tables).
- **Choose NoSQL if:** Data is unstructured (e.g. key-value logs, JSON documents) and requires high write throughput or horizontal scaling without schema locks.

### 4. Red Flags to Revisit
- SQL database writes block because transactional tables cannot handle incoming write spikes (>10,000 writes/second).
- NoSQL queries become extremely slow because applications must perform manual joins in code due to lack of native SQL support.

### 5. Where to Go Next
- For database selection guides, see [Database Selection Reference](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/01-database-selection/index.md).
- For relational schema design best practices, see [Relational Databases Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/02-relational-design/index.md).
