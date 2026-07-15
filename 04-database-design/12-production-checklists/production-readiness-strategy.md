# Production Readiness Checklist

## 1. Purpose
This checklist consolidates core reliability, performance, security, scaling, backup, and observability requirements into a final production-readiness sign-off before launching a new database cluster or moving a database instance into active production environments.

## 2. Checklist

### Reliability & HA
- [ ] Database instances deployed across at least three distinct Availability Zones (multi-AZ).
- [ ] Primary and replica nodes configured with matching hardware resources (CPU, RAM, IOPS).
- [ ] Automated failover orchestrator (e.g. Patroni) active and tested (split-brain fencing enabled).
- [ ] Database connection proxies (PgBouncer, ProxySQL) active to manage connection slots.

### Backup & DR
- [ ] Weekly physical backups and continuous WAL archiving are active.
- [ ] Daily automated restore testing verify that backups are restorable.
- [ ] Decryption keys replicated to DR region KMS stores.
- [ ] DR replication lag monitored and alerts active.

### Security & Auditing
- [ ] Database port is inaccessible to the public internet (restricted to private VPC subnets).
- [ ] SCRAM-SHA-256 password hashing active. TLS v1.3 forced on client connections.
- [ ] Row-Level Security (RLS) active and tested for multi-tenant tables.
- [ ] Database-native query auditing (pgAudit) active and logging modifications.

### Telemetry & Performance
- [ ] Host OS metrics (CPU, RAM, IOPS) and database metrics (connection count, lag) tracked.
- [ ] Alert limits set for disk space utilization (warn at 80%, page at 90%).
- [ ] Slow query logging active (threshold configured at e.g., 100ms).
- [ ] Average query latencies stay under SLA limits (<50ms).

## 3. Cross-references
This checklist compiles rules from the following detailed topic folders:
- [04 Database Best Practices](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/04-database-best-practices/index.md)
- [06 Scalability Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/06-scalability/index.md)
- [07 Security & Access Control](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/07-security/index.md)
- [08 Reliability & Backup](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/08-reliability-and-backup/index.md)

## 4. Sign-off Criteria
The database production readiness review passes when:
1. 100% of checklist boxes are verified.
2. Simulated zone failover verifies database recovery within RTO limits.
3. Security audits verify that connection rules block non-VPC IP endpoints.
4. Monitoring dashboard verifies that telemetry and alerting routes (PagerDuty) are online.
