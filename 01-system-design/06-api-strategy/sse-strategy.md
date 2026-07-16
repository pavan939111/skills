# Server-Sent Events (SSE) Strategy

### 1. The Question Decided
"Should the application deploy Server-Sent Events (SSE) for real-time, unidirectional server-to-client updates, and how do we resolve proxy connection limits?"

### 2. Options Compared
| Dimension | Server-Sent Events (SSE) | WebSocket | HTTP Long Polling |
|---|---|---|---|
| **Cost (Compute)** | Low (HTTP connection) | High (Full TCP socket) | High (Continuous hits) |
| **Direction** | Unidirectional (Server -> Client) | Bidirectional | Bidirectional |
| **Complexity** | Low (Native browser API) | High | Medium |
| **Proxy Friendly**| Yes (Standard HTTP) | No (Requires upgrade) | Yes |
| **Protocols** | HTTP/1.1 (Limit 6 connections) | TCP | HTTP |

### 3. Decision Rule
- **Choose SSE if:** The application needs real-time, push-only notifications (e.g. LLM text streaming, dashboard charts alerts) and must navigate firewalls easily.
- **Avoid SSE if:** Client apps require high-frequency upstream mutations (use WebSocket or REST instead).

### 4. Red Flags to Revisit
- Client browsers hang because they hit the HTTP/1.1 limit of 6 open domain connections. (Mitigation: Force HTTP/2).
- Reverse proxies (Nginx/Cloudflare) buffer response streams, blocking real-time chunks delivery.

### 5. Where to Go Next
- For implementation of real-time stream handlers and push channels, see Real-time Push and WebSockets.
