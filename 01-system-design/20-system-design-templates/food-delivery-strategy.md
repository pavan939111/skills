# Food Delivery System Design Template

## 1. Target Product Shape
Multi-sided platform coordinating restaurant menus, user orders, driver location tracking, and order state machines.

## 2. Requirements Analysis
- **Functional:** Browse restaurant menus, place orders, match delivery couriers, track order status.
- **Non-Functional:** Eventual consistency on courier tracking, high availability of menus catalog, low order checkout latency.

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Active Users: 500,000 daily orders.
  - Peak Order Rate: 50 orders/second.
- **Sizing Math:**
  - *Storage:* 500,000 orders/day $\times 2\text{ KB/order details} \approx 1\text{ GB/day}$ database growth.
  - *Compute:* Menus are static and read-heavy: cached globally at CDN edges.

## 4. Selected Architecture & Components
- **Architecture Style:** Microservices with Saga orchestration.
- **Core Components:**
  - Catalog Module (manages menus and pricing).
  - Order Orchestrator (coordinates payment, kitchen confirmation, and courier matches).
  - Courier tracker (monitors live GPS coordinates).

## 5. Technology Selection Strategy
- **Primary Database:** PostgreSQL (menu relationships and order transactions).
- **Courier Location Cache:** Redis (volatile spatial coordinates store).
- **Messaging:** AWS SQS (coordinates delivery events across services).

## 6. Critical Trade-offs
- **Menu Caching vs. Price Inconsistencies:** Restaurant menus are cached for 1 hour, accepting minor pricing lag.
- **Orchestration Saga vs. Choreography:** Order checkout uses central orchestrator to manage state rollbacks (e.g. refunding user if kitchen rejects order).

## 7. Reusable Design Checklist
```markdown
- [ ] Restaurant menus cached in Redis and distributed via CDN.
- [ ] Order workflow managed by a central State Machine orchestrator.
- [ ] Courier location queries run on Redis memory grids (never SQL disk queries).
```
