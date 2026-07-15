# API Gateway Design Pattern Strategy

> [!NOTE]
> [That file decides whether/what API gateway strategy to use; this file covers the pattern's structural mechanics.](../06-api-strategy/api-gateway-strategy.md)

### 1. The Question Decided
"Should the network architecture utilize an API Gateway as a single ingress point, and what routing/validation responsibilities live at this boundary?"

### 2. Options Compared
| Dimension | Central API Gateway | Direct Service Ingress | Service Mesh Sidecar |
|---|---|---|---|
| **Request Latency** | Low-Medium (Gateway hop) | Extremely Low | Low (Direct routing) |
| **Complexity** | Medium | Low | High |
| **Security Controls** | High (Central auth/rate limits) | Low | High (mTLS validation) |
| **Scale Ceiling** | High | Medium | Very High |

### 3. Decision Rule
- **Choose Central API Gateway if:** Deploying microservices or modular backends where cross-cutting concerns (authentication validation, TLS termination, global rate limiting, CORS configuration) must be offloaded from application code.
- **Avoid API Gateway if:** Building single, simple monoliths where direct server ingress is sufficient.

### 4. Red Flags to Revisit
- The API gateway becomes a single point of failure (SPOF), crashing under traffic spikes because it was not scaled independently of app instances.
- Developers write custom business application logic inside gateway configuration scripts, making debugging complex.

### 5. Where to Go Next
- For configuring routing rules, load balancing, and rate limiting policies, see [API Gateway Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/06-api-strategy/api-gateway-strategy-implementation.md).
