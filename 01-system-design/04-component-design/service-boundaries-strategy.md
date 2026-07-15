# Service Boundaries

## 1. What Question This Answers
"How do we define the physical and logical boundaries of services in our system design, and what rules prevent services from overlapping in logic or database access?"

## 2. Why It Matters at the System-Design Stage
Defining service boundaries is the core task of decomposing a complex system. If service boundaries are poorly defined, the system devolves into a distributed monolith: services share databases directly, experience circular API call chains, and require synchronized deployments. Establishing clear service boundaries early ensures that each service:
- Owns its data store exclusively.
- Can be scaled independently.
- Has a single, well-defined business responsibility (Single Responsibility Principle).

## 3. Methodology / How to Work Through It
1. **Apply Domain-Driven Design (Bounded Contexts):** Identify business subdomains (e.g. Catalog, Billing, Fulfillment) and model them as isolated contexts.
2. **Enforce Database Ownership:** Establish the rule of "one database per service." No service may read or write directly to another service's database.
3. **Analyze Service Cohesion:** Ensure that logic inside a service is highly related. If two services require frequent synchronous updates to maintain state consistency, merge them.
4. **Define Integration Ports:** Standardize how services communicate (e.g., exposing public API schemas while keeping implementation details private).
5. **Establish Team Ownership boundaries:** Align service boundaries with team structures to reduce communication overhead.

## 4. Inputs Needed
- Product user flows and functional capabilities from [Functional Requirements](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/functional-requirements-analysis.md).
- Chosen architecture style (from architecture selection).

## 5. Outputs Produced
- Feeds into [Domain Boundaries](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/04-component-design/domain-boundaries-strategy-implementation.md) and [Component Interactions](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/04-component-design/component-interactions-strategy-implementation.md).

## 6. Worked Example (E-Commerce Decomposition)
- **Bounded Contexts:**
  - `BillingContext`: Owns payment gateway integrations and invoice generation. Database: `billing_db`.
  - `FulfillmentContext`: Owns shipping labels creation and stock updates. Database: `fulfillment_db`.
- **Communication rule:** If `Fulfillment` needs order payment status, it cannot query `billing_db` directly. It must listen to `billing.completed` events published to the broker or call the `/invoices` API, keeping databases decoupled.

## 7. Common Mistakes
- **The Shared Database Backdoor:** Connecting multiple microservices to a single shared PostgreSQL database, breaking boundary isolation.
- **Anemic Services:** Creating too many tiny services (e.g. `UserFirstNameService`), causing high network overhead and complex deployments.
- **Circular API Dependencies:** Allowing Service A to call Service B, which synchronously calls Service A, creating deadlock risks.

## 8. AI Coding-Agent Guidelines
1. **Identify Subdomains:** Group functional requirements into Bounded Contexts.
2. **Enforce Data Isolation:** Require separate databases for each physical service in architecture specs.
3. **Map Public APIs:** Design clear API contracts to expose service capabilities while hiding internal tables.
4. **Produce Service Boundaries Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Service Boundary Specification: [System Name]

### 1. Bounded Context Definitions
- **Service A (e.g., Billing Service):**
  - *Business Domain:* Payment authorization, invoicing, refunds.
  - *Data Ownership:* Dedicated database `billing_db`. No direct external reads/writes allowed.
- **Service B (e.g., Shipping Service):**
  - *Business Domain:* Address validation, courier dispatch.
  - *Data Ownership:* Dedicated database `shipping_db`.

### 2. Cross-Boundary Communication Rules
- **Synchronous Integration:** Services query other domains strictly via public HTTP/REST or gRPC endpoints.
- **Asynchronous Integration:** State updates propagate via event topics (e.g. `billing.invoice_created`) published to a shared broker.
- **Shared Data Strategy:** Duplicate core metadata (like customer names) locally in read-only tables to avoid cross-service queries, synced asynchronously.
```
