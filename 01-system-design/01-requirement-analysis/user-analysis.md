# User Analysis

## 1. What Question This Answers
"What is the scale, distribution, and behavior of the user base, and how does this dictate connection pooling, concurrency limits, and regional database placement?"

## 2. Why It Matters at the System-Design Stage
Systems behave differently depending on who uses them. A system built for 10 million global consumers (high volume, low write complexity, distributed locations) requires a completely different design compared to a system built for 100 enterprise tenants (low volume, high write complexity, strict data boundaries). User analysis translates user characteristics into technical variables: concurrent connections, regional database sizing, and read-to-write ratios.

## 3. Methodology / How to Work Through It
1. **Analyze User Metrics:** Determine total registered users, daily active users (DAU), and peak concurrent users.
2. **Determine Geographic Distribution:** Identify where users are physically located to decide on multi-region load balancers, CDNs, and database regional deployments.
3. **Map Concurrency Limits:** Estimate the maximum number of active open connections expected during peak hours.
4. **Identify Client Environments:** Analyze devices and network access qualities (e.g. mobile 3G vs high-speed office fiber) to size payload payload constraints.
5. **Translate to System Configurations:** Use the analysis to set database connection pool targets, write rate-limiting, and regional node counts.

## 4. Inputs Needed
- Product-level User Personas and Access Patterns from [User Personas](file:///c:/Users/mahip/OneDrive/Desktop/skills/00-product-analysis/user-personas-analysis.md).
- Target audience geography definitions.

## 5. Outputs Produced
- Feeds into [Capacity Planning](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/index.md) (request volumes) and [Database Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/08-database-strategy/index.md).

## 6. Worked Example (Global Social Media Feed App)
- **User Demographics:** 10M DAU, distributed 50% in North America, 30% in Europe, 20% in Asia.
- **Concurrency:** Peak concurrent sessions = 500,000 users.
- **Read-to-Write Ratio:** 100:1 (highly read-heavy feed scrolling).
- **Network Quality:** 60% mobile users on variable cellular networks.
- **System Design Decisions:**
  - *Data Delivery:* Deploy edge CDNs to cache profile media files locally.
  - *Read Splitting:* Use globally distributed read replicas in EU and Asia, with the primary database in US.
  - *Payload Optimization:* Enforce strict image compression and JSON payload limits to protect mobile data buffers.

## 7. Common Mistakes
- **Assuming Uniform Distribution:** Sizing systems for a single region when the user base is distributed globally, leading to high latency hops for international users.
- **No Concurrency Planning:** Provisioning database limits based on total registered users rather than peak active concurrent sessions, leading to under-sized connection pools.
- **Ignoring Client Network Limits:** Designing heavy API payloads that timeout on mobile connections.

## 8. AI Coding-Agent Guidelines
1. **Analyze User Base:** Read the user personas and access pattern definitions.
2. **Calculate Concurrency Limits:** Quantify peak concurrency and geographic distribution.
3. **Draft Architecture Actions:** Document how user distributions constrain server routing and databases.
4. **Produce User Analysis Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# User Scale & Distribution Analysis: [System Name]

### 1. User Scale Parameters
- **Total Registered Users:** [e.g. 100,000]
- **Daily Active Users (DAU):** [e.g. 10,000]
- **Peak Concurrent Sessions:** [e.g. 1,000 concurrent active connections]
- **Average Read-to-Write Ratio:** [e.g. 10:1]

### 2. Geographic Distribution & Network Routes
- **Primary Region (US-East):** [e.g. 70% of users]
- **Secondary Region (EU-West):** [e.g. 30% of users]
- **Client Network Quality:** [e.g., 90% desktop office users on high-speed fiber; mobile timeouts rare]

### 3. System Design Impacts
- **Database Placement:** [e.g. Primary database located in `us-east-1`, with a read replica in `eu-west-1` to speed up European reads.]
- **Connection Routing:** [e.g., Cloud CDN active at edge regions to cache static assets close to users.]
- **Connection Sizing:** [e.g. Enforce database connection limit of 150 to support peak concurrency.]
```
