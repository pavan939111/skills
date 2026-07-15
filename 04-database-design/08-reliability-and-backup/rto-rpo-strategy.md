# RTO / RPO (Recovery Objectives)

## 1. Definition & Core Concepts

RTO (Recovery Time Objective) and RPO (Recovery Point Objective) are the foundational metrics used to define database disaster recovery SLAs and design replication/backup architectures.

Core metrics:
- **RTO (Recovery Time Objective):** The maximum target duration of database downtime allowed before the system must be fully restored to operation. (Measures target speed of recovery).
- **RPO (Recovery Point Objective):** The maximum target age of data transactions that can be lost due to a recovery event. (Measures target data durability/loss window).
- **RTO/RPO Alignment Curve:** The trade-off between recovery speeds/durability and infrastructure cost. Near-zero RTO/RPO requires active-active multi-region clustering, while high RTO/RPO can run on nightly cold backups.

```
[Outage Event]
      │
◄─────┼────────────────────────►
 RPO (Data Loss Window)    RTO (Downtime Window)
◄─────┼────────────────────────►
      │
[Last Backup/Sync]         [Database Restored]
```

*(Boundary Note: Application-level service SLAs, business impact analysis spreadsheets, and customer support notification workflows belong in business operations and product analysis. This document covers database-specific RTO/RPO mapping, replication speeds, WAL archiving windows, and backup restoration times.)*

## 2. Why It Exists / What Problem It Solves

If RTO and RPO are not defined, database designs are built on assumptions. Business teams may expect zero data loss and instant recovery during outages, but engineering may have only configured simple nightly SQL dumps stored locally. If the database crashes, the company loses 24 hours of transactions and experiences hours of downtime, leading to financial loss. Defining RTO and RPO establishes clear technical requirements that dictate database clustering, replication, and backup designs.

## 3. What Breaks in Production Without It

- **Restore Time Exceeds RTO Limits:** A 2TB database primary crashes. The DBA attempts to restore from the latest backup. Downloading and extracting 2TB of raw data from cloud storage over the network takes 14 hours. The business RTO SLA was 1 hour, resulting in breach of contract penalties.
- **RPO Violations from Lagging WALs:** A database crashes. Because the WAL log shipping script only executes once every hour, the latest 45 minutes of customer purchases are lost, requiring manual audit reconciliations and customer refunds.
- **Over-Engineered Infrastructure Costs:** Setting a zero-downtime, zero-data-loss target (RTO=0, RPO=0) for a non-critical internal logging database, wasting budgets on active-active multi-region clusters when a simple nightly backup would suffice.
- **Decryption Key Drifts during DR:** Attempting to restore a database in a backup region during a disaster. The restore fails because the KMS keys needed to decrypt the backup files were not replicated to the target region, blocking RTO metrics.

## 4. Best Practices

- **Quantify RTO/RPO Per Service Domain:** Do not set a global database SLA. Classify databases based on criticality:
  - *Tier 1 (Core Transactions/Auth):* RTO < 1 minute, RPO < 5 seconds. (Requires Hot Standby + pgAudit/Patroni).
  - *Tier 2 (User Profiles/Metadata):* RTO < 2 hours, RPO < 15 minutes. (Requires Warm Standby + WAL Archiving).
  - *Tier 3 (Analytics/Internal logs):* RTO < 24 hours, RPO < 24 hours. (Requires Nightly Full Backups).
- **Match Replication Modes to RPO Targets:**
  - For $RPO \approx 0$, configure semi-synchronous or synchronous replication.
  - For $RPO < 5$ minutes, use physical streaming replication combined with continuous WAL archiving (log shipping every 1 minute).
- **Measure Actual RTO via Daily Restore Tests:** Do not estimate RTO. Run daily automated test restores in sandbox environments, recording download, decryption, and validation times to verify the real RTO.
- **Pre-position Encryption Keys in DR Regions:** Ensure KMS Key Encryption Keys (KEK) are globally replicated so that decryption does not delay RTO during disaster failovers.

## 5. Common Mistakes / Anti-Patterns

- **Setting RTO/RPO to Zero without Budget:** Demanding zero downtime and zero data loss without allocating budget for multi-AZ, multi-region clusters.
- **Estimating RTO without Testing:** Assuming a large database can be restored quickly without running restoration dry-run tests.
- **No Replication Lag Monitoring:** Failing to track replica synchronization lag, resulting in unexpected RPO violations during failovers.
- **No Network Bandwidth Calculations:** Forgetting to calculate network bandwidth limits when estimating backup download speeds, leading to slow restore times.

## 6. Security Considerations

- **KMS Access during DR Failovers:** Ensure the backup region's database IAM role has decrypt permissions for the replicated KMS keys, preventing key lockouts from blocking database RTO.

## 7. Performance Considerations

- **Write Latency vs. RPO:** Low RPO targets require synchronous or frequent asynchronous log writes, which can add disk and network latency to primary database write paths. Balance RPO targets against transaction latency requirements.

## 8. Scalability Considerations

- **Data Size Influence on RTO:** As database size grows, restoration times scale linearly. Use database partitioning to isolate active tables, allowing backups and restores to target specific partitions to maintain low RTO.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict sub-minute RTO and RPO limits across billing and ledger databases, deploying Patroni-orchestrated PostgreSQL clusters and continuous WAL log shipping to meet availability SLAs.
- **Amazon:** Configures DynamoDB replication across multiple global regions to meet low RTO/RPO limits for e-commerce carts, handling automatic failovers.

## 10. Decision Checklist (RTO/RPO Architecture Mapping)

Select database architecture based on RTO and RPO targets:

| Target RTO | Target RPO | Required Database Architecture | Estimated Cost |
|---|---|---|---|
| < 1 Minute | Near Zero ($<5$ seconds) | Multi-AZ Active-Passive HA with Semi-Synchronous Replication & Patroni Failover | High |
| < 30 Minutes | < 5 Minutes | Asynchronous Streaming Replication + Continuous WAL Archiving (1-min slot shipping) | Medium |
| < 4 Hours | < 1 Hour | Warm Standby (hourly log shipping) or Fast Volume Snapshots (hourly) | Medium-Low |
| < 24 Hours | < 24 Hours | Cold Standby (Nightly Full Backups + S3 shipping) | Low |

## 11. AI Coding-Agent Implementation Guidelines

- Always require RTO and RPO metrics to be explicitly defined in database architecture proposals.
- Never write database backup scripts that run less frequently than the defined RPO targets.
- Always include automated restore timing metrics logging in sandbox verify playbooks.
- Never configure synchronous replication for cross-region disaster recovery unless write latency budgets permit.
- Always verify that KMS key replication is configured to match DR region RTO targets.

## 12. Reusable Checklist

- [ ] RTO and RPO targets documented and approved per database service
- [ ] Database replication and backup frequencies configured to support RPO limits
- [ ] Daily automated restore tests execute in sandboxes to measure and log real RTO
- [ ] Standby replicas configured with identical hardware to handle load post-failover
- [ ] KMS decryption keys pre-replicated to the DR region (prevents restore delays)
- [ ] Replication lag monitored and alerts set to warn before RPO limits are breached
- [ ] Network bandwidth verified to support backup download times matching RTO
- [ ] Partitioning active on large tables to keep restore scopes small and fast
