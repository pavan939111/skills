# Data Warehouse Strategy

## 1. Definition & Core Concepts
A Data Warehouse Strategy establishes the pipelines, database engines, and synchronization topologies used to aggregate operational data from distributed transactional databases (OLTP) into a unified, high-performance analytical repository (OLAP).

Key architectures:
- **Change Data Capture (CDC):** Captures low-level database write logs in real-time, streaming mutations to the warehouse with minimal target lag.
- **ETL (Extract-Transform-Load):** Extract data, transform schemas on intermediary servers, and load clean data into the target warehouse.
- **ELT (Extract-Load-Transform):** Extract raw data, load it directly into the warehouse, and run transformations in-database using tools like DBT.

## 2. Why It Exists / What Problem It Solves
It unifies isolated business databases. When customer records, payment logs, and support interactions live in separate microservice databases, cross-domain reporting is impossible. A data warehouse aggregates these sources without loading active production systems.

## 3. What Breaks in Production Without It
- **Production Database Exhaustion:** BI analysts run complex multi-database queries directly on production database nodes, exhausting locks and causing API downtime.
- **Sync Failure from Schema Drift:** An developer alters an OLTP table column type, causing downstream daily ETL scripts to crash and leaving reports stale.
- **Data Inconsistencies:** Different business units compute key metrics (e.g. monthly revenue) differently, causing inconsistent reporting.

## 4. Best Practices
- **Implement Change Data Capture (CDC):** Use log-based CDC toolsets (e.g. Debezium, Fivetran) to stream database changes without running high-load SQL queries on source nodes.
- **Decouple Pipelines via Messaging:** Stream transaction changes through distributed queues (Kafka, Redpanda) to isolate ETL processors from source database crashes.
- **Enforce ELT for Large Scale:** Load raw data directly to modern warehouses (Snowflake, BigQuery), using SQL transformation engines (DBT) to compile models.

## 5. Common Mistakes / Anti-Patterns
- **Pipelining with SQL Select Dumps:** Running raw `SELECT * FROM table` queries every night on active transactional databases, locking tables.
- **Hardcoding Transformations in Code:** Writing complex python scripts to clean data during transit, making pipelines difficult to debug.

## 6. Security Considerations
- **PII Scrubbing at Pipeline Entrance:** Ensure the replication pipeline automatically hashes or removes customer identifiers (passwords, payment cards, names) before writing to the warehouse.

## 7. Performance Considerations
- **CDC Log Overhead:** Configure database log levels (e.g. `wal_level = logical` in Postgres) carefully, and monitor disk storage growth on source database engines.

## 8. Scalability Considerations
- **Incremental Loading Models:** Always construct warehousing models using incremental sync rules (e.g. scanning only rows modified since the last check) to avoid scanning full tables.

## 9. How Major Companies Implement It
- **Airbnb:** Employs Apache Airflow to schedule and manage thousands of daily ETL/ELT pipelines, consolidating logs into an analytics warehouse.
- **Spotify:** Streams millions of playback events through Kafka to Google BigQuery, validating event schemas before execution.

## 10. Decision Checklist (Data Pipeline Selection)
- Use **Log-Based CDC (Debezium + Kafka)** when:
  - Real-time or sub-hour sync latency is required.
  - Source database resource utilization must be kept minimal.
- Use **Batch ELT (DBT + Snowflake)** when:
  - Performing complex multi-step data cleanups and transformations.
  - The team is fluent in SQL-driven data modeling.

## 11. AI Coding-Agent Guidelines
- Write database schemas that include modified timestamps on all records to support incremental extraction.

## 12. Reusable Checklist
- [ ] Source tables contain index-backed modification timestamps for incremental queries
- [ ] Log-based Change Data Capture (CDC) configured to stream updates asynchronously
- [ ] Central message broker (Kafka) buffers raw database events
- [ ] Dynamic transformation pipelines anonymize PII data before warehouse ingestion
- [ ] ETL schemas include version controls to prevent drift failures
- [ ] Snowflake/BigQuery/Redshift clusters configured with compute auto-suspension
- [ ] Integrity tests run on DBT model builds before deploying changes\n