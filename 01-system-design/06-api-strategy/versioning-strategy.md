# API Versioning Strategy

### 1. The Question Decided
"How should API versioning be structured (URI, Header, or Query Parameter), and what criteria define a breaking change?"

### 2. Options Compared
| Dimension | URI Versioning (`/v1/`) | Custom Header (`X-Version`) | Accept Header (MIME Type) |
|---|---|---|---|
| **Cost (Caching)** | Low (Cache friendly) | High (Cache keys complex) | High (Cache keys complex) |
| **Complexity** | Low | Medium | High |
| **Client Control**| High (Explicit URL) | Medium | High |
| **Route Routing** | Simple path matching | Requires header inspect | Requires header inspect |

### 3. Decision Rule
- **Choose URI Versioning if:** API caching is critical, and client integrations require simple, explicit routes configurations.
- **Choose Header Versioning if:** Designing clean resource URIs and supporting fine-grained version overrides (e.g. per-endpoint versioning).

### 4. Red Flags to Revisit
- Maintaining 5 versions of the same API simultaneously exhausts developer resources and introduces data schema migration bugs.
- Public CDNs serve stale `v1` cached JSON outputs because client apps changed header versions without changing request URLs.

### 5. Where to Go Next
- For implementation of URI routing versioning and framework middlewares configurations, see API Versioning Implementation.
