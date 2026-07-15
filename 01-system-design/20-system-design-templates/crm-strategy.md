# CRM System Design Template

## 1. Target Product Shape
Enterprise Customer Relationship Management (CRM) platform managing tenant isolation, customer contacts, activity logs, and pipeline workflows.

## 2. Requirements Analysis
- **Functional:** Manage tenant accounts (B2B), track contacts, log activity notes, define sales pipeline stages.
- **Non-Functional:** Strict multi-tenant data isolation, fast contact search (<50ms), highly audit-compliant data boundaries.

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Tenants: 10,000 corporate clients.
  - Active Users: 100,000 agents.
  - Peak Write Rate: 200 writes/second.
- **Sizing Math:**
  - *Storage:* 10,000 tenants $\times 10,000$ contacts $\times 1\text{ KB/contact} \approx 100\text{ GB}$ relational database storage.
  - *Compute:* Small, multi-region web servers.

## 4. Selected Architecture & Components
- **Architecture Style:** Multi-tenant Monolith.
- **Core Components:**
  - Tenant Interceptor (validates tenant headers).
  - Activity Logger (writes history notes).
  - Contact Search Indexer (manages inverted index).

## 5. Technology Selection Strategy
- **Primary Database:** PostgreSQL (Row-Level Security - RLS - enabled to guarantee tenant isolation).
- **Search Engine:** PostgreSQL native B-Tree indexes or Elasticsearch.
- **Cache:** Redis (stores active session tokens).

## 6. Critical Trade-offs
- **Logical vs. Physical Isolation:** Relies on logical Row-Level Security (RLS) tables inside a shared database to simplify maintenance, accepting CPU virtualization risks.
- **FTS Query Performance:** Restricts search wildcard queries to B-Tree indexes to avoid managing external Elasticsearch clusters.

## 7. Reusable Design Checklist
```markdown
- [ ] Database tables configured with PostgreSQL Row-Level Security (RLS) policies.
- [ ] Every database query enforces the `tenant_id` filter via SQL validation layers.
- [ ] Contact exports are processed in background tasks (never block the main server thread).
```
