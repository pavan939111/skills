# State Management

## 1. What Question This Answers
"Where and how is user session state, application cache state, and database transactional state managed, and how do we ensure stateless backend boundaries?"

## 2. Why It Matters at the System-Design Stage
If backend application servers store user session state in local memory (stateful), load balancers must configure sticky sessions to route users to the same server node. This prevents horizontal scaling: if a server crashes, all user sessions hosted on that node are lost, degrading availability. State management design isolates state from compute, storing sessions and cache out-of-process to allow web servers to scale horizontally.

## 3. Methodology / How to Work Through It
1. **Classify State Types:** Segment data states:
   - *Transient State:* User session IDs, shopping cart drafts.
   - *Persistent State:* Historical orders, invoice records, profile logins.
   - *Cached State:* Product details, configuration values.
2. **Enforce Compute Statelessness:** Ensure that application servers do not hold in-memory user details.
3. **Select Out-of-Process Stores:** Route transient/cache state to Redis/Memcached. Persistent state routes to primary databases.
4. **Define Session Sharing:** Use JWTs (Stateless tokens verified via cryptography) or external Redis session backends.
5. **Establish Cache Eviction Rules:** Set TTL (Time To Live) parameters and LRU (Least Recently Used) cache policies.

## 4. Inputs Needed
- Peak concurrency and compute projections from [Compute Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/compute-estimation-strategy-implementation.md).
- User scale parameters.

## 5. Outputs Produced
- Feeds into [Caching Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/09-caching-strategy/index.md) and [Scalability Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/14-scalability-strategy/index.md).

## 6. Worked Example (User Session Architecture)
- **Problem:** A web application requires user login sessions. If sessions are stored in memory, web servers cannot auto-scale without logging users out.
- **State Management Decisions:**
  - *Compute:* Web servers run Node.js in stateless mode. No user profile variables are cached locally.
  - *Session:* Deploy a Redis cluster dedicated to session storage.
  - *Access:* When a request hits the server, the server retrieves the session token from the cookie, queries Redis, executes logic, and writes updates back.
  - *Scaling:* Web servers are scaled up or down based on CPU load. If a web node crashes, traffic is routed to another node with zero user session dropouts.

## 7. Common Mistakes
- **In-Memory Cache Pollution:** Caching database queries inside local server variables without synchronization, leading to data drift when multiple servers run.
- **Sticky Session Dependencies:** Relying on load balancer session stickiness, blocking horizontal scalability.
- **Storing PII in JWTs:** Placing sensitive customer data (passwords, SSNs) inside stateless JWT tokens, exposing data to client decryptions.

## 8. AI Coding-Agent Guidelines
1. **Never Cache in Local Server Memory:** Store all session and lookup caches in external databases (Redis).
2. **Encourage JWT/Redis for Auth:** Specify stateless JWT verification or shared Redis session caches.
3. **Declare TTLs:** Ensure every cache insertion specifies a Time To Live limit.
4. **Produce State Management Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# State Management & Session Topology: [System Name]

### 1. State Allocation Architecture
- **Transient Session State:** [e.g. Stored in shared Redis cluster; token ID mapped to session JSON]
- **Cached State:** [e.g. Product metadata stored in Redis; evicted via LRU policy after 1 hour]
- **Persistent State:** PostgreSQL primary instance (ACID storage).

### 2. Session Lifecycle Sizing
- **Session Token Type:** JWT containing `user_id` and `role_permissions` (cryptographically signed).
- **Session Expiration (TTL):** [e.g. 7 days (604,800 seconds)]
- **Session Revocation Strategy:** [e.g., Maintain a token blacklist database in Redis to revoke compromised tokens before expiration.]

### 3. Scaling Triggers
- **Horizontal Scaling Mode:** Stateless application VM hosts; auto-scale instances based on CPU utilization >65%.
```
