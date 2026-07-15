# Microservices

## 1. What Question This Answers
"When and why should a system be decomposed into distributed microservices, and how is this decision justified against operational complexity and network latency costs?"

## 2. Why It Matters at the System-Design Stage
Decomposing a system into microservices is a major architectural transition. It separates data, code, deployment, and team ownership boundaries physically. While microservices allow independent scaling (e.g. scaling the image service without scaling the billing engine) and reduce coordination friction in large teams, they introduce severe technical costs: network latencies, distributed query complexity, transactional boundaries issues, and complex CI/CD infrastructure requirements. This decision must be rigorously justified.

## 3. Methodology / How to Work Through It
1. **Analyze Team Scale Boundaries:** Identify if team size (e.g., >30 engineers divided into separate sub-teams) warrants physical service ownership splits.
2. **Review Scalability Vectors:** Check if specific components have widely different resource profiles (e.g. one service requires massive memory, another requires GPUs).
3. **Establish Data Boundaries (Database-per-Service):** Ensure each microservice owns its physical database. Direct cross-database access is prohibited.
4. **Select Communication Protocols:** Define RPC (gRPC) or REST interfaces for synchronous communication, and message brokers (Kafka/RabbitMQ) for asynchronous events.
5. **Formulate the Decision:** Verify if the scaling benefits outweigh the network latency and distributed transaction complexities.

## 4. Inputs Needed
- Peak QPS, capacity sizing, and team organization profiles from [Workload Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/workload-analysis.md).
- Non-functional performance budgets.

## 5. Outputs Produced
- Feeds into [Component Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/04-component-design/index.md) and [Technology Strategy Decision Briefs](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/06-api-strategy/index.md).

## 6. Worked Example (High-Scale Ride Sharing Platform)
- **Problem:** Ride matching requires intensive, real-time geography processing (high compute load); payment processing requires transactional reliability; user profiles require simple cached lookups.
- **Microservices Division:**
  - `MatchingService`: CPU-bound node, scales out horizontally based on map calculations. Database: Redis/PostGIS.
  - `BillingService`: High security, low throughput. Database: ACID PostgreSQL.
  - `ProfileService`: Simple read-heavy key-value lookups. Database: DynamoDB.
- **Communication:** Services query each other via gRPC over private virtual networks, publishing location state changes asynchronously to Kafka.

## 7. Common Mistakes
- **The Database Backdoor:** Deploying separate backend containers but linking them to a single, shared relational database, creating a single point of failure and blocking independent schema changes.
- **Microservices for Small Teams:** Splitting a project into 10 microservices with a team of 3 developers, wasting resources on infrastructure administration.
- **Synchronous Call Chains:** Designing request chains where Service A calls B, which calls C, which calls D. If any node lags or fails, the entire request crashes, multiplying network latency.

## 8. AI Coding-Agent Guidelines
1. **Verify Sizing Triggers:** Only recommend microservices if team size >25 or specific services have highly unique compute scaling requirements.
2. **Enforce Database Separation:** In microservice specs, always declare separate databases for each service.
3. **Specify RPC and Event Channels:** Use gRPC and event brokers in design blueprints.
4. **Produce Microservices Design Artifact:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Microservices Architecture Proposal: [System Name]

### 1. Architectural Drivers & Justification
- **Primary Scale Bottleneck:** [e.g. Geoprocessing compute demands scale independently of user profiles.]
- **Team Ownership Split:** [e.g., Divided into three distinct service teams (Identity, Payments, Search)]
- **Estimated Network Latency Cost:** [e.g., gRPC RPC network hop adds 3ms per call; acceptable within P95 200ms budget.]

### 2. Service Definitions & Data Boundaries
- **Service A (e.g., Billing):**
  - *Database:* Dedicated PostgreSQL instance.
  - *Communication:* Exposes gRPC endpoints; publishes `billing.completed` events.
- **Service B (e.g., Catalog):**
  - *Database:* Dedicated MongoDB instance.
  - *Communication:* Exposes REST API.

### 3. Distributed Sync & Consistency Strategy
- **Cross-Service Data Joins:** [e.g., Prohibited. Use pre-computed read models (CQRS) or event outbox publishers to sync user names to order records.]
- **Transaction Boundary:** [e.g. Saga pattern active across Billing and Catalog services; transactional outbox pattern manages events execution.]
```
