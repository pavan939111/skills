# Database Selection Strategy

### 1. The Question Decided
"Which specific database class (Relational, Document, Key-Value, Wide-Column, Graph, Vector) fits the primary data workload?"

### 2. Options Compared
| Class | PostgreSQL / MySQL | MongoDB | Redis | Cassandra | Neo4j |
|---|---|---|---|---|---|
| **Primary Use** | OLTP Transactions | JSON Docs | Cache / Session | Time-series / Logs | Social Graphs |
| **ACID** | High | Single-Doc | Low | Low | Medium |
| **Complexity** | Low | Low | Low | High | Medium |
| **Scale Ceiling**| Medium-High | High | High (RAM limit) | Very High | Medium |

### 3. Decision Rule
- **Map database classes to data relationships:**
  - *If* transactional ledger, *then* select **PostgreSQL** or **MySQL**.
  - *If* catalog with dynamic JSON fields, *then* select **MongoDB** or **PostgreSQL JSONB**.
  - *If* session store, *then* select **Redis**.
  - *If* high-throughput audit events, *then* select **Cassandra** or **DynamoDB**.

### 4. Red Flags to Revisit
- MongoDB is chosen, but developers end up writing manual references and joins across multiple document collections, creating database inconsistencies.
- Redis memory costs spike because the team stores massive, permanent customer record tables in RAM instead of disk storage.

### 5. Where to Go Next
- For database selection guidelines and engine comparisons, see [Database Selection Reference Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/01-database-selection/index.md).
- For vector-specific databases selections, see [Vector Database selection](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/01-database-selection/vector-database-decision-matrix.md) (once built).
