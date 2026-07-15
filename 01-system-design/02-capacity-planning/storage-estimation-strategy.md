# Storage Estimation

## 1. What Question This Answers
"What is the expected data volume growth rate per day, month, and year, and how does this define physical database disk sizing and partition strategies?"

## 2. Why It Matters at the System-Design Stage
Running out of disk space is a primary cause of database outages. If a database hits 100% capacity, the engine shuts down to prevent index corruption. Storage estimation calculates:
- The byte-size footprint of rows.
- Sizing requirements for primary SSD volumes.
- When partitioning or cold storage offloading must be triggered.
Without this estimation, disk provisioning is arbitrary, risking storage starvation or high cloud hosting costs.

## 3. Methodology / How to Work Through It
1. **Analyze Table Schema Rows:** Calculate the byte size of a single row in the high-volume tables.
   - *Data types size reference:* UUID = 16 bytes, BigInt = 8 bytes, Int = 4 bytes, Timestamps = 8 bytes, Boolean = 1 byte, floats = 4/8 bytes. Estimate average string widths (Varchar/Text).
2. **Add Index Overhead:** Factor in index sizes (generally add 20% to 50% extra storage per row for standard indexes, and up to 100% for HNSW vector indexes).
3. **Calculate Daily Ingestion Volume:** Multiply row size (with index overhead) by daily write transaction counts.
4. **Project Growth:** Calculate storage footprints for 1 month, 1 year, and 5 years.
5. **Add Safety Buffer:** Add 30% overhead for database-internal page fragmentation and temp tables.

## 4. Inputs Needed
- Estimated write QPS from [Traffic Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/traffic-estimation-strategy-implementation.md).
- Table schemas and database extensions (pgvector checks).

## 5. Outputs Produced
- Feeds into [Database Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/08-database-strategy/index.md) and [Storage Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/10-storage-strategy/index.md).

## 6. Worked Example (User Message Logging System)
- **Schema Row:** `message_log` (id: BigInt [8B], sender_id: UUID [16B], content: Text [average 150B], created_at: Timestamp [8B]) = 182 bytes/row.
- **Index Overhead:** Two indexes configured. Add 30% overhead $\approx 237$ bytes/row.
- **Write Volume:** 10,000,000 messages written daily.
- **Calculations:**
  - *Daily Ingestion:* $10,000,000 \times 237\text{ bytes} \approx 2.37\text{ GB/day}$.
  - *Monthly Growth:* $2.37\text{ GB} \times 30 \approx 71.1\text{ GB/month}$.
  - *Annual Growth:* $71.1\text{ GB} \times 12 \approx 853.2\text{ GB/year}$.
  - *Sizing with 30% Safety Buffer:* $853.2\text{ GB} \times 1.30 \approx 1.1\text{ TB/year}$.
- **Infrastructure Impact:** Server requires a minimum of 1.1TB of storage for Year 1, suggesting range partitioning by month to archive historical tables to S3.

## 7. Common Mistakes
- **Ignoring Index Overhead:** Provisioning storage based only on raw row data, ignoring the index sizes which can double the footprint.
- **Ignoring Database Pages Fragmentation:** Failing to factor in database page fill factors (bloat), leading to disks filling up earlier than projected.
- **Ignoring Log/Temp Table growth:** Sizing disks without accounting for database audit logs or temporary tables.

## 8. AI Coding-Agent Guidelines
1. **Estimate Row Byte Sizes:** Calculate the average byte size per row based on data types.
2. **Factor Index Growth:** Append 30-50% index and system overhead.
3. **Calculate Growth Vectors:** Estimate annual storage growth and recommend partitioning triggers.
4. **Produce Storage Estimation:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Storage Capacity Sizing: [System Name]

### 1. High-Volume Row Sizing (e.g. `order_event` Table)
- **Column Sizing:**
  - `id` (BigInt): 8 bytes
  - `tenant_id` (UUID): 16 bytes
  - `payload` (JSONB): [e.g. average 200 bytes]
  - `created_at` (Timestamp): 8 bytes
- **Raw Row Size:** [e.g. 232 bytes]
- **Index & Bloat Overhead (e.g. 40%):** [e.g. 93 bytes]
- **Total Row Storage Footprint:** [e.g. 325 bytes/row]

### 2. Storage Growth Projections (Peak Volume)
- **Daily Ingestion Rate:** [e.g. 2,000,000 rows/day]
- **Daily Growth:** [e.g. $2,000,000 \times 325\text{ bytes} \approx 650\text{ MB/day}$]
- **Monthly Growth:** [e.g. 19.5 GB/month]
- **Annual Growth:** [e.g. 234 GB/year]
- **5-Year Storage Sizing (with 30% Safety Buffer):** [e.g. $234\text{ GB} \times 5 \times 1.30 \approx 1.52\text{ TB}$]

### 3. Database Storage Infrastructure Impact
- **Primary Drive Sizing:** [e.g. Provision 500GB SSD for Year 1.]
- **Lifecycle Action Threshold:** [e.g. Enable monthly range partitioning, offloading tables to cold storage when database size exceeds 200GB.]
```
