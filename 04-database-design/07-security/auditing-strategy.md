# Database Auditing (Security Activity Logging)

## 1. Definition & Core Concepts

Database Auditing is the security practice of recording and monitoring system events, administrative changes, data access patterns, and schema modifications within a database engine to maintain compliance, trace forensics, and detect data breaches.

Core auditing concepts:
- **System Audit Logs:** Logs generated directly by the database engine recording connection events, authentication results, and system configurations.
- **DDL & DCL Auditing:** Logging all Data Definition Language (`CREATE`, `ALTER`, `DROP` tables) and Data Control Language (`GRANT`, `REVOKE` privileges) actions.
- **pgAudit (PostgreSQL Audit Extension):** A specialized database extension that provides detailed session and object auditing, logging specific operations matching audit profiles.
- **WORM (Write-Once, Read-Many) Storage:** Immutable storage destinations (e.g. locked S3 buckets, write-locked log streams) where audit logs are shipped, preventing logs from being altered or deleted.
- **Database Activity Monitoring (DAM):** Independent software agents that monitor SQL queries and server access logs in real-time without impacting engine performance.

*(Boundary Note: Schema-level metadata columns (`created_at`, `updated_at`) inside data tables are covered in `04-database-best-practices/`. This document covers database engine system logs, pgAudit configurations, DDL change tracking, failed connection audits, and immutable log destinations.)*

## 2. Why It Exists / What Problem It Solves

If database queries are not audited, security breaches can go undetected. An attacker who gains access to database credentials can download tables, drop databases, or change user permissions without leaving a trace. Compliance frameworks (SOC 2, HIPAA, PCI-DSS) require maintaining an immutable, detailed log of all administrative and data access operations to enable forensic reconstruction during security incidents.

## 3. What Breaks in Production Without It

- **Undetected Data Breaches:** An attacker steals a backup database credential and slowly downloads the entire customer database over weeks. Because query logging is disabled, the breach is only discovered months later when customer data is leaked online.
- **Database Crashes from Log Disk Exhaustion:** Logging every single SQL query (including high-frequency, low-risk `SELECT` queries) in production, causing log files to consume all disk space, crashing the server.
- **Audit Log Tampering:** An attacker compromises the database server as a superuser. They delete the local log files to hide their activities, leaving security forensics impossible.
- **Failed Compliance Audits:** Disqualification from target industry certifications due to a lack of centralized audit trails for database configuration modifications.

## 4. Best Practices

- **Log all DDL and DCL Operations:** Always log schema changes (`ALTER TABLE`, `DROP TABLE`) and permission updates (`GRANT`, `REVOKE`).
- **Log all Failed Authentication Attempts:** Record all connection failures, source IP addresses, and usernames to identify brute-force attacks.
- **Ship Audit Logs to Immutable External Storage:** Instantly stream database logs to an external, write-locked destination (e.g. AWS CloudWatch or a secure central log server) separate from the database host machine. Ensure the database user has no permission to edit or delete these logs.
- **Enable pgAudit for PostgreSQL:** Install and configure the `pgAudit` extension to provide granular session auditing, mapping log statements to target schemas and tables.
- **Redact Sensitive Parameters:** Configure the audit logging engine to redact sensitive values (like plain-text passwords or card details) in SQL statement inputs before writing them to log files.
- **Isolate Audit Log Disks:** If logs must be written locally before shipping, use a separate physical disk partition for logs to prevent log growth from consuming primary database storage.

## 5. Common Mistakes / Anti-Patterns

- **Logging All SELECT Queries (Verbose Logging):** Logging every read query on high-frequency tables, saturating disk write queues.
- **Storing Logs Locally on the Database Disk:** Keeping audit logs in the same directory as database tables, allowing attackers to delete them.
- **Ignoring Database Superuser Actions:** Excluding the `postgres` or `sa` master account actions from audit logs, leaving admin actions untracked.
- **No Log Monitoring Alerts:** Collecting logs without setting up automated alerts for anomalies (e.g. alert on >10 failed connection attempts in 1 minute).

## 6. Security Considerations

- **Log Tampering Protection:** Ensure the log shipper uses a secure, write-only service role. The database server must only have permissions to append logs, never to delete or rewrite historical audit files.

## 7. Performance Considerations

- **Log Serialization Cost:** Verbose database logging creates I/O bottlenecks. Optimize log settings to record only critical events (DCL, DDL, failed logins, write mutations on sensitive tables), keeping read-heavy query trails disabled.

## 8. Scalability Considerations

- **Centralized Log Aggregation Hubs:** Route all database logs to centralized enterprise SIEM (Security Information and Event Management) platforms (like Splunk or Datadog) to aggregate and analyze audit trails at scale.

## 9. How Major Companies Implement It

- **Stripe:** Automatically routes all PostgreSQL audit logs via pgAudit to an immutable, centralized logging infrastructure, alerting security teams instantly if any DDL operation is executed outside the automated migration window.
- **Financial Institutions:** Enforce write-once logging (WORM) on all database environments, preserving immutable, tamper-proof logs for 7+ years to comply with banking regulations.

## 10. Decision Checklist (Auditing Sizing Framework)

Configure audit parameters based on the following:

- Use **DDL, DCL, and Connection Auditing** on:
  - Every production database table and environment.
- Use **Granular Data Auditing (pgAudit)** on:
  - Tables containing highly sensitive operational data (PII, billing configurations, transaction ledger states).
- Never use **Verbose Query Logging (SELECT * logging)** on:
  - High-traffic read tables (e.g. product catalog lookups, session caches) where log I/O would saturate storage.

## 11. AI Coding-Agent Implementation Guidelines

- Always include DDL and DCL auditing parameters in database server installation scripts.
- Never write database configuration files that store audit logs on the primary table disk partition.
- Always recommend pgAudit extension integration for PostgreSQL databases.
- Never generate code templates that log raw plaintext values of passwords or credit cards in query logs.
- Always configure database setups to stream logs to an external syslog or cloud log group.

## 12. Reusable Checklist

- [ ] All DDL (`CREATE`, `ALTER`, `DROP`) and DCL (`GRANT`, `REVOKE`) actions logged
- [ ] Failed database connection attempts and source IP addresses recorded in logs
- [ ] Database system logs streamed in real-time to an external, write-once storage destination
- [ ] pgAudit extension installed and active (for PostgreSQL instances)
- [ ] Audit log storage isolated on a separate disk partition from database table data
- [ ] Automated monitoring alerts set for anomalous database admin activity
- [ ] SQL query parameters redacted or sanitized before writing to log files
- [ ] Superuser (`postgres`, `sa`, `root`) activities fully included in audit logs
