# Slowly Changing Dimensions (SCD)

## 1. Definition & Core Concepts

Slowly Changing Dimensions (SCD) is a set of data warehousing design patterns used to manage and track historical changes in dimension tables (e.g., a customer changing their address, or a product changing its category) over time.

Core SCD Types:
- **Type 0 (Retain Original):** Dimension values are immutable; changes are ignored (e.g. `birth_date`).
- **Type 1 (Overwrite):** The old value is overwritten with the new value. No historical record is kept (e.g., correcting a spelling error).
- **Type 2 (Add New Row):** A new row is inserted with the updated values. Historical records are preserved by using versioning columns:
  - `start_date` (when the version became active).
  - `end_date` (when the version expired, defaulting to a far-future date like `9999-12-31` or NULL).
  - `is_current` (boolean flag identifying the active version).
- **Type 3 (Add New Column):** The table stores the current value and the immediate previous value in separate columns, keeping limited history.
- **Type 4 (Mini-Dimension):** High-frequency changes are split out into a separate "mini-dimension" table linked to the fact table directly.
- **Type 6 (Hybrid):** Combines attributes of Types 1, 2, and 3.

*(Boundary Note: ETL script coding (e.g. Python Spark pipelines), application-layer CRUD operations, and BI tool visual layouts belong in data engineering and application books. This document covers warehouse schema design, SCD type choices, and query version filtering.)*

## 2. Why It Exists / What Problem It Solves

Operational databases overwrite data. If a customer moves from Seattle to Boston, a transactional database updates their row. If a data warehouse did the same (Type 1), historical sales reports would recalculate, showing past sales that occurred in Seattle as now occurring in Boston. SCD Type 2 resolves this by preserving historical states, allowing analysts to accurately report transactions based on the context that existed at the exact moment the event occurred.

## 3. What Breaks in Production Without It

- **Historical Metric Shifts (Data Drift):** Overwriting historical dimensions (Type 1) causes historical revenue reports to silently shift metrics (e.g., attributing past sales to the wrong sales representative or territory).
- **Duplicate Row Query Errors:** Querying a Type 2 dimension table without filtering on the active version flag (`is_current = true`). The query returns multiple rows for a single entity (one row per historical version), skewing join aggregates.
- **Failed Joins in Fact Tables:** Joining fact tables to dimension tables using the natural business key (e.g., `product_sku`) instead of the surrogate version key (e.g., `product_dim_key`). The join matches multiple versions of the product, duplicating facts.
- **Open-Ended Date Overlaps:** A bug in the ETL pipeline inserts a new version of a Type 2 dimension but fails to close the previous version (leaves `end_date` active), creating overlapping valid time periods.

## 4. Best Practices

- **Use Type 2 for Critical Business History:** Default to Type 2 versioning for dimensions where tracking historical context is required for audit or business analysis (e.g., territory assignments, pricing tiers).
- **Enforce Surrogate Version Keys in Fact Tables:** Always join fact tables to the specific surrogate version key (`dimension_dim_key`) representing the active version at the time of the transaction. Never join fact tables on natural business keys.
- **Use Far-Future Dates for Active Records:** Set the `end_date` of active Type 2 records to a standardized far-future date (e.g., `9999-12-31`) rather than `NULL` to simplify index scans and range queries (`WHERE transaction_date BETWEEN start_date AND end_date`).
- **Implement a Boolean `is_current` Flag:** Add an `is_current` column to Type 2 dimensions and index it, enabling fast query routing to current records.
- **Isolate Fast-Changing Fields (Type 4):** If an attribute updates frequently (e.g., customer credit score), do not use Type 2, as it will cause table bloat. Extract it to a Type 4 mini-dimension.

## 5. Common Mistakes / Anti-Patterns

- **Joining Facts on Business Keys:** Joining fact transactions to dimensions on `customer_uuid` instead of `customer_dim_key`, losing version history accuracy.
- **Overlapping Timestamps:** Creating overlapping date windows for the same business entity in Type 2 dimensions due to buggy ETL code.
- **Using Type 2 for High-Frequency Changes:** Applying Type 2 to columns that update daily, leading to table size inflation.
- **Querying Without Version Filters:** Writing queries that omit `is_current = true` filters when querying current dimension states, generating duplicate rows.

## 6. Security Considerations

- **Auditable Historical Logs:** Ensure historical dimension updates are write-only. Block update or delete access to expired Type 2 rows to preserve audit trails.

## 7. Performance Considerations

- **Index Optimization:** Create compound indexes on Type 2 tables covering `(business_key, is_current)` and `(start_date, end_date)` to optimize join path execution plans.

## 8. Scalability Considerations

- **Dimension Table Growth:** Type 2 dimensions expand in size over time. Configure partition strategies (e.g., partitioning by `is_current` or date ranges) to keep the active index footprint small.

## 9. How Major Companies Implement It

- **Stripe:** Tracks merchant fee agreements using Type 2 histories, ensuring that billing updates only apply to future invoices while past invoices remain locked to their historical rates.
- **Global Retail Networks:** Use SCD Type 2 schemas to track product price changes and store manager reassignments, preserving accurate territory metrics.

## 10. Decision Checklist (SCD Types Selection)

Choose the right SCD type based on requirements:

- Use **Type 1 (Overwrite)** when:
  - The change corrects a typo (e.g., correcting "Jhon" to "John").
  - Historical tracking of the attribute has zero business value.
- Use **Type 2 (Add Row)** when:
  - Historical context must be preserved for accurate transaction attribution (e.g., customer territory, product cost).
  - Changes are infrequent (e.g. a few times per year).
- Use **Type 4 (Mini-Dimension)** when:
  - Attributes change frequently (e.g., monthly credit scores, user ranks) and must be tracked.

## 11. AI Coding-Agent Implementation Guidelines

- Always use surrogate version keys (e.g. `product_dim_key`) to link fact tables to Type 2 dimension tables.
- Never write DML statements that insert a new Type 2 version without executing a corresponding update statement to close the previous version (set `end_date = CURRENT_DATE` and `is_current = false`).
- Always use a standardized far-future date (e.g. `9999-12-31`) for active records.
- Never write analytical queries against Type 2 tables without specifying `is_current = true` or a date range constraint.
- Always index the `is_current` and business key columns on Type 2 tables.

## 12. Reusable Checklist

- [ ] Core dimensions requiring historical tracking configured as SCD Type 2
- [ ] Fact tables join on surrogate version keys, not natural business keys
- [ ] Type 2 tables include `start_date`, `end_date`, and `is_current` columns
- [ ] Active Type 2 records set `end_date` to `9999-12-31` (not NULL)
- [ ] Indexes created on `(business_key, is_current)` and `(start_date, end_date)`
- [ ] ETL pipeline closes old versions atomically before inserting new ones
- [ ] No high-frequency variables stored in Type 2 dimensions (Type 4 mini-dimensions used instead)
- [ ] Update and delete permissions blocked on inactive Type 2 history rows (audit protection)
