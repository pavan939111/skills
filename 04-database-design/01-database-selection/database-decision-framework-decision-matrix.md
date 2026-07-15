# Database Decision Framework

## 1. Definition & Core Concepts

The Database Decision Framework is a structured methodology used to analyze application workloads and select the correct database engine (or engines) based on technical requirements, performance constraints, and operational realities.

Core pieces:
- **Workload Classification:** Identifying if the application is read-heavy, write-heavy, transactional, analytical, or search-centric.
- **Data Structure Analysis:** Determining if data is tabular (highly structured), hierarchical (semi-structured documents), key-based (simple lookups), connected (networks/graphs), or time-series.
- **Consistency Constraints:** Assessing if the business requires immediate consistency (ACID) or can tolerate eventual consistency (BASE).
- **SLA Parameters:** Defining target latency budgets (sub-millisecond, milliseconds, seconds) and overall data storage volume size (gigabytes, terabytes, petabytes).

*(Boundary Note: Network protocol configuration details, application driver setups, and cloud licensing cost reviews are out of scope. This document covers systemic selection logic, workload analysis, and engineering decision mapping.)*

## 2. Why It Exists / What Problem It Solves

Choosing a database based on developer popularity or hype rather than structural alignment leads to architectural lock-in, high cloud costs, and performance failures. A relational database forced to process IoT log streams will run out of write connections; a NoSQL database forced to calculate ledger balances will drift and create inconsistencies. This framework guides developers to map data requirements directly to the correct database category.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Scale Bottlenecks from Single Primaries:** Forcing an RDBMS to ingest high-frequency click streams, leading to connection pool exhaustion and system-wide timeouts.
- **Data Integrity Collapses:** Storing financial balance data in an eventually consistent document store, resulting in race-condition double-spending bugs.
- **Query Timeouts on Complex Relations:** Trying to query deep network relationships (e.g. social connections) inside an RDBMS, resulting in recursive joins that freeze the CPU.
- **Cost Explosions:** Storing gigabytes of temporary cache keys in expensive SSD-backed relational servers instead of using memory-evicting key-value caches.

## 4. Best Practices

- **Model Access Patterns First:** Before selecting a database, write down the exact queries the application must execute, how frequently they run, and their relative read/write ratios.
- **Map to CAP Theorem Constraints:**
  - Choose *Consistent/Partition Tolerant* (CP) databases if data correctness is a strict requirement (e.g. financial ledgers).
  - Choose *Available/Partition Tolerant* (AP) databases if system uptime is a priority and eventual consistency is acceptable (e.g. social feeds).
- **Evaluate Data Volume & Growth:** Determine target data size:
  - If data stays <1TB, default to a robust Relational Database (PostgreSQL/MySQL) due to simplicity and safety.
  - If data exceeds 10TB and is unstructured/write-heavy, evaluate NoSQL/Wide-column options.
- **Deconstruct the Monolith (Polyglot Persistence):** Accept that a single database type rarely fits all application features. Use a relational database for core transactions, Redis for caching, and Elasticsearch for text searches.
- **Map Write/Read Profiles to Storage Engines:**
  - Use *LSM-Tree* engines (Cassandra, InfluxDB) for write-heavy append workloads.
  - Use *B-Tree* engines (PostgreSQL, MySQL) for read-heavy, index-structured queries.

## 5. Common Mistakes / Anti-Patterns

- **"One Database to Rule Them All":** Forcing a single database type to handle every application concern (e.g. using MongoDB for transactional billing, product search, and session caching).
- **NoSQL by Default for Simple Schemas:** Choosing NoSQL under the assumption that "relational schemas are too slow/inflexible," only to reinvent constraints and joins in application code.
- **Ignoring Write Volume Growth:** Choosing a single-node write database for a service expected to scale writes horizontally.
- **Ignoring Operating/Maintenance Costs:** Selecting complex distributed databases (like Cassandra) for small workloads that could run reliably on a cheap managed SQL instance.

## 6. Security Considerations

- **Evaluating Security Features Native to Engines:** During selection, verify if the engine supports Row-Level Security (RLS), Column-Level Encryption, and granular audit log options to satisfy target compliance standards (HIPAA/SOC 2).

## 7. Performance Considerations

- **Latency Budgets:** Match database latency profiles to requirements. If sub-millisecond API response is required, place a Key-Value cache in front of your primary database.

## 8. Scalability Considerations

- **Sharding Complexity:** Understand that sharding a database introduces massive operational overhead. Default to vertical scaling or read replicas first before choosing databases that require manual sharding architectures.

## 9. How Major Companies Implement It

- **Uber:** Implements a strict polyglot persistence architecture. They route driver location streams to high-write Cassandra databases, financial balances to ACID MySQL clusters, and search parameters to Elasticsearch.
- **Stripe:** Enforces PostgreSQL as the primary ledger of record, utilizing Redis strictly for rate-limiting and session caches, separating transactional consistency from ephemeral lookups.

## 10. Decision Checklist (The Database Selection Matrix)

Use the following mapping to guide your selection:

| Data Structure | Read/Write Pattern | Consistency Target | Recommended Database |
|---|---|---|---|
| Highly Structured / Relational | Complex SELECTs / Transactions | Immediate (ACID) | PostgreSQL / MySQL |
| Semi-Structured / JSON | High Read/Write Documents | Immediate/Eventual | MongoDB / DocumentDB |
| Key-Based Lookup | High-Throughput / Transient | Ephemeral / Evicted | Redis / Memcached |
| Highly Connected Graph | Deep Traversal Loops | Eventual | Neo4j / Amazon Neptune |
| Append-Only Telemetry | Ultra-High Write Volume | Eventual | Cassandra / InfluxDB |
| Long Text Fields | Fuzzy Match Search / Aggregations | Eventual | Elasticsearch / OpenSearch |
| High-Dimensional Vectors | Approximate Similarity (ANN) | Eventual | Pinecone / Qdrant / pgvector |

## 11. AI Coding-Agent Implementation Guidelines

- Always map application access patterns (queries) before recommending a database schema design.
- Never choose NoSQL databases purely to avoid defining schema models.
- Always recommend polyglot persistence when an application has clearly distinct concerns (e.g. payment transactions vs full-text search).
- Never recommend distributed databases (e.g. Cassandra) if the target data storage size is estimated to stay under 1TB.
- Always check that the selected database supports required security features (e.g. encryption at rest, RLS) before deployment mapping.

## 12. Reusable Checklist

- [ ] Access patterns modeled and mapped to specific queries
- [ ] Read/Write ratio estimated and matched to storage engines (B-Tree vs LSM-Tree)
- [ ] CAP Theorem requirements defined (CP for accuracy, AP for uptime)
- [ ] Data storage size and growth rate scoped (SQL default for <1TB)
- [ ] Polyglot Persistence evaluated (separate caching, search, and transactional systems)
- [ ] Security features (RLS, encryption) supported by selected database
- [ ] Database selection aligns with the database decision matrix
- [ ] Operation/maintenance cost overhead budgeted
