# Autoscaling Strategy

### 1. The Question Decided
"Which metrics trigger automated container scaling (CPU, memory, QPS, or message queue depth), and how do we prevent scale thrashing?"

### 2. Options Compared
| Metric Target | CPU Utilization | Memory Utilization | Request Count (QPS) | Queue Depth |
|---|---|---|---|---|
| **Accuracy** | Medium | Poor | High | Best Match |
| **Response Speed**| Medium | Slow | Fast | Fast |
| **Use Case** | CPU-bound routes | RAM leaks check | Web API routing | Background workers |

### 3. Decision Rule
- **Choose metric triggers based on worker types:**
  - *If* application is web API router, *then* scale horizontally based on **CPU Utilization** (>65%) or **Target QPS**.
  - *If* application is async background worker, *then* scale based on **Queue Depth** (e.g. scale out if queue backlog > 100 messages).

### 4. Red Flags to Revisit
- System enters scale "thrashing" loops where containers repeatedly boot up and shut down due to missing cool-down threshold settings.
- Memory utilization triggers scale-out actions, but containers fail to scale down because JVM processes refuse to release memory back to the OS.

### 5. Where to Go Next
- For configuring cool-down periods, scaling policy triggers, and cloud metrics monitors, see Scalability Implementation Guide.
