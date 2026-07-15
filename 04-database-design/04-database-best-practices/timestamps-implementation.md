# Timestamps

## 1. Definition & Core Concepts

Timestamps represent date and time attributes in database schemas. Defining them correctly ensures accurate time-based ordering, interval comparisons, and database timezone conversions.

Core concepts:
- **UTC (Coordinated Universal Time):** The global time standard. Storing timestamps in UTC ensures they are unaffected by local timezone offsets or daylight saving time (DST) shifts.
- **Timezone-Aware Type (e.g., `TIMESTAMPTZ`):** Database column types that store the offset or convert the input time to UTC internally, returning the value relative to the client's timezone connection.
- **Timezone-Unaware Type (e.g., `TIMESTAMP`):** Columns that store the raw date and time values exactly as inputted, ignoring offsets and timezone context.
- **Unix Epoch Time:** Storing time as an integer representing seconds (or milliseconds) elapsed since January 1, 1970 (UTC).
- **Resolution Precision:** The sub-second accuracy level of the timestamp (seconds, milliseconds, microseconds, or nanoseconds).

*(Boundary Note: Code-level date-formatting libraries (e.g., moment.js, date-fns), client timezone detection code, and timezone offset parsing logic belong in `backend-development/`. This document covers database-level date types, timezone-aware index tables, and NTP clock synchronization.)*

## 2. Why It Exists / What Problem It Solves

If databases store timestamps without timezone awareness or use local system times (e.g. EST or GMT), data becomes inconsistent. When servers span multiple geographical regions, updates write with inconsistent times. Daylight saving time changes cause duplicate transaction timestamps or offset gaps. Standardizing on timezone-aware UTC types ensures data integrity, chronological sorting, and consistent reporting.

## 3. What Breaks in Production Without It

- **Historical Metric Shifts (DST Anomalies):** Storing time in timezone-unaware columns. During the annual DST clock shift back (e.g. 2:00 AM becomes 1:00 AM), the database writes duplicate timestamps for distinct events, breaking time-series metrics.
- **Transactional Accounting Outages:** A payment is processed at 11:30 PM in California on December 31. Because the database stores local time without offset tracking, reporting engines record the transaction in the next year's budget, causing tax compliance errors.
- **Slow Queries from String-Formatted Times:** Storing timestamps as strings (e.g. `VARCHAR('2026-07-15 19:00:00')`). String comparisons bypass range optimizations and slow down queries.
- **Clock Drift in Distributed Nodes:** Database cluster nodes lose NTP (Network Time Protocol) synchronization, causing transaction timestamps to drift and creating order-of-operation errors.

## 4. Best Practices

- **Always Store Timestamps in UTC:** Standardize the database engine to store all date and time attributes in UTC.
- **Use Timezone-Aware Datatypes:** Default to timezone-aware types (`TIMESTAMPTZ` in PostgreSQL, `TIMESTAMP` in MySQL/Oracle). Avoid timezone-unaware types (`TIMESTAMP WITHOUT TIME ZONE`) unless modeling abstract local time.
- **Specify Precision Explicitly:** Define the precision level of timestamps (e.g. `TIMESTAMPTZ(3)` for millisecond resolution or `TIMESTAMPTZ(6)` for microsecond resolution) to ensure consistent storage width.
- **Index Timestamps for Range Queries:** Create B-Tree indexes on timestamp columns targeted in `WHERE` filters, sorting queries, or sync loops (e.g. `created_at`).
- **Use Native Date Types:** Never store timestamps as strings or raw floats. Use native datetime columns to allow the database to apply date-math optimizations.
- **Enforce NTP Synchronization:** Ensure all database host servers run active NTP daemons to keep system clocks synchronized, preventing time drift anomalies.

## 5. Common Mistakes / Anti-Patterns

- **Timezone-Unaware Storage:** Using `TIMESTAMP` columns, which strips timezone context.
- **String-Formatted Dates:** Storing datetimes in `VARCHAR` fields, preventing indexing and range calculations.
- **Local Time Storage:** Running database servers in local timezone configurations instead of UTC.
- **Epoch Float Storage:** Storing Unix timestamps as floating-point numbers instead of integers or native types, leading to rounding errors.

## 6. Security Considerations

- **Timestamp Precision Auditing:** Precision audit timestamps prevent attackers from spoofing actions. High-resolution timestamps (microseconds/nanoseconds) are required to verify the sequence of events during security audits.

## 7. Performance Considerations

- **Storage Width:** 
  - Standard `TIMESTAMP` takes 8 bytes.
  - `INT` Unix epoch takes 4 bytes (limited to 2038).
  - `BIGINT` Unix epoch takes 8 bytes.
  Use native database date types since modern engines compress and index them more efficiently than integer epochs.

## 8. Scalability Considerations

- **Distributed Order of Events:** In distributed multi-primary databases, clock synchronization is critical. If clock drift exceeds limits, transaction ordering fails. Use distributed databases with TrueTime architectures (like Google Spanner) or logical clocks if strict ordering is required.

## 9. How Major Companies Implement It

- **Stripe:** Records all payment events, disputes, and webhook logs in UTC using timezone-aware ISO-8601 formatting, returning unified timestamp attributes globally to merchants.
- **Netflix:** Monitors streaming playbacks and server metrics using UTC microsecond timestamps, enabling precise correlation of telemetry data across thousands of services.

## 10. Decision Checklist (Datetime Types Selection)

Choose the datetime type:

- Use **Timezone-Aware Timestamps (TIMESTAMPTZ)** when:
  - Storing transactional timestamps (e.g. `created_at`, `updated_at`, `transaction_time`).
  - Data is queried across multiple timezones.
  - Accurate chronological ordering is a strict requirement.
- Use **Date (DATE)** when:
  - Storing calendar dates that do not have a time component (e.g. `birth_date`, `holiday_date`).
- Use **Timezone-Unaware Timestamps (TIMESTAMP)** ONLY when:
  - Modeling abstract time templates independent of timezones (e.g., "Open store at 9:00 AM every day regardless of region").

## 11. AI Coding-Agent Implementation Guidelines

- Always store dates and times in UTC format.
- Never declare database timestamp columns using timezone-unaware types (like `TIMESTAMP` in Postgres). Use `TIMESTAMPTZ`.
- Always store date fields using native database datetime types (never use `VARCHAR`).
- Never use floating-point numbers to store epoch time.
- Always configure database host setups with active NTP synchronization validation checks.

## 12. Reusable Checklist

- [ ] All database timestamps stored in UTC format
- [ ] Columns use timezone-aware data types (`TIMESTAMPTZ` / `timestamp with time zone`)
- [ ] No VARCHAR or FLOAT columns used to store dates or times
- [ ] Calendar-only dates (e.g., birthdays) stored using the `DATE` type
- [ ] Indexes created on timestamp columns targeted in range queries and sorts
- [ ] Resolution precision (e.g., milliseconds) defined consistently across tables
- [ ] NTP clock synchronization active on all database host servers
- [ ] Database server engine timezone set to UTC globally
