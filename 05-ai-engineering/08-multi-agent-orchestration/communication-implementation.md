# Agent Communication Protocols

## 1. Definition & Core Concepts
Agent Communication Protocols define the structured message formats (e.g. JSON schemas) and transport channels (e.g., event queues, WebSockets) used by agents to exchange data, task statuses, and execution updates.

## 2. Why It Exists / What Problem It Solves
Multi-agent systems require coordination. Protocols ensure that agents speak the same data language, allowing them to exchange parameters and state maps without parsing errors.

## 3. What Breaks in Production Without It
- **JSON Parsing Errors:** Agents fail to parse responses because a peer returned free-form text instead of the expected schema.
- **Accidental State Mutates:** Agents execute actions out of order due to lack of coordination.
- **Network drops:** Ingress connections hang because communication paths are synchronous and block threads.

## 4. Best Practices
- **Define Strict Message Schemas:** Force JSON schemas on all agent communication payloads (e.g. `from`, `to`, `type`, `payload`).
- **Use Asynchronous Event Queues:** Transport messages using queues (e.g., RabbitMQ / Redis) to keep execution threads non-blocking.
- **Implement request retry jitter:** Exponential backoff for network drops.

## 5. Common Mistakes / Anti-Patterns
- **Free-form text messaging:** Allowing agents to chat in plain text without structure, causing parsing errors.
- **Synchronous HTTP loops:** Making direct HTTP calls between agents, risking thread blocks.

## 6. Security Considerations
- **Boundary controls:** Ensure messages are encrypted in transit and validate user access tags.

## 7. Performance Considerations
- **Protocol Overhead:** Keep schema fields compact to optimize serialization latency.

## 8. Scalability Considerations
- **Concurrency Queues:** Scale consumer worker pools to handle message queues.

## 9. How Major Companies Implement It
- **Microsoft:** Uses standardized schema messages to coordinate agents inside Autogen frameworks.
- **OpenAI:** Exposes function calling schemas to allow structured communication.

## 10. Decision Checklist (Protocol Selection)
- Use **Structured JSON over Event Queues** when:
  - Designing complex multi-agent systems where tasks run asynchronously in background threads.
- Use **Synchronous API Routing** when:
  - Tasks are short, linear, and require immediate UI updates.

## 11. AI Coding-Agent Guidelines
- Always implement Zod/Pydantic schemas to validate communication payloads before forwarding them to agent classes.

## 12. Reusable Checklist
- [ ] Message schemas defined in code (Zod/Pydantic)
- [ ] Asynchronous event queue transport configured
- [ ] Client SDKs configured with timeouts and backoffs
- [ ] Message payloads encrypted in transit
- [ ] Telemetry metrics track queue sizes and latency
- [ ] Unit tests verify schema compliance under edge cases
