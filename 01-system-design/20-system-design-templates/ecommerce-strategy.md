# E-Commerce System Design Template

## 1. Target Product Shape
High-availability online retail store handling product catalogs, user shopping carts, checkout payments, and order tracking.

## 2. Requirements Analysis
- **Functional:** Browse catalogs, search items, manage cart state, checkout order, send invoice emails.
- **Non-Functional:** Low catalog latency (<50ms P95), strong order checkout consistency (zero double-bookings), high uptime (99.99%).

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Active Users: 1,000,000 monthly.
  - Peak Checkout Rate: 50 checkouts/second.
  - Catalog Read rate: 5,000 requests/second.
- **Sizing Math:**
  - *Compute:* Web API routers scale horizontally (10 containers total at peak).
  - *Storage:* 50 writes/sec $\times$ 1KB database row payload $\approx 50\text{ KB/second}$ database storage growth.
  - *RAM:* 1,000,000 items in Redis cache $\times 10\text{ KB/item} \approx 10\text{ GB}$ Redis memory size.

## 4. Selected Architecture & Components
- **Architecture Style:** Modular Monolith (consolidated compute, distinct domain directories).
- **Core Components:**
  - Ingress Gateway terminating TLS and forwarding calls.
  - Catalog Module (uses read replicas for fast queries).
  - Order Module (uses Postgres database lock transactions).
  - Payment Outbox (CDC logs shipping events to Stripe).

## 5. Technology Selection Strategy
- **Primary Database:** PostgreSQL (supports transactional checkouts).
- **Caching Layer:** Redis (cache-aside for catalogs and active cart sessions).
- **Queue/Messaging:** AWS SQS (async invoice emailing and delivery alerts).

## 6. Critical Trade-offs
- **Postgres locking vs. Checkout Throttle:** Restricts checkout concurrency to guarantee product inventory count accuracy.
- **Eventual Consistency on Cart Reads:** Shopping carts are stored in Redis cache-aside, accepting minor cart contents latency.

## 7. Reusable Design Checklist
```markdown
- [ ] Catalog data is cached in Redis with 5-minute TTL.
- [ ] Order checkout uses strict PostgreSQL serializable transactions or SELECT FOR UPDATE.
- [ ] Payment triggers use the Transactional Outbox pattern before hitting Stripe APIs.
```
