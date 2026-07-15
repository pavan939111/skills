# SQL vs. NoSQL Trade-off Analysis

> [!NOTE]
> [That file decides the database storage strategy; this file contains technical tradeoffs analysis.](../08-database-strategy/sql-vs-nosql-strategy.md)

## 1. What Question This Answers
"How do we choose between a Relational Database (SQL) and a Non-Relational Database (NoSQL) for a specific data domain, and what are the detailed trade-offs?"

## 2. Why It Matters at the System-Design Stage
Pick the wrong database paradigm and you lock yourself into either a schema that cannot scale or a schema that cannot enforce data integrity. A SQL database excels at structured, highly consistent, relational data with complex query needs (joins, transactions). A NoSQL database excels at scale, unstructured document schemas, or high-throughput write streams. This analysis defines the exact boundaries of relational safety vs. horizontal scale.

## 3. Methodology / How to Work Through It
1. **Analyze Data Structure:** Is the data highly structured and uniform (SQL), or unstructured and hierarchical (NoSQL)?
2. **Evaluate Transactional Needs:** Does the business require ACID consistency across multiple tables (SQL), or is single-record atomic write sufficiency acceptable (NoSQL)?
3. **Check Query Complexity:** Do read requests require complex joins, aggregates, and multi-field indexing (SQL), or simple primary-key/secondary-index lookups (NoSQL)?
4. **Size Throughput and Scale Limits:** Will write rates exceed single-instance IOPS, requiring horizontal scaling (NoSQL)?
5. **Compare Operational Complexity:** Evaluate hosting and backup costs.

## 4. Inputs Needed
- Data schemas and read/write QPS from [Workload Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/workload-analysis.md).
- Compliance and availability parameters.

## 5. Outputs Produced
- Feeds directly into [Database Strategy Selection](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/08-database-strategy/database-selection-strategy-implementation.md).

## 6. Worked Example (User Shopping Cart vs. Financial Balance)
- **Financial Balance (SQL Choice):**
  - *Needs:* ACID compliance, strict constraints (balance cannot go negative), joins on account/transaction history.
  - *Decision:* PostgreSQL (SQL).
- **Shopping Cart (NoSQL Choice):**
  - *Needs:* High write QPS, hierarchical JSON structure (cart items list), volatile state, no cross-table joins.
  - *Decision:* DynamoDB or MongoDB (NoSQL).

## 7. Common Mistakes
- **NoSQL for Core Financials:** Using NoSQL for accounting ledgers, requiring developers to write complex, slow, and unsafe double-entry validation code in the application layer.
- **SQL for High-Frequency Logs:** Writing thousands of transient sensor logs per second directly into standard relational tables, causing disk write saturation.

## 8. AI Coding-Agent Guidelines
1. **Segregate Domains:** Do not select one database paradigm for the entire app if workloads differ. Propose Polyglot Persistence.
2. **Apply ACID check:** Recommend SQL by default for all core business transaction registries.
3. **Produce SQL vs NoSQL Trade-off Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# SQL vs. NoSQL Trade-off Matrix: [System Domain Name]

### 1. Comparative Analysis
| Metric / Feature | SQL Option (e.g. Postgres) | NoSQL Option (e.g. MongoDB) |
|---|---|---|
| **Data Schema** | Strict Relational (DDL enforced) | Dynamic JSON Schema |
| **Joins / Queries** | Native SQL Joins | Application-level parsing |
| **Consistency** | Strong ACID (Multi-row) | Eventual / Single-document atomic |
| **Scaling** | Vertical (Primary-Replica) | Horizontal Sharding |

### 2. Decision Log
- **Domain (e.g., User Profiles):** [SQL selected due to relations to invoices.]
- **Domain (e.g. User Notifications):** [NoSQL selected to support unstructured, dynamic payloads.]
```
