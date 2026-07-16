# Data Pipeline

## 1. What Question This Answers
"How is high-volume streaming telemetry and transactional data collected, cleaned, transformed, and loaded (ETL/ELT) into analytical datastores without impacting primary transaction databases?"

## 2. Why It Matters at the System-Design Stage
Analytical queries (aggregates, reports, audit trends) require scanning millions of rows. If executed directly against primary SQL databases (OLTP), they lock tables, exhaust CPU cores, and block user checkouts. A data pipeline extracts transactional data, transforms it, and loads it into dedicated analytical stores (OLAP) asynchronously. Designing this early ensures transactional database performance is isolated from analytical workloads.

## 3. Methodology / How to Work Through It
1. **Identify Data Sources:** Locate transactional databases (OLTP) and telemetry streams (app logs, clickstreams) that feed analytics.
2. **Define the Extraction Method:** Choose non-blocking extraction patterns:
   - *Batch Extraction:* Nightly SQL dumps (using replicas, not primary databases).
   - *Change Data Capture (CDC):* Real-time streaming of transaction logs (Debezium).
3. **Map the Broker Routing:** Queue data streams through message buses (Kafka) to absorb write spikes.
4. **Define Transformations:** Plan data cleansing, validation, and schema mapping rules (e.g. converting nested JSON into structured columns).
5. **Select Analytical Stores (OLAP):** Route processed data to dedicated OLAP engines (e.g. Snowflake, BigQuery, ClickHouse).

## 4. Inputs Needed
- High-volume transaction write projections and storage growth metrics from Storage Estimation.
- Business analytical reporting requirements.

## 5. Outputs Produced
- Feeds into [Database Strategy](../../13-architecture-decision-records/index.md) and [Search Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (User Purchase Report Pipeline)
- **Problem:** E-Commerce managers want to query hourly sales reports. Executing aggregate SQL queries on the active `orders` database locks tables, slowing customer checkout times.
- **Pipeline Design:**
  - *Source:* PostgreSQL `orders` table.
  - *Extract (CDC):* Debezium reads PostgreSQL transaction WALs, publishing order updates to Kafka.
  - *Stream (Broker):* Kafka queues updates in `order-cdc-events` topic.
  - *Transform & Load:* Spark streaming job consumes events, flattens order JSON details, formats dates, and writes rows directly to ClickHouse (OLAP database).
  - *Query:* Management dashboard queries ClickHouse, leaving PostgreSQL performance unimpacted.

## 7. Common Mistakes
- **Running ETL on Active OLTP primary databases:** Executing cron-based database aggregation scripts directly against active transaction nodes.
- **No Schema Version Control:** Changing columns in the OLTP database schema, causing downstream pipeline ingestion to fail due to parsing mismatches.
- **Vague Ingestion Buffers:** Shipping streaming logs directly to analytical databases without queue buffers, crashing analytical nodes during traffic surges.

## 8. AI Coding-Agent Guidelines
1. **Never run analytical queries on OLTP primary databases:** Route reporting dashboards to isolated replicas or ClickHouse/OLAP nodes.
2. **Recommend CDC for Sync:** Propose log-based Change Data Capture (CDC) over slow, polling batch SQL dumps.
3. **Ensure Ingestion Buffers:** Position Kafka or SQS queues in front of analytical ingestion nodes.
4. **Produce Data Pipeline Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Data Pipeline & ETL Architecture: [System Name]

### 1. Ingestion & Storage Architecture (Mermaid)
```mermaid
graph LR
    subgraph OLTP (Transactional)
        App[App Instance] --> DB_Primary[(Postgres Primary)]
    end
    
    subgraph Stream Pipeline
        DB_Primary -- CDC WAL --> Debezium[Debezium CDC]
        Debezium -- Stream --> Kafka[Kafka Broker]
    end
    
    subgraph OLAP (Analytical)
        Kafka -- Stream Ingestion --> ClickHouse[(ClickHouse OLAP)]
        Dashboard[Management App] --> ClickHouse
    end
```

### 2. Pipeline Component Sizing
- **Data Source:** PostgreSQL `order` and `user_event` tables.
- **Extraction Protocol:** Change Data Capture (CDC) via Debezium.
- **Ingress Broker:** Apache Kafka (partitioned by `tenant_id`).
- **Target Analytics Store:** [e.g. ClickHouse / BigQuery / Snowflake]

### 3. Schema Schema Protection Rules
- **Schema registry:** Kafka Schema Registry active. Updates to primary tables must be backward-compatible (non-destructive database additions only).
- **Audit Field Enforcements:** All extracted tables must include `ingested_at` and `source_timestamp` audit columns.
```
