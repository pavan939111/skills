# Serverless Architecture

## 1. What Question This Answers
"When and why should a system adopt a Serverless (FaaS/BaaS) architecture style, and how do we manage cold starts, execution timeouts, and stateless storage boundaries?"

## 2. Why It Matters at the System-Design Stage
Adopting a serverless architecture (e.g. AWS Lambda, Google Cloud Run) changes the hosting model. It eliminates server administration, provides automatic scaling from zero to thousands of requests, and enforces a "pay-per-request" cost model. However, serverless introduces severe technical constraints:
- **Cold Starts:** Latency spikes when a function boots after being idle.
- **Execution Timeouts:** Functions are terminated after a set duration (typically 15 minutes).
- **Stateless Operations:** Functions cannot hold persistent in-memory connections or state caches.
Evaluating these constraints early prevents deploying latency-sensitive or long-running tasks to serverless nodes.

## 3. Methodology / How to Work Through It
1. **Analyze Traffic Volatility:** Choose serverless when traffic is highly unpredictable, irregular, or has long idle periods (allowing scaling to zero to save budget).
2. **Review Execution Duration:** Ensure tasks execute in milliseconds, well under timeouts.
3. **Assess Latency Budgets:** Avoid FaaS for user-facing API routes requiring consistent, low latencies (<50ms) due to cold start risks.
4. **Enforce Stateless Design:** Store all session states and caches in out-of-process stores (such as Redis or DynamoDB).
5. **Manage Database Connections:** Avoid direct connections from thousands of transient Lambda nodes to relational databases. Use database proxies (PgBouncer or RDS Proxy) to prevent connection slot exhaustion.

## 4. Inputs Needed
- Peak QPS and database connection profiles from Traffic Estimation.
- Non-functional performance budgets.

## 5. Outputs Produced
- Feeds into [Deployment Strategy](../../13-architecture-decision-records/index.md) and [Cost Optimization Strategies](../../13-architecture-decision-records/index.md).

## 6. Worked Example (SaaS Thumbnail Generator)
- **Workload:** Users upload raw images. A task generates thumbnails, extracts metadata, and updates catalogs. Traffic is highly irregular (spikes when users import catalogs; zero traffic at night).
- **Serverless Design:**
  - *Ingress:* User uploads image to S3 bucket.
  - *Trigger:* S3 publishes a creation event, triggering AWS Lambda.
  - *Function:* Lambda downloads image, resizes it, writes thumbnail to S3, and writes metadata to DynamoDB.
  - *Cost Model:* Pays only for the exact milliseconds the Lambda executes. Cost scales to zero when no uploads occur.

## 7. Common Mistakes
- **Database Connection Floods:** Writing Lambda functions that connect directly to PostgreSQL. During write bursts, the Lambda scales to 1,000 nodes, attempting to open 1,000 direct database connections, crashing the Postgres engine.
- **Long-running Tasks on FaaS:** Running database migrations or video processing tasks that run past 15 minutes on serverless functions, causing timeout crashes.
- **Microservices inside Lambda:** Bundling massive monolithic routing frameworks (e.g. Express.js) inside a single Lambda function, increasing package size and cold start latency.

## 8. AI Coding-Agent Guidelines
1. **Analyze Idle Times:** Recommend serverless for highly erratic workloads with long idle periods.
2. **Enforce Database Proxies:** Always require connection proxies (RDS Proxy/PgBouncer) when serverless functions access SQL databases.
3. **Keep Packages Small:** Write single-purpose functions to minimize package sizes and cold starts.
4. **Produce Serverless Design Artifact:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Serverless Architecture Design: [System Name]

### 1. Decision Rationale & Workload Suitability
- **Primary Driver:** [e.g. Highly volatile image processing traffic; scaling to zero at night reduces costs]
- **Target Execution Duration:** [e.g. average 2.5 seconds, well under 15-minute timeout limits]
- **Cold Start Latency Mitigation:** [e.g., Use lightweight runtimes (Node.js/Go); package size kept < 10MB.]

### 2. Service Trigger & Function Map
- **Function A (e.g., Image Resizer):**
  - *Trigger Source:* [e.g. S3 ObjectCreated event]
  - *Database Access:* [e.g. None. Reads/writes to S3 only.]
- **Function B (e.g. Catalog Update):**
  - *Trigger Source:* [e.g. SQS Message queue]
  - *Database Access:* PostgreSQL via AWS RDS Proxy.

### 3. Stateless Connection Strategy
- **Session Cache:** [e.g. Session states stored in Redis cache; no local memory caches inside functions]
- **Relational DB Connection Limit:** [e.g., All Lambda database writes pass through RDS Connection Proxy, capping maximum active database connection slots to 50.]
```
