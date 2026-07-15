# CI/CD Strategy

### 1. The Question Decided
"What continuous integration and deployment pipelines validate code updates, and what release strategies promote code to production hosts?"

### 2. Options Compared
| Dimension | GitOps CD (ArgoCD) | Push-Based CD (GitHub Actions) | Manual Scripted CD |
|---|---|---|---|
| **Cost** | Medium | Low | Low |
| **Security** | High (Pull model, no cluster keys) | Medium (Requires keys) | Low |
| **Complexity** | High | Low-Medium | Low |
| **Audit Trails** | High (Git history matches state) | Medium | Low |

### 3. Decision Rule
- **Choose GitOps CD (ArgoCD) if:** Operating Kubernetes environments where deployment configurations must reflect Git repository states.
- **Choose Push-Based CD if:** Building standard applications where deploying VM clusters or serverless functions from GitHub runners is sufficient.

### 4. Red Flags to Revisit
- Deployments fail silently because the pipeline lacks automated post-deploy integration test validations.
- Credentials leak because CI runners deploy code using high-privilege keys.

### 5. Where to Go Next
- For configuring linting, vulnerability scans, build jobs, and deployment pipelines, see [CI/CD Implementation Reference](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/delivery-and-readiness/02-ci-cd-strategy-implementation.md).
