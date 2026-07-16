# Data Warehouse Strategy

### 1. The Question Decided
"How do we replicate transactional data from OLTP databases to a central OLAP data warehouse for reporting?"

### 2. Options Compared
| Replication Pattern | ETL (Extract-Transform-Load) | ELT (Extract-Load-Transform) | Change Data Capture (CDC) |
|---|---|---|---|
| **Latency** | High (Batch/Daily) | Medium (Hourly) | Low (Real-time stream) |
| **Source Impact** | High (large SQL dumps) | Medium | Very Low (reads database log) |

### 3. Decision Rule
- Use **CDC** (Debezium, Kafka) for real-time reporting pipelines where transaction events must sync instantly to the warehouse.
- Use **ELT** for high-volume raw loading where transformations happen inside the target data warehouse (Snowflake) using DBT.

### 4. Red Flags to Revisit
- Bulk queries on source replica nodes causing database lag, preventing real-time failovers.
- Missing schema migration synchronization pipelines, causing warehouse loading jobs to crash when primary tables change.

### 5. Where to Go Next
- For database selection decision matrices, see [OLTP vs OLAP Decision Matrix](./oltp-vs-olap-decision-matrix.md).
