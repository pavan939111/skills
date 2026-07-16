# Geo-Distribution Strategy

### 1. The Question Decided
"How do we distribute content and route user API requests to the closest physical servers?"

### 2. Options Compared
| Routing Protocol | DNS Geo-routing | Anycast routing | CDN Edge caching |
|---|---|---|---|
| **Layer Level** | Layer 7 (Application DNS) | Layer 3/4 (Network Routing) | Layer 7 (Proxy Edge) |
| **Performance** | Slow (DNS cache TTL) | Very Fast | Best for static payloads |
| **Failure Recovery** | Slow | Fast (BGP routing changes) | Fast (health-check updates) |

### 3. Decision Rule
- Use **CDN Edge Caching** for static content, assets, and cacheable API read routes.
- Use **Anycast Routing** for entry gateways (e.g. Global load balancer IPs) to route API write traffic to the nearest regional cluster.
- Enforce fallback to secondary IP targets dynamically on server health check failures.

### 4. Red Flags to Revisit
- Geographically misrouted traffic due to outdated IP geolocation databases at public DNS providers.
- Localized cache poisoning attacks on the CDN edge nodes due to missing cache key headers validation.

### 5. Where to Go Next
- For configuring reverse proxies and server headers, see [Load Balancing Strategy](./load-balancing-strategy.md).
