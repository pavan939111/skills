# Transaction Management

## 1. Definition & Core Concepts
Transaction Management is the practice of coordinating multiple database write operations into a single atomic execution unit, ensuring that either all changes are committed successfully or all changes are rolled back on failures.

## 2. Why It Exists / What Problem It Solves
API workflows often require writing data to multiple database tables (e.g., deducting user balance and creating an invoice). If the server crashes or an exception occurs mid-workflow, the database can end up in an inconsistent state. Transactions guarantee ACID compliance.

## 3. What Breaks in Production Without It
- **Data Inconsistencies:** Money is deducted from a user's account but no order record is created because the order save failed.
- **Ghost Records:** Orphanded data rows remain in database tables when parent transactions fail.

## 4. Best Practices
- **Define Transaction Boundaries at Service Level:** Wrap application service workflows in transaction boundaries using decorators or transaction managers.
- **Keep Transactions Short:** Avoid performing network calls (HTTP queries, email sends) inside database transaction blocks to prevent locks.
- **Enforce Database Isolation Levels:** Configure appropriate isolation levels (e.g., Read Committed) to prevent dirty reads or lockouts.

## 5. Common Mistakes / Anti-Patterns
- **API calls inside transactions:** Calling external payment gateways while keeping a database transaction open, holding database connection locks.
- **Ignoring rollback blocks:** Catching database errors but forgetting to trigger database rollbacks, leaving sessions open.

## 6. Security Considerations
- **Race Condition Prevention:** Use locking strategies (Pessimistic/Optimistic) inside transactions to prevent double-spending or race condition modifications.

## 7. Performance Considerations
- **Lock Contention:** Long-running database transactions block index tables. Keep queries fast and optimize connection pools.

## 8. Scalability Considerations
- **Distributed Transactions:** For microservice databases, avoid two-phase commits (2PC) if possible. Use the Saga pattern or asynchronous Eventual Consistency instead.

## 9. How Major Companies Implement It
- **Banking Systems:** Enforce strict ACID transaction controls on all account balance modifications, utilizing pessimistic locks to guarantee data safety.

## 10. Decision Checklist (Locking Strategy)
- Use **Optimistic Locking (version columns)** when:
  - Write conflicts are rare, and you want to avoid holding database locks (highly concurrent web APIs).
- Use **Pessimistic Locking (SELECT FOR UPDATE)** when:
  - Write conflicts are common, and data accuracy is critical (account balance deductions).

## 11. AI Coding-Agent Guidelines
- Ensure that transaction scopes are opened before database updates and rolled back inside catch blocks before raising exceptions.

## 12. Reusable Checklist
- [ ] Transaction scopes wrap workflows that execute multiple database writes
- [ ] No external API or network calls occur within open transaction blocks
- [ ] Catch blocks trigger database rollbacks on all query exceptions
- [ ] Appropriate transaction isolation level (e.g. Read Committed) configured
- [ ] Database locks kept short to minimize contention under load
- [ ] Distributed updates use Saga or Eventual Consistency patterns
