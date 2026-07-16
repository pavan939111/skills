# OLTP vs OLAP Decision Matrix

### 1. The Question Decided
"Should the database architecture use an Online Transaction Processing (OLTP) engine or an Online Analytical Processing (OLAP) engine for our target workloads?"

### 2. Options Compared
| Criteria | OLTP (Relational) | OLAP (Columnar) |
|---|---|---|
| **Query Pattern** | Simple inserts/updates, single-row lookup | Complex aggregates (SUM, AVG) over billions of rows |
| **Data layout** | Row-oriented storage | Column-oriented storage |
| **Write Type** | High concurrency, low latency | Batch uploads, low frequency |

### 3. Decision Rule
- Choose **OLTP** (PostgreSQL, MySQL) for core transactional operations (billing, shopping carts, order mutations) requiring low-latency queries.
- Choose **OLAP** (ClickHouse, Snowflake, Redshift) for analytical reporting dashboards, aggregations, and log monitoring systems.

### 4. Red Flags to Revisit
- Runaway analytical queries (like aggregate joins) on the OLTP database causing CPU spikes and locking out active transactional writes.
- Attempting high-frequency single-row updates on OLAP databases, leading to write lock bottlenecks.

### 5. Where to Go Next
- For setting up transactional replication lines, see [Read Replicas Strategy](../06-scalability/read-replicas-strategy.md).
