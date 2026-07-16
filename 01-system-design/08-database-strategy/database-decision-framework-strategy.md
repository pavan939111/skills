# Database Decision Framework

### 1. The Question Decided
"What is the overall structured decision logic used to select database classes, replication types, and scaling strategies for all system domains?"

### 2. Options Compared
| Criteria / Context | SQL + Async Replica | NoSQL Document | Sharded SQL Cluster |
|---|---|---|---|
| **High Relational / ACID** | Best Match | Poor | Fair |
| **High Write / Dynamic schema**| Poor | Best Match | Fair |
| **Extreme Scale (>10TB writes)**| Poor | Fair | Best Match |

### 3. Decision Rule
- **Follow the database decision logic tree:**
  - *If* transactional ledger, *then* select **PostgreSQL** with asynchronous read replicas.
  - *If* write throughput exceeds single disk IOPS, *then* layer in **horizontal sharding** or **message queue buffers**.
  - *If* analytical reporting is required, *then* deploy **ClickHouse** or **Snowflake** OLAP nodes synced via CDC.

### 4. Red Flags to Revisit
- Developers spend hours trying to configure complex sharding setups for databases that are under 500GB in size.
- Query performance drops because the primary transactional database is saturated with analytical scans.

### 5. Where to Go Next
- For the comprehensive data layer selection, modeling, and operational scaling guidelines, see [Database Design Master Reference](../../13-architecture-decision-records/README.md).
- For picking specific database engines (e.g. Postgres vs DynamoDB), see [Database Selection Reference](../../13-architecture-decision-records/index.md).
