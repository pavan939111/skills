# Availability Requirements

## 1. What Question This Answers
"What are the target system uptime requirements (SLAs), and how do they define high availability clusters, multi-AZ distributions, and failover topologies?"

## 2. Why It Matters at the System-Design Stage
A system's availability target directly dictates its infrastructure design and cost:
- 99.0% uptime ("two nines") allows for 3.65 days of downtime per year, meaning a single database node with manual recovery is acceptable.
- 99.9% uptime ("three nines") allows for 8.76 hours of downtime, requiring automated failover within a single cloud region (multi-AZ).
- 99.99% uptime ("four nines") allows for 52.6 minutes of downtime, requiring multi-AZ topologies, redundant networking, and fast node promotions.
- 99.999% uptime ("five nines") allows for 5.26 minutes of downtime, requiring active-active multi-region deployments.
Defining the availability target prevents under-engineering (causing SLA breaches) and over-engineering (wasting budget).

## 3. Methodology / How to Work Through It
1. **Analyze Uptime Goals:** Translate the business availability SLA percentage into annual, monthly, and daily downtime budgets.
2. **Identify Single Points of Failure (SPOFs):** Review the system architecture to ensure no single server, switch, or disk volume can take the system offline.
3. **Select High Availability Topologies:**
  - *Multi-AZ:* Distribute database primary and standby nodes across distinct datacenters.
  - *Multi-Region:* Stream replication to standby nodes in a separate region.
4. **Define Failover Automation:** Choose consensus-based clustering tools (like Patroni) to automate failover detection and promotion within SLA windows.
5. **Establish Maintenance SLA Boundaries:** Determine if maintenance must be executed online (zero-downtime migrations) or if offline windows are permitted.

## 4. Inputs Needed
- Product availability expectations and RTO/RPO limits from [Product Analysis NFRs](file:///c:/Users/mahip/OneDrive/Desktop/skills/00-product-analysis/non-functional-requirements-analysis.md).
- Infrastructure budget limits.

## 5. Outputs Produced
- Feeds into [Reliability Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/15-reliability-strategy/index.md) and [Deployment Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/16-deployment-strategy/index.md).

## 6. Worked Example (Financial Ledger System)
- **Uptime SLA:** 99.99% (maximum 52.6 minutes of downtime per year).
- **RTO Limit:** <30 seconds for failover promotion.
- **RPO Limit:** Near-zero data loss ($RPO \approx 0$).
- **System Design Decisions:**
  - *Clustering:* Deploy a 3-node PostgreSQL HA cluster across three AWS Availability Zones in `us-east-1`.
  - *Replication:* Configure semi-synchronous replication to ensure at least one standby replica has written transaction logs before transactions commit on the primary.
  - *Failover:* Use Patroni with Consul to manage consensus voting. If the primary crashes, the orchestrator executes STONITH fencing and promotes the standby within 15 seconds.
  - *Maintenance:* All migrations must follow zero-downtime expand-contract patterns.

## 7. Common Mistakes
- **Demanding "Five Nines" without Budget:** Setting 99.999% uptime goals without funding multi-region active-active clusters, leading to inevitable SLA breaches during regional outages.
- **Replicas without Orchestrators:** Setting up read replicas but having no automated orchestrator to promote them during primary node crashes.
- **Single-AZ HA:** Deploying database primary and standby instances in the same datacenter rack or AZ, leaving the system vulnerable to local power cuts.

## 8. AI Coding-Agent Guidelines
1. **Define Uptime Budget:** Map availability SLA percentages to real downtime budgets.
2. **Design Redundant Topologies:** Distribute database nodes across Availability Zones.
3. **Configure Failover Times:** Propose automated consensus-based managers matching RTO limits.
4. **Produce Availability Requirements:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Availability & Uptime Sizing: [System Name]

### 1. Availability Budgets
- **Target SLA:** [e.g. 99.9% ("three nines")]
- **Maximum Tolerable Downtime:**
  - **Annual:** [e.g. 8.76 hours]
  - **Monthly:** [e.g. 43.8 minutes]
  - **Daily:** [e.g. 1.44 minutes]

### 2. High Availability Topology
- **Distribution:** [e.g. Multi-AZ active-passive (3-node PostgreSQL cluster across AZ-A, AZ-B, and AZ-C)]
- **Shared Resource Redundancy:** [e.g., Shared-nothing architecture. Each node holds dedicated cloud storage disks.]
- **Database Proxy Routing:** [e.g. PgBouncer proxies route connections, dynamically updating write routes post-failover.]

### 3. Failover Metrics & Controls
- **Heartbeat Timeout:** [e.g. 10 seconds]
- **Target Promotion Time (RTO):** [e.g. <30 seconds]
- **Consensus Manager:** [e.g. Patroni utilizing Consul backend]
- **Fencing Action:** [e.g. Enforce node isolation (STONITH) before standby promotion to prevent split-brain.]
```
