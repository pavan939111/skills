# 01 — System Design

The decision engine of the whole knowledge base. Given a product and its requirements, this folder decides *what architecture and technology strategy* fits — it does not teach implementation. Implementation lives in `../03-backend-development/`, `../04-database-design/`, and the operational layers (`../07-platform-engineering/` through `../12-governance/`).

**Status legend:** ✅ done · ⏳ pending

## Workflow position

```
Product Analysis        (../00-product-analysis/)
      ↓
System Design    ← you are here
      ↓
Backend Architecture     (../03-backend-development/)
      ↓
Database Design           (../04-database-design/)
      ↓
Infrastructure / Production   (../07-platform-engineering/ to ../12-governance/)
      ↓
Implementation
```

## The altitude rule (how overlap with other folders is resolved)

Several topics here have same-named files elsewhere (e.g., "caching," "sharding," "CQRS," "CI/CD"). That's intentional — a senior architect thinks about caching at multiple altitudes: *should we cache here at all, and with what?* (system design) vs. *how do we implement Redis cache-aside correctly?* (03-backend-development/13-performance-optimization/) vs. *how does this affect our read replicas?* (database-design). To keep these from becoming duplicated content, every file in this folder follows one of two strict templates, and neither template contains implementation how-to:

### Template A — Analysis Template
Used in `01-requirement-analysis/`, `02-capacity-planning/`, `03-architecture-selection/`, `04-component-design/`, `05-data-flow-design/`, `18-tradeoff-analysis/`, `20-system-design-templates/`, `21-readiness-audit/`. These topics are genuinely unique to system design — nothing else in the knowledge base does requirement analysis or capacity estimation.

1. What question this answers
2. Why it matters at the system-design stage
3. Methodology / how to work through it
4. Inputs needed (from product analysis or earlier system-design steps)
5. Outputs produced (feeds into which later step)
6. Worked example
7. Common mistakes
8. AI coding-agent guidelines (what to ask the user, what artifact to produce)
9. Reusable template (fill-in-the-blank artifact)

### Template B — Decision Brief
Used in `06-api-strategy/`, `07-backend-strategy/`, `08-database-strategy/`, `09-caching-strategy/`, `10-storage-strategy/`, `11-message-queue-strategy/`, `12-search-strategy/`, `13-security-strategy/`, `14-scalability-strategy/`, `15-reliability-strategy/`, `16-deployment-strategy/`, `17-cost-optimization/`, `19-design-patterns/`. These are the topics that overlap with execution-level folders. Every file here is intentionally short — a comparison and a decision, never a how-to guide.

1. The question this decides (e.g., "should this product use Redis, Memcached, or no cache?")
2. Options compared (a table: option × dimension — cost, latency, complexity, team familiarity, scale ceiling)
3. Decision rule (if [requirement from system design] then [choice])
4. Red flags that mean this decision should be revisited
5. **Where to go next** — explicit link(s) to the implementation-level file(s) elsewhere in the knowledge base

A Decision Brief file must never contain setup instructions, code, or a "best practices" list — that content belongs at the linked destination.

## Cross-reference map (Decision Brief folders → their implementation destinations)

| System Design folder | Decides | Implementation lives in |
|---|---|---|
| `06-api-strategy/` | REST vs GraphQL vs gRPC vs WebSocket/SSE, gateway need | `../03-backend-development/04-api-design/` (once built) |
| `07-backend-strategy/` | Monolith vs microservices vs serverless, framework class | `../03-backend-development/` (once built) |
| `08-database-strategy/` | SQL vs NoSQL, single vs polyglot, replication/sharding need | `../04-database-design/01-database-selection/`, `06-scalability/` |
| `09-caching-strategy/` | Whether to cache, where, which store | `../04-database-design/04-database-best-practices/caching-implementation.md`, `../04-database-design/04-database-best-practices/caching-implementation.md` |
| `10-storage-strategy/` | Object storage vs file storage vs CDN need | `../04-database-design/file-storage-strategy.md` |
| `11-message-queue-strategy/` | Whether async messaging is needed, which broker class | `../03-backend-development/11-background-processing/` |
| `12-search-strategy/` | Whether a dedicated search engine is needed | `../04-database-design/01-database-selection/search-engine-decision-matrix.md`, `../04-database-design/10-ai-and-modern-databases/` |
| `13-security-strategy/` | Auth model, threat model, compliance posture | `../04-database-design/07-security/`, `../08-security-engineering/security-fundamentals-policy.md` |
| `14-scalability-strategy/` | Horizontal vs vertical, stateless requirement | `../04-database-design/06-scalability/` |
| `15-reliability-strategy/` | Which resilience patterns this product needs | `../03-backend-development/09-error-handling/` |
| `16-deployment-strategy/` | Deployment model (blue-green, canary, rolling) | `../07-platform-engineering/ci-cd-configuration.md`, `../07-platform-engineering/devops-configuration.md` |
| `17-cost-optimization/` | Cost ceiling and where cost risk lives | `../12-governance/03-operations-and-governance/01-cost-optimization-finops-guideline.md` |
| `19-design-patterns/` | Which architecture pattern fits this scenario | `../04-database-design/13-design-patterns/` (data-layer angle), `../03-backend-development/` pattern folder (code-layer angle, once built) |
| `21-readiness-audit/` | Architecture-level go/no-go | `../04-database-design/12-production-checklists/` (data-layer detail) |
| `22-observability-strategy/` | Logging levels, metrics collection, tracing depth, alerting, SLOs/SLIs | `../10-production-operations/` |

## Folder map

```
01-system-design/
├── README.md                          (this file)
│
├── 01-requirement-analysis/           11 topics  [Template A]
├── 02-capacity-planning/               9 topics  [Template A]
├── 03-architecture-selection/         12 topics  [Template A]
├── 04-component-design/                8 topics  [Template A]
├── 05-data-flow-design/                8 topics  [Template A]
│
├── 06-api-strategy/                    9 topics  [Template B]
├── 07-backend-strategy/                7 topics  [Template B]
├── 08-database-strategy/               8 topics  [Template B]
├── 09-caching-strategy/                7 topics  [Template B]
├── 10-storage-strategy/                6 topics  [Template B]
├── 11-message-queue-strategy/          7 topics  [Template B]
├── 12-search-strategy/                 6 topics  [Template B]
├── 13-security-strategy/               8 topics  [Template B]
├── 14-scalability-strategy/            7 topics  [Template B]
├── 15-reliability-strategy/            7 topics  [Template B]
├── 16-deployment-strategy/             7 topics  [Template B]
├── 17-cost-optimization/               6 topics  [Template B]
│
├── 18-tradeoff-analysis/               9 topics  [Template A]
├── 19-design-patterns/                10 topics  [Template B]
├── 20-system-design-templates/        10 topics  [Template A]
├── 21-production-readiness/            8 topics  [Template A]
└── 22-observability-strategy/          6 topics  [Template B]
```

**Total: 178 topics.**

## Overall workflow

```
Product Requirements
        ↓
01 Requirement Analysis
        ↓
02 Capacity Planning
        ↓
03 Architecture Selection
        ↓
04 Component Design
        ↓
05 Data Flow Design
        ↓
06–17 Technology Strategy Decision Briefs
        ↓
18 Trade-off Analysis
        ↓
19 Architecture Patterns
        ↓
20 System Design Templates (worked examples, if this product matches a known shape)
        ↓
21 Production Readiness Review
        ↓
Backend Implementation → Database Implementation → Deployment
```

---

## Folder reference

| Folder | Covers | Template | Status |
|---|---|---|---|
| [`01-requirement-analysis/`](./01-requirement-analysis/index.md) | Functional/Non-Functional Requirements, User Analysis, Workload Analysis, Business/Technical Constraints, Compliance, Latency/Availability/Scalability Requirements | A | 11/11 |
| [`02-capacity-planning/`](./02-capacity-planning/index.md) | Traffic, Storage, Bandwidth, Compute, Memory, Request/QPS Estimation, Growth Planning | A | 9/9 |
| [`03-architecture-selection/`](./03-architecture-selection/index.md) | Monolith, Modular Monolith, Microservices, Event-Driven, Serverless, Clean/Hexagonal/Onion, CQRS, Event Sourcing, Decision Tree | A | 12/12 |
| [`04-component-design/`](./04-component-design/index.md) | Service/Domain Boundaries, Module Design, Dependency Design, Communication Patterns, Decomposition, Diagrams | A | 8/8 |
| [`05-data-flow-design/`](./05-data-flow-design/index.md) | Request/Event/Async/Sync Flow, Workflow Design, State Management, Sequence Diagrams, Data Pipelines | A | 8/8 |
| [`06-api-strategy/`](./06-api-strategy/index.md) | REST, GraphQL, gRPC, WebSocket, SSE, API Gateway, Versioning, Idempotency, Decision Framework | B | 9/9 |
| [`07-backend-strategy/`](./07-backend-strategy/index.md) | Framework Selection Class, Service Pattern, Background Jobs, Scheduler, Orchestration, Distributed Services | B | 7/7 |
| [`08-database-strategy/`](./08-database-strategy/index.md) | SQL vs NoSQL, Database Selection, Polyglot Persistence, Replication/Sharding Strategy, Partitioning, Consistency | B | 8/8 |
| [`09-caching-strategy/`](./09-caching-strategy/index.md) | Redis, Cache-Aside, Write-Through/Back, Distributed Cache, Invalidation | B | 7/7 |
| [`10-storage-strategy/`](./10-storage-strategy/index.md) | Object/File/Blob Storage, CDN, Backup Storage | B | 6/6 |
| [`11-message-queue-strategy/`](./11-message-queue-strategy/index.md) | RabbitMQ, Kafka, SQS, Pub/Sub, Event Bus, DLQ, Queue Selection | B | 7/7 |
| [`12-search-strategy/`](./12-search-strategy/index.md) | Elasticsearch, OpenSearch, Vector Search, Hybrid Search, Full-Text Search | B | 6/6 |
| [`13-security-strategy/`](./13-security-strategy/index.md) | Authentication, Authorization, Encryption, Secret Management, Zero Trust, Threat Modeling, Compliance | B | 8/8 |
| [`14-scalability-strategy/`](./14-scalability-strategy/index.md) | Horizontal/Vertical Scaling, Autoscaling, Load Balancing, Stateless Services, Distributed Systems | B | 7/7 |
| [`15-reliability-strategy/`](./15-reliability-strategy/index.md) | Retry, Circuit Breaker, Timeout, Fallback, Graceful Degradation, Disaster Recovery | B | 7/7 |
| [`16-deployment-strategy/`](./16-deployment-strategy/index.md) | Docker, Kubernetes, CI/CD, Blue-Green, Canary, Rolling Update | B | 7/7 |
| [`17-cost-optimization/`](./17-cost-optimization/index.md) | Cloud/Infra/Storage/Database/AI Cost | B | 6/6 |
| [`18-tradeoff-analysis/`](./18-tradeoff-analysis/index.md) | SQL vs NoSQL, Monolith vs Microservices, Sync vs Async, REST vs GraphQL, Kafka vs RabbitMQ, Redis vs Memcached, Polling vs WebSocket, gRPC vs REST | A | 9/9 |
| [`19-design-patterns/`](./19-design-patterns/index.md) | CQRS, Event Sourcing, Saga, Outbox, BFF, Strangler Fig, API Gateway, Sidecar, Aggregator, Choreography vs Orchestration | B | 10/10 |
| [`20-system-design-templates/`](./20-system-design-templates/index.md) | E-Commerce, Social Media, Chat, Payment, Video Streaming, Ride-Sharing, Food Delivery, AI SaaS, CRM, Healthcare | A | 10/10 |
| [`21-production-readiness/`](./21-production-readiness/index.md) | Architecture/Scalability/Security/Database/Backend/Deployment/Monitoring Review, Production Checklist | A | 8/8 |
| [`22-observability-strategy/`](./22-observability-strategy/index.md) | Metrics, Logging, Tracing, SLOs/SLIs, Alerting, Tooling Selection | B | 6/6 |

 
 ---
 
 ## Overall progress
 
 **178 of 178 topics done.**
