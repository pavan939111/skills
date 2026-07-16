# Event Sourcing

## 1. What Question This Answers
"Should this system store state as a sequence of immutable events (Event Sourcing) instead of capturing only current records, and how is this decision justified against event replay latency and storage costs?"

## 2. Why It Matters at the System-Design Stage
Adopting Event Sourcing is a fundamental system design commitment. It changes the database from a mutable table space into an immutable, append-only event ledger (Event Store). While event sourcing provides a complete, auditable history of all changes, enables temporal queries ("View cart as of Tuesday"), and allows building multiple read models, it introduces complexity: replaying events to build state, optimistic concurrency requirements, and event schema versioning. This decision must be made at the system design stage.

## 3. Methodology / How to Work Through It
1. **Verify Audit Requirements:** Choose event sourcing when the domain requires a complete, audit-proof history of state mutations (e.g. billing, banking, health charts).
2. **Review Query History Needs:** Identify if users need to view historical states or track how states changed.
3. **Assess Event Volume Limits:** Ensure the database can support append-only write loads.
4. **Define Snapshot Checkpoints:** Plan snapshotting intervals (e.g. saving state every 100 events) to limit event replay durations.
5. **Decouple using Read Projections:** Ensure read queries are routed to pre-computed read tables (CQRS), never replaying events synchronously on main read paths.

## 4. Inputs Needed
- Product compliance rules, audit needs, and transactional user flows from [Functional Requirements](../../00-product-analysis/functional-requirements-analysis.md).
- Target storage capacity budgets.

## 5. Outputs Produced
- Feeds into [Database Strategy](../../13-architecture-decision-records/index.md) and [Design Patterns Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Financial Ledger System)
- **Problem:** A banking system must track wallet transactions. It is insufficient to update a user's balance column; auditors must see every debit and credit action, verifying that the current balance matches the sum of all historical events.
- **Event Sourcing Selection:**
  - *Event Store:* An append-only database table (`wallet_events`) that logs immutable event payloads (`DepositCreated`, `TransferInitiated`, `TransferCompleted`).
  - *Concurrency:* Composite unique constraint on `(wallet_id, version)` prevents race conditions.
  - *Read Model:* Pre-computed `wallet_balance` table stores current balances, updated asynchronously by event consumers.
  - *Audit:* Auditors reconstruct any account balance state by replaying events up to a target timestamp.

## 7. Common Mistakes
- **Running Synchronous Event Replays:** Querying the event table and replaying thousands of rows to calculate state on active user read paths, causing high latency.
- **Updating/Deleting Event Rows:** Running SQL update commands on the event store, corrupting the audit trail.
- **No Concurrency Controls:** Appending events to streams without verifying version counts, leading to data drift.

## 8. AI Coding-Agent Guidelines
1. **Audit Check:** Recommend event sourcing for core billing, ledger, and regulatory compliance domains.
2. **Require Projections:** Enforce the separation of event stores from read models.
3. **Enforce Immutability:** Never write templates that run update or delete commands on event store tables.
4. **Produce Event Sourcing Design spec:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Event Sourcing Architecture Proposal: [System Name]

### 1. Decision Rationale & Justification
- **Primary Driver:** [e.g. Regulatory compliance requires complete, audit-proof financial ledgers.]
- **Temporal Query Requirement:** [e.g. Users must be able to view invoice states at any specific date.]
- **Event Store Engine:** [e.g., PostgreSQL append-only tables or dedicated EventStoreDB]

### 2. Event Store Schema & Constraints
- **Table Definition:** `event_store` table (BigInt sequence, stream_id UUID, stream_version Int, payload JSONB).
- **Concurrency Control:** Unique index on `(stream_id, stream_version)`.
- **Snapshot Checkpoint:** Save state snapshot every 100 events to limit replay latency.

### 3. Read Projection Sync Strategy
- **Read Model:** Pre-computed read tables (e.g. `current_wallet_balance`) updated asynchronously.
- **Sync Channel:** Background event consumers listen to the event stream and execute idempotent upserts.
```
