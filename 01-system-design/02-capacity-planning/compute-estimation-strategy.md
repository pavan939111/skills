# Compute Estimation

## 1. What Question This Answers
"How many server CPU cores are required to process peak request volumes, and how does this define backend container scaling limits and virtual machine sizing?"

## 2. Why It Matters at the System-Design Stage
If a backend cluster does not have sufficient compute power (vCPU cores), CPU utilization hits 100%, causing request queuing, thread execution delays, and API timeouts. Compute estimation calculates:
- The CPU capacity needed to handle concurrent threads.
- Sizing guidelines for application VMs or containers (e.g. EC2 c6i instances).
- Sizing constraints for horizontal autoscaling thresholds.
Without this estimation, servers run out of CPU cycles under traffic spikes.

## 3. Methodology / How to Work Through It
1. **Identify Request Complexity (CPU Cycles):** Estimate average CPU execution time per request type (e.g. lightweight JSON router vs. CPU-intensive PDF generator or encryption algorithm).
2. **Calculate Peak Concurrency (Active Threads):** Multiply peak QPS by the average request execution duration (in seconds):
   $$\text{Active Concurrent Requests} = \text{Peak QPS} \times \text{Average Request Duration (seconds)}$$
3. **Determine Core Sizing Capacity:** A single CPU core can process one thread at a time. If hyperthreading is active, a vCPU can handle one thread. Set a safe target CPU utilization (typically 50% to 70%) to handle unexpected spikes.
4. **Calculate Required Cores:**
   $$\text{Required Cores} = \frac{\text{Active Concurrent Requests}}{\text{Target CPU Utilization}}$$
5. **Establish Container Distribution:** Divide required cores across multiple containers/VMs to ensure high availability.

## 4. Inputs Needed
- Peak QPS and read/write transaction profiles from [Traffic Estimation](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/traffic-estimation-strategy-implementation.md).
- Target latency budgets.

## 5. Outputs Produced
- Feeds into [Backend Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/07-backend-strategy/index.md) and [Scalability Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/14-scalability-strategy/index.md).

## 6. Worked Example (User Authentication API Service)
- **Peak Traffic:** 2,000 QPS.
- **Request Profile:** User login routes. Checking credentials involves executing bcrypt password hashing (highly CPU-intensive, average execution time 100ms).
- **Calculations:**
  - *Active Concurrent Requests:* $2,000\text{ QPS} \times 0.100\text{s} = 200$ concurrent active threads.
  - *Target CPU Utilization Limit:* 50% (to handle login surges).
  - *Required Cores:* $\frac{200}{0.50} = 400$ cores.
- **Infrastructure Impact:** The authentication service requires 400 virtual CPU cores during peak hours.
  - *Distribution:* Provision 50 backend container instances, each allocated 8 vCPUs, configured with autoscaling.

## 7. Common Mistakes
- **Assuming Standard I/O Constraints:** Treating CPU-bound routes (cryptography, image rendering, parsing) the same as standard database-bound routes, causing severe CPU starvation.
- **Sizing for 100% CPU Utilization:** Designing VM sizing assuming servers can run at 100% CPU capacity without queuing delay.
- **No Autoscaling Safety limits:** Setting autoscaling triggers too high, causing servers to crash before new nodes can boot.

## 8. AI Coding-Agent Guidelines
1. **Identify CPU-Bound Routes:** Flag operations like password hashing, image rendering, or JSON serialization.
2. **Calculate Active Concurrent Threads:** Determine required vCPU core counts based on target utilization (50-70%).
3. **Propose Container Distributions:** Suggest VM sizing (e.g. AWS C-class CPU optimized nodes) and horizontal scaling parameters.
4. **Produce Compute Estimation Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Compute Sizing & CPU Budget: [System Name]

### 1. Request Performance Profile
- **Peak QPS:** [e.g. 500 QPS]
- **Average Request Processing Duration:** [e.g. 80ms (0.08 seconds)]
- **Workload Classification:** [I/O Bound (Database waiting) / CPU Bound (Processing/Encryption)]

### 2. CPU Core Calculations
- **Active Concurrent Threads:** [e.g. $500\text{ QPS} \times 0.08\text{s} = 40$ concurrent active threads]
- **Target Node CPU Utilization:** [e.g. 60% safety target]
- **Total Required vCPU Cores:** [e.g. $\frac{40}{0.60} \approx 67$ cores]

### 3. Server Node Sizing & Distribution
- **Target Node Instance type:** [e.g., AWS c6i.2xlarge (8 vCPUs, 16GB RAM)]
- **Required Node Count:** [e.g. $\frac{67\text{ cores}}{8\text{ cores/node}} \approx 9$ server nodes]
- **Autoscaling Configuration:** [e.g. Trigger scale-out when CPU exceeds 65% for 3 consecutive minutes; minimum 3 nodes for HA.]
```
