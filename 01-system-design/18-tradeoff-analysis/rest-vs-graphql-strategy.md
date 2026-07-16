# REST vs. GraphQL Trade-off Analysis

## 1. What Question This Answers
"Should our public and web API boundaries utilize RESTful endpoints or a GraphQL schema, and what are the operational trade-offs?"

## 2. Why It Matters at the System-Design Stage
API boundary design affects both client bandwidth utilization and server performance. RESTful APIs are simple, universally supported, and leverage standard HTTP caching, but can suffer from over-fetching (returning fields the client does not need) and under-fetching (requiring multiple API hits per screen). GraphQL solves this by allowing clients to query specific fields in a single call, but introduces query parsing overhead, complex security limits, and database N+1 join risks.

## 3. Methodology / How to Work Through It
1. **Analyze Client Query Dynamics:** Do client views vary significantly in field requirements? If yes, GraphQL provides flexibility.
2. **Review Caching Policies:** Is CDN-edge HTTP caching critical for scaling? If yes, choose REST (GraphQL uses POST, making edge caching complex).
3. **Audit Database Schema Stability:** Do database tables have deep relationships prone to N+1 query loops under dynamic JSON joins?
4. **Compare Operational Complexity:** Evaluate development time for schemas and loaders.
5. **Formulate the API Boundary Selection:** Choose the style matching client and database performance profiles.

## 4. Inputs Needed
- Latency budgets and database scaling limits from [Capacity Planning](../../13-architecture-decision-records/index.md).
- User flow characteristics.

## 5. Outputs Produced
- Feeds directly into [API Strategy Selection](../../13-architecture-decision-records/index.md).

## 6. Worked Example (SaaS Dashboard vs. Simple Mobile Feed)
- **SaaS Analytics Dashboard (GraphQL Choice):**
  - *Context:* Dynamic dashboard charts. Users can customize which columns, metrics, and groupings are displayed.
  - *Decision:* GraphQL (with DataLoader batching to prevent database loops).
- **Mobile Storefront Feed (REST Choice):**
  - *Context:* Static product feed, highly cached at CDN edge to scale to millions of concurrent reads.
  - *Decision:* REST (with CDN headers configuration).

## 7. Common Mistakes
- **No Query Depth Limiting:** Deploying open GraphQL endpoints without setting query depth limits, allowing clients to send infinitely nested query strings that exhaust server memory.
- **GraphQL for Simple CRUD:** Implementing a GraphQL layer for simple CRUD databases, adding unnecessary schema overhead.

## 8. AI Coding-Agent Guidelines
1. **Force DataLoader on GraphQL:** Always require DataLoader patterns on GraphQL resolver classes to prevent N+1 queries.
2. **CDN check:** Recommend REST if public API CDN caching is the primary scaling mechanism.
3. **Produce REST vs GraphQL Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# REST vs. GraphQL Trade-off Assessment: [System Boundary Name]

### 1. Comparative Matrix
| Metric / Feature | REST (JSON) | GraphQL |
|---|---|---|
| **Client Over-fetching**| High (Static responses) | Zero (Selective queries) |
| **HTTP Edge Caching** | Native, simple | Complex (Requires POST queries hashing) |
| **Gateway Performance**| Low CPU overhead | High CPU (Schema parsing) |
| **N+1 Join Risk** | Low (Static routes queries) | Extremely High (Dynamic loops) |
| **Integration Complexity**| Low | High (Schema registries, loaders) |

### 2. Selection Recommendation
- **Target Selection:** [e.g. REST API]
- **Justification:** [e.g. Public API must be cached at edge CDN to support peak read traffic. Simple CRUD schema does not justify GraphQL resolver complexity.]
```
