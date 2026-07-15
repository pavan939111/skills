# Traffic Estimation

## 1. What Question This Answers
"What is the expected volume of user requests, reads, and writes per second, and how does this define web server routing capacity and database connection limits?"

## 2. Why It Matters at the System-Design Stage
Without traffic estimation, infrastructure sizing is guesswork. Proposing system structures without calculating traffic targets leads to:
- Under-provisioned servers that crash under active user loads.
- Over-provisioned systems that waste thousands of dollars in cloud resources.
Traffic estimation provides the raw numbers (QPS, DAU ratios) that dictate node counts, load balancer routing policies, and server size configurations.

## 3. Methodology / How to Work Through It
1. **Analyze Daily Active Users (DAU):** Determine target daily active users.
2. **Estimate Request per User:** Calculate average number of page interactions or actions a user executes daily.
3. **Calculate Average QPS (Queries Per Second):**
   $$\text{Average QPS} = \frac{\text{Total Requests per Day}}{86,400\text{ seconds}}$$
4. **Calculate Peak QPS:** Account for peak-to-average surges. A standard industry multiplier is $2\text{x}$ to $5\text{x}$ average QPS for general apps, and up to $10\text{x}$ or $20\text{x}$ for event-driven systems (e.g. ticketing, messaging).
5. **Separate Read and Write QPS:** Align ratios with workload analyses.

## 4. Inputs Needed
- Active user scale and read-to-write ratios from [User Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/user-analysis.md).
- Target peak traffic parameters.

## 5. Outputs Produced
- Feeds directly into [Storage Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/storage-estimation-strategy-implementation.md), [Bandwidth Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/bandwidth-estimation-strategy-implementation.md), and [QPS Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/qps-estimation-strategy-implementation.md).

## 6. Worked Example (Standard SaaS Product Catalog)
- **User Scale:** 1,000,000 DAU.
- **Ratios:** 95:5 read-to-write ratio.
- **User Activity:** Average user makes 20 queries daily (19 reads, 1 write).
- **Calculations:**
  - *Total Requests/Day:* $1,000,000 \times 20 = 20,000,000$ requests.
  - *Average QPS:* $\frac{20,000,000}{86,400} \approx 231$ QPS.
  - *Peak QPS (using 3x factor):* $231 \times 3 \approx 693$ QPS.
  - *Read QPS (Peak):* $693 \times 0.95 \approx 658$ QPS.
  - *Write QPS (Peak):* $693 \times 0.05 \approx 35$ QPS.
- **Infrastructure Impact:** Server web clusters must support 700 concurrent requests, and database connection pools must handle at least 35 writes/second.

## 7. Common Mistakes
- **Underestimating Peak Factors:** Using average QPS to size database servers, causing crashes during peak launch hours when traffic spikes by 10x.
- **Ignoring Read/Write Segregation:** Sizing databases assuming all QPS are reads, failing to design for write lock contention when write rates spike.
- **No Buffer Headroom:** Sizing servers exactly to current peak numbers with no growth margin.

## 8. AI Coding-Agent Guidelines
1. **Request Scale Metrics:** Ask: "What are the target DAU and average user action counts?"
2. **Calculate Peak Boundaries:** Quantify average and peak QPS values.
3. **Produce Sizing Requirements:** Document the server web cluster and database connection pool impacts.
4. **Produce Traffic Estimation Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Traffic Estimation: [System Name]

### 1. Scale Input Parameters
- **Daily Active Users (DAU):** [e.g. 500,000]
- **Average Requests per User/Day:** [e.g. 10 requests]
- **Read-to-Write Ratio:** [e.g. 90:10 (90% reads, 10% writes)]
- **Peak Surge Multiplier:** [e.g. 3x]

### 2. QPS Sizing Calculations
- **Total Daily Requests:** [e.g. 5,000,000 requests/day]
- **Average QPS:** [e.g. $\frac{5,000,000}{86,400} \approx 58$ QPS]
- **Peak QPS:** [e.g. $58 \times 3 \approx 174$ QPS]
- **Peak Read QPS:** [e.g. $174 \times 0.90 \approx 156$ QPS]
- **Peak Write QPS:** [e.g. $174 \times 0.10 \approx 18$ QPS]

### 3. System Sizing Impact
- **Web Tier Capacity:** [e.g. Load balancer must support 174 QPS peak routing.]
- **Database Write Limit:** [e.g. Database connection pools must support 18 concurrent write sessions.]
```
