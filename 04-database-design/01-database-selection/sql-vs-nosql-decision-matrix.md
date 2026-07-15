# SQL vs. NoSQL

## 1. Definition & Core Concepts

SQL (Relational) and NoSQL (Non-Relational) databases represent two primary data-storage paradigms, differing in schema enforcement, consistency models, and scale architectures.

Core pieces:
- **Schema Enforcement:**
  - *SQL (Schema-on-Write):* Schema structure is defined and validated by the database engine *before* data can be written.
  - *NoSQL (Schema-on-Read):* The database stores raw, unstructured/semi-structured data. Schema structure validation is deferred to the application code when reading.
- **Consistency Models:**
  - *SQL (ACID):* Immediate consistency. Transactions guarantee data is instantly accurate across all nodes.
  - *NoSQL (BASE):* Basically Available, Soft state, Eventual consistency. Data updates propagate asynchronously, allowing nodes to be temporarily out of sync.
- **Data Modeling:**
  - *SQL:* Tables, columns, rows, and relationships mapped via keys.
  - *NoSQL:* Diverse models (Key-Value, Document, Graph, Column-Family).
- **Scale Strategy:**
  - *SQL:* Primarily vertical scaling (scale-up). Reads scale horizontally, but writes are routed to a single primary node.
  - *NoSQL:* Horizontal scaling (scale-out). Data is partitioned across a shared-nothing network of nodes.

*(Boundary Note: Code-level database client library comparisons, ORM config differences, and application repository patterns belong in `backend-development/`. This document covers architectural engine paradigms, storage trade-offs, and scaling boundaries.)*

## 2. Why It Exists / What Problem It Solves

SQL databases are the standard for structured data safety, but they face bottlenecks under high-volume, rapid-scaling web workloads. NoSQL databases were created to bypass SQL's write bottlenecks and schema rigidity, allowing horizontal scaling across commodity servers and providing flexible data formats for semi-structured dynamic payloads.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Ledger Imbalances in NoSQL:** Storing a financial double-entry ledger in an eventually consistent NoSQL database. Due to replication lag, a user executes concurrent withdrawals, spending their balance twice (soft state vulnerability).
- **SQL Lockouts under High Write Traffic:** Funneling millions of continuous write events (e.g. ad clicks) into a single-primary SQL database, causing the engine's transaction log disk queue to saturate, blocking all requests.
- **Schema Migration Lockups on SQL:** Running a DDL migration (e.g. `ALTER TABLE`) on a massive SQL table containing 500M rows in production, locking tables for hours and causing application timeout outages.
- **Schema-on-Read Application Crashes:** Changing document structures in NoSQL without versioning. Older application instances crash because they attempt to read fields that do not exist in the new document shapes.

## 4. Best Practices

- **Align Consistency Needs with Database Paradigm:**
  - If immediate, strict data correctness is required (e.g., identity, billing, security), select SQL.
  - If uptime, high write throughput, and horizontal scaling are more critical than real-time correctness, select NoSQL.
- **Account for the "Schema-on-Read" Tax:** When using NoSQL, implement strict schema validation in the application logic (e.g., Zod, Pydantic) to catch database anomalies before they reach business math.
- **Normalize in SQL; Denormalize in NoSQL:**
  - In SQL, use relationships and foreign keys to eliminate duplicate data.
  - In NoSQL, embed subdocuments to ensure fast single-key read and write operations.
- **Design for Single Primary SQL Limits:** Keep SQL databases under 1TB whenever possible by archiving historical data to cold storage, avoiding long backup and migration times.

## 5. Common Mistakes / Anti-Patterns

- **Assuming NoSQL has "No Schema":** Treating NoSQL as a free-for-all. NoSQL has a schema — it is just written and managed in the application code rather than the database engine, requiring developers to write validation code.
- **Emulating Joins in NoSQL Code:** Selecting NoSQL and then writing nested client-side query loops to mimic SQL joins, resulting in slow network latency and high CPU overhead.
- **Choosing NoSQL Only for Speed:** Assuming NoSQL is always faster than SQL. For single-row lookups or optimized indexed queries, PostgreSQL and MySQL perform identically to NoSQL engines.
- **Bypassing SQL Transactions for Convenience:** Bypassing relational databases because writing DDL migrations is "annoying," compromising data integrity.

## 6. Security Considerations

- **SQL Injection vs. NoSQL Injection:**
  - SQL engines are vulnerable to standard SQL injection. Parameterize queries.
  - NoSQL engines (like MongoDB) are vulnerable to NoSQL query injection (e.g., passing operator strings like `{"$gt": ""}`). Validate parameter types strictly.

## 7. Performance Considerations

- **Index Memory Footprints:** SQL indexes are structured as B-Trees. NoSQL engines use various indexes (LSM trees, inverted files). In both cases, ensure the active indexes fit entirely in RAM to prevent disk swap lag.

## 8. Scalability Considerations

- **Sharding Complexity:** Understand that sharding a SQL database is manually coordinated by application code or middleware, whereas NoSQL engines are natively designed to shard data horizontally out-of-the-box.

## 9. How Major Companies Implement It

- **Netflix:** Migrated user billing and subscription management to highly consistent relational databases, but stores user viewing histories and content catalog data in Cassandra (NoSQL) to handle massive scale.
- **Uber:** Developed custom NoSQL datastores (Schemaless) built on top of MySQL engines, utilizing NoSQL database interfaces to handle scale while relying on MySQL for low-level node storage.

## 10. Decision Checklist (SQL vs. NoSQL Matrix)

Use the following parameters to choose:

- Choose **SQL (PostgreSQL, MySQL, Oracle)** when:
  - Data structure is highly relational and consistent.
  - Transactions span multiple tables and require immediate ACID correctness.
  - Query patterns are dynamic, requiring ad-hoc joins and reporting.
- Choose **NoSQL (MongoDB, Redis, Cassandra)** when:
  - Data is unstructured, semi-structured, or has dynamic properties.
  - Write volume requires horizontal write partitioning across nodes.
  - Query patterns are simple key-value lookups or document-centric fetches.

## 11. AI Coding-Agent Implementation Guidelines

- Always default to a relational database (SQL) for billing, invoicing, user roles, and security systems.
- Never write application-level loops to perform joins across NoSQL collections — redesign the schema to embed data or swap to a relational database.
- Always implement input schema parsing (Zod, Pydantic) on NoSQL data fetches to enforce type-safety on read.
- Never concatenate query parameters into NoSQL filter JSON structures — use explicit, parameterized client methods.
- Always use SQL migrations to manage relational schema changes incrementally.

## 12. Reusable Checklist

- [ ] Core transaction workflows (billing, auth) routed to ACID SQL databases
- [ ] NoSQL document structures designed to minimize lookup/join dependencies
- [ ] NoSQL input queries parameterized (NoSQL injection prevented)
- [ ] Schema-on-read type validations active on all NoSQL database read paths
- [ ] SQL DDL migrations versioned and run incrementally via migration tools
- [ ] Data volumes scoped (SQL preferred if database size is estimated <1TB)
- [ ] Read replica routing configured if scaling reads is required
- [ ] Sharding key planned if selecting NoSQL for horizontal scale
