# Document Database

## 1. Definition & Core Concepts

A Document Database (a subset of NoSQL) stores semi-structured data as self-contained, hierarchical documents (typically JSON, BSON, or XML format) rather than flat rows and columns.

Core pieces:
- **Document Store:** Storing data as keys mapped to dynamic documents. Documents in the same collection can have different fields and structures.
- **Embedded Subdocuments:** Nesting arrays and child objects directly inside a single parent document (denormalization), eliminating the need for relationships and joins.
- **BSON (Binary JSON):** The binary-encoded serialization format (used by MongoDB) that extends JSON to support additional data types (e.g., Date, ObjectId, Binary).
- **Dynamic Schema:** Schema flexibility where the database engine does not enforce a rigid field structure, allowing rapid API contract evolution.

*(Boundary Note: Application-level JSON serializers, document-to-object mappers, and repository clients are out of scope. This document covers database-engine selection, document modeling constraints, and document-store indexing.)*

## 2. Why It Exists / What Problem It Solves

Relational databases require mapping complex hierarchical application objects to flat SQL tables (Object-Relational Impedance Mismatch), requiring multiple join queries. Document databases store data in the exact JSON format used by web applications, enabling fast single-key read and write operations on complete documents and eliminating migration bottlenecks for dynamic, unstructured datasets.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Application Parser Crashes (Schema Drift):** Because the database does not enforce field types by default, document shapes in a collection drift. The application crashes when attempting to read missing fields or parse unexpected types (e.g. parsing string as date).
- **Document Size Limit Failures:** Documents swell past physical limits (e.g., MongoDB's 16MB BSON limit) due to storing unbounded nested arrays (like log events), causing database write operations to fail.
- **Severe Latency from Missing Index on Nested Fields:** Querying nested properties (e.g., `user.address.zipcode`) without compound indexes causes the database to perform slow, full-collection scans, spiking CPU.
- **Uncontrolled Data Inconsistency:** Over-denormalizing mutable data (e.g., embedding customer names in 10 separate collections) leads to data inconsistency when the customer changes their name, as some documents fail to update.

## 4. Best Practices

- **Implement Database-Level Schema Validation:** Use JSON Schema validation configurations inside the document collection to enforce type, presence, and boundary checks on critical fields.
- **Design around the 16MB Document Limit:** Ensure all embedded arrays are bounded. If a nested relationship can grow indefinitely (e.g. comments on a post), use references (storing the document ID) rather than nesting.
- **Use Projections on Queries:** Never retrieve the entire document if you only need a few fields. Use SELECT projections to reduce network bandwidth and serialization CPU.
- **Select the Right Shard Key:** When scaling out, choose a shard key with high cardinality and even distribution to prevent hot partitions.
- **Enforce Write Concerns Wisely:** Configure write concerns (e.g., `w:majority`) for critical financial transactions, and relax concerns (e.g., `w:1`) for low-risk telemetry.

## 5. Common Mistakes / Anti-Patterns

- **Unbounded Arrays:** Storing logs, audit events, or transaction histories inside nested lists inside a parent document.
- **Emulating Relational DBs (Joins Overload):** Designing schemas with multiple references and executing lookup pipelines (joins) repeatedly, which NoSQL engines handle slowly.
- **No Indexing on Subdocuments:** Querying nested fields without creating indexes, causing slow execution paths.
- **Ignoring Write Conflicts:** Assuming document updates are thread-safe without configuring optimistic locking (version fields) or using atomic operators (like `$set` or `$push`).

## 6. Security Considerations

- **NoSQL Injection Prevention:** Avoid building query parameters using raw string concatenation (e.g. passing query JSON strings directly). Use structured client APIs and sanitize operator tags (like `$where`, `$or`).
- **Field-Level Encryption:** Encrypt sensitive fields (e.g., PII data inside JSON attributes) at the client boundary before storing the document in the database.

## 7. Performance Considerations

- **Index Fit in RAM:** Document databases are highly dependent on memory-mapped files. Ensure that the total size of collection indexes fits entirely within the server's RAM (Working Set), or performance will degrade.
- **Atomic Operations:** Use in-place update operators (e.g. `$inc`, `$set`, `$push`) rather than retrieving a document, modifying it in code, and saving it back, which wastes bandwidth.

## 8. Scalability Considerations

- **Replica Sets:** Deploy document databases in replica sets (e.g. 3 nodes) to ensure automatic failover and scale read traffic using secondary-read configurations.
- **Horizontal Sharding:** Partition data across independent shard servers to scale both storage capacity and write throughput.

## 9. How Major Companies Implement It

- **eBay:** Uses MongoDB to manage product catalogs. Because product properties vary wildly (e.g. screen sizes for phones vs sizes for shirts), document stores handle the diverse schema attributes cleanly without requiring millions of null columns.
- **Uber:** Utilizes document structures to store receipt metadata and trip summaries, enabling fast key-value fetches of complete historical files.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Document Databases (MongoDB, DocumentDB, Couchbase)** when:
  - Data structure is semi-structured, dynamic, or hierarchical (JSON).
  - Rapid application iteration is needed with minimal schema migrations.
  - Queries target self-contained documents (minimal relationships).
- Use **Relational or Wide-Column Databases** when:
  - Strong transactional integrity across multiple entities is required.
  - Complex SQL queries and multi-table joins are needed.
  - The dataset has highly consistent, flat rows.

## 11. AI Coding-Agent Implementation Guidelines

- Always define JSON schema validators for collections containing core business entities.
- Never store unbounded array attributes (e.g., transaction logs) inside a single document.
- Always write queries using projections to retrieve only the required fields.
- Never write database query definitions using raw string/JSON concatenation — sanitize query variables.
- Always verify that fields targeted by queries are covered by database indexes (including nested sub-properties).

## 12. Reusable Checklist

- [ ] JSON Schema validation active on collections containing core entities
- [ ] Nested arrays are bounded (no infinite growth attributes)
- [ ] Index created for every field targeted in query filters (including sub-properties)
- [ ] Working set size (indexes) fits within database RAM allocation
- [ ] NoSQL injection prevented by using structured parameter queries
- [ ] Queries use selective projections (returns only needed attributes)
- [ ] Write concerns (`w:majority`, journaling) set matching data priority
- [ ] Optimistic locking version/timestamp implemented on documents
- [ ] Client connections configured to handle replica set failover addresses
