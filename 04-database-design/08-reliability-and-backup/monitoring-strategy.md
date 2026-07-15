# Monitoring (Database Telemetry)

## 1. Definition & Core Concepts

Database Monitoring is the continuous practice of collecting, aggregating, and analyzing real-time performance metrics, engine logs, lock statistics, and resource utilization from database instances to maintain system health, diagnose bottlenecks, and alert on anomalies.

Core monitoring concepts:
- **Engine-Level Metrics:** Telemetry exposed by the database engine (e.g., active connections, replication lag, transaction commit/rollback rates, lock wait durations, cache hit ratios).
- **System-Level Metrics:** Host operating system telemetry (CPU usage, RAM allocation, disk read/write IOPS, network ingress/egress, disk space utilization).
- **Slow Query Logging:** Capturing and logging queries that exceed a defined runtime execution threshold (e.g., logging queries taking >100ms).
- **Alert Fatigue:** The state where engineers ignore alerts because warning thresholds are set too low or trigger false alarms frequently.

*(Boundary Note: Code-level tracing APIs (e.g. OpenTelemetry backend instrumentation), client-side profiling decorators, and Grafana dashboard UI designs belong in operations and backend-development. This document covers database-engine metric collectors, database slow logs, telemetry endpoints, and system alerts.)*

## 2. Why It Exists / What Problem It Solves

Databases are complex state machines. A database can crash due to many non-code factors: running out of disk space, hitting maximum connection limits, experiencing replica lag, or locking critical rows. Without monitoring, these bottlenecks develop silently until they crash the server. Monitoring provides real-time visibility into database health, allowing engineers to identify and resolve performance issues before they cause outages.

## 3. What Breaks in Production Without It

- **Database Crashes from Disk Exhaustion:** Write-Ahead Logs (WAL) or temp tables fill up the server's primary storage disk. Because disk usage is not monitored, the disk hits 100% capacity, forcing the database engine to shut down immediately to prevent corruption.
- **Slow Query Degradation Storms:** A developer deploys a query that runs fine on small datasets but executes full-table scans in production. Under load, the query saturates CPU, slowing down all other concurrent queries. Without slow query monitoring, identifying the specific bottleneck query takes hours.
- **Undetected Replication Lag:** A replica node falls behind the primary node by hours due to a slow join query. The application routes read queries to the replica, serving highly stale data to users without triggering alerts.
- **Deadlock Outages:** Concurrent transactions block each other, causing transaction timeouts. Without lock wait telemetry, engineers cannot identify which rows are locked or which service is holding the lock.

## 4. Best Practices

- **Track the Core Database Metrics:**
  - *Disk Space:* Alert at 80% capacity, page at 90% (critical).
  - *Connection Pool:* Alert when active connections reach 80% of `max_connections`.
  - *Replication Lag:* Alert if replica sync lag exceeds 5 seconds.
  - *Cache Hit Ratio:* Alert if buffer cache hit ratio drops below 99% for OLTP.
  - *Lock Waits:* Monitor the count and duration of queries waiting for locks.
- **Configure Slow Query Logging:** Set the slow query log threshold to capture slow queries (e.g., `log_min_duration_statement = 100` ms in PostgreSQL). Ensure parameters are logged safely.
- **Define Multi-Tiered Alerting:**
  - *Warning Alerts (Slack/Teams):* Non-urgent issues (e.g. disk space at 75%, minor replication lag).
  - *Paging Alerts (PagerDuty/Opsgenie):* Urgent, outage-producing issues (e.g. database unreachable, disk space >90%, replica lag >5 minutes).
- **Run Telemetry Collectors Locally:** Deploy lightweight database metric exporters (e.g., `postgres_exporter`, `mysqld_exporter`) on the same subnet to poll engine statistics, shipping metrics to a time-series store (Prometheus/Datadog) every 10 to 15 seconds.

## 5. Common Mistakes / Anti-Patterns

- **Monitoring OS Metrics Only:** Tracking host CPU and memory usage while ignoring database-internal metrics (like lock waits or connection saturation).
- **Logging Everything (Verbose Logs):** Logging every query statement in production, generating massive log volumes that saturate disk write queues.
- **Alert Noise/Fatigue:** Setting alarms on normal spikes (e.g., alert on CPU >85% for 1 minute), causing engineers to mute or ignore database alerts.
- **No Disk Alerts:** Failing to alert on disk storage usage, leading to sudden out-of-space crashes.

## 6. Security Considerations

- **Redacting Parameters in Slow Logs:** Ensure query loggers redact sensitive parameters (like passwords or credit card details) in SQL log statements. Restrict read access to database query log files.

## 7. Performance Considerations

- **Collector Overhead:** Ensure metric exporters execute lightweight, indexed queries against database catalog tables. Avoid running heavy queries (like calculating table sizes using `pg_total_relation_size` on every poll) to keep monitoring overhead under 1% of database CPU.

## 8. Scalability Considerations

- **Centralized Metrics Aggregation:** Aggregate telemetry metrics from all sharded nodes and read replicas into a centralized monitoring system to enable global performance analysis and correlation.

## 9. How Major Companies Implement It

- **Stripe:** Monitors database clusters using Grafana and Datadog, tracking query metrics, connection rates, and lock waits, alerting engineers when performance deviations occur.
- **Netflix:** Collects database telemetry across global Cassandra clusters, utilizing automated alerts to detect replica synchronization drift and scale read nodes.

## 10. Decision Checklist (Database Alert Thresholds)

Configure database alerts using the following standard thresholds:

| Metric | Warning Alert Threshold | Pager/Critical Alert Threshold | Action Required |
|---|---|---|---|
| Disk Space | 80% Utilization | 90% Utilization | Clean logs, scale disks, or partition tables |
| Connections | 75% of max | 85% of max | Check connection pool leaks or add proxies |
| Replication Lag | > 5 Seconds | > 60 Seconds | Check network latency, scale replica hardware |
| Cache Hit Ratio | < 99% | < 95% | Increase memory buffer pools or optimize indexes |
| Lock Waits | > 5 queries | > 20 queries | Check transactions scopes, identify blocked IDs |

## 11. AI Coding-Agent Implementation Guidelines

- Always include database disk space and connection alerts in environment configuration scripts.
- Never write database configuration files that log all SQL statements in production.
- Always recommend database-specific exporters (e.g. pg_exporter) for system monitoring.
- Never set telemetry poll intervals under 10 seconds to protect database CPU limits.
- Always ensure slow query logs redact PII parameters.

## 12. Reusable Checklist

- [ ] Host OS metrics (CPU, RAM, Disk IOPS) monitored and alert limits set
- [ ] Database-internal metrics (connections, replica lag, cache hits) tracked
- [ ] Disk utilization alerts configured (warn at 80%, page at 90%)
- [ ] Slow query logging active (threshold configured at e.g., 100ms)
- [ ] Telemetry collector (exporter) active on private subnets
- [ ] Multi-tiered alerting (warning vs critical) defined and connected to channels
- [ ] SQL parameters sanitized in slow query logs to protect PII
- [ ] Database log rotation configured to prevent log files from filling disk spaces
