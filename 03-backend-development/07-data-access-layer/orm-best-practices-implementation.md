# ORM Best Practices

## 1. Definition & Core Concepts
Object-Relational Mapping (ORM) Best Practices are the design guidelines and configurations used to optimize the mapping of in-memory programming language objects to relational SQL database tables.

## 2. Why It Exists / What Problem It Solves
ORMs (like Hibernate, SQLAlchemy, TypeORM, Prisma) simplify database access. However, because they abstract SQL queries, they can easily generate inefficient database calls (like N+1 queries, large SELECT fields) if configured poorly.

## 3. What Breaks in Production Without It
- **High CPU and Database Load:** The system makes thousands of database queries for a single user request, slowing down the server.
- **Connection Pool Exhaustion:** ORM sessions are kept open too long, blocking other users.
- **Out of Memory Crashes:** The ORM loads complete related tables (lazy loading bloat) into server memory.

## 4. Best Practices
- **Solve N+1 Query Loops:** Use eager loading, joins, or batch selectors (e.g. joinedload in SQLAlchemy) to fetch relationships.
- **Limit SELECT Fields:** Retrieve only columns required for the action (avoid SELECT * defaults).
- **Disable Tracking on Read-only Queries:** Configure ORM queries to skip object tracking (e.g. AsNoTracking() in Entity Framework) for read-only APIs to save memory.

## 5. Common Mistakes / Anti-Patterns
- **Querying in loops:** Writing ORM lookup statements inside code loops.
- **Mapping massive blob tables:** Loading large text or binary columns automatically on search routes.

## 6. Security Considerations
- **Automated Parameter Binding:** Ensure the ORM config binds parameters rather than building raw query strings.

## 7. Performance Considerations
- **Batch Updates:** Use bulk insert/update APIs instead of saving models individually inside loops.

## 8. Scalability Considerations
- **Replica Routing:** Configure the ORM client to direct read queries to read-replicas.

## 9. How Major Companies Implement It
- **Netflix / Shopify:** Tune ORM configurations strictly, disabling default lazy loading on relationships and setting up query logging to catch performance bottlenecks.

## 10. Decision Checklist (ORM usage)
- Use **ORMs** when:
  - Working on complex domain schemas, relationships, and transactional updates where developer velocity is preferred.
- Use **Raw SQL/Query Builders (Knex/Dapper)** when:
  - Executing high-performance analytics, complex reporting joins, or high-throughput transactions.

## 11. AI Coding-Agent Guidelines
- Write database queries that use explicit join parameters and select only necessary fields, checking log files for N+1 warnings.

## 12. Reusable Checklist
- [ ] Relationship queries utilize joins/eager loading to prevent N+1 queries
- [ ] Select parameters restricted to required fields (no default select all)
- [ ] Object tracking disabled for read-only database queries
- [ ] Bulk update/insert operations run using batch ORM APIs
- [ ] ORM session connection pools set with strict timeout parameters
- [ ] Query execution plans checked for slow database queries
