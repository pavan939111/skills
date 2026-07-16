# Scalability Requirements

## 1. What Question This Answers
"What are the system scalability triggers (user growth, transaction QPS spikes, data volume accumulation) and how do they define vertical vs. horizontal scaling, sharding keys, and partition designs?"

## 2. Why It Matters at the System-Design Stage
Scalability requirements define the "growth headroom" the architecture must support. If a database must handle 500GB of new records daily, the architect cannot use a single PostgreSQL node with standard storage volumes. Designing for scalability early ensures that:
- Database sharding schemas are planned (using keys like `tenant_id` or `user_id` to split tables).
- Table partitioning strategies are defined (range partitions by date to allow dropping old tables).
- Stateless backend boundaries are enforced, allowing horizontal scaling.
Without these specs, systems hit scaling limits under traffic, requiring expensive database rewrites.

## 3. Methodology / How to Work Through It
1. **Analyze Growth Vectors:** Quantify expected data growth rates (daily/monthly/annually), concurrent user targets, and transaction QPS limits.
2. **Define the Scale Ceiling:** Identify the resource limits of a single server node (CPU, memory, disk IOPS) to determine when vertical scaling is exhausted.
3. **Determine Partitioning Strategy:** Identify high-volume tables suitable for time-based range partitioning.
4. **Choose Sharding Keys:** Identify high-cardinality keys (like `tenant_id` or `user_id`) that can distribute database rows evenly across distributed nodes.
5. **Establish Scaling Triggers:** Define CPU/memory thresholds (e.g. CPU > 70% for 5 minutes) that trigger automated scale-out operations.

## 4. Inputs Needed
- Product scalability expectations and success metrics from [Product Analysis Success Metrics](../../00-product-analysis/success-metrics-analysis.md).
- Operational workload profiles and QPS estimates.

## 5. Outputs Produced
- Feeds into [Capacity Planning](../../13-architecture-decision-records/index.md) and [Scalability Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (B2B SaaS Analytics Dashboard)
- **Scale Requirements:**
  - *Data Ingestion:* 50 Million analytics events written daily (approx. 500 writes/second steady, 5,000 writes/second peak).
  - *Data Volume:* 1.5 Terabytes of growth per month.
- **System Design Decisions:**
  - *Vertical Scaling Limits:* Sizing primary server storage to hold max 1TB of active, hot data.
  - *Horizontal Scaling:* Shard the analytics database across 4 physical database nodes using `tenant_id` as the sharding partition key, ensuring even write distribution.
  - *Table Partitioning:* Apply monthly range partitioning on the analytics tables, allowing older monthly partitions to be archived to S3 and dropped.
  - *Stateless Web Tier:* Enforce session-free API handlers, allowing web servers to scale horizontally based on CPU load.

## 7. Common Mistakes
- **Premature Sharding:** Implementing complex sharding architectures for systems that could easily run on a single, well-optimized database instance.
- **Selecting Low-Cardinality Sharding Keys:** Sharding by `country_code` in a system where 90% of users reside in one country, creating a hot partition node that crashes.
- **Ignoring Data Retention Limits:** Failing to configure table partitioning on high-volume tables, leading to massive single tables that are impossible to vacuum.

## 8. AI Coding-Agent Guidelines
1. **Estimate Data Volumes:** Calculate daily write metrics and annual storage footprints.
2. **Define Sharding Requirements:** Propose high-cardinality sharding keys (like `tenant_id`) if sharding is required.
3. **Suggest Partitioning Scopes:** Recommend range partitioning on tables that grow continuously.
4. **Produce Scalability Requirements:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Scalability & Headroom Sizing: [System Name]

### 1. Scale Targets
- **Peak Write Throughput:** [e.g. 1,000 writes/second]
- **Target Storage Growth:** [e.g. 100GB/month, 1.2TB/year]
- **Active Concurrent Users:** [e.g. 5,000 concurrent sessions]

### 2. Horizontal & Vertical Sizing
- **Vertical Scale Limit (Single Instance):** [e.g., Up to 64 vCPU, 256GB RAM, 10,000 IOPS SSD storage]
- **Horizontal Scaling Mode:** [e.g. Stateless web servers scale out based on CPU load; database sharding active]

### 3. Sharding & Partitioning Strategy
- **Target Sharded Tables:** [e.g., `user_event`, `user_analytics`]
- **Primary Sharding Key:** [e.g. `tenant_id` (enforces tenant isolation and distributes writes)]
- **Table Partitioning Key:** [e.g., Range partition by month on `created_at` timestamp]
- **Data Lifecycle Action:** [e.g. Archive partitions older than 90 days to S3, dropping database rows]
```
