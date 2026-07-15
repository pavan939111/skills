# Raw SQL in Backend Development

## 1. Definition & Core Concepts
Raw SQL is the practice of writing direct, database-specific SQL query statements (using database drivers or query builders like Knex/Dapper) in backend code rather than relying on ORM abstractions.

## 2. Why It Exists / What Problem It Solves
ORMs add abstraction overhead and often generate sub-optimal SQL queries for complex joins or calculations. Writing raw SQL gives developers absolute control over the queries executed by the database, maximizing performance and enabling advanced database-specific features.

## 3. What Breaks in Production Without It
- **Slow Query Latency:** complex ORM-generated queries result in database table scans and slow response times.
- **Inability to use DB features:** Developers cannot use specific SQL optimization operations (e.g. window functions, CTEs) because the ORM does not support them.

## 4. Best Practices
- **Use Parameterized Queries:** Always bind user input parameters (using ? or $1 markers) to block SQL injection attacks.
- **Isolate SQL in Repositories:** Write SQL queries exclusively inside repository classes, keeping services pure.
- **Track Query Metrics:** Set up logging to capture query execution durations, logging queries that exceed thresholds.

## 5. Common Mistakes / Anti-Patterns
- **String Concatenation:** Building SQL query strings by concatenating user inputs.
- **Hardcoding schema names:** Hardcoding database schemas in query strings, making migrations difficult.

## 6. Security Considerations
- **SQL Injection Prevention:** Parameterize all inputs. Never construct SQL strings dynamically using user inputs.

## 7. Performance Considerations
- **Query Optimization:** Run EXPLAIN ANALYZE on SQL queries to verify index usage and table scans.

## 8. Scalability Considerations
- **Connection Management:** Ensure raw SQL sessions close database connections cleanly to prevent resource exhaustion.

## 9. How Major Companies Implement It
- **Stack Overflow:** Relies heavily on Dapper (a micro-ORM) and optimized raw SQL queries to serve millions of requests daily with minimal CPU overhead.

## 10. Decision Checklist (Raw SQL vs ORM)
- Use **Raw SQL/Query Builders** when:
  - Designing performance-critical routes, high-throughput transactions, complex reporting queries, or using database-specific syntax.
- Use **ORMs** when:
  - Working on standard, database-agnostic business platforms with complex relationships.

## 11. AI Coding-Agent Guidelines
- Write SQL queries that use parameterized bindings, verify index usage, and format queries inside repository methods.

## 12. Reusable Checklist
- [ ] All database queries parameterized to block SQL injection
- [ ] SQL query statements isolated exclusively in repository classes
- [ ] EXPLAIN ANALYZE check confirms optimal database index utilization
- [ ] Database connection sessions closed cleanly in finally blocks
- [ ] SQL syntax matches version conventions of the target database engine
- [ ] Query execution duration logs flag slow transactions (> 100ms)
