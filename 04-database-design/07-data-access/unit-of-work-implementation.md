# Unit of Work Pattern

## 1. Definition & Core Concepts
The Unit of Work Pattern is an architecture pattern that maintains a list of database transactions affected by a single business transaction. It coordinates the writing of changes and resolves concurrency conflicts as a unified transaction.

## 2. Why It Exists / What Problem It Solves
When a business transaction modifies multiple tables through separate repositories, committing changes individually can lead to partial failures. The Unit of Work coordinates these repositories, ensuring that all database updates are committed or rolled back together.

## 3. What Breaks in Production Without It
- **Inconsistent Commits:** A customer is charged and their order is created, but inventory updates fail, leaving records inconsistent.
- **Database Connection Leaks:** Multiple repositories opening separate database transactions and connections for a single workflow.

## 4. Best Practices
- **Coordinate Repositories:** Share a single database transaction context across all repositories inside the Unit of Work scope.
- **Enforce Atomic Commits:** Execute all database writes via a single final commit method (e.g. commit()).
- **Implement rollback handling:** Ensure database connection sessions are closed and rolled back on exceptions.

## 5. Common Mistakes / Anti-Patterns
- **Long-lived transactions:** Keeping the Unit of Work scope open during external API integrations, locking database rows.
- **Nested Transactions:** Creating nested transaction blocks that complicate error handling and locks.

## 6. Security Considerations
- **Isolation Boundaries:** Prevent cross-tenant operations from being combined in a single Unit of Work session.

## 7. Performance Considerations
- **Connection pooling efficiency:** Share database connections across repositories, decreasing connection handshakes.

## 8. Scalability Considerations
- **Distributed Event Outbox:** Use the Unit of Work to commit both business records and message outbox events in a single transaction.

## 9. How Major Companies Implement It
- **Microsoft Entity Framework:** Implements Unit of Work internally through DBContext, keeping track of entity changes and writing updates on SaveChanges().

## 10. Decision Checklist (Unit of Work Scope)
- Use **Unit of Work** when:
  - Workflows modify multiple entities through separate repositories and require ACID compliance.
- Use **Single Repository Transactions** when:
  - Workflows target a single database table or are read-only.

## 11. AI Coding-Agent Guidelines
- Write Unit of Work classes that manage database transaction contexts, exposing repositories as read-only properties.

## 12. Reusable Checklist
- [ ] Single database transaction context shared across active repositories
- [ ] Database updates committed in a single transaction block (ACID)
- [ ] Connection session closed and rolled back on exceptions
- [ ] No external API calls are made within the Unit of Work transaction scope
- [ ] Repository parameters bind to shared database contexts
- [ ] Unit tests mock Unit of Work interfaces to check execution steps
