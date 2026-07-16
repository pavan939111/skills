# CDN Strategy

### 1. The Question Decided
"Should the system deploy a Content Delivery Network (CDN) at edge regions, and what headers control edge caching policies?"

### 2. Options Compared
| Dimension | Edge CDN (CloudFront / Cloudflare) | Direct Storage Link (Public S3 URL) | Direct Application Server Routing |
|---|---|---|---|
| **Cost (Bandwidth)** | Low (Egress discounts) | High | Very High |
| **Edge Latency** | Extremely Low (Cached globally) | Medium | High (Geographic distance) |
| **Complexity** | Medium (Header config needed) | Low | Low |
| **Server Protection** | High (Absorbs read QPS) | High | None (Saturates VM ports) |
| **Dynamic content** | Good (Geo-routing) | Poor | Best Match |

### 3. Decision Rule
- **Choose Edge CDN if:** The system serves static assets (HTML, JS, CSS, images) globally, and we want to protect origin databases and server bandwidth from cache hits.
- **Avoid Edge CDN if:** The application is highly personalized (every page read is unique per user) and caching offers no benefit.

### 4. Red Flags to Revisit
- Application hosting costs spike due to high network egress egress rates on VM servers.
- Users see outdated media images because the CDN cache invalidation headers are set incorrectly.

### 5. Where to Go Next
- For configuring HTTP caching headers (`Cache-Control`, `ETag`) and CDN integrations, see [CDN & Cache-Control Configurations](../../04-database-design/file-storage-strategy.md).
