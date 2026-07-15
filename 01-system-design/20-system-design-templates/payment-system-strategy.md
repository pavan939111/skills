# Payment System Design Template

## 1. Target Product Shape
Highly secure, transaction-consistent system processing ledgers, wallet balances, checkout payments, and vendor disbursements.

## 2. Requirements Analysis
- **Functional:** Process ledger movements, track account balances, process external payment gateways, prevent double-charges.
- **Non-Functional:** Zero data loss ($RPO = 0$), strong consistency, idempotency, strict audit trails, PCI-DSS compliance.

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Peak Transactions Rate: 100 payments/second.
- **Sizing Math:**
  - *Storage:* 100 payments/sec $\times 2\text{ KB/ledger entry} \approx 200\text{ KB/second}$ database storage growth.
  - *Compute:* Small, highly redundant API VM nodes (Active-Active across regions).

## 4. Selected Architecture & Components
- **Architecture Style:** Monolithic core with isolated compliance subnets (CDE).
- **Core Components:**
  - Idempotency Gatekeeper (records unique request keys).
  - Double-Entry Ledger (manages credits and debits).
  - Payment Executor (manages connection states to external APIs).

## 5. Technology Selection Strategy
- **Primary Database:** PostgreSQL or MySQL (serializable transaction levels, ACID transactions).
- **Audit Logs Store:** Immutable, write-once storage (Glacier compliance vault).
- **Queue/Messaging:** AWS SQS FIFO (guarantees transaction ordering).

## 6. Critical Trade-offs
- **Serializable Isolation vs. Throughput:** Enforces strict serializable isolation to prevent overdrafts, accepting lower peak QPS capacity.
- **Synchronous API Handshakes:** Blocks user requests to verify payment gateway receipts, preventing drift.

## 7. Reusable Design Checklist
```markdown
- [ ] Database columns for ledger balance use DECIMAL/NUMERIC types (never FLOAT).
- [ ] Idempotency keys verified in local tables before executing external API handshakes.
- [ ] Account balance changes run double-entry audits (total credits equals total debits).
```
