# Unit of Work Pattern Implementation

## 1. Definition & Core Concepts
Unit of Work coordinates multiple database write operations in a single transaction, ensuring ACID compliance.

## 2. Why It Exists / What Problem It Solves
It prevents partial failures when updating multiple repositories during a single business transaction.

## 3. What Breaks in Production Without It
- **Inconsistent Database State:** Customer charged but order creation fails, leaving records out of sync.

## 4. Best Practices
- **Shared DB Context:** Share a single database connection across repositories inside the transaction scope.

## 5. Common Mistakes / Anti-Patterns
- **API calls inside transactions:** Keeping database locks open during slow external API calls.

## 6. Security Considerations
- **Isolation Boundaries:** Prevent combining different client operations in a single transaction.

## 7. Performance Considerations
- **Optimized Connections:** Reduce transaction times to prevent database lock timeouts.

## 8. Scalability Considerations
- **Outbox Integration:** Commit transaction records and messaging outbox tasks together.

## 9. How Major Companies Implement It
- **Microsoft EF:** Implements Unit of Work internally via DBContext.

## 10. Decision Checklist (Transaction Scope)
- Use **Unit of Work** when:
  - Workflows update multiple entities through separate repositories and require ACID safety.

## 11. AI Coding-Agent Guidelines
- Expose repositories as properties inside a Unit of Work context that opens and commits transactions.

## 12. Reusable Checklist
- [ ] Single database transaction context shared across repositories
- [ ] Database updates committed in a single transaction block (ACID)
- [ ] Catch blocks trigger database rollbacks on all exceptions
- [ ] No external API calls are made within transaction blocks
- [ ] Repository parameters bind to shared database contexts
- [ ] Unit tests mock Unit of Work interfaces to verify steps
