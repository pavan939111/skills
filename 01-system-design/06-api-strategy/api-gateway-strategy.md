# API Gateway Strategy

### 1. The Question Decided
"Should the system deploy a dedicated API Gateway (e.g. Kong, Envoy, AWS API Gateway) in front of services, and what features are consolidated at this edge?"

### 2. Options Compared
| Dimension | Dedicated API Gateway | Direct Routing (Load Balancer) | BFF (Backend for Frontend) |
|---|---|---|---|
| **Cost (Hosting)** | Medium-High (Dedicated proxies) | Low (Simple rule sets) | Medium (Extra Node services) |
| **Latency** | Low (Added network hop 1-2ms) | Extremely Low | Medium (Resolvers execution) |
| **Complexity** | High (Configuration management) | Low | High |
| **Capabilities** | High (Rate limiting, auth, logging) | Low (Basic routing) | High (Data aggregation) |

### 3. Decision Rule
- **Choose API Gateway if:** Building microservice architectures where routing, authentication, and rate-limiting must be consolidated at a single ingress point.
- **Avoid API Gateway if:** Developing simple monolithic applications where standard load balancers and framework middlewares can handle routing and auth.

### 4. Red Flags to Revisit
- The API gateway becomes a single point of failure (SPOF) and experiences outages due to misconfigured Lua routing plugins.
- Total request latency increases because the gateway network hops and filter pipelines consume too much time budget.

### 5. Where to Go Next
- For configuring Docker containers and network routing setups for gateways, see [DevOps Readiness](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/20-devops-readiness/index.md).
- For implementing ingress middleware logic in backend services, see [API Development](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/05-api-development/restful-api.md).
