# REST API Strategy

### 1. The Question Decided
"Should the primary external API boundary use RESTful patterns, and how does this affect client integration and performance?"

### 2. Options Compared
| Dimension | REST (JSON) | GraphQL | gRPC | WebSocket |
|---|---|---|---|---|
| **Cost (Infra)** | Low | Medium (Query parser CPU) | Low | High (Persistent sockets) |
| **Latency** | Low (Cached) | Medium (N+1 query risks) | Very Low (Binary) | Very Low |
| **Complexity** | Low | High (Schema mapping) | High (Protobuf) | High (State management) |
| **Familiarity** | Universal | Medium | Medium-Low | Medium |
| **Scale Ceiling**| High | Medium | Very High | High |

### 3. Decision Rule
- **Choose REST if:** The client interface is a standard web/mobile app, HTTP caching is required, team familiarity is a priority, and request patterns are predictable.
- **Avoid REST if:** Clients require complex, dynamic fields filtering (use GraphQL) or low-latency service-to-service streaming (use gRPC).

### 4. Red Flags to Revisit
- Over-fetching JSON payloads exceeds 5MB per page load, saturating client bandwidth.
- Client applications execute $>10$ separate API calls per screen to fetch related child resources, causing network congestion.

### 5. Where to Go Next
- For implementation of REST API routes, controllers, and routing configurations, see RESTful API Implementation.
