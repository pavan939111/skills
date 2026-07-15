# Disaster Recovery (DR)

## 1. Definition & Core Concepts

Database Disaster Recovery (DR) is the set of policies, tools, and procedures designed to recover database infrastructure and restore access to data following a catastrophic event (e.g., natural disasters, complete cloud region outages, major ransomware attacks).

Core DR concepts:
- **RTO (Recovery Time Objective):** The maximum tolerable duration of database downtime before the system must be restored.
- **RPO (Recovery Point Objective):** The maximum tolerable age of data that can be lost due to a recovery event (e.g. RPO of 1 hour means losing at most 1 hour of transactions).
- **Standby Topologies:**
  - *Hot Standby:* A live replica in a separate region actively receiving replication streams and ready to accept reads and writes instantly on failover.
  - *Warm Standby:* A standby replica that receives log files asynchronously, running but requiring configurations changes or promotion to become a primary.
  - *Cold Standby:* A database configuration node that is not running, built from scratch by restoring backup files when a disaster occurs. (Slowest RTO, cheapest cost).
- **Multi-Region Replication:** Asynchronously streaming transaction logs to a database replica located in a separate geographical region.

*(Boundary Note: Code-level DNS switchers, cloud network load balancer route rules, and corporate communication plans belong in operations and backend-development. This document covers database-level replication channels, failover promotion, split-brain resolution, and RTO/RPO limits.)*

## 2. Why It Exists / What Problem It Solves

Cloud datacenters can experience complete physical failures (e.g., power grid drops, network line cuts, or fires). If a database runs entirely within a single region, a regional outage takes the business offline and risks data loss. A disaster recovery plan ensures that data is replicated to a separate geographical zone and runbooks exist to promote standby servers, keeping the system available.

## 3. What Breaks in Production Without It

- **Total Outage during Regional Failures:** Running a single-region database setup. When the cloud provider experiences a regional blackout, the application goes offline for hours with zero option to boot elsewhere.
- **Split-Brain Write Conflicts:** A network hiccup interrupts communication between the primary region and the DR region. The DR manager mistakenly assumes the primary has crashed and promotes the standby. Both nodes accept writes concurrently. When the network heals, the database states diverge, corrupting transactional records.
- **catastrophic Data Loss from Laggy Promotons:** Promoting a standby replica that has a high replication lag (e.g. 1 hour behind) during a failover, causing the database state to lose 1 hour of committed customer transactions.
- **Missing KMS Keys in DR Region:** The DR database fails to boot in the backup region because the KMS Key Encryption Keys (KEK) were only defined in the primary region, preventing file decryption.

## 4. Best Practices

- **Enforce Cross-Region Asynchronous Replication:** Maintain at least one hot or warm standby replica in a separate geographical region to protect against regional outages.
- **Replicate KMS Keys Globally:** Configure multi-region replication for KMS keys, ensuring the backup region database has permission to decrypt storage volumes and backup files.
- **Enforce Human-in-the-Loop for Cross-Region Failover:** Avoid fully automating cross-region failovers based on simple ping monitors. Temporary WAN hiccups can trigger false failovers, leading to split-brain. Require manual confirmation or quorum votes.
- **Measure and Monitor Replication Lag Continuously:** Trigger alerts if replication lag to the DR node exceeds RPO thresholds (e.g. alerts if lag >5 minutes).
- **Practice Regular DR Simulation Drills:** Run scheduled, simulated regional failover drills quarterly. Shift database traffic to the standby region and verify recovery steps under realistic conditions.

## 5. Common Mistakes / Anti-Patterns

- **Single Region Storage:** Keeping database backups and standby nodes in the same cloud region as the primary server.
- **No Cross-Region Key Replication:** Forgetting to synchronize KMS encryption keys to the DR region.
- **Automatic Cross-Region Promotion without Quorum:** Promoting standby nodes automatically on short network drops, leading to split-brain.
- **Ignoring Data Residency Laws (GDPR):** Replicating database tables containing raw PII to DR nodes in countries with conflicting data privacy laws.

## 6. Security Considerations

- **Secure DR Connection Paths:** Ensure the cross-region replication stream is encrypted using TLS (mTLS), and the network paths utilize dedicated VPNs or private cloud connection channels, avoiding exposure to the public internet.

## 7. Performance Considerations

- **Asynchronous Replication Overhead:** Do not use synchronous replication across distant geographical regions (high network latency). Use asynchronous replication to protect primary write performance, and accept minor RPO data lag.

## 8. Scalability Considerations

- **Stateless Read Routing during DR:** Use global database proxies to abstract connection details. During a failover, update the proxy configuration once, routing all application traffic to the new primary.

## 9. How Major Companies Implement It

- **Stripe:** Maintains database standbys across multiple AWS regions, replicating transaction logs asynchronously and conducting automated failover drills to verify RTO/RPO boundaries.
- **Netflix:** Utilizes active-active multi-region deployments (using Cassandra), allowing writes in any regional zone and replicating state changes globally in the background to handle data center losses.

## 10. Decision Checklist (DR Topology Selection)

Select the DR topology based on RTO/RPO:

- Use **Hot Standby (Active-Passive Replication)** when:
  - RTO must be under 30 minutes.
  - RPO must be under 1 minute.
  - Budget permits paying for matching database instances in two regions.
- Use **Warm Standby (Log Shipping)** when:
  - RTO can be up to 4 hours.
  - RPO can be up to 1 hour.
  - You want to reduce instance costs in the backup region.
- Use **Cold Standby (Backup Recovery)** when:
  - RTO can be 24+ hours (non-critical, internal systems).
  - RPO of 24 hours is acceptable (nightly backups).
  - Minimizing infrastructure cost is the primary constraint.

## 11. AI Coding-Agent Implementation Guidelines

- Never write database configuration files that store backups and standbys in the same cloud region.
- Always recommend asynchronous replication instead of synchronous replication for cross-region disaster recovery.
- Always ensure KMS key replication configurations are included in multi-region deployment playbooks.
- Never automate cross-region failovers without implementing split-brain prevention checks (e.g. majority consensus quorum).
- Always include database replication lag monitoring and alerts in telemetry configurations.

## 12. Reusable Checklist

- [ ] Hot or warm standby database node active in a separate geographical region
- [ ] Database encryption keys (KEKs) replicated to the DR region KMS vault
- [ ] Replication lag to DR standby monitored and alerts configured
- [ ] Split-brain prevention checks configured (manual failover confirmation required)
- [ ] DR replication stream encrypted via TLS over private network paths
- [ ] Regular DR failover drills scheduled (quarterly testing)
- [ ] RTO and RPO metrics documented and validated against business SLAs
- [ ] Database configuration parameters synchronized between primary and standby nodes
