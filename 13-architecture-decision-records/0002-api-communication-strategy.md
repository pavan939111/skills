# ADR 0002: API Communication Strategy

*   **Status**: Accepted
*   **Date**: 2026-07-16
*   **Deciders**: Principal Architect, API Lead

---

## 1. Context & Problem Statement

Client applications and internal microservices require a standard interface for communications. Previously, services relied on an inconsistent mix of REST over HTTP, raw sockets, and GraphQL endpoints, leading to code shape fragmentation, routing loops, and payload parsing overhead.

---

## 2. Decision

We will adopt a hybrid **REST-gRPC Communication Strategy**:
1.  **Public External Interfaces**: All client-facing interfaces (web, mobile, third-party integrations) must use **RESTful JSON over HTTPS** routed through a unified API Gateway.
2.  **Internal Inter-Service Interfaces**: All private service-to-service communications must use **gRPC over HTTP/2** with protocol buffer serialization.
3.  **Real-Time Interfaces**: Live data sync loops must use **WebSockets** backed by Redis Pub/Sub backplanes.

---

## 3. Consequences

*   **Optimized Performance**: Internal payload serialization overhead is reduced by up to 80% via proto binary mappings, and connection latency drops due to HTTP/2 multiplexing.
*   **Strict Contracts**: gRPC service APIs are defined using shared `.proto` files, reducing runtime errors.
*   **Proxy Complexity**: API Gateways must handle protocol transcoding (HTTP JSON $\rightarrow$ internal gRPC) for public routes.
