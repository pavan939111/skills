# GraphQL

## 1. Definition & Core Concepts
GraphQL is a query language and server-side runtime for APIs that allows clients to request exactly the data they need, utilizing a strongly-typed schema to resolve data properties dynamically.

## 2. Why It Exists / What Problem It Solves
Traditional REST APIs often suffer from over-fetching (returning unnecessary fields) or under-fetching (requiring multiple API requests to get related data). GraphQL solves this by allowing the client to specify the data structure in a single request.

## 3. What Breaks in Production Without It
- **Network Congestion:** Mobile clients download massive REST JSON payloads containing fields they do not display.
- **API Version Bloat:** Creating separate REST endpoints for different client views, cluttering routes.

## 4. Best Practices
- **Strict Schema Definitions:** Maintain a single, strongly-typed schema file defining all queries, mutations, and types.
- **Implement Batch Loading (Dataloader):** Use batch loading libraries to solve the N+1 query problem, grouping database lookups.
- **Restrict Query Depths:** Set limits on query depths and complexity scores to prevent recursive queries from crashing database pools.

## 5. Common Mistakes / Anti-Patterns
- **Ignoring N+1 queries:** Letting resolvers query database instances individually inside loops, running up database load.
- **Omitting rate limits:** Allowing clients to submit massive, nested queries without complexity checks.

## 6. Security Considerations
- **Schema Protection:** Disable public introspection queries in production configurations to hide internal API layouts from attackers.

## 7. Performance Considerations
- **Query Complexity Budgets:** Calculate query complexity scores before execution, rejecting requests that exceed thresholds.

## 8. Scalability Considerations
- **Federated Schemas:** Deploy federated GraphQL gateways (e.g. Apollo Federation) to combine schemas from separate microservices.

## 9. How Major Companies Implement It
- **GitHub:** Exposes a public GraphQL API alongside its REST API, allowing developers to query complex repository graphs in a single request.

## 10. Decision Checklist (GraphQL Fit)
- Use **GraphQL** when:
  - Building client-heavy, multi-view applications (like dashboards) with complex relational data lookups.
- Use **REST** when:
  - Building basic public APIs, simple microservices, or webhook receivers.

## 11. AI Coding-Agent Guidelines
- Write resolvers that use batch loaders (Dataloader) to fetch database records efficiently and configure query complexity validators.

## 12. Reusable Checklist
- [ ] Strongly-typed GraphQL schema defines all queries, mutations, and types
- [ ] Dataloader libraries active on resolvers to prevent N+1 queries
- [ ] Query depth and complexity limits enforced in production config
- [ ] Introspection disabled on production GraphQL gateways
- [ ] Access controls validated at the individual field resolver level
- [ ] Client inputs validated against GraphQL input schemas
