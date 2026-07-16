# Stateless Services Strategy

### 1. The Question Decided
"How does the backend enforce stateless execution boundaries, and where are dynamic session variables or caches stored out-of-process?"

### 2. Options Compared
| Dimension | Stateless Service Tier | Stateful Service Tier |
|---|---|---|
| **Horizontal Scaling**| Instant, simple routing | Complex (Requires sticky routing) |
| **Failover Cost** | Zero (Client retries on any node) | High (Session data lost on crash) |
| **Complexity** | Low | High |
| **Session Read Latency**| Medium (Requires Redis lookup) | Extremely Low (In-memory lookup) |

### 3. Decision Rule
- **Choose Stateless Services if:** Building user-facing web APIs that must scale horizontally behind standard load balancers based on CPU/traffic spikes.
- **Enforce Out-of-Process storage:** All session data must reside in Redis, and database states in primary instances.

### 4. Red Flags to Revisit
- A server VM node crashes, causing hundreds of active users to be logged out because session states were stored in local application memory threads.
- Server scaling is blocked because network load balancers are configured with sticky session rules, routing traffic unevenly.

### 5. Where to Go Next
- For implementing stateless controllers, token checks, and out-of-process caches, see Scalability Implementation Guide.
- For details on state storage architectures, see State Management Design.
