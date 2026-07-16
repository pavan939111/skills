# Backend-for-Frontend (BFF) Strategy

### 1. The Question Decided
"Should the architecture deploy dedicated API translation layers (Backend-for-Frontend) per client platform type (Mobile, Web, IoT)?"

### 2. Options Compared
| Dimension | Single Shared API Gateway | Dedicated BFF per Client Type |
|---|---|---|
| **Bandwidth (Client)**| High (Verbose JSON payload) | Low (Custom formatted payloads) |
| **Complexity** | Low | High (Multiple BFFs to maintain) |
| **Security** | Low-Medium (Shared entry) | High (Client-specific token maps) |
| **Dev Velocity** | Low (Teams block on changes) | High (Client team controls BFF) |

### 3. Decision Rule
- **Choose BFF if:** Developing distinct client types with widely divergent interface requirements (e.g. mobile client requires compact payloads due to network bandwidth; web client displays verbose datasets) and teams want to update APIs independently.
- **Avoid BFF if:** The product uses a single client type or has simple, uniform API shapes.

### 4. Red Flags to Revisit
- Mobile development stalls because teams must wait for backend engineers to update the single, shared monolithic API gateway payload schemas.
- High latency is introduced because the BFF layer executes multiple synchronous RPC hops without using async request aggregation.

### 5. Where to Go Next
- For configuring routing rules and gateway structures, see API Gateway Strategy.
