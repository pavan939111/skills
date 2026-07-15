# Primary Keys

## 1. Definition & Core Concepts

A Primary Key (PK) is a database constraint that uniquely identifies each row in a table. It enforces entity integrity by guaranteeing that the key value is both unique and non-nullable.

Core concepts:
- **Natural vs. Surrogate Key:**
  - *Natural Key:* A naturally unique attribute that already exists in the business domain (e.g., `ISBN` for books).
  - *Surrogate Key:* A synthetic, database-generated identifier created solely to act as a unique key (e.g. `uuid`, `auto_increment_id`).
- **Clustered Index Relationship:** In many relational engines (like MySQL InnoDB or SQL Server), the primary key dictates the physical storage order of rows on disk (Clustered Index).
- **Key Generation Strategies:**
  - *Auto-Increment/Serial:* Sequentially increasing integers (e.g., 1, 2, 3).
  - *UUIDv4:* Random 128-bit globally unique identifier.
  - *UUIDv7:* Time-ordered (lexicographically sortable) 128-bit globally unique identifier.
  - *Snowflake/Distributed ID:* 64-bit time-sorted integer generated across distributed nodes.

*(Boundary Note: Application-layer UUID generators (e.g. JS crypto modules), entity ID mapping annotations, and client-side ID routing logic belong in `backend-development/`. This document covers database-level constraints, clustered indexes, key sorting mechanics, and storage efficiency.)*

## 2. Why It Exists / What Problem It Solves

Primary keys prevent duplicate rows and ensure that every record can be precisely located. Without a primary key, the database engine has no definitive way to distinguish between two rows that have identical column values, leading to update errors. Furthermore, primary keys act as the endpoints for referential integrity, allowing other tables to link to them via foreign keys.

## 3. What Breaks in Production Without It

- **Slow Writes from Index Page Splits (UUIDv4 fragmentation):** Storing random UUIDv4 values as primary keys in a clustered index. Because UUIDv4 is non-sequential, the database must write data to random pages on disk. This triggers frequent B-Tree page splits, causing heavy disk write operations and slowing down inserts.
- **Auto-Increment Integer Wrapping:** Using a standard 32-bit integer (`INT`) for an auto-increment primary key on a high-volume transaction table. The sequence reaches its maximum value of `2,147,483,647` and wraps or errors, crashing all write operations.
- **Resource Scraping (Enumeration Attacks):** Exposing sequential integer primary keys (e.g. `/users/1`, `/users/2`) on public API endpoints. Attackers write simple loops to scrape every record in the database.
- **Broken Clustered Indexes:** Operating tables without primary keys. MySQL InnoDB will silently generate a hidden 6-byte row ID index, wasting system overhead.

## 4. Best Practices

- **Enforce a Primary Key on Every Table:** Never design tables without an explicit primary key.
- **Prefer Time-Sorted Identifiers for High Write Volumes:** Use time-ordered identifiers (like **UUIDv7** or **ULID**) for clustered indexes to ensure new rows are written sequentially to the end of the index on disk, avoiding B-Tree page splits.
- **Use BIGINT for Auto-Increment Sequences:** Always declare sequential keys as `BIGINT` (64-bit) instead of `INT` (32-bit) to prevent key wrapping failures in transactional tables.
- **Ensure Primary Keys are Immutable:** Never define primary keys on columns whose values can change during business workflows (like user email or username).
- **Use UUIDs/Surrogates for Public Facing Tables:** Prevent resource enumeration attacks by using UUIDs or obfuscated keys for public-facing identifiers.

## 5. Common Mistakes / Anti-Patterns

- **Mutable Natural Keys:** Using mutable columns like phone numbers or emails as primary keys, forcing heavy cascading updates across foreign keys when they change.
- **Using 32-bit Integers for Logging Tables:** Declaring `INT` keys on high-volume audit tables, causing wrap failures.
- **Neglecting Disk Storage Width:** Using very long strings (e.g., 64-character hash strings) as primary keys. Since foreign keys copy the primary key, large primary keys bloat the size of all secondary indexes.
- **UUIDv4 on Clustered Index Primaries:** Using random UUIDs as clustered primary keys in MySQL/SQL Server without optimization, leading to performance degradation as the table grows.

## 6. Security Considerations

- **API ID Obfuscation:** Even if using sequential integers internally for database joins (to keep indexes small), never expose them to public APIs. Map them to random surrogate UUIDs or use hashing libraries to obfuscate them before serialization.

## 7. Performance Considerations

- **Storage Width:** 
  - `BIGINT` takes 8 bytes.
  - `UUID` takes 16 bytes.
  - String-based IDs take 36+ bytes.
  Keep primary keys as narrow as possible because their value is duplicated in every secondary index on that table, impacting memory utilization.

## 8. Scalability Considerations

- **Distributed Key Generation:** Auto-increment columns require synchronization across database nodes, creating a single point of failure in multi-primary architectures. Use decentralized generation formats (UUIDv7, Snowflake IDs) in distributed databases to allow nodes to write independently.

## 9. How Major Companies Implement It

- **Instagram:** Uses a custom PostgreSQL key format combining timestamp bits, logical shard IDs, and auto-increment sequences, generating 64-bit time-sorted primary keys across distributed servers.
- **Stripe:** Generates string-based keys prefixed with object types (e.g., `cus_` for customer) using centralized secure random ID generators, ensuring global searchability.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **UUIDv7 / ULID** when:
  - Designing high-volume, insert-heavy transactional tables.
  - Working in distributed or sharded database environments.
  - Identifiers are exposed on public APIs (prevents enumeration).
- Use **BIGINT Auto-Increment** when:
  - Building low-to-medium scale internal databases where simplicity is preferred.
  - Index storage size must be minimized (8 bytes vs 16 bytes).
- Never use **UUIDv4 (Random)** on:
  - Clustered primary indexes without SSD-optimized storage or low write volumes.

## 11. AI Coding-Agent Implementation Guidelines

- Always define a primary key constraint on every table.
- Never declare sequential primary keys using 32-bit `INT` — always use 64-bit `BIGINT`.
- Always recommend time-ordered keys (UUIDv7/ULID) for clustered primary indexes with high write loads.
- Never use mutable data columns (email, phone, username) as primary keys.
- Always ensure primary key columns are declared as `NOT NULL`.

## 12. Reusable Checklist

- [ ] Every table has a Primary Key defined
- [ ] High-volume sequential keys declared as `BIGINT` (64-bit) to prevent wrapping
- [ ] Insert-heavy clustered primary keys use time-sorted formats (UUIDv7, ULID, or sequential IDs)
- [ ] Random UUIDv4 avoided on clustered B-Tree indexes
- [ ] Natural keys are verified as truly immutable (never changing)
- [ ] No sequential integer primary keys exposed directly to public APIs
- [ ] Primary keys are declared `NOT NULL` explicitly
- [ ] Primary key data width kept minimal to protect secondary index sizes
