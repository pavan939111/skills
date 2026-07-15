# Database Anti-Patterns

## 1. Definition & Core Concepts

Database Anti-Patterns are common database design and querying practices that appear convenient at first but lead to performance degradation, data corruption, and maintenance bottlenecks in production.

Core relational anti-patterns:
- **EAV (Entity-Attribute-Value):** Designing a generic table with `entity_id`, `attribute_name`, and `attribute_value` columns to bypass defining structured schemas in relational databases.
- **Polymorphic Associations:** A foreign key column designed to reference different parent tables dynamically depending on a type string.
- **Data Type Mismatches:** Storing structured values (dates, UUIDs, IPs) as generic `VARCHAR` strings instead of using native database datatypes.
- **BLOB Abuse (File Hoarding):** Storing raw binary files (images, PDFs, audio) inside database BLOB/BYTEA columns instead of storing reference URLs.
- **Excessive Database Business Logic:** Writing complex business calculations inside stored procedures, database functions, and triggers, coupling the application code to the database catalog.

*(Boundary Note: Code-level anti-patterns (e.g., N+1 query loops, ORM lazy loading bugs) belong in `05-query-and-performance/` and `backend-development/`. This document covers database-native schema anti-patterns, DDL structures, and catalog design flaws.)*

## 2. Why It Exists / What Problem It Solves

Anti-patterns usually originate from developers attempting to avoid database tasks, such as writing DDL migrations or configuring storage drives. Bypassing schema structure by using EAV tables or VARCHAR columns appears simple during initial coding. However, as the database scales, these shortcuts break down, resulting in slow query performance, complex SQL syntax, and data corruption.

## 3. What Breaks in Production Without It (or When Applied)

- **SQL Timeout Outages from EAV Tables:** Querying an EAV table requires joining the table to itself repeatedly to retrieve a single record (e.g., 5 joins to fetch one customer profile), causing the query optimizer to saturate database CPU.
- **Referential Integrity Bypass (Polymorphic Keys):** A polymorphic foreign key fails because SQL cannot enforce a foreign key constraint on a column that references different tables dynamically, resulting in orphaned records.
- **Database Storage Starvation (BLOB Bloat):** Storing 10MB images directly inside the database table. Querying the table pulls massive binary payloads into the database's memory buffers, pushing out hot indexes and degrading overall query speed.
- **Loss of Type Safety:** Storing dates as strings (e.g., `'15-07-2026'`). Developers write inconsistent formats (e.g., `'2026/07/15'`), breaking time-based sorting and range queries.

## 4. Best Practices

- **Avoid EAV; Use Normalization or JSONB:** If attributes vary dynamically, use native document database engines, or use PostgreSQL's `JSONB` columns with GIN indexes. Never use EAV tables.
- **Avoid Polymorphic Keys; Use Junction Tables:** Create explicit, separate junction tables for each entity relationship to maintain database-level foreign key validation.
- **Use Native Datatypes:** Always match columns to their exact native types:
  - Store UUIDs as `UUID` or `BINARY(16)`.
  - Store timestamps as `TIMESTAMPTZ`.
  - Store IP addresses as `INET`.
- **Store Files on Object Storage (S3/Cloud Storage):** Save binary files to cloud object storage. Store only the metadata and the public/private URL string inside the database.
- **Keep Business Logic in Application Code:** Keep database functions and triggers minimal, using them only to enforce basic data integrity (like setting timestamps). Place business calculations in the application code where they are easy to test and scale.

## 5. Common Mistakes / Anti-Patterns (Visual & Code Reference)

The following schema examples demonstrate anti-patterns vs. correct designs:

### Anti-Pattern 1: Entity-Attribute-Value (EAV)
```sql
-- BAD: Generic key-value table bypassing schema structure
CREATE TABLE user_metadata (
    user_id INT,
    attribute_name VARCHAR(50),
    attribute_value TEXT
);
```
*Correction:* Use a normalized table schema or a JSONB column:
```sql
-- GOOD: PostgreSQL JSONB column with GIN index for dynamic attributes
CREATE TABLE user_account (
    id BIGINT PRIMARY KEY,
    metadata JSONB
);
CREATE INDEX idx_user_metadata ON user_account USING GIN (metadata);
```

### Anti-Pattern 2: Polymorphic Associations
```sql
-- BAD: Single foreign key column pointing to different tables dynamically
CREATE TABLE comments (
    id BIGINT PRIMARY KEY,
    commentable_id BIGINT, -- Can point to Post, Video, or Invoice
    commentable_type VARCHAR(50) -- 'Post', 'Video', 'Invoice'
);
```
*Correction:* Use distinct junction tables:
```sql
-- GOOD: Explicit association tables enforcing referential integrity
CREATE TABLE post_comments (
    post_id BIGINT REFERENCES post(id) ON DELETE CASCADE,
    comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, comment_id)
);
```

## 6. Security Considerations

- **Stored Procedure SQL Injection:** If business logic must reside in stored procedures, ensure parameters are parameterized. Avoid executing dynamic SQL strings constructed via concatenation inside procedures, which exposes SQL injection vulnerabilities.

## 7. Performance Considerations

- **Memory Buffer Pollution:** Storing raw files (BLOBs) inside tables pollutes the database engine's memory buffers, displacing hot indexes and forcing disk lookups. Keep rows narrow to maximize memory caching.

## 8. Scalability Considerations

- **Stateless Application Scaling:** Moving business logic out of database stored procedures allows you to scale application nodes horizontally (which is cheap and simple) rather than bottlenecking the database server.

## 9. How Major Companies Implement It

- **Stripe:** Prohibits EAV and polymorphic associations in their database schemas, enforcing strict relational normalization and utilizing object storage for document files.
- **Amazon:** Mandates that all application services store large binary assets in S3, keeping database rows narrow and optimized for transaction queries.

## 10. Decision Checklist (Anti-Pattern Auditing)

Audit schemas for the following patterns:

- Replace **EAV Tables** when: Dynamic attributes are required (use JSONB or swap to a Document DB).
- Replace **Polymorphic Foreign Keys** when: Database referential integrity constraints must be enforced (use distinct junction tables).
- Replace **BLOB Columns** when: File size exceeds 100KB (use Cloud Object Storage and store URL strings).
- Replace **Stored Procedure Business Logic** when: Calculations can be performed in application code.

## 11. AI Coding-Agent Implementation Guidelines

- Never generate database schemas that utilize Entity-Attribute-Value (EAV) structures.
- Always use native, specific database data types for columns (e.g. `TIMESTAMPTZ` for timestamps, `UUID` for identifiers).
- Never recommend storing raw binary files (images/PDFs) inside database tables.
- Always avoid polymorphic foreign keys — use explicit junction tables.
- Never write business logic calculations inside database stored procedures or triggers.

## 12. Reusable Checklist

- [ ] Schema contains no Entity-Attribute-Value (EAV) tables
- [ ] No polymorphic foreign keys present (distinct junction tables used instead)
- [ ] Columns use native data types (no dates or UUIDs stored as VARCHAR)
- [ ] Binary files (images, PDFs) stored in cloud object storage, not in BLOB columns
- [ ] Business logic resides in application code, not in database stored procedures/triggers
- [ ] JSONB columns indexed using GIN index types when querying dynamic attributes
- [ ] No SQL reserved words used as table or column names
- [ ] Database-level constraints (FK, PK, Check) enforced instead of relying on app code
