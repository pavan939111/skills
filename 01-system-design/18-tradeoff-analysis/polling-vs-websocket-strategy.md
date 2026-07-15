# Polling vs. WebSocket Trade-off Analysis

## 1. What Question This Answers
"Should the client application use HTTP Polling, Server-Sent Events (SSE), or WebSockets for real-time updates, and what are the detailed architectural trade-offs?"

## 2. Why It Matters at the System-Design Stage
Real-time client connections affect server resource consumption. HTTP polling generates high request volume, saturating database connections. WebSockets solve this with persistent TCP channels, but exhaust server socket limits under concurrency and prevent standard load balancing. Server-Sent Events (SSE) provide a lightweight, HTTP-based push alternative, but are unidirectional. Selecting the wrong model can lead to performance issues or complex codebases.

## 3. Methodology / How to Work Through It
1. **Analyze Directionality:** Does the client need to send high-frequency updates to the server (WebSockets), or does the server only need to push updates (SSE/Polling)?
2. **Review Concurrency Limits:** Estimate the number of concurrent open connections. Persistent sockets consume RAM per connection.
3. **Compare Load Balancing Support:** Standard proxies route HTTP polling easily. WebSockets require sticky connections.
4. **Evaluate Firewall Friendly nature:** Standard HTTP (polling/SSE) easily passes firewalls. WebSockets require specific upgrade header rules.
5. **Formulate the Real-time Selection:** Choose the protocol matching direction and scale profiles.

## 4. Inputs Needed
- Peak concurrent user sessions from [User Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/user-analysis.md).
- Target latency budgets.

## 5. Outputs Produced
- Feeds directly into [API Strategy Selection](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/06-api-strategy/websocket-strategy-implementation.md).

## 6. Worked Example (Live Chat vs. Delivery Status Updates)
- **Live Chat Application (WebSocket Choice):**
  - *Context:* Low-latency bidirectional messaging between users.
  - *Decision:* WebSockets.
- **Order Delivery Tracking (SSE Choice):**
  - *Context:* Server pushes coordinate updates to the client app map. Unidirectional updates.
  - *Decision:* Server-Sent Events (SSE).

## 7. Common Mistakes
- **HTTP Short Polling for Real-Time:** Implementing 1-second short polling loops on database-backed APIs, causing connection exhaustion.
- **WebSockets for Alerts:** Deploying complex WebSocket servers for simple notifications tasks that could be handled by native browser SSE.

## 8. AI Coding-Agent Guidelines
1. **Enforce SSE for Unidirectional Push:** Recommend SSE for LLM text streams and status alerts.
2. **Propose WebSockets for Bidirectional real-time:** Recommend WebSockets only for interactive, multiplayer-style features.
3. **Produce Real-time Protocol Comparison Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Polling vs. WebSocket vs. SSE Assessment: [System Name]

### 1. Comparative Matrix
| Metric / Feature | HTTP Polling | Server-Sent Events (SSE) | WebSockets |
|---|---|---|---|
| **Direction** | Bidirectional (Poll) | Unidirectional (Server -> Client) | Bidirectional |
| **Server Resource** | High (Repeated pings) | Medium (HTTP connection) | High (Persistent TCP) |
| **Latency** | High (Poll interval wait)| Low | Extremely Low |
| **Proxy Compatibility**| High | High | Medium (Upgrade headers) |
| **Reconnect Support** | Loop managed | Native browser auto-reconnect | Manual script required |

### 2. Selection Recommendation
- **Target Selection:** [e.g. Server-Sent Events (SSE)]
- **Justification:** [e.g., Application only needs to push progress status updates from background PDF tasks. Unidirectional flow fits standard HTTP/2 proxies.]
```
