# Non-Functional Requirements (Technical Translation)

## 1. What Question This Answers
"How do we translate business SLOs (performance, availability, scaling) into concrete, engineering-level design budgets, RTO/RPO limits, and security constraints?"

## 2. Why It Matters at the System-Design Stage
Business teams declare goals like "The app must be fast." An architect cannot design a cluster based on that. NFR translation converts these goals into database query latency budgets (e.g. max 50ms), throughput capabilities (e.g. 1000 QPS), connection limits, and backup rates. Without this, the system is under-provisioned, resulting in outages under load, or over-provisioned, wasting budget.

## 3. Methodology / How to Work Through It
1. **Deconstruct Business SLOs:** Read the product NFRs (latencies, volumes).
2. **Allocate Latency Budgets:** Divide total latency limits across components:
   `Total Latency (200ms) = Network Hop (50ms) + API Router (20ms) + DB Query (50ms) + Worker Queue (80ms).`
3. **Define Throughput & Connections:** Calculate target QPS (Queries Per Second) and write rates, specifying database connection pool sizing.
4. **Translate Recovery Objectives:** Map business recovery limits (RTO/RPO) to replication types (sync, semi-sync, async) and backup shipping speeds.
5. **Establish Security Baselines:** Translate compliance rules (GDPR, PCI) to database RLS, column encryption, and auditing logs.

## 4. Inputs Needed
- Product-level Non-Functional Requirements from [Product Analysis NFRs](../../00-product-analysis/non-functional-requirements-analysis.md).
- Business budget limits and legacy integration constraints.

## 5. Outputs Produced
- Feeds into [Capacity Planning](../../13-architecture-decision-records/index.md) and [Technology Strategy Briefs](../../13-architecture-decision-records/index.md) (folders 06–17).

## 6. Worked Example (Payment Processing API)
- **Business Target:** "Checkout API must process payments securely and recover fast on crashes."
- **Technical Translation:**
  - *Latency Budget:* P95 response < 300ms. Database write query allocated max 50ms.
  - *Uptime SLO:* 99.99% availability. Requires multi-AZ Active-Passive HA.
  - *Durability (RPO):* Near-zero data loss ($RPO \approx 0$). Enforces semi-synchronous replication to standby.
  - *Recovery (RTO):* Failover completed in <30 seconds. Requires Patroni consensus coordinator.
  - *Security:* PCI-DSS compliant. Tokenized card data (no raw card storage).

## 7. Common Mistakes
- **Subjective Metrics:** Using terms like "highly available" or "responsive" without numbers.
- **Unrealistic Latency Targets:** Sizing database budgets to 1ms when network ping times across AZs take 2-3ms, making the target physically impossible.
- **Ignoring Dependency Limits:** Defining low latency goals for features that integrate with slow, third-party legacy APIs.

## 8. AI Coding-Agent Guidelines
1. **Read Product SLOs:** Read the product NFR definitions.
2. **Translate to Component Budgets:** Document the latency, throughput, connection, and recovery specifications for each architectural tier.
3. **Produce Tech NFR Artifact:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Technical Non-Functional Requirements: [System Name]

### 1. Performance Latency Budget (Total Target: [e.g. 200ms])
- **Network Ingress/Egress:** [e.g. 50ms]
- **API Gateways & Routing:** [e.g. 20ms]
- **Business Logic Layer:** [e.g. 50ms]
- **Database Query Budget:** [e.g. 50ms max for primary keys, 100ms for indexes]
- **External API Integrations:** [e.g. 200ms limit, timeout aborted after 3s]

### 2. Throughput & Scalability Sizing
- **Peak Read Throughput:** [e.g. 2,000 QPS]
- **Peak Write Throughput:** [e.g. 200 writes/second]
- **Target Connection Pool:** [e.g. max 100 connections per application container, managed via PgBouncer]

### 3. Reliability & Recovery Limits
- **SLA Uptime Target:** [e.g. 99.9% (8.76h downtime/year)]
- **RTO (Recovery Time Objective):** [e.g. <1 hour, achieved via automated multi-AZ replication failover]
- **RPO (Recovery Point Objective):** [e.g. <5 seconds, achieved via continuous physical WAL shipping]

### 4. Security & Cryptography Baselines
- **Transport Security:** TLS v1.3 forced on all internal and external routes.
- **Storage Security:** AES-256 volume encryption on database hosts.
- **Compliance Rules:** [e.g. HIPAA audit logs tracking all reads on `patient_record` table].
```
