# Latency Requirements

## 1. What Question This Answers
"What is the latency budget for each system component, and how does this define caching tiers, replica routing, database sharding, and network choices?"

## 2. Why It Matters at the System-Design Stage
A system latency budget must be allocated before choosing technology stacks. If a user-facing search API must return results in under 100ms globally, the architect cannot allow slow sequential database joins or cross-continent network hops. Establishing explicit latency budgets defines:
- Where caching (Redis) is required.
- Where read replicas must be positioned geographically.
- What database indexes and connection proxies are necessary.
Without a latency budget, components are built independently, resulting in slow aggregate performance that is hard to debug.

## 3. Methodology / How to Work Through It
1. **Define Total Latency SLO:** Set the maximum acceptable round-trip response time for primary APIs (e.g. Checkout P95 < 300ms).
2. **Deconstruct the Request Path:** Trace the network and processing steps:
   `Total = Client Network Ping + CDN Edge + Load Balancer + API Router + DB Query + Downstream API.`
3. **Allocate Component Budgets:** Assign explicit millisecond limits to each component.
4. **Identify Slow Paths:** Flag integrations with slow external systems (e.g., credit check APIs) and design asynchronous patterns to decouple them from user wait loops.
5. **Enforce Database Latency Budgets:** Set statement timeouts (e.g. abort database queries taking >100ms) to protect resource pools.

## 4. Inputs Needed
- Product-level performance expectations from [Product NFRs](../../00-product-analysis/non-functional-requirements-analysis.md).
- User geographical distributions.

## 5. Outputs Produced
- Feeds into [Capacity Planning](../../13-architecture-decision-records/index.md) and [Caching Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Global E-Commerce Search)
- **Total Latency SLO:** P95 response < 150ms.
- **Request Path Allocation:**
  - *Client Network (EU user accessing US server):* 80ms (WAN network latency bottleneck).
  - *CDN Edge Cache:* 10ms (on cache hit).
  - *API Router Processing:* 15ms.
  - *Database Query (Postgres search):* 45ms.
- **System Design Decisions to meet SLO:**
  - *Read replicas:* WAN network latency (80ms) makes accessing a single US database too slow. Deploy database read replicas in the EU region, reducing regional network ping to <10ms.
  - *Cache-Aside:* Cache high-frequency searches in regional Redis nodes, keeping search returns under 5ms.
  - *DB Statement Timeout:* Enforce `SET statement_timeout = '50ms'` on the database to prevent long-running queries from blocking connection pools.

## 7. Common Mistakes
- **Ignoring WAN Network Latency:** Allocating 10ms for database queries but forgetting that cross-continent network round-trips take 70ms-150ms, causing latency SLO breaches.
- **No Statement Timeouts:** Allowing slow queries to execute indefinitely, saturating CPU and connection pools.
- **Synchronous External Hops:** Blocking user-facing API threads while communicating with slow, third-party services.

## 8. AI Coding-Agent Guidelines
1. **Read Product SLOs:** Read the target API latencies.
2. **Deconstruct Request Paths:** Map out the network hops and allocate database query budgets.
3. **Enforce Database Limits:** Suggest statement timeouts and caching strategies based on latency limits.
4. **Produce Latency Requirements:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Latency Budget Allocation: [System Name]

### 1. API Route Latency Budgets
- **User Authentication (`/login`):** P95 < [e.g. 200ms]
- **Search Query (`/search`):** P95 < [e.g. 100ms]
- **Transactional Checkout (`/checkout`):** P95 < [e.g. 300ms]

### 2. Request Path Breakdown (Example: `/search`)
- **Client to Edge Network:** [e.g. 30ms (Regional CDN Router)]
- **API Routing & Middleware:** [e.g. 15ms]
- **Database Query Budget:** [e.g. 40ms max execution time]
- **API Serializer & Output:** [e.g. 15ms]
- **Total Estimated Latency:** [e.g. 100ms]

### 3. Database Latency Controls
- **SQL Statement Timeout:** [e.g. `SET statement_timeout = 100ms;`]
- **Read-Replica Routing:** [e.g. Route read queries to regional replicas to keep network hops under 15ms.]
- **Caching Threshold:** [e.g. Queries with budgets < 10ms must read from Redis cache, bypassing SQL DB.]
```
