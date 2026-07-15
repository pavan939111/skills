# ADR 0003: Relational Database Selection

*   **Status**: Accepted
*   **Date**: 2026-07-16
*   **Deciders**: Principal Architect, Lead Database Administrator

---

## 1. Context & Problem Statement

Different services stored relational transactions across MongoDB, MySQL, and DynamoDB. This database fragmentation broke ACID guarantees, created split-brain reporting anomalies, and increased maintenance overhead for schema migrations.

---

## 2. Decision

We will standardize **PostgreSQL** as our primary transactional database engine:
1.  **ACID Compliance**: Enforce strict transaction boundaries for core entity mutations (billing, inventory, user accounts).
2.  **Semi-Structured Storage**: Use PostgreSQL's native `JSONB` data type for unstructured dynamic payloads (metadata properties, audit trails).
3.  **Read-Write Segregation**: Deploy one Primary node for write operations and two read replicas to offload reporting queries.

---

## 3. Consequences

*   **Reliability**: Guaranteed ACID reliability across complex multi-table inserts.
*   **Operational Simplicity**: Simplifies disaster recovery, backups, and schema evolution pipelines by tracking one database system.
*   **Write Throughput Limits**: Relational scaling requires strict connection pooling and vertical partition designs at higher scales.
