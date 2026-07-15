# Request Estimation

## 1. What Question This Answers
"What is the total number of API requests, database queries, and static asset downloads expected daily and at peak times, and how does this define load balancer and gateway scaling boundaries?"

## 2. Why It Matters at the System-Design Stage
API gateways and load balancers rate-limit requests based on request limits, not server CPU. Request estimation calculates the raw number of HTTP requests that must be parsed, validated, routed, and terminated per second. This defines:
- The required scale of API gateway nodes (e.g. AWS Kong or Envoy proxies).
- Sizing constraints for web server connection concurrency.
- Where rate-limiting rules must be applied to prevent DDoS outages.
Without this estimation, gateways exhaust file descriptors, dropping connections during traffic spikes.

## 3. Methodology / How to Work Through It
1. **Define Daily Active User Interaction Profile:** Map the exact sequence of API requests a single user triggers during a standard session:
   - *Example:* 1 login request + 10 list reads + 2 write orders + 5 image downloads = 18 requests/session.
2. **Calculate Daily Request Volume:** Multiply the total session requests by daily active users (DAU).
3. **Deconstruct Request Types:** Segment requests into:
   - *Transactional Writes:* Requires ACID database queries.
   - *Static Asset Downloads:* Can be offloaded to CDNs.
   - *Read-only Queries:* Can be served via caches or replicas.
4. **Calculate Peak Request Rates:** Estimate the peak requests per second (RPS) using surge multipliers.
5. **Establish Gateway Limits:** Use these numbers to size concurrent connection limits on load balancers.

## 4. Inputs Needed
- Peak QPS estimates and read/write ratios from [Traffic Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/traffic-estimation-strategy-implementation.md).
- User flow sequences.

## 5. Outputs Produced
- Feeds into [API Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/06-api-strategy/index.md) and [Scalability Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/14-scalability-strategy/index.md).

## 6. Worked Example (E-Commerce Storefront API)
- **User Base:** 100,000 DAU.
- **Session Profile:**
  - `POST /api/v1/auth/login` (1 request)
  - `GET /api/v1/products` (10 requests)
  - `POST /api/v1/cart` (3 requests)
  - `POST /api/v1/checkout` (1 request)
  - Static product image downloads (15 requests)
  - *Total Requests/User:* 30 requests.
- **Calculations:**
  - *Total Daily Requests:* $100,000 \times 30 = 3,000,000$ requests/day.
  - *Average RPS:* $\frac{3,000,000}{86,400} \approx 35$ RPS.
  - *Peak RPS (using 4x surge factor):* $35 \times 4 \approx 140$ RPS.
- **System Design Decisions:**
  - *CDN offload:* Static images (15 requests per session = 50% of total requests) are offloaded to CloudFront, reducing peak server load from 140 RPS to 70 RPS.
  - *Gateway sizing:* API gateway must support 70 RPS peak, with rate-limiting set to 20 requests/minute per IP to prevent scraper abuse.

## 7. Common Mistakes
- **Ignoring Static Asset Requests:** Failing to count image, style, or asset requests, causing web servers to choke on static asset downloads under load.
- **No Rate-Limiting rules:** Designing open API endpoints without rate-limiting, leaving the system vulnerable to scrape loops or DDoS attacks.
- **Ignoring Browser Pre-flight Options:** Failing to account for HTTP CORS `OPTIONS` pre-flight requests, which can double the number of hits on API gateways.

## 8. AI Coding-Agent Guidelines
1. **Audit User Session Paths:** Count the number of API hits generated per page transition.
2. **Quantify Peak RPS limits:** Estimate load requirements for gateways and load balancers.
3. **Propose CDN and Rate-limiting policies:** Suggest offloading static assets and setting IP-based rate-limits.
4. **Produce Request Estimation Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Request Capacity Sizing: [System Name]

### 1. User Session Request Profile
- **Target DAU:** [e.g. 200,000]
- **Requests per Session breakdown:**
  - `/api/auth` (reads/writes): [e.g. 2 hits]
  - `/api/content` (reads): [e.g. 8 hits]
  - Static Asset hits: [e.g. 10 hits]
- **Total Requests per Session:** [e.g. 20 hits]

### 2. Request Rates Sizing (Peak Volume)
- **Total Daily Server Requests:** [e.g. $200,000 \times 20 = 4,000,000$ requests/day]
- **Average RPS:** [e.g. $\frac{4,000,000}{86,400} \approx 46$ RPS]
- **Peak RPS (e.g. 3x surge):** [e.g. $46 \times 3 \approx 138$ RPS]
- **Egress Offloaded to CDN:** [e.g., 50% (static asset hits), reducing peak server load to 69 RPS]

### 3. Load Balancer & Gateway Constraints
- **Gateway Sizing:** [e.g. API Gateway must support 70 RPS routing.]
- **Rate-Limiting Rule:** [e.g. Enforce rate-limits on `/api/auth` at 10 requests/minute per IP, and 100 requests/minute on search routes.]
```
