# Load Balancing Strategy

### 1. The Question Decided
"Which load balancing algorithms (Round Robin, Least Connections, or IP Hash) should distribute traffic across backend server clusters?"

### 2. Options Compared
| Algorithm | Round Robin | Least Connections | IP Hash |
|---|---|---|---|
| **Traffic Distribution**| Equal distribution | Based on active sessions | Based on client IP |
| **Use Case** | Stateless, quick routes | Long-running queries | Stateful / Sticky sessions |
| **Complexity** | Low | Medium | Medium |
| **Scale Friendly** | High | High | Low (Reduces scaling balance) |

### 3. Decision Rule
- **Choose Least Connections if:** Request execution times vary significantly (e.g. some queries take milliseconds, others take seconds) to prevent overloading a single node.
- **Choose Round Robin if:** Requests are stateless, fast, and uniform in execution profile.

### 4. Red Flags to Revisit
- A single backend server instance crashes under load because it received too many heavy database queries while other nodes remained idle (Round Robin limitation under uneven request loads).
- The load balancer fails to distribute traffic during auto-scaling events due to sticky session configuration bindings.

### 5. Where to Go Next
- For configuring load balancers, health checks routing, and SSL termination policies, see [Scalability Implementation Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/performance-and-scale/02-scalability.md).
