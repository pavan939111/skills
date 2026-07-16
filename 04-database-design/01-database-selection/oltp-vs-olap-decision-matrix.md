# OLTP vs OLAP Decision Matrix

## 1. Definition & Core Concepts
The choice between Online Transaction Processing (OLTP) and Online Analytical Processing (OLAP) dictates how a database organizes, indexes, and executes queries.

Core architectures:
- **OLTP (Row-Oriented):** Optimizes write performance, concurrency, and low-latency single-row operations. Data is stored sequentially by row on disk, making operations like creating an order fast and consistent.
- **OLAP (Column-Oriented):** Optimizes massive aggregation and analytical queries. Data is stored by column on disk, allowing queries to scan only target attributes (e.g. average order value) across billions of rows without loading unused data.

## 2. Why It Exists / What Problem It Solves
It resolves hardware and query format conflicts. A transactional system needs to write single rows instantly with ACID safety (OLTP). An analytical system needs to scan billions of lines to generate monthly reports (OLAP). Attempting to run both workloads on a single relational engine results in queries locking each other out, degrading performance.

## 3. What Breaks in Production Without It
- **OLTP Performance Collapse:** Running heavy report queries (e.g. SUM or GROUP BY across millions of records) on the primary OLTP database locks tables, spikes CPU, and crashes active API write transactions.
- **Columnar Write Bottlenecks:** Treating an OLAP database (like ClickHouse) as a transactional engine by writing single-row updates continuously locks storage parts and causes write throughput failure.

## 4. Best Practices
- **Segregate Workloads:** Direct all user transactions, checkouts, and writes to an OLTP database. Replicate this data asynchronously to an OLAP engine for reporting.
- **Optimize Column Queries in OLAP:** Only query required columns (e.g., `SELECT price FROM sales`) in OLAP databases; running `SELECT *` defeats the purpose of columnar layouts.
- **Batch OLAP Writes:** Aggregate write operations in application code or queue layers, writing to the OLAP database in large, batch loads (e.g., > 10,000 rows at once).

## 5. Common Mistakes / Anti-Patterns
- **Runaway Reporting Queries:** Connecting business intelligence tools (Tableau, Metabase) directly to production OLTP primary databases.
- **Row-by-Row OLAP Writes:** Sending thousands of single-row INSERT statements to a columnar database per second, causing storage fragmentation and disk I/O failure.

## 6. Security Considerations
- **Anonymize Reporting Warehouses:** Mask or anonymize sensitive customer details (PII) before replicating transactions from OLTP to the OLAP data warehouse.

## 7. Performance Considerations
- **Disk I/O Profiling:** OLTP databases are bounded by random disk seek times (benefiting from SSDs and high IOPS). OLAP databases rely on sequential read throughput (benefiting from compression).

## 8. Scalability Considerations
- **Distributed Analytics:** Scale OLAP engines horizontally using clusters (e.g., ClickHouse merge trees) that distribute column blocks across multiple storage nodes.

## 9. How Major Companies Implement It
- **Uber:** Routes booking transactions to OLTP (Schemaless/MySQL), while shipping telemetries and historical ride logs to OLAP systems (Hadoop/ClickHouse) for spatial aggregations.
- **Netflix:** Stores transactional subscriptions in Postgres (OLTP), while analyzing streaming logs and CDN loads inside AWS Redshift (OLAP).

## 10. Decision Checklist (OLTP vs OLAP Selection)
- Use **OLTP (PostgreSQL, MySQL, Redis)** when:
  - Workload involves high-frequency read/write operations on individual records.
  - Transactions require strict ACID consistency.
  - The API needs sub-50ms responses for user-facing mutations.
- Use **OLAP (ClickHouse, Snowflake, Redshift)** when:
  - Queries require analyzing millions of rows to compute aggregates (min, max, average).
  - Data is write-once, read-many (log tracing, clickstream events).
  - Real-time transaction locking is not required.

## 11. AI Coding-Agent Guidelines
- Design database architectures that isolate transactional repositories from analytic reporting clients using separate connection strings.

## 12. Reusable Checklist
- [ ] Transactional write operations isolated to dedicated OLTP engine
- [ ] Analytics and reporting clients route queries to dedicated OLAP warehouse
- [ ] Asynchronous data replication lines configured between OLTP and OLAP nodes
- [ ] OLAP inserts batched in buffer arrays (>5,000 rows) before execution
- [ ] No `SELECT *` queries executed on columnar databases
- [ ] Columnar primary keys matching aggregation query filters configured in OLAP
- [ ] PII data anonymized before replication to the analytics warehouse\n