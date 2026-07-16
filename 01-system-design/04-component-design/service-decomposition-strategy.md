# Service Decomposition

## 1. What Question This Answers
"How do we physically partition a monolithic codebase or large system into independent, deployable services, and what metrics guide this decomposition?"

## 2. Why It Matters at the System-Design Stage
Decomposing a system too early or into too many small services (microservice premium) leads to high deployment costs, network latencies, and distributed debugging complexity. Conversely, delaying decomposition leads to a bloated codebase that slows down teams. Service decomposition defines the exact transition metrics: when a module should stay in a monolith and when it must be extracted into a separate service, aligning engineering complexity with scaling requirements.

## 3. Methodology / How to Work Through It
1. **Analyze Domain Cohesion:** Group related entities into Bounded Contexts.
2. **Review Resource Scopes:** Identify modules that have unique compute requirements (e.g. GPU, high memory, high CPU write QPS).
3. **Assess Deployment Frequencies:** Identify modules that change frequently (e.g. marketing content) vs. stable modules (e.g. accounting core). Extract high-change modules to prevent constant redeploys of the core.
4. **Enforce Database Isolation:** Prior to physical extraction, isolate the module's database tables logically into separate schemas.
5. **Decouple via Event Bridges:** Swap in-memory class imports with network API calls or asynchronous event publish loops.

## 4. Inputs Needed
- Service boundaries maps and domain definitions from Service Boundaries.
- Target peak QPS and transaction scopes.

## 5. Outputs Produced
- Feeds into Component Interactions and deployment topologies.

## 6. Worked Example (Extracting Recommendation Engine)
- **Monolith State:** Single server running Node.js, managing User Profiles, Checkout, and a basic Product Recommendation loop (joins user histories to product tables).
- **Scale Out Trigger:** Recommendation query QPS increases, saturating database CPU. The recommendation algorithm is updated to run Python ML models (requiring high memory/GPU).
- **Decomposition Process:**
  - *Data Isolation:* Separate recommendation logs into a dedicated database schema.
  - *Extraction:* Extract the recommendation code into a new, Python-based `RecommendationService`.
  - *Communication:* The primary monolith queries `RecommendationService` via HTTP/REST. The primary monolith publishes user click events to Kafka, consumed by `RecommendationService` to update models asynchronously.

## 7. Common Mistakes
- **Decomposing without Database Splits:** Extracting code into a microservice but allowing it to query the primary database instance directly, negating decoupling.
- **Decomposing Early (Startup Phase):** Building 10 microservices for an MVP before validating customer demand, wasting resources.
- **Nano-services:** Creating services that are too small (e.g. single functions), leading to high network routing overhead.

## 8. AI Coding-Agent Guidelines
1. **Apply Decomposition Gates:** Only recommend microservice extraction if single-node database scales are exhausted or deployment schedules conflict.
2. **Isolate Database First:** Ensure logic database splits are configured before writing service extraction blueprints.
3. **Use Event Decoupling:** Propose event-driven sync patterns for extracted services.
4. **Produce Service Decomposition Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Service Decomposition & Extraction Plan: [System Name]

### 1. Extraction Candidate & Rationale
- **Target Module:** [e.g. Recommendation Engine]
- **Primary Extraction Trigger:** [e.g. Compute profiles differ. Recommendation requires Python and GPU; checkout requires Node.js and SQL.]
- **Database Partition Strategy:** [e.g., Separate recommendation log tables into a dedicated database instance; read-only replication active.]

### 2. Extraction Phases
- **Phase 1 (Logical Isolation):** Isolate recommendation tables inside PostgreSQL schemas, blocking cross-schema SQL joins.
- **Phase 2 (Async Sync):** Deploy background outbox workers to stream user click events to Kafka.
- **Phase 3 (Physical Extraction):** Boot Python service container, route recommendation requests to it via HTTP, and drop old monolith code.

### 3. Network Latency Impact
- **Original In-Memory Call Latency:** <0.1ms
- **Post-Extraction API Hop Latency:** P95 < 20ms (Acceptable within total 200ms page budget).
```
