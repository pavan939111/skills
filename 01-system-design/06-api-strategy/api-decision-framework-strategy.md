# API Decision Framework

### 1. The Question Decided
"What is the overall structured decision logic used to select the appropriate API protocol and interface pattern for each application boundary?"

### 2. Options Compared
| Criteria / Context | REST (JSON) | GraphQL | gRPC | WebSockets / SSE |
|---|---|---|---|---|
| **Public API Clients** | Best Match | Good | Poor | Fair |
| **Mobile & Web UI** | Good | Best Match | Fair | Good |
| **Internal RPC** | Poor | Poor | Best Match | Poor |
| **Real-time Push** | Poor | Fair | Fair | Best Match |

### 3. Decision Rule
- **Use the protocol matrix to map boundaries:**
  - *If* communication is internal service-to-service, *then* select **gRPC**.
  - *If* communication is client-to-server read-heavy feed scrolling, *then* select **REST** (with caching) or **GraphQL**.
  - *If* communication requires real-time server updates, *then* select **SSE** (push-only) or **WebSockets** (bidirectional).

### 4. Red Flags to Revisit
- Developers spend hours writing custom HTTP REST wrappers for internal calls when auto-generated gRPC stubs could automate the path.
- Client applications lag because they must parse heavy REST JSON responses containing unused nested fields.

### 5. Where to Go Next
- For implementation guidelines across all API styles (REST, GraphQL, gRPC, WebSockets), see [API Development Reference](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/05-api-development/index.md).
