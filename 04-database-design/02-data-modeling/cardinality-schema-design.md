# Cardinality

## 1. Definition & Core Concepts

Cardinality in database engineering has two distinct meanings:

- **Relationship Cardinality:** The numerical relationship between connected entities (One-to-One, One-to-Many, Many-to-Many), defining how many instances of entity B can associate with entity A.
- **Data (Column) Cardinality:** The number of unique values in a table column relative to the total number of rows in that table:
  - *High Cardinality:* A column containing mostly unique values (e.g. `user_id`, `email`, `social_security_number`).
  - *Low Cardinality:* A column containing few unique values across many rows (e.g. `status_flag`, `country_code`, `is_active`).

*(Boundary Note: Code-level collection sizes, pagination lengths, and application memory sizing belong in `backend-development/`. This document covers database-level relationship cardinality, index-level column cardinality, and query planner statistics.)*

## 2. Why It Exists / What Problem It Solves

Understanding cardinality is critical for both relational design and performance tuning.
- Correct **Relationship Cardinality** mapping prevents structural errors (e.g. mapping a user-role connection as 1:N when it should be M:N).
- Analyzing **Column Cardinality** ensures correct indexing decisions. Relational query optimizers use column cardinality statistics to determine whether to perform a fast index scan or a sequential table scan.

## 3. What Breaks in Production Without It

- **Ineffective Indexing Overhead:** Creating indexes on low cardinality columns (like `is_deleted` or `gender`). The database engine ignores the index because scanning the table sequentially is faster, meaning the index only wastes disk space and slows down write operations.
- **Sub-optimal Query Execution Plans:** Stale database cardinality statistics cause the optimizer to choose slow table scans instead of index scans, causing transaction timeouts under load.
- **Wrong Relationship Mappings:** Modeling a relationship as One-to-Many. The business requirement changes (e.g. users need multiple workspace roles). The database cannot support this without a structural schema migration and rewriting queries.

## 4. Best Practices

- **Create B-Tree Indexes on High Cardinality Columns:** Focus indexing on columns with many unique values (e.g. `uuid`, `created_at`, `email`) to optimize lookup performance.
- **Combine Low Cardinality Columns in Compound Indexes:** Do not index low cardinality columns individually. If search patterns require them, place them in a compound index as prefixes (e.g., creating a compound index on `(status, created_at)`).
- **Run Regular Statistics Updates:** Configure the database maintenance agent to run `ANALYZE` (or engine equivalents) periodically, ensuring the query planner has accurate cardinality metrics to choose the fastest execution paths.
- **Design Junction Tables for M:N Relationships:** Always implement Many-to-Many relationships via separate association tables to support high-cardinality links.

## 5. Common Mistakes / Anti-Patterns

- **Single-Index Low Cardinality Columns:** Indexing boolean flags (`is_active = true/false`) or status columns individually, wasting write IOPS.
- **Assuming Constant Cardinality:** Assuming a column's cardinality will remain constant. A column like `tenant_id` might have high cardinality in local dev but low cardinality in a single-tenant enterprise production deployment, changing execution patterns.
- **Neglecting to Analyze:** Disabling automatic statistics updates, leading to query plans choosing sequential scans on large tables.
- **Failing to Model Optionality:** Assuming relationships are always mandatory (e.g., requiring every user to have a billing profile), leading to transaction failures when creating guest accounts.

## 6. Security Considerations

- **Statistical Data Leaks:** Highly skewed column cardinality distributions can occasionally be exploited via side-channel timing attacks to infer table data contents (e.g. measuring query speed to guess if rare records exist). Ensure access control is enforced at the gateway boundary.

## 7. Performance Considerations

- **Query Planner Choices:** If a column has high cardinality (e.g., unique email), the database optimizer will choose an index seek (very fast). If a column has low cardinality (e.g. country = 'US' where 95% of users live), the optimizer will choose a sequential scan, bypassing the index.

## 8. Scalability Considerations

- **Shard Key Selection:** In sharded architectures, never select a low-cardinality column as your shard key. This causes massive write hotspots on a single database node. Choose a high-cardinality shard key (like `user_id` or `uuid`) to distribute data evenly.

## 9. How Major Companies Implement It

- **Stripe:** Regularly monitors index cardinality metrics to prune dead or low-use indexes, ensuring write operations remain low-latency across massive billing clusters.
- **Google:** Employs HyperLogLog algorithms inside analytical databases to estimate cardinality statistics across petabyte-scale datasets with minimal memory footprints, optimizing query planning speeds.

## 10. Decision Checklist (when to use / when NOT to use)

- Index a **Column** when:
  - The column has high cardinality (unique or highly varied values).
  - The column is targeted in `WHERE` and `JOIN` filters.
- Combine **Columns into a Compound Index** when:
  - You query a low-cardinality column (e.g., status) paired with a high-cardinality column (e.g., date). Place the low-cardinality column first in the index key.
- Skip Indexing a **Column** when:
  - The column has low cardinality and is queried in isolation.

## 11. AI Coding-Agent Implementation Guidelines

- Never create B-Tree indexes on individual boolean, enum, or low-cardinality status columns.
- Always include `ANALYZE` commands or equivalent statistics update loops in database maintenance scripts.
- Never write database query models that assume relationships are strictly 1:N if business rules suggest eventual growth to M:N — use junction tables.
- Always verify that the selected database shard key has a high-cardinality value distribution.

## 12. Reusable Checklist

- [ ] High-cardinality columns (UUID, email) prioritized for indexing
- [ ] No single-column indexes exist on low-cardinality columns (booleans, enums)
- [ ] Compound indexes position low-cardinality fields as prefixes (first)
- [ ] Relationship cardinality correctly modeled (1:1, 1:N, M:N via junction tables)
- [ ] Automated database statistics updates (`ANALYZE` / `VACUUM ANALYZE`) active
- [ ] Shard key selection uses a high-cardinality attribute (no hotspots)
- [ ] Optional relationship cardinality (nullability) configured correctly on foreign keys
- [ ] Column indexes reviewed and pruned if cardinality ratios drop below usability thresholds
