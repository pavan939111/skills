# gRPC

## 1. Definition & Core Concepts
gRPC (Google Remote Procedure Call) is a high-performance, open-source RPC framework that utilizes HTTP/2 for transport, Protocol Buffers (protobuf) as the interface definition language, and supports streaming, load balancing, and tracing.

## 2. Why It Exists / What Problem It Solves
REST/JSON is verbose, slow to parse, and lacks native contract enforcement. gRPC solves these issues by compiling strongly-typed protobuf schemas into code, using binary serialization for low CPU overhead, and multiplexing connections over HTTP/2.

## 3. What Breaks in Production Without It
- **High CPU and Latency:** Internal microservices spend significant resources encoding and decoding JSON strings, increasing network latency.
- **Integration Inconsistencies:** Services fail to communicate because of field naming mismatches in unstructured REST payloads.

## 4. Best Practices
- **Pin Protobuf Versions:** Store .proto files in a shared registry repository, compiling client and server stubs from identical schemas.
- **Enable Connection Multiplexing:** Reuse HTTP/2 connection channels to avoid port exhaustion under high concurrent load.
- **Implement Deadlines:** Always configure request deadlines in gRPC clients to prevent slow downstream calls from hanging event pools.

## 5. Common Mistakes / Anti-Patterns
- **Exposing gRPC directly to web clients:** Routing public web traffic directly to gRPC stubs without translation gateways (like grpc-gateway).
- **Ignoring status code mappings:** Returning raw exceptions instead of mapping errors to standard gRPC status codes.

## 6. Security Considerations
- **Secure Transport:** Enforce Transport Layer Security (TLS) or mutual TLS (mTLS) for all gRPC connections.

## 7. Performance Considerations
- **Binary Serialization:** Protobuf binary payloads are up to 80% smaller than JSON, reducing bandwidth and CPU usage.

## 8. Scalability Considerations
- **L4/L7 Load Balancing:** Use gRPC-aware load balancers (like Envoy) to distribute requests evenly over persistent HTTP/2 connections.

## 9. How Major Companies Implement It
- **Netflix:** Relies on gRPC for almost all internal microservice-to-microservice communication to optimize latency and throughput.

## 10. Decision Checklist (gRPC Selection)
- Use **gRPC** when:
  - Designing internal service-to-service communication paths in microservice or modular monolith systems.
- Use **REST** when:
  - Designing public-facing client APIs, webhook targets, or lightweight web integrations.

## 11. AI Coding-Agent Guidelines
- Write Protocol Buffer files with explicit namespace declarations, index tags, and status code mappings for exceptions.

## 12. Reusable Checklist
- [ ] Protocol Buffer schemas define all service methods and data types
- [ ] client stubs auto-generated from shared, version-pinned proto files
- [ ] TLS or Mutual TLS active on gRPC transport channels
- [ ] Request deadlines and connection timeouts configured in clients
- [ ] gRPC-aware load balancing active (e.g. Envoy proxy)
- [ ] Internal exceptions mapped to standard gRPC status codes
