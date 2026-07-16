# Workload Analysis

## 1. What Question This Answers
"What are the workload patterns (write-heavy vs. read-heavy, batch vs. transactional, peaks vs. steady state) and how do they dictate database engine selections and scaling architectures?"

## 2. Why It Matters at the System-Design Stage
A database optimized for steady, low-volume transactional updates (e.g. standard accounting software) will collapse if subjected to massive, sudden write bursts (e.g., flash sales or sensor log streaming). Workload analysis classifies the operational traffic characteristics. This dictates whether the system requires write-buffering (message queues), read replicas, database sharding, or specialized NoSQL document stores to handle traffic shapes.

## 3. Methodology / How to Work Through It
1. **Analyze Workload Ratios:** Calculate the ratio of read operations to write operations:
   - *Read-Heavy (e.g. >95% reads):* Suggests read replica routing and caching.
   - *Write-Heavy (e.g. >50% writes):* Suggests NoSQL LSM-tree stores or message queues.
2. **Identify Write/Read Spikes:** Estimate peak surge factors (e.g., 10x traffic spikes during black Friday sales or morning logins).
3. **Classify Operation Types:** Segment traffic into:
   - *OLTP (Online Transaction Processing):* Fast, short database queries (inserts, primary key lookups).
   - *OLAP (Online Analytical Processing):* Slow, heavy aggregate scans (reports, dashboards).
4. **Define Data Lifecycle Types:** Categorize tables by growth rates (e.g., static configurations, steady user growth, infinite log accumulation).

## 4. Inputs Needed
- Product user flows and success metrics from [Product Analysis](../../13-architecture-decision-records/index.md).
- User scale projections.

## 5. Outputs Produced
- Feeds into [Capacity Planning](../../13-architecture-decision-records/index.md) (QPS numbers) and [Database Selection](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Ticket Booking Application)
- **Workload Profile:** Transactional ticket purchases.
- **Ratios:** 98:2 read-to-write ratio during search, shifting to 50:50 write-heavy during seat selection/payment transaction phases.
- **Traffic Peaks:** Extreme 20x spike in traffic during popular event ticket launches (within a 5-minute window).
- **Operation Class:** Hybrid OLTP (payment) and OLAP (historical sales dashboards).
- **Architecture Decisions:**
  - *Read Scaling:* Cache event availability counts in Redis to absorb seat check lookups.
  - *Write Buffering:* Queue ticket requests in RabbitMQ during launch surges to rate-limit database writes.
  - *ACID Boundaries:* Enforce relational constraints on seat booking tables to prevent double-booking.

## 7. Common Mistakes
- **Designing for Steady State Only:** Failing to calculate peak write surges, causing connection exhaustion and database crashes during marketing events.
- **Mixing OLTP and OLAP workloads:** Running analytical aggregates directly against active transactional database instances without replica isolation, causing database locks.
- **Ignoring Data Growth:** Sizing storage systems without accounting for infinite log accumulation tables.

## 8. AI Coding-Agent Guidelines
1. **Read User Flows:** Analyze how data is written and read.
2. **Quantify Workload Types:** Classify the database transaction frequencies and peak surge scales.
3. **Map Sizing Rules:** Propose write-buffering (queues) and caching based on workload characteristics.
4. **Produce Workload Analysis:** Generate the document using the template below.

## 9. Reusable Template
```markdown
# Workload Profile Analysis: [System Name]

### 1. Traffic Ratios & Characteristics
- **Read-to-Write Ratio:** [e.g. 50:1 (Read-Heavy)]
- **Peak Traffic Surge Factor:** [e.g. 5x surge expected during peak hours (9 AM - 10 AM)]
- **Primary Operation Type:** [OLTP (Transactional) / OLAP (Analytical) / Hybrid]
- **Data Mutation Patterns:** [e.g. Steady trickle of inserts; updates to existing records frequent]

### 2. Table Lifecycle Categorization
- **Static Configuration Tables:** [e.g. Country lists, categories (low growth)]
- **User State Tables:** [e.g. User profiles, configurations (growth aligned with user signup rate)]
- **High-Volume Telemetry Tables:** [e.g., Audit logs, event logs (infinite growth, requires partitioning/DLM)]

### 3. Database Architecture Constraints
- **Caching Recommendation:** [e.g. Cache static product listings in Redis to reduce read QPS on Postgres.]
- **Write-Buffering Recommendation:** [e.g. Route high-frequency telemetry writes to Kafka before writing to disk.]
```
