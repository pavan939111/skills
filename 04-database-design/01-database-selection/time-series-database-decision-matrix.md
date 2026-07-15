# Time-Series Database

## 1. Definition & Core Concepts

A Time-Series Database (TSDB) is a database optimized to store, index, and query data points that are sequentially measured and recorded over time (e.g., system metrics, IoT sensor data, financial stock ticks).

Core pieces:
- **Timestamp Indexing:** Every data point is natively associated with a high-resolution timestamp as its primary indexing dimension.
- **Metric (Field) vs. Tag (Dimension):**
  - *Metric/Field:* The actual measured values (e.g. `cpu_usage = 84.2`, `temperature = 22.5`). These are generally not indexed.
  - *Tag/Dimension:* Metadata fields used to categorize and filter measurements (e.g. `host = 'server-01'`, `region = 'us-east'`). These are highly indexed.
- **Downsampling & Rollups:** Aggregating high-resolution raw data (e.g., millisecond metrics) into lower-resolution summaries (e.g., 5-minute averages) to conserve storage space.
- **Data Retention Policies:** Rules that automatically purge or archive historical data once it reaches a defined age (e.g. drop raw metrics after 14 days).

*(Boundary Note: Telemetry agents configurations (e.g. Prometheus yaml rules), application-level metrics metrics-collectors, and dashboard UI setup are out of scope. This document covers database selection, metric indexing design, downsampling patterns, and retention rules.)*

## 2. Why It Exists / What Problem It Solves

Time-series data is append-only, high-write, and continuous. Relational databases store data in row-oriented formats and use standard B-Tree indexes, which degrade in performance under massive, continuous write volumes and lack native functions for time-based calculations (e.g. calculating rolling averages or downsampling). TSDBs utilize columnar compression and time-interval partitioning to write millions of data points per second and perform instant aggregations over time windows.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Database Crashes from High Cardinality:** Appending unique variables (like user IDs, email addresses, or transaction UUIDs) as indexed **tags**. This causes the database's index size to expand exponentially, exhausting server memory and crashing the database engine.
- **Disk Space Exhaustion:** Storing raw, millisecond-level telemetry data indefinitely without configuring data retention policies, filling server storage and crashing the operating system.
- **Aggregations Timeout Outages:** Attempting to render time-series dashboards (e.g. plotting a 30-day average) by querying billions of rows of raw data directly, instead of querying downsampled rollup tables, resulting in queries timing out.
- **Severe Write Degradation from Out-of-Order Data:** Submitting data points with old timestamps or executing update/delete commands. TSDBs optimize for sequential append writes; processing random history updates requires rewriting data blocks, degrading write throughput.

## 4. Best Practices

- **Enforce Low Cardinality on Tags/Dimensions:** Limit tags to variables with predefined, low-cardinality values (e.g., `environment`, `device_model`, `status_code`). Never put unique transaction IDs or user identifiers in tags.
- **Configure Retention Policies immediately:** Set up automatic data deletion policies at database creation (e.g., keep raw logs for 30 days, downsampled rollups for 365 days).
- **Implement Continuous downsampling:** Configure database-level task rollups to aggregate raw data into coarser time chunks (e.g., hourly/daily metrics) automatically.
- **Write Data Sequentially (UTC):** Ensure data points are written in chronological order using UTC timestamps to optimize block compression algorithms.
- **Use Columnar Storage Compression:** Enable specialized compression algorithms (like Gorilla or Double-Delta compression) inside the TSDB to shrink time-series payloads by up to 90%.

## 5. Common Mistakes / Anti-Patterns

- **Using TSDB for Relational CRUD:** Storing relational tables (like billing profiles or inventories) in a TSDB, which lacks transactional consistency and handles updates poorly.
- **Unique IDs as Tags:** Placing unique identifiers (like user UUIDs, request trace IDs) in indexed tag dimensions.
- **Updating Existing Timestamps:** Executing update queries to change historical measurements, which forces the database engine to perform heavy write block rewrites.
- **Timezone-Unaware Timestamps:** Storing timestamps without explicit timezone metadata (UTC), causing data shifts and calculation mismatch errors.

## 6. Security Considerations

- **Auditable Metrics Gating:** Ensure that telemetry data does not contain sensitive configurations or PII (e.g. passwords, customer names) in metric labels. Scrub data before it reaches the ingestion pipeline.

## 7. Performance Considerations

- **Write Batching:** Group single metrics writes into batches (e.g., writing 1,000 metrics in a single network request) to maximize TSDB write pipelines and minimize CPU cost.
- **Memory Buffer Sizing:** Allocate sufficient write buffer memory to allow the database to organize data points chronologically in memory before flushing them to disk.

## 8. Scalability Considerations

- **Time-Based Chunk Partitioning:** Partition database tables into time-based chunks (e.g., one chunk per day/week). This ensures that queries targeting recent data only scan the relevant physical chunk and index, keeping performance constant as data grows.

## 9. How Major Companies Implement It

- **Uber:** Developed M3DB, an open-source, distributed time-series database designed to ingest and store billions of telemetry metrics per second, utilizing time-window partitioning and custom compression.
- **Netflix:** Analyzes real-time streaming quality and server resource saturation by routing trillions of system metrics to dedicated time-series metrics aggregates, powering alert monitors.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Time-Series Databases (InfluxDB, TimescaleDB, Prometheus)** when:
  - Workload is append-only, high-write telemetry, metrics, or sensor events.
  - Queries are primarily time-based aggregations (e.g. "calculate the hourly average of CPU usage over the last week").
  - Data naturally ages out and can be deleted after a set retention window.
- Use **Relational or Key-Value Databases** when:
  - The application requires updates, deletes, and multi-row transactional safety.
  - Data structure is highly relational.
  - Cardinality is extremely high (every record has a unique ID).

## 11. AI Coding-Agent Implementation Guidelines

- Always store all timestamps in UTC format at the database engine level.
- Never write unique, high-cardinality values (e.g. user IDs, UUIDs, trace IDs) as tags or dimensions.
- Always configure database-level retention policies (TTLs) for every new metric table.
- Never write code that attempts to update or overwrite historical time-series data points.
- Always use batching client write APIs when pushing metrics in loops.
- Always use downsampled rollup tables for rendering dashboard range queries.

## 12. Reusable Checklist

- [ ] High-cardinality values (UUIDs, trace IDs, emails) excluded from indexed tags
- [ ] Database-level data retention policies (TTLs) active
- [ ] Automated continuous downsampling task configured for rollup tables
- [ ] All timestamps stored in UTC format
- [ ] Metrics writes executed in batches
- [ ] Time-based table partitioning (chunking) active (e.g., daily/weekly partitions)
- [ ] No update or delete operations written in database queries
- [ ] Columns use double-delta or Gorilla compression options
