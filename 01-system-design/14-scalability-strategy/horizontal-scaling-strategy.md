# Horizontal Scaling Strategy

### 1. The Question Decided
"Should the application compute tier scale horizontally (adding more instances) or vertically (adding more vCPUs/RAM to existing hosts)?"

### 2. Options Compared
| Dimension | Horizontal Scaling (Scale Out) | Vertical Scaling (Scale Up) |
|---|---|---|
| **Cost** | High initially, scales linearly | High at high tiers (quadratic VM pricing) |
| **Limit Ceiling** | Infinite | Finite (Single host hardware limits) |
| **Complexity** | High (Requires stateless design + ALB)| Low |
| **Availability** | High (Multi-node redundancy) | Low (SPOF host) |
| **Startup Delay** | Yes (VM boot latency) | None |

### 3. Decision Rule
- **Choose Horizontal Scaling if:** Sizing application backend container tiers that handle dynamic user request traffic, to allow automatic scaling out while maintaining high availability.
- **Choose Vertical Scaling if:** Scaling primary relational database instances where data joins require single-memory CPU access speeds, up to instance hardware limits (e.g. 64 vCPUs).

### 4. Red Flags to Revisit
- Application scaling is blocked because compute nodes store user session variables locally in server memory, preventing users from hit routing to alternate nodes.
- Virtual machine hosting costs spike exponentially because the team continues to scale up database instance sizing instead of introducing read replicas.

### 5. Where to Go Next
- For configuring autoscaling groups, load balancer targets, and horizontal node metrics, see Scalability Implementation Guide.
- For database horizontal partition designs, see Horizontal Database Scaling.
