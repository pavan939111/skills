# Denormalization

## 1. Definition & Core Concepts

Denormalization is the intentional process of introducing redundancy into a database schema by duplicating data or grouping tables to optimize read query performance and reduce join complexity.

Core concepts:
- **Read-Optimized Models:** Structuring tables to minimize the number of disk accesses and table joins required to serve a query.
- **Materialized Views:** Database-managed tables that pre-calculate and store the results of complex queries, refreshing periodically.
- **Derived/Calculated Fields:** Caching computed values (e.g., storing `order_total_amount` or `item_count` directly in the parent table) to avoid running runtime aggregates (`SUM`/`COUNT`).
- **Data Duplication:** Copying static attributes (e.g., caching `customer_name` inside the `orders` table) to eliminate join steps during high-frequency queries.

*(Boundary Note: Application-level query caching, Redis cache layers, and frontend state synchronization belong in `backend-development/`. This document covers database-level schema denormalization, database triggers, materialized views, and write overhead management.)*

## 2. Why It Exists / What Problem It Solves

Normalized databases require executing SQL joins to combine data from multiple tables. At high scale (thousands of requests/sec), running joins across tables containing millions of rows saturates database CPU and disk read queues. Denormalization resolves this read bottleneck by storing related data together on disk, allowing queries to retrieve the required payload in a single, fast table scan.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Write Anomalies (Data Drift):** A customer changes their name from "John" to "Jonathan". The database updates the primary `customers` table but fails to update the cached `customer_name` inside the `orders` table, leading to inconsistent invoices.
- **Write Path Latency Degradation:** Denormalizing fields that update frequently (e.g. price or status). Every update triggers a cascading write operation across multiple denormalized tables, bottlenecking the system.
- **Storage Cost Inflation:** Duplicating large text blobs or payloads across tables, bloating disk storage requirements.
- **Stale Analytical Reports:** Relying on materialized views that are refreshed infrequently, causing application dashboards to show stale metrics.

## 4. Best Practices

- **Profile Before Denormalizing:** Never denormalize prematurely. Design schemas to 3NF first, and only introduce denormalization after database profiling confirms table joins are a read latency bottleneck.
- **Limit to Immutable or Stable Data:** Only duplicate fields that never change (e.g. timestamps, transaction amounts) or change very rarely (e.g. usernames, category names).
- **Synchronize Asynchronously:** Use background event pipelines (Change Data Capture / transactional outbox) or database triggers to update duplicated fields asynchronously. Avoid synchronous double-writes in core transaction APIs.
- **Use Materialized Views for Analytical Scans:** Implement materialized views to store aggregated metrics, refreshing them during off-peak hours to isolate production performance.
- **Document Redundant Columns:** Clearly comment denormalized columns in the database DDL to warn future developers that the column is a replica of a primary source.

## 5. Common Mistakes / Anti-Patterns

- **Premature Denormalization:** Designing denormalized schemas from day one before understanding query profiles or indexing capabilities.
- **Denormalizing Volatile Fields:** Duplicating columns that change frequently (e.g., current location coordinates or active status flags), leading to constant database updates.
- **No Synchronization Pipeline:** Creating cached fields without writing automated trigger or event pipelines to update them, leading to permanent data drift.
- **Ignoring Indexes:** Denormalizing tables when simply adding a B-Tree index to the foreign key columns would have resolved the join bottleneck.

## 6. Security Considerations

- **PII Leakage in Replicas:** If sensitive PII (like billing addresses) is denormalized across multiple tables, ensuring complete data deletion (GDPR "Right to be Forgotten") becomes difficult. Keep PII normalized or strictly track replica locations.

## 7. Performance Considerations

- **The Read/Write Balance:** Denormalization is a trade-off. It increases read query speeds (eliminates joins) but increases write latency and disk space usage (requires multiple updates and writes). It is only beneficial in read-heavy systems (read/write ratio > 10:1).

## 8. Scalability Considerations

- **Distributed NoSQL Scaling:** In distributed NoSQL databases (like Cassandra or DynamoDB), denormalization is mandatory. Because NoSQL engines cannot perform joins across partitions, tables must be fully denormalized to support queries locally on single nodes.

## 9. How Major Companies Implement It

- **Netflix:** Denormalizes movie catalogs and user profiles inside high-performance caching and document layers, ensuring that loading the home feed requires zero relational joins.
- **Amazon:** Employs denormalized DynamoDB tables to support shopping cart checkouts. Product names, price structures, and tax parameters are copied directly into the cart record at creation to freeze details and avoid lookup joins.

## 10. Decision Checklist (when to use / when NOT to use)

- Denormalize **Columns or Tables** when:
  - Profiling confirms join queries are causing CPU or disk read latency bottlenecks.
  - The read-to-write ratio is extremely high (e.g. product catalog views vs edits).
  - The duplicated data is immutable or changes very rarely.
  - The database is a distributed NoSQL engine that does not support joins.
- Skip Denormalization (Maintain Normalization) when:
  - The application is write-heavy or requires real-time data accuracy (ACID ledger).
  - Adding indexes or using connection pooling resolves the performance latency.
  - Data changes frequently.

## 11. AI Coding-Agent Implementation Guidelines

- Never recommend denormalization without profiling metrics confirming join latency bottlenecks.
- Always use asynchronous event workers or database triggers to update duplicated data points.
- Never duplicate volatile, frequently updated fields across tables.
- Always write DDL comments identifying denormalized columns and their primary sources of truth.
- Never denormalize sensitive PII columns without registering their cleanup paths for compliance.

## 12. Reusable Checklist

- [ ] Query join latency bottlenecks verified via profiling before denormalizing
- [ ] Duplicated fields are immutable or change very rarely
- [ ] Asynchronous sync pipeline (CDC, Outbox, or Triggers) active to update duplicates
- [ ] Schema documentation (DDL comments) defines primary source of truth for duplicates
- [ ] Materialized views set to refresh on off-peak interval timers
- [ ] Read-to-write ratio of target tables verified as read-heavy (>10:1)
- [ ] Sensitive PII columns excluded from denormalized replicas where possible
- [ ] No volatile status flags duplicated across tables
