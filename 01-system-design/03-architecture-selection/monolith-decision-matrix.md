# Monolithic Architecture

## 1. What Question This Answers
"When and why should a system use a Monolithic architecture style, and how is this decision justified at the system-design stage?"

## 2. Why It Matters at the System-Design Stage
Selecting a monolithic architecture is a deliberate choice to prioritize rapid feature delivery, deployment simplicity, and low operational overhead over complex service boundaries. For early-stage startups or small engineering teams, a monolith eliminates the network complexity, deployment pipelines, and distributed transaction issues (e.g. distributed joins, two-phase commits) inherent in microservices, keeping system budgets lean.

## 3. Methodology / How to Work Through It
1. **Assess Organizational Scale:** Evaluate team size (small teams of <15 engineers naturally benefit from sharing a single deployment unit).
2. **Review Concurrency & Traffic Sizing:** Verify if peak request throughput fits within single-node scale limits (<5,000 requests/second).
3. **Analyze Data Consistency Requirements:** Choose a monolith when transactions require immediate, synchronous consistency (ACID) across multiple domains (e.g., balance updates linked to cart state).
4. **Identify Component Cohesion:** Determine if modules share highly correlated code schemas.
5. **Formulate the Decision:** Justify the choice of monolith based on low infrastructure budgets and short delivery timelines.

## 4. Inputs Needed
- Product timelines, team resource limits, and business constraints from [Business Constraints](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/business-constraints-analysis.md).
- Peak QPS projections.

## 5. Outputs Produced
- Feeds into [Backend Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/07-backend-strategy/index.md) and [Deployment Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/16-deployment-strategy/index.md).

## 6. Worked Example (Standard SaaS MVP Storefront)
- **Context:** A new e-commerce application targeting launch in 2 months with a team of 4 JavaScript developers.
- **System Design Decisions:**
  - *Architecture:* Single, consolidated monolithic server running Node.js.
  - *Data Store:* Single PostgreSQL database instance.
  - *Communication:* All service modules (User, Product, Order) run in the same memory process space. Method calls are standard, synchronous code invocations, bypassing network latency.
  - *Deployment:* Package the application as a single Docker container deployed to a VM instance behind a basic load balancer.

## 7. Common Mistakes
- **The Distributed Monolith:** Splitting code into multiple microservices but sharing a single database, inheriting all the network latency of microservices with the deployment locks of a monolith.
- **No Modular Separation:** Failing to enforce package/folder separation inside the monolith, resulting in a "spaghetti code" structure that is impossible to refactor later.
- **Scaling the Whole instead of the Bottleneck:** Scaling the entire monolith instance globally just because one minor route (e.g. image sizing) is CPU-bound.

## 8. AI Coding-Agent Guidelines
1. **Read Team Scale:** Check team size and milestones. If team <15 and project is new, recommend a monolith.
2. **Establish Modular Boundaries:** In code templates, enforce folder boundaries to ensure future microservice extraction is possible.
3. **Produce Monolith Design Artifact:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Monolithic Architecture Design Brief: [System Name]

### 1. Decision Rationale
- **Primary Driver:** [e.g. Small team (3 developers) and short time-to-market milestone (8 weeks)]
- **Target Scale Headroom:** [e.g. Under 500 QPS; easily managed on a single node]
- **Data Consistency Target:** ACID transactions across all modules.

### 2. Monolith Module Structure
- **Module A (e.g. Billing):** [Folder location: `/services/billing`]
- **Module B (e.g. Catalog):** [Folder location: `/services/catalog`]
- **In-Memory Communication:** [e.g., Services communicate via code imports and interfaces; no network API calls between modules.]

### 3. Deployment & Scaling Limits
- **Container Sizing:** Single Docker container deployed to AWS EC2 instance.
- **Horizontal Scaling Limit:** Scale instances horizontally behind a load balancer; state stored out-of-process in a shared database.
```
