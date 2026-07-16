# Kubernetes Strategy

### 1. The Question Decided
"Should the container deployment use Kubernetes (K8s) orchestration, or select simpler VM/Service hosting models?"

### 2. Options Compared
| Dimension | Kubernetes (K8s Cluster) | Docker Compose / EC2 VM | Managed Container Service (ECS) |
|---|---|---|---|
| **Cost (Infra)** | High (Control plane nodes) | Low | Low-Medium |
| **Scaling Control**| High (HPA, VPA, node pools) | Low (Manual VM scale) | Medium |
| **Complexity** | Extremely High | Low | Medium |
| **Multi-Service** | Best Match | Fair | Good |

### 3. Decision Rule
- **Choose Kubernetes if:** Managing large-scale microservice clusters (>10 independent services) requiring automated service discovery, complex routing rules, and auto-scaling.
- **Avoid Kubernetes if:** Building simple monoliths or static multi-container backends where managing control planes and manifest files adds unnecessary overhead.

### 4. Red Flags to Revisit
- Developers spend more hours managing Kubernetes manifests and cluster configuration settings than writing application code.
- Cluster nodes exhaust memory because application pods do not specify resource requests and limits.

### 5. Where to Go Next
- For configuring Kubernetes pod resources limits, network security policies, and deployment templates, see [DevOps Foundations](../../07-platform-engineering/devops-configuration.md).
