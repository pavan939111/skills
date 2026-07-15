# Non-Functional Requirements

## 1. Definition & Core Concepts
Non-Functional Requirements (NFRs) define the operational qualities, performance characteristics, and systemic constraints of a product (how the system performs a task, rather than what task it performs). They establish metrics for performance, scalability, availability, security, and durability from a user experience perspective.

Core concepts:
- **Performance:** Speed of execution (latencies, load times, throughput).
- **Scalability:** The ability of the system to handle increasing load (user growth, concurrent writes, data volume expansion).
- **Availability & Durability:** System uptime parameters (SLAs, failover speed, backup integrity).
- **Security & Compliance:** Encryption boundaries, data residency, network isolation, and access controls.

*(Boundary Note: Technical system sizing calculations, database replication setups, hardware profiles, and latency budget allocations belong in `01-system-design/` and operations. This document covers product-tier NFR definitions, user SLAs, and operational thresholds.)*

## 2. Why It Exists / What Problem It Solves
If developers only focus on functional requirements (e.g. "Users can login"), they may build systems that work fine in development but crash when 1,000 concurrent users attempt to log in. Non-functional requirements establish clear operational boundaries and quality benchmarks. This ensures that the application remains fast, secure, and available under production load.

## 3. What Goes Wrong on a Project Without It
- **API Performance Degradation:** The application functions correctly, but loading the home page takes 8 seconds under minor user concurrency, leading to user abandonment.
- **System Outages during traffic spikes:** A marketing campaign launches, traffic spikes by 10x, and the database server crashes due to CPU saturation because no scalability targets were set.
- **Data Loss on Hardware Failure:** A physical disk crashes, and the system loses 24 hours of transactions because RTO and RPO limits were never defined.
- **Security Compliance Violations:** Failing to document data encryption and isolation boundaries, exposing user PII and violating data residency regulations.

## 4. Best Practices
- **Quantify Every NFR with Specific Metrics:** Avoid subjective terms. Define explicit targets (e.g., "API latencies must be under 200ms for 95% of queries").
- **Differentiate NFRs from Functional Logic:** Focus strictly on *how* the system behaves (throughput, reliability, security), not *what* features it runs.
- **Define SLA, SLO, and SLI Targets:**
  - *SLA (Service Level Agreement):* Commercial uptime commitment (e.g. 99.9% uptime).
  - *SLO (Service Level Objective):* Internal engineering target (e.g. 99.95% uptime).
  - *SLI (Service Level Indicator):* Actual measured metrics.
- **Enforce Security Tiers based on Data Classification:** Align encryption and auditing rules with the sensitivity of the stored data.
- **Test NFRs under Simulated Load:** Run load and chaos tests in staging to verify the architecture meets NFR metrics.

## 5. Common Mistakes / Anti-Patterns
- **Vague NFR Statements:** Writing requirements like: "The application must be fast and secure" without defining metrics or security levels.
- **Demanding Zero Downtime/Latency without Budget:** Requesting 100% uptime and sub-1ms global query latencies without allocating budget for multi-region replication.
- **No Performance Budgets:** Failing to allocate latency budgets across application components (e.g. allocating 50ms for database queries, 100ms for network, 50ms for backend logic).
- **Untested Backups:** Assuming backup files work without running automated restoration tests.

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** A requirement for 99.99% uptime mandates multi-AZ active-passive database clustering and automated failover orchestrators.
- **Backend Architecture:** A requirement to process 5,000 orders/minute requires event-driven message queues and asynchronous processing threads.
- **Database Design:** Strict data isolation and RPO targets constrain the schema to use Row-Level Security and semi-synchronous replication.

## 7. What "Good" Looks Like
A high-quality NFR document specifies quantified, verifiable metrics for performance, availability, scalability, security, and durability. It defines RTO/RPO limits, API latencies, concurrent user capacities, and encryption baselines.

## 8. How Major Companies/Teams Do It
- **Netflix:** Defines strict latency budgets for its streaming APIs, automatically degrading features (e.g. hiding recommendations) if response times exceed NFR limits.
- **Stripe:** Enforces strict 99.999% uptime SLAs for payment transactions, designing resilient, multi-region database architectures to meet these metrics.

## 9. Decision Checklist
Go **Deep** (comprehensive NFR specifications) when:
- Designing core transactional systems (billing, identity, medical logs).
- The system must scale to handle high traffic volumes or concurrent writes.
- The company faces strict regulatory audit requirements (PCI, HIPAA, GDPR).

Keep it **Lightweight** when:
- Building internal prototypes, developer utilities, or simple content sites.
- Operating low-traffic systems with no commercial uptime SLAs.

## 10. AI Coding-Agent Implementation Guidelines
When starting a project:
1. **Identify Performance Targets:** Ask: "What are the latency targets for API responses? What is the expected concurrent user volume?"
2. **Determine Availability Requirements:** Ask: "What are the RTO (recovery time) and RPO (acceptable data loss) limits?"
3. **Establish Security Rules:** Ask: "What data encryption and privacy constraints are required? (e.g. PCI, HIPAA)."
4. **Produce Non-Functional Requirements Artifact:** Generate a quantified NFR page using the template below.

## 11. Reusable Checklist
- [ ] Every non-functional requirement quantified with specific, measurable metrics
- [ ] Performance metrics (response times, page load times) defined clearly
- [ ] Scalability parameters (concurrent users, write throughput) specified
- [ ] Availability targets (uptime SLA/SLO) documented
- [ ] Durability and recovery limits (RTO/RPO) defined per service
- [ ] Security benchmarks (encryption at rest/in transit, RLS) declared
- [ ] Compliance standards (GDPR, HIPAA, PCI) mapped to database rules
- [ ] Performance budgets allocated across database, network, and application tiers

## 12. Output Template
```markdown
# Non-Functional Requirements: [Project Name]

### 1. Performance Requirements
- **API Latency:** P95 response times must be under 200ms, P99 under 500ms for read queries.
- **Page Load Time:** First Contentful Paint (FCP) must load in under 1.5 seconds.
- **Write Latency:** Transaction write operations must commit database-side in under 50ms.

### 2. Scalability Requirements
- **Concurrent Users:** System must support 10,000 active concurrent user sessions without degradation.
- **Write Throughput:** Database must handle a minimum of 500 write transactions/second.
- **Data Volume:** Database storage design must support 500GB of growth/year.

### 3. Availability & Durability Requirements
- **Uptime SLA:** Core transactional APIs must maintain 99.9% availability (less than 8.76 hours of downtime/year).
- **RTO (Recovery Time Objective):** Maximum 1 hour of database downtime during regional outages.
- **RPO (Recovery Point Objective):** Maximum 5 minutes of transaction data loss (log-shipping interval).

### 4. Security & Compliance
- **Encryption:** All data in transit encrypted via TLS v1.3. Storage disks encrypted at rest via AES-256.
- **PII Isolation:** User credentials and contact details isolated in tables covered by Row-Level Security.
- **Audit Logs:** All schema changes (DDL) and administrative updates recorded in write-locked audit tables.
```
