# Growth Planning

## 1. What Question This Answers
"What is the projected system load growth (user base, traffic, storage) over 1, 2, and 5 years, and how does this define when vertical scaling limits are hit and horizontal scaling triggers must execute?"

## 2. Why It Matters at the System-Design Stage
A system designed for today's capacity will hit bottlenecks as the business grows. Growth planning models scale vectors over multi-year horizons. This allows architects to plan:
- Sizing thresholds for primary database disks.
- When to migrate from a single instance to sharded database clusters.
- Sizing limits for database auto-vacuuming and index rebuild maintenance schedules.
Without a growth plan, scaling bottlenecks trigger emergency system rewrites during periods of high business growth.

## 3. Methodology / How to Work Through It
1. **Define Annual Growth Rates:** Estimate user base and transaction growth percentages (e.g., projecting 50% year-over-year growth).
2. **Project Storage Footprint:** Model annual storage consumption, factoring in index bloat and audit log accumulation.
3. **Identify Single-Instance Limits:** Determine the CPU, memory, and storage boundaries of the largest virtual machine configurations available on the hosting platform.
4. **Define Architecture Transition Gates:** Set explicit criteria for when the system must transition to more complex architectures (e.g. migrate to read-replicas when QPS > 1,000; migrate to sharding when storage > 2TB).
5. **Plan Data Lifecycle Automation:** Design partition dropping and cold-archiving routines early to keep active storage sizes steady.

## 4. Inputs Needed
- Storage and traffic projections from [Storage Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/storage-estimation-strategy-implementation.md) and [Traffic Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/traffic-estimation-strategy-implementation.md).
- Business scaling targets.

## 5. Outputs Produced
- Feeds into [Scalability Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/14-scalability-strategy/index.md) and [Cost Optimization Strategies](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/17-cost-optimization/index.md).

## 6. Worked Example (Financial Ledger Startup)
- **Start State (Year 1):** 100,000 users, 100GB database storage, peak 100 QPS.
- **Growth Projections (50% Year-over-Year Growth):**
  - *Year 2:* 150,000 users, 250GB database storage, peak 150 QPS.
  - *Year 3:* 225,000 users, 550GB database storage, peak 225 QPS.
  - *Year 5:* 500,000 users, 1.8TB database storage, peak 500 QPS.
- **System Transition Gates:**
  - *Gate 1 (Storage > 500GB, Year 3):* Enforce monthly database partitioning and build background workers to archive invoices older than 1 year to S3, dropping primary rows to keep active DB size < 200GB.
  - *Gate 2 (Write QPS > 300, Year 5):* Scale PostgreSQL primary storage to GP3 with 5,000 provisioned IOPS to prevent write queue timeouts.

## 7. Common Mistakes
- **Assuming Linear Growth:** Underestimating growth vectors by ignoring compound interest (exponential user growth trends).
- **No Transition Gates:** Failing to define the criteria that trigger migrations to sharded databases, causing teams to scramble when single instances hit limits.
- **Postponing Data Lifecycle Design:** Storing all customer records on expensive SSD primary tables indefinitely, causing backup and index maintenance times to expand past maintenance windows.

## 8. AI Coding-Agent Guidelines
1. **Model Exponential Growth:** Apply compounding annual growth rates (CAGR) to user scale projections.
2. **Define Architectural Transition Gates:** Set numeric triggers (e.g. QPS, storage thresholds) that dictate upgrades.
3. **Plan Partition and Archiving triggers:** Suggest data lifecycle automation milestones.
4. **Produce Growth Planning Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Growth & Scale Transition Plan: [System Name]

### 1. 5-Year Scale Projections (Assuming [e.g. 40%] CAGR)
| Metrics | Year 1 (Baseline) | Year 2 | Year 3 | Year 5 |
|---|---|---|---|---|
| Active Users | [e.g. 50,000] | [e.g. 70,000] | [e.g. 98,000] | [e.g. 192,000] |
| Peak QPS | [e.g. 100 QPS] | [e.g. 140 QPS] | [e.g. 196 QPS] | [e.g. 384 QPS] |
| DB Storage | [e.g. 80GB] | [e.g. 200GB] | [e.g. 420GB] | [e.g. 1.1TB] |

### 2. Physical single-instance limits
- **AWS Primary VM Limit:** [e.g., c6i.16xlarge (64 vCPUs, 128GB RAM, 10Gbps Network)]
- **Max single-node SSD capacity:** [e.g. 16TB, 16,000 IOPS]

### 3. Architectural Transition Gates
- **Trigger Gate 1 (Storage > 200GB):**
  - *Action:* Configure range partitioning by month on transaction tables and automate S3 data offloading.
- **Trigger Gate 2 (Peak QPS > 500):**
  - *Action:* Introduce database read replicas and configure application-tier write-read splitting.
- **Trigger Gate 3 (Write QPS > 1,000):**
  - *Action:* Shard tables horizontally using `tenant_id` to distribute write loads across nodes.
```
