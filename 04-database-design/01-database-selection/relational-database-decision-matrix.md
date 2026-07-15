# Relational Database

## 1. Definition & Core Concepts

A Relational Database Management System (RDBMS) organizes data into structured, two-dimensional tables consisting of rows (tuples) and columns (attributes), connected by defined mathematical relationships.

Core pieces:
- **The Relational Model:** Data representation via tables, where rows represent entity instances and columns represent data properties.
- **ACID Transactions:** Guarantors of database reliability:
  - *Atomicity:* All operations in a transaction succeed, or all fail.
  - *Consistency:* State transitions must preserve schema constraints.
  - *Isolation:* Concurrent transactions execute without mutual interference.
  - *Durability:* Committed changes survive system crashes.
- **Relational Integrity:** Constraints enforcing correctness: Primary Keys (PK) enforce row uniqueness; Foreign Keys (FK) enforce referential links between tables; Check constraints validate column value boundaries.
- **SQL (Structured Query Language):** The declarative language used to define, query, and manipulate relational structures.

*(Boundary Note: Code-level ORM definitions, Active Record patterns, and repository connection setups belong in `backend-development/`. This document covers database-level engine selection, schema structure constraints, and transactional storage mechanics.)*

## 2. Why It Exists / What Problem It Solves

Relational databases prevent data corruption, duplication, and fragmentation. By enforcing a strict write schema and ACID transaction controls, they ensure that complex multi-table updates (like moving money between accounts) either complete fully or roll back completely. SQL allows developers to run arbitrary queries and join tables dynamically without pre-defining data retrieval paths.

## 3. What Breaks in Production Without It

- **Data Anomalies (Drift):** Without referential integrity constraints, deleting a parent record (e.g., `customers`) leaves orphan rows in child tables (e.g., `orders`), leading to corrupted queries and reports.
- **Transactional State Corruption:** Without ACID guarantees, a system crash mid-operation leaves a multi-step change (e.g. subtracting inventory but failing to record the order) half-completed.
- **Poor Structural Consistency:** In schema-less databases, variations in row properties (e.g. spelling a column name as `email_address` in some rows and `email` in others) cause silent query failures.

## 4. Best Practices

- **Enforce Database-Level Constraints:** Always declare Primary Keys, Foreign Keys, Unique constraints, and NOT NULL checks at the database engine level. Never rely on application logic alone to enforce integrity.
- **Normalize to 3rd Normal Form (3NF):** Design schemas to eliminate redundancy by ensuring every non-key column is dependent solely on the primary key, minimizing duplicate writes.
- **Route to Read Replicas:** Scale read workloads by separating queries; direct write queries (INSERT/UPDATE/DELETE) to the primary node and read queries (SELECT) to read replicas.
- **Set Up Regular Table Maintenance:** Configure auto-vacuuming (in PostgreSQL) or optimize tables (in MySQL) to reclaim storage and update search index statistics.

## 5. Common Mistakes / Anti-Patterns

- **No Foreign Keys:** Omitting FK constraints at the database level to "improve performance," leading to orphaned records and compromised referential integrity.
- **Abusing JSON/BLOB Columns:** Storing large, unstructured JSON documents in relational columns instead of normalizing data, defeating the purpose of indexing and SQL query parsing.
- **Massive Join Paths:** Querying tables requiring 10+ joins, which degrades read performance and exhausts temporary database memory pools.
- **Long-Running Lockups:** Executing slow transactions that lock rows, causing concurrent query queues to block and exhausting connection limits.

## 6. Security Considerations

- **Database Role Separation:** Create separate database user accounts for distinct services (e.g., a read-only account for reporting tools, and a read-write account for API services).
- **Row-Level Security (RLS):** Configure database-level RLS policies to restrict row visibility based on the authenticated database tenant or role.
- **SQL Injection Prevention:** Enforce database-level parameterized execution plans to prevent malicious string inputs from manipulating SQL execution.

## 7. Performance Considerations

- **B-Tree Indexing:** Create indexes on columns used in `WHERE` clauses, `JOIN` conditions, and `ORDER BY` statements. Avoid indexing columns with high write frequency and low cardinality (e.g., booleans).
- **Connection Limits:** Relational engines allocate a thread/process per connection. Limit connection pool size, and use database connection proxies (e.g., PgBouncer) to multiplex connections.

## 8. Scalability Considerations

- **Scale-Up Limits:** RDBMS engines are fundamentally designed to run on a single primary node to maintain ACID consistency. Scaling write capacity requires sharding (partitioning tables across multiple database instances) which increases operational complexity.
- **Partitioning Large Tables:** Partition massive tables (e.g. logs by date range) into smaller physical sub-tables to keep index sizes manageable and speed up queries.

## 9. How Major Companies Implement It

- **Stripe:** Relies on highly secured PostgreSQL clusters as the single source of truth for all ledger balances, using transactional boundaries to ensure financial movements are atomic and consistent.
- **GitHub:** Operates massive MySQL clusters. They scale write throughput by implementing strict database partitioning (sharding) schemes coordinated by vitess, allowing them to route repository queries to separate database nodes.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Relational Databases (PostgreSQL, MySQL, SQL Server)** when:
  - Data structure is highly consistent and relational.
  - Strict transactional integrity (ACID) is a core requirement.
  - Complex queries requiring dynamic multi-table joins are needed.
- Use **Alternative Databases** when:
  - Write volume exceeds a single database node's capacity (use Wide-Column or Distributed NoSQL).
  - Data is unstructured, hierarchical, or has a dynamic schema (use Document DB).
  - The use case is specialized (e.g., Vector search, Time-series, or Graph traversal).

## 11. AI Coding-Agent Implementation Guidelines

- Always write database schema definitions (DDL) containing explicit Foreign Keys, Not Null constraints, and data type boundaries.
- Never use database administrator accounts (`root`, `sa`, `postgres`) for normal application service connections.
- Always create database-level indexes on primary keys, foreign keys, and unique constraint combinations.
- Never write SQL queries that concatenate variables directly — always use parameterized inputs.
- Always wrap multi-statement mutations in database transaction blocks.

## 12. Reusable Checklist

- [ ] Primary Keys defined on every table
- [ ] Foreign Key constraints enforce referential integrity between tables
- [ ] Not Null constraints applied to required attributes
- [ ] Columns indexed appropriately (joining keys, search terms)
- [ ] Database users have least privilege roles (separate read-only and write users)
- [ ] Parameterized execution enforced globally (prevents injection)
- [ ] Transaction isolation level configured appropriately (e.g., Read Committed)
- [ ] Table partitioning configured for tables expected to exceed 100M rows
- [ ] Connection pool limits set on the database engine host
