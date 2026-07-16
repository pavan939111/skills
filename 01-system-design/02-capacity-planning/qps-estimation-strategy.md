# QPS Estimation

## 1. What Question This Answers
"What are the peak and average Queries Per Second (QPS) targets for specific high-frequency database query paths, and how does this define database clustering and scaling strategies?"

## 2. Why It Matters at the System-Design Stage
A database cannot scale if its query throughput requirements (QPS) exceed the performance limits of a single node. QPS estimation calculates the query workload load per database path. This defines:
- Where read replicas must be introduced to distribute read QPS.
- When write QPS exceeds physical disk IOPS, requiring sharding or message queues.
- Sizing parameters for database connection pools.
Without this estimation, database clusters are mis-configured, leading to connection timeouts and query queue collapses.

## 3. Methodology / How to Work Through It
1. **Analyze High-Frequency Query Paths:** Identify the primary SQL read and write operations (e.g. read product catalog, insert orders).
2. **Calculate Path Request Rates:** Estimate the number of times each query path is executed per user session.
3. **Calculate Average Path QPS:**
   $$\text{Path QPS} = \frac{\text{DAU} \times \text{Path executions per day}}{86,400\text{ seconds}}$$
4. **Calculate Peak Path QPS:** Apply surge multipliers (typically 3x to 10x depending on the app type).
5. **Map to Hardware Limits:** Compare peak write QPS against database disk write IOPS boundaries (e.g. standard AWS GP3 storage supports 3,000 IOPS baseline).

## 4. Inputs Needed
- Peak RPS estimates from Request Estimation.
- Operational workloads and read/write ratios.

## 5. Outputs Produced
- Feeds directly into [Database Strategy](../../13-architecture-decision-records/index.md) and [Scalability Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Financial Wallet Ledger)
- **Scale:** 5,000,000 DAU.
- **Query Paths & Frequencies per User/Day:**
  - `SELECT balance FROM wallet WHERE user_id = ?` (10 executions/day)
  - `INSERT INTO ledger_transaction` (2 executions/day)
- **Calculations:**
  - *Total Balance Reads:* $5,000,000 \times 10 = 50,000,000$ reads/day.
  - *Average Read QPS:* $\frac{50,000,000}{86,400} \approx 578$ QPS.
  - *Peak Read QPS (using 4x surge):* $578 \times 4 \approx 2,312$ QPS.
  - *Total Transaction Writes:* $5,000,000 \times 2 = 10,000,000$ writes/day.
  - *Average Write QPS:* $\frac{10,000,000}{86,400} \approx 115$ QPS.
  - *Peak Write QPS (using 4x surge):* $115 \times 4 \approx 460$ QPS.
- **System Design Decisions:**
  - *Read replicas:* Peak read QPS (2,312) requires deploying at least 2 read replicas to offload read traffic from the primary node.
  - *Write capacity:* Peak write QPS (460) commits directly to the primary database. Ensure database host disk storage is provisioned with a minimum of 3,000 provisioned IOPS to prevent write queue blockages.

## 7. Common Mistakes
- **Failing to Estimate Peak Surge Times:** Designing databases using average QPS rates, causing outages when lunch hour or event launches spike write rates by 20x.
- **Assuming all writes require identical disk I/O:** Ignoring the fact that writing wide JSON payloads consumes more disk I/O than simple integer updates.
- **No connection proxy planning:** Running high QPS rates without connection pooling, exhausting database process slots.

## 8. AI Coding-Agent Guidelines
1. **List High-Frequency SQL paths:** Map the target select and insert statements.
2. **Calculate Peak QPS rates:** Apply surge factors based on transaction profiles.
3. **Recommend replicas or sharding:** Suggest read replicas if read QPS > 1,000, and sharding or queues if write QPS exceeds 1,000 or disk IOPS limits.
4. **Produce QPS Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Database QPS Capacity Sizing: [System Name]

### 1. High-Frequency Query Paths
- **Path 1 (Read):** `SELECT * FROM product WHERE category_id = ?`
  - *Executions per session:* [e.g. 5 times]
- **Path 2 (Write):** `INSERT INTO order_record ...`
  - *Executions per session:* [e.g. 1 time]

### 2. QPS Sizing Calculations (Peak Volume)
- **Path 1 (Read) QPS:**
  - *Average:* [e.g. $\frac{100,000\text{ DAU} \times 5}{86,400} \approx 5.8\text{ QPS}$]
  - *Peak (3x surge):* [e.g. $17.4$ QPS]
- **Path 2 (Write) QPS:**
  - *Average:* [e.g. $\frac{100,000\text{ DAU} \times 1}{86,400} \approx 1.1\text{ QPS}$]
  - *Peak (3x surge):* [e.g. $3.3$ QPS]

### 3. Database Cluster Sizing Impact
- **Read Routing:** [e.g. A peak read QPS of 17.4 is easily handled by a single primary node. Read replicas are deferred.]
- **Disk IOPS Allocation:** [e.g. A peak write QPS of 3.3 requires minimal disk writes. Standard baseline SSD storage is sufficient.]
```
