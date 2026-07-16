# CQRS (Command Query Responsibility Segregation)

## 1. What Question This Answers
"Should this system separate the write paths (Commands) from the read paths (Queries) at an architectural level, and how is this decision justified against data sync lag and operational complexity costs?"

## 2. Why It Matters at the System-Design Stage
Deciding to adopt CQRS (Command Query Responsibility Segregation) is a major architectural commitment. It splits the application logic and databases into:
- A write-heavy path optimized for transactional safety (ACID).
- A read-heavy path optimized for denormalized query performance.
While CQRS isolates read-write resource contention and allows independent scaling of query models, it introduces eventual consistency (sync lag between write and read DBs) and duplicate schema management. This decision must be made at the system design stage before selecting databases or routing strategies.

## 3. Methodology / How to Work Through It
1. **Analyze Read-to-Write Ratios:** Choose CQRS when read traffic scales independently and dominates write traffic (e.g. 100:1).
2. **Review Query Complexity:** Flag systems that require heavy SQL joins, calculations, or search features on transactional tables.
3. **Assess Consistency Tolerances:** Ensure the business can tolerate eventual consistency (reads lagging writes by milliseconds/seconds).
4. **Choose Synchronization Channels:** Define CDC (Change Data Capture) or event brokers to sync data asynchronously.
5. **Formulate the Decision:** Verify if isolating resource contention is worth the sync complexity.

## 4. Inputs Needed
- Peak QPS, database write metrics, and read/write ratios from [Workload Analysis](../01-requirement-analysis/workload-analysis.md).
- Non-functional performance budgets.

## 5. Outputs Produced
- Feeds into [Database Strategy](../../13-architecture-decision-records/index.md) and [Design Patterns Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Financial Ledger & Search Dashboard)
- **Problem:** Users generate high write volume of wallet transactions (must be ACID). Simultaneously, merchants run heavy analytical query dashboards to filter transaction history, locking database rows.
- **CQRS Selection:**
  - *Command Side (Write):* Normal 3NF SQL database (PostgreSQL) optimized for fast updates.
  - *Query Side (Read):* Denormalized Elasticsearch cluster optimized for search queries.
  - *Sync:* PostgreSQL writes trigger CDC event streams (Debezium) to Kafka, which updates Elasticsearch asynchronously.
  - *Latency:* Read dashboards load in <10ms from Elasticsearch. Payment writes remain unblocked by analytics.

## 7. Common Mistakes
- **Applying CQRS Prematurely:** Implementing separate write and read databases for low-traffic CRUD applications where a single Postgres database could handle both.
- **Synchronous Write Integration:** Updating both databases synchronously in the write handler, multiplying write latency and coupling services.
- **No Concurrency Handling:** Failing to design the UI to support eventual consistency, causing page errors when users do not see updates immediately.

## 8. AI Coding-Agent Guidelines
1. **Verify CQRS Triggers:** Only recommend CQRS if read-to-write ratio >100:1 or analytics queries block transactions on primary tables under load.
2. **Asynchronous Sync Enforcement:** Never write templates that dual-write synchronously. Enforce CDC or event queues.
3. **Handle Sync Lag:** Propose UI polling or optimistic client-side updates.
4. **Produce CQRS Design Spec:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# CQRS Architecture Design Proposal: [System Name]

### 1. Decision Justification
- **Primary Scale Bottleneck:** [e.g. Merchant analytical searches lock ledger tables during checkout transactions.]
- **Read-to-Write Ratio:** [e.g. 500:1 (Read-Heavy)]
- **Tolerable Sync Lag:** [e.g. Up to 1 second eventually consistent dashboard updates acceptable]

### 2. Write (Command) vs. Read (Query) Segregation
- **Command Path:**
  - *Write Database:* PostgreSQL (ACID compliant, 3NF schema).
  - *Write Actions:* `/api/v1/orders/create` writes order row and outbox transaction.
- **Query Path:**
  - *Read Database:* Elasticsearch (Denormalized indexes, optimized for search).
  - *Read Actions:* `/api/v1/orders/search` reads from Elasticsearch.

### 3. Data Synchronization Strategy
- **Sync Channel:** Asynchronous CDC log streaming (Debezium/Kafka) reads PostgreSQL transaction logs, updating Elasticsearch indexes.
- **Idempotency Key:** Consumer workers execute updates using order UUID keys.
```
