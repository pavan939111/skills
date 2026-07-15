# Sidecar Strategy

### 1. The Question Decided
"Should cross-cutting operational tasks (logging, tracing, proxy routing) run as isolated sidecar containers alongside primary application containers?"

### 2. Options Compared
| Dimension | Sidecar Pattern (Out-of-Process container) | In-Process App Library | Shared Daemon Node Service |
|---|---|---|---|
| **Resource Cost** | High (RAM per container) | Low | Low |
| **Isolation** | High (Process boundaries) | Low | Medium |
| **Polyglot Friendly**| Yes (Language agnostic) | No (Requires specific library) | Yes |
| **Complexity** | High | Low | Medium |

### 3. Decision Rule
- **Choose Sidecar Pattern if:** Deploying polyglot microservices in Kubernetes where operations tasks (e.g. Envoy proxies for service meshes, logging agents like FluentBit) must be standardized without modifying application code.
- **Avoid Sidecar if:** Running a single monolith or resource-constrained nodes (RAM limits) where running duplicate sidecars is too expensive.

### 4. Red Flags to Revisit
- Kubernetes pods run out of memory because sidecar containers (e.g. logs buffers) consume more RAM than the primary application container.
- Container startup dependencies fail because the application attempts to bind to network interfaces before the proxy sidecar finishes booting.

### 5. Where to Go Next
- For configuring Kubernetes pod container resources, sidecars definitions, and startup timings, see [DevOps Foundations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/delivery-and-readiness/03-devops-configuration.md).
