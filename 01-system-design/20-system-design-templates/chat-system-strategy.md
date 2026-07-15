# Chat System Design Template

## 1. Target Product Shape
Real-time messaging platform supporting direct messages, group chats, online presence tracking, and message delivery receipts.

## 2. Requirements Analysis
- **Functional:** Send and receive direct messages, track online status, display typing indicators, store message history.
- **Non-Functional:** Real-time latency (<100ms message delivery), persistent client connection management, high write scaling.

## 3. Capacity Planning & Sizing Calculations
- **Traffic Targets:**
  - Active Connections: 500,000 concurrent sockets.
  - Message Write Rate: 5,000 messages/second.
- **Sizing Math:**
  - *RAM (WebSockets):* 500,000 connections $\times 10\text{ KB memory/socket} \approx 5\text{ GB}$ gateway server RAM.
  - *Storage:* 5,000 messages/sec $\times 200\text{ bytes/msg} \approx 1\text{ MB/second}$ storage growth ($\approx 86\text{ GB/day}$).

## 4. Selected Architecture & Components
- **Architecture Style:** WebSockets Gateway cluster + stateless API handlers.
- **Core Components:**
  - WebSocket Connection Servers (manages persistent client sockets).
  - Presence Service (monitors online state via heartbeats).
  - Chat Message Store (writes message logs).

## 5. Technology Selection Strategy
- **Primary Database:** ScyllaDB or Apache Cassandra (handles high write volumes, ordered by chat room ID and timestamp).
- **Session Cache:** Redis (maps connection IDs to active servers, stores presence).
- **Message Broker:** RabbitMQ or Redis Pub/Sub (routes messages to the target container node).

## 6. Critical Trade-offs
- **Write-Heavy Partition Key Choice:** Partition data by `room_id` to ensure message histories are sequential on single disk sectors, preventing slow multi-node reads.
- **Presence Heartbeat Intervals:** Heartbeats sent every 30 seconds to minimize network noise, accepting minor delays in presence state changes.

## 7. Reusable Design Checklist
```markdown
- [ ] WebSocket connections mapped in a shared Redis session store.
- [ ] Messages written to Cassandra/ScyllaDB using composite partition keys.
- [ ] Typing indicators run on volatile memory threads (never written to disk).
```
