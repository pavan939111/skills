# Database Review Readiness Guide

## 1. What Question This Answers
"Is the database design schema, indexing, replication, and failover model optimized and ready for production operations?"

## 2. Why It Matters at the System-Design Stage
Bad database configurations lead to index fragmentation, slow queries, locked tables, and data loss during node crashes.

## 3. Methodology / How to Work Through It
1. **Audit Schema Design:** Verify foreign key constraints and normalization tiers.
2. **Review Index Coverage:** Ensure all query paths have indexes.
3. **Verify Backup Rules:** Check snapshots configurations.
4. **Run Database Readiness Checklist:** Record output status.

## 4. Inputs Needed
- Data structures and workload estimations.
- Target RTO/RPO limits.

## 5. Outputs Produced
- Feeds directly into [Database Production Readiness Review](../../04-database-design/12-production-checklists/production-readiness-strategy.md).

## 6. Worked Checklist Example
- [x] Primary query search keys are covered by B-Tree indexes.
- [x] Automated hourly snapshots are enabled with 30-day retention policies.
- [x] Asynchronous replication is configured to standby nodes.

## 7. Common Mistakes
- **Zero Query Indexing:** Launching databases without creating indexes on lookup columns, causing query table scans.
- **Untested Backups:** Assuming backups are functional without performing restore simulations.

## 8. AI Coding-Agent Guidelines
1. **Require Indexing:** Ensure every foreign key column has a corresponding index.
2. **Validate Backups:** Request automated backups recovery alerts.
3. **Produce Database Audit Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Database Review Log: [System Name]

### 1. Database Operations Checks
- [ ] Table indexes match query requirements.
- [ ] Database backup retention lifecycles are configured.
- [ ] Master-replica synchronization lag monitors are enabled.
- [ ] Statement timeouts are set to prevent runaway queries.

### 2. Sign-off Status
- **Status:** [Go / No-Go]
- **Outstanding Actions:** [e.g. Schedule database restore testing run.]
```
