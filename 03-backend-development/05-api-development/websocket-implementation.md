# WebSockets

## 1. Definition & Core Concepts
WebSockets is a network protocol that provides full-duplex, bi-directional communication channels over a single, long-lived TCP connection, starting with an HTTP handshake.

## 2. Why It Exists / What Problem It Solves
HTTP is a request-response protocol where only clients can initiate communication. For real-time applications (like chat, live tracking, or stock tickers), clients must repeatedly poll the server. WebSockets allow the server to push updates to the client instantly.

## 3. What Breaks in Production Without It
- **Server Overload from Polling:** Thousands of clients spamming HTTP endpoints every second to check for updates, crashing databases.
- **Delayed Notification Deliveries:** Users receive chat messages or live tracking updates minutes late due to polling delays.

## 4. Best Practices
- **Secure Connection Handshakes:** Validate user authentication tokens (JWT) during the initial HTTP Upgrade handshake.
- **Implement Heartbeats (Ping/Pong):** Send regular ping frames to detect and close dead or hung client connections.
- **Use Message Brokers for Pub/Sub:** Scale WebSocket servers horizontally by connecting them to a Redis Pub/Sub cluster to route events.

## 5. Common Mistakes / Anti-Patterns
- **Using WebSockets for standard requests:** Routing simple, static queries through WebSockets instead of REST endpoints.
- **Ignoring connection limits:** Failing to configure file descriptor limits (NOFILE) on servers, leading to connection blocks.

## 6. Security Considerations
- **Cross-Site WebSocket Hijacking (CSWSH):** Validate the Origin header during handshakes to prevent malicious sites from establishing websocket links.

## 7. Performance Considerations
- **Connection footprints:** WebSocket sessions consume memory. Set reasonable idle timeouts and disconnect inactive users.

## 8. Scalability Considerations
- **Distributed Session Gateways:** Route websocket connections through API gateways that support sticky sessions or distributed memory channels.

## 9. How Major Companies Implement It
- **Slack:** Uses WebSockets to stream real-time chat messages, typing indicators, and status updates to millions of active clients.

## 10. Decision Checklist (Real-Time Channels)
- Use **WebSockets** when:
  - Building bi-directional, high-frequency interactive features (chatrooms, multiplayer games, real-time whiteboards).
- Use **Server-Sent Events (SSE)** when:
  - Building read-only streams (LLM generation tokens, live notifications, news ticker feeds).

## 11. AI Coding-Agent Guidelines
- Write connection managers that validate tokens, handle client disconnect events, and route messages via Redis pub/sub.

## 12. Reusable Checklist
- [ ] Authentication token validated during HTTP Upgrade handshake
- [ ] Ping/Pong heartbeats configured to detect dead connections
- [ ] Redis Pub/Sub backend coordinates messages across websocket nodes
- [ ] Server file descriptor limits (NOFILE) raised for concurrent sockets
- [ ] Origin headers validated during handshake to block hijacking attacks
- [ ] Reconnection logic configured on client libraries with backoff
