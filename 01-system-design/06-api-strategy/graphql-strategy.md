# GraphQL API Strategy

### 1. The Question Decided
"Should the application boundary use GraphQL schemas, and how do we resolve client query dynamics against database performance?"

### 2. Options Compared
| Dimension | GraphQL | REST | gRPC |
|---|---|---|---|
| **Cost (Compute)** | High (Schema parsing & resolver CPU) | Low | Low |
| **Latency** | Medium (Prone to N+1 joins) | Low | Very Low |
| **Complexity** | High (Requires resolver optimization) | Low | High |
| **Client Flexibility**| Very High (Selective queries) | Low | Low |
| **Scale Ceiling** | Medium (Query depth limits needed) | High | Very High |

### 3. Decision Rule
- **Choose GraphQL if:** The client app has complex, variable views requiring dynamic page queries, or integrates multiple downstream APIs into a single gateway (BFF).
- **Avoid GraphQL if:** The database is highly relational and prone to N+1 join cascades under nested queries, or the client needs simple, static CRUD resources.

### 4. Red Flags to Revisit
- Database CPU spikes to 100% due to nested client queries executing un-optimized database lookups (N+1 query problem).
- Gateway memory is exhausted attempting to parse complex client query strings.

### 5. Where to Go Next
- For implementation of GraphQL schemas, queries, mutations, and database loaders, see [GraphQL Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/05-api-development/graphql-strategy-implementation.md).
