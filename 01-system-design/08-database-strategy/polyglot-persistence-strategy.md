# Polyglot Persistence Strategy

### 1. The Question Decided
"Should the system deploy multiple database engines (Polyglot Persistence) to support different data access patterns, or consolidate on a single database?"

### 2. Options Compared
| Dimension | Single Database (e.g. Postgres-only) | Polyglot Persistence (Postgres + Redis + ES) |
|---|---|---|
| **Operational Cost** | Low | High (Multiple databases hosting & licenses) |
| **Development Speed** | Fast | Slow (Multiple schemas & drivers) |
| **Complexity** | Low | High (Sync lag, data consistency issues) |
| **Performance** | Medium | Very High (Each path optimized) |
| **Consistency** | Strong ACID | Eventually consistent |

### 3. Decision Rule
- **Choose Single Database if:** The team is small, budgets are tight, and a single relational database (like PostgreSQL) can handle the workload (e.g. using JSONB for document paths, B-Tree for searches).
- **Choose Polyglot Persistence if:** Distinct sub-services have highly unique data needs that cannot be handled efficiently by a single engine (e.g. full-text search requires Elasticsearch; sessions require Redis; billing requires Postgres).

### 4. Red Flags to Revisit
- The application database hosting bill spikes because the team runs Elasticsearch, Redis, Neo4j, and Cassandra instances for a simple blog application.
- Data drift occurs between the primary SQL database and the Elasticsearch search index because of synchronizing event failures.

### 5. Where to Go Next
- For implementation patterns and schema designs for polyglot databases, see [Polyglot Persistence Pattern Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/13-design-patterns/polyglot-persistence-pattern.md).
- For hybrid search patterns, see [Hybrid Search Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/10-ai-and-modern-databases/hybrid-search-strategy-implementation.md).
