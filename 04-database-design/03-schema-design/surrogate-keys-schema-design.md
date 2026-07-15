# Surrogate Keys

## 1. Definition & Core Concepts

A Surrogate Key is a synthetic, database-generated primary key that has no logical connection to the business domain or attributes of the row (e.g., an auto-incrementing integer or a UUID). It exists solely to uniquely identify a record.

Core concepts:
- **Design Neutrality:** The key contains no business meaning or information (unlike natural keys like SSN or email).
- **Auto-Incrementing Integer:** A simple sequential counter managed by the database server (typically `BIGINT`).
- **Universally Unique Identifier (UUID):** A 128-bit value ensuring global uniqueness across systems without a central authority:
  - *UUIDv4:* Randomly generated, prone to index fragmentation.
  - *UUIDv7:* Time-ordered, optimized for database B-Tree clustering.
- **Distributed ID Generation:** Generating unique keys across multiple servers using time-sorted, coordinate-based systems (e.g., Snowflake IDs, ULID).

*(Boundary Note: Code-level ID obfuscation wrappers, ORM sequence configurations, and API payload serializations are out of scope. This document covers database-level surrogate types, clustered index behaviors, and storage footprint rules.)*

## 2. Why It Exists / What Problem It Solves

Natural keys are volatile. A business attribute that appears unique and immutable (like an email address, tax ID, or product barcode) often changes due to operational updates (e.g. a customer changes their email, or a manufacturer reuses a barcode). If a natural key is used as a primary key, updating it requires updating all child tables' foreign keys, locking rows. Surrogate keys decouple the database structure from business logic, ensuring key stability.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Database Lockups from Natural Key Updates:** Using user emails as primary keys. A customer updates their email address. The database must execute cascading updates on millions of foreign key rows across 20 tables, locking the database and causing API timeouts.
- **Key Collisions in Distributed Environments:** Multiple servers generate auto-incrementing sequential keys (`1`, `2`, `3`) independently. Merging their databases causes key conflicts and data corruption.
- **Index Performance Collapse:** Using wide, non-sequential string values as surrogate keys (e.g., 64-character hashes), which bloats the size of all secondary indexes and slows writes due to index page fragmentation.
- **Security Enumeration Exploits:** Exposing internal auto-incrementing integer keys on public URLs, allowing malicious scripts to scrape private customer profiles sequentially.

## 4. Best Practices

- **Default to Surrogate Keys for Primary Entities:** Use surrogate keys as the primary key for most tables (e.g., users, transactions, workspaces).
- **Prefer UUIDv7 / ULID for High-Scale Writes:** Use time-sorted unique identifiers for database primary keys to ensure sequential disk writes and avoid index page splits.
- **Use BIGINT for Internal Sequential Keys:** If using sequential numbers, always declare them as `BIGINT` to prevent integer wrap errors.
- **Keep Surrogates Hidden from APIs:** If using sequential integers internally for fast joins, map them to random UUID keys for public API requests to prevent scraping.
- **Enforce Unique Constraints on Natural Attributes:** Even when using a surrogate key, always enforce database-level `UNIQUE` constraints on natural identifiers (like `email` or `tax_id`) to prevent duplicate records.

## 5. Common Mistakes / Anti-Patterns

- **Exposing Auto-Increment IDs:** Letting raw sequential integers leakage to public API payloads, enabling scraping.
- **Using UUIDv4 in Clustered Indexes:** Using random UUIDs as primary keys in engines that store tables by key order (like MySQL InnoDB), degrading write throughput.
- **Natural Key Assumption:** Assuming a business attribute is immutable and unique, only to write complex migration scripts when it changes.
- **Bloated Surrogate String Widths:** Using long, custom alphanumeric strings as keys, wasting index RAM.

## 6. Security Considerations

- **Id Predictability:** Sequential keys are predictable. Attackers use them to access unauthorized endpoints. Prevent this by using UUIDv7/ULID keys or cryptographically generated random hashes on client routes.

## 7. Performance Considerations

- **Key Size Index Bloat:** Every secondary index on a table copies the primary key. If a surrogate key is a wide string (36 bytes) instead of a `BIGINT` (8 bytes) or a binary `UUID` (16 bytes), the secondary index footprint expands, reducing page cache efficiency. Store UUIDs in binary format (`BINARY(16)` or native `UUID` type), not as 36-character strings.

## 8. Scalability Considerations

- **Decentralized Scale:** Auto-increment columns require a single master database to coordinate the sequence, bottlenecking multi-primary scaling. Using decentralized formats (UUIDv7, Snowflake IDs) allows nodes to write independently.

## 9. How Major Companies Implement It

- **Stripe:** Uses random, prefix-obfuscated string surrogate keys (e.g., `ch_9aF8`) generated securely on clients, preventing internal database sequence locks.
- **Instagram:** Generates time-sorted 64-bit surrogate keys containing timestamp and logical shard ID bits to coordinate writes across distributed databases.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **UUIDv7 / ULID / Distributed IDs** when:
  - Designing distributed, sharded, or multi-primary architectures.
  - Identifiers are exposed on public API routes.
  - Insert volume is high and index performance must be protected.
- Use **BIGINT Auto-Increment** when:
  - Working in single-primary databases with small or medium data volumes (<1TB).
  - Internal index storage space is a critical constraint.
- Never use **Natural Keys** as:
  - Primary keys on tables where the attribute values can change or are managed by external third-parties.

## 11. AI Coding-Agent Implementation Guidelines

- Always use surrogate keys (UUIDv7 or `BIGINT`) for primary entity tables.
- Never expose sequential integer keys on public API endpoints.
- Always store UUIDs using native `UUID` or `BINARY(16)` column types.
- Never use random UUIDv4 as a primary key in clustered index tables.
- Always declare unique constraints on natural attributes even when using a surrogate key.

## 12. Reusable Checklist

- [ ] Primary keys use synthetic surrogate identifiers (UUIDv7 or `BIGINT`)
- [ ] No sequential integer keys exposed to public API endpoints
- [ ] UUIDs stored using native `UUID` or `BINARY(16)` column types (no strings)
- [ ] Unique constraints (`UNIQUE`) enforce business keys (email, tax ID) separately
- [ ] Sequential surrogate keys declared as `BIGINT` (64-bit) to prevent wrap failures
- [ ] Time-sorted identifiers (UUIDv7/ULID) selected for high-volume clustered indexes
- [ ] No business logic embedded in surrogate key values
- [ ] Secondary indexes audited to ensure key width does not cause RAM bloat
