# Database Tools Integration

## 1. Definition & Core Concepts
Database Tools Integration is the interface that lets AI agents interact with databases (relational, document, graph) by running queries, updates, or schema checks.

## 2. Why It Exists / What Problem It Solves
Agents need to fetch real-time facts. Database tools translate search queries into SQL or NoSQL calls, letting agents retrieve customer records, inventory counts, or system logs dynamically.

## 3. What Breaks in Production Without It
- **SQL Injection Exploits:** Agents execute user input strings directly in SQL commands, exposing the database.
- **Accidental Deletions:** Agents execute `DROP TABLE` or `DELETE` statements during cleanup runs.
- **Connection pool saturation:** Loops leave database connections open, blocking other services.

## 4. Best Practices
- **Use Read-Only Connections:** Restrict database access credentials to read-only roles by default.
- **Implement SQL Sandboxing:** Enforce parameters validation or run queries in isolated replication nodes.
- **Enforce Row Limits:** Cap maximum query output rows (e.g. `LIMIT 100`) to prevent memory crashes.

## 5. Common Mistakes / Anti-Patterns
- **Direct production writes:** Letting agents execute `UPDATE` or `DELETE` statements on production databases without human verification checks.
- **Skipping schemas validation:** Writing dynamic SQL queries using direct string concatenation.

## 6. Security Considerations
- **Isolated Credentials:** Never commit database credentials inside codebase repositories.

## 7. Performance Considerations
- **Query timeouts:** Cap database query execution times to prevent thread hangs.

## 8. Scalability Considerations
- **Connection pools:** Deploy pgBouncer or equivalent pools to handle connection overhead.

## 9. How Major Companies Implement It
- **Bloomberg:** Uses read-only database replicas to let financial analysis agents query market records safely.
- **Stripe:** Exposes database records using REST APIs instead of allowing agents to connect to SQL ports directly.

## 10. Decision Checklist (Database Integrations)
- Use **Database Tools (SQL/NoSQL)** when:
  - Task requires querying dynamic, structured transaction tables.
- Avoid **Database Tools** when:
  - Context can be retrieved using indexed vector searches (use RAG instead).

## 11. AI Coding-Agent Guidelines
- Never expose direct SQL write permissions to agent classes; require all updates to run through validated API service functions.

## 12. Reusable Checklist
- [ ] Read-only database connection credentials active by default
- [ ] Query limits (`LIMIT 100`) enforced in tool code
- [ ] SQL string parameterization enforced (no direct string merges)
- [ ] Database query timeouts set (e.g., max 5s execution)
- [ ] Write operations require human approval gates
- [ ] Connection pooling active on target databases
