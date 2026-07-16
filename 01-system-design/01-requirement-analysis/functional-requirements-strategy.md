# Functional Requirements (Technical Translation)

## 1. What Question This Answers
"How do we translate product-level user stories into technical system operations, data read/write patterns, and component interactions?"

## 2. Why It Matters at the System-Design Stage
Product managers write functional requirements in human terms (e.g. "Users can invite teammates"). System design cannot act directly on this. The architect must translate this into engineering terms: what services are called, which database tables are updated, whether operations are synchronous or asynchronous, and what events are published. Without this translation, developers implement ad-hoc APIs that do not scale or align with security boundaries.

## 3. Methodology / How to Work Through It
1. **Deconstruct User Stories:** Analyze product features to identify the primary actors, inputs, and desired outcomes.
2. **Define Database Mutations:** Determine which operations read from the database, which write to disk, and identify their transaction boundaries.
3. **Map Component Interactions:** Identify which microservices or modular components cooperate to execute the request.
4. **Identify Sync vs. Async Paths:** Group actions that must commit immediately (synchronous) vs. tasks that can run in background queues (asynchronous).
5. **Declare System Events:** Define the events published to message brokers upon completion.

## 4. Inputs Needed
- Product-level User Personas and Flows from [Product Analysis](../../13-architecture-decision-records/index.md).
- Business goals and MoSCoW priority lists.

## 5. Outputs Produced
- Feeds directly into [Capacity Planning](../../13-architecture-decision-records/index.md) (QPS and storage sizing) and [Component Design](../../13-architecture-decision-records/index.md).

## 6. Worked Example (User Teammate Invitation)
- **Product Requirement:** "A team owner can invite a new manager to their dashboard via email."
- **Technical Translation:**
  - *Authentication:* Verify caller session holds role `admin` and matches target `tenant_id`.
  - *Database Write (Sync):* Insert row to `tenant_invitation` (uuid, tenant_id, email, role, token, expires_at, status='PENDING').
  - *Event Publish (Async):* Publish `invitation.created` event to Kafka broker.
  - *Worker Action:* Email service consumes event, calls SendGrid API, and updates email status.

## 7. Common Mistakes
- **Copying Business Text Directly:** Paste product-level user stories without defining backend API inputs, validation rules, or database write actions.
- **Specifying Low-Level Code syntax:** Writing function names or framework classes (e.g. "Create Java class Inviter") instead of system-level contracts.
- **Failing to Segregate Async Tasks:** Blocking API threads while executing slow, external HTTP calls (like sending emails) instead of using background worker queues.

## 8. AI Coding-Agent Guidelines
1. **Read Business Specs:** Parse the product-level functional requirements.
2. **Translate to System Calls:** For every feature, define: Actor, HTTP endpoint pattern, database write table, async events published, and validations.
3. **Produce Tech Requirements:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Technical Functional Requirements: [Component Name]

### 1. Actor Roles & Security Permissions
- **[Role Name, e.g., Admin]:** Allowed to execute write mutations on `/api/v1/tenant/*`.
- **[Role Name, e.g., Viewer]:** Read-only query actions on `/api/v1/tenant/*`.

### 2. Feature Technical Breakdown: [e.g., Order Checkout]
- **API Endpoint:** `POST /api/v1/orders/checkout`
- **Request Inputs:** `cart_id` (UUID), `payment_method_id` (String), `idempotency_key` (UUID).
- **Synchronous Actions (ACID Boundary):**
  - Query `cart` table to verify active status.
  - Write `order` row with state `PENDING` and save `idempotency_key`.
  - Write outbox entry in the same transaction.
- **Asynchronous Actions (Event-Driven):**
  - Publish `order.created` event to RabbitMQ.
- **Validations & Constraints:**
  - Idempotency key checked before execution to prevent duplicate transactions.
```
