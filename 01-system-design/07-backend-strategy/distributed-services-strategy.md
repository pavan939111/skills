# Distributed Services Strategy

### 1. The Question Decided
"How do we coordinate distributed backend nodes, and what consensus patterns or discovery protocols manage dynamic cluster membership?"

### 2. Options Compared
| Dimension | Dynamic Service Discovery (e.g. Consul) | Static Gateway Routing (DNS mapping) | Service Mesh (e.g., Istio) |
|---|---|---|---|
| **Cost (Infra)** | Medium (Consul agent nodes) | Low (DNS setup only) | High (Sidecar proxy CPU) |
| **Routing Speed** | Fast | Fast (DNS TTL cached) | Medium (Sidecar latency hop) |
| **Complexity** | High | Low | Very High |
| **Capability** | High (Health status routing) | Low (Static endpoints) | Very High (mTLS, telemetry) |

### 3. Decision Rule
- **Choose Dynamic Service Discovery/Service Mesh if:** Building high-scale microservices clusters where nodes boot dynamically and need secure mTLS communication.
- **Choose Static Gateway/DNS Routing if:** Building simple monoliths or static multi-container backends where routing endpoints remain stable.

### 4. Red Flags to Revisit
- Network timeouts occur because application DNS pings fail to update fast enough when backend service instances scale down.
- Developers spend significant time configuring manual routing maps across microservice clusters.

### 5. Where to Go Next
- For implementing microservice interfaces, endpoints wiring, and RPC connectivity models, see Microservice Implementation Guide.
- For distributed service boundaries strategy, see Service Decomposition.
