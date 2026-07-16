# gRPC vs. REST Trade-off Analysis

## 1. What Question This Answers
"Should internal service-to-service communication use gRPC or RESTful JSON APIs, and what are the detailed performance and development trade-offs?"

## 2. Why It Matters at the System-Design Stage
In distributed architectures (microservices), internal service communication happens constantly. If services communicate via HTTP/REST with JSON payloads, the network overhead is high: text serialization, connection handshakes, and verbose payload size. gRPC resolves this by using HTTP/2 connections, multiplexing requests over a single channel, and serializing payloads to binary Protocol Buffers. However, gRPC complicates browser-to-server routing and requires API client code generation.

## 3. Methodology / How to Work Through It
1. **Analyze Interface Location:** Is the boundary external (public/browser clients) or internal (service-to-service)?
2. **Review Latency Requirements:** Will network serialization delay exceed 5ms? If yes, select gRPC.
3. **Check Payload Size constraints:** For bandwidth-sensitive routes, compare binary Protobuf sizes against JSON.
4. **Compare Client Tooling capabilities:** REST is universally supported; gRPC requires client stub compilation.

## 4. Inputs Needed
- Latency budgets from Latency Requirements.
- Service boundaries and communication maps.

## 5. Outputs Produced
- Feeds directly into API Strategy Selection.

## 6. Worked Example (User Order to Inventory Check)
- **Order Service calling Inventory Service (gRPC Choice):**
  - *Context:* Internal call. Runs 500 times/second. Latency budget is <5ms.
  - *Decision:* gRPC (HTTP/2, Protocol Buffers).
- **Client App calling Order Service (REST Choice):**
  - *Context:* Public ingress route from client browsers.
  - *Decision:* REST (JSON payloads, HTTP/1.1 compatible).

## 7. Common Mistakes
- **gRPC in Browser Client:** Attempting to call gRPC endpoints directly from client browsers without configuring gRPC-Web proxies.
- **REST for internal telemetry streams:** Using heavy REST APIs for internal logging pipelines, saturating CPU on JSON parsing.

## 8. AI Coding-Agent Guidelines
1. **gRPC for Internal Hops:** Recommend gRPC by default for all internal, synchronous microservice connections.
2. **REST for Public Endpoints:** Recommend REST/JSON for all public and client-facing interfaces.
3. **Produce gRPC vs REST Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# gRPC vs. REST Trade-off Matrix: [System Boundary Name]

### 1. Comparative Analysis
| Metric / Feature | gRPC (HTTP/2) | REST (HTTP/1.1) |
|---|---|---|
| **Payload Format** | Binary Protocol Buffers | Text-based JSON |
| **Connection Model** | Multiplexed HTTP/2 | Single HTTP/1.1 (or keepalive) |
| **API Code Generation**| Required (proto schema compiler)| Optional |
| **Latency profile** | Extremely Low (<2ms) | Low-Medium (5ms-15ms) |
| **Browser Support** | Limited (Needs proxy) | Universal |

### 2. Selection Log
- **Boundary: [e.g. Order to Invoicing]** $\rightarrow$ [gRPC. Internal service RPC call requiring lowest latency.]
- **Boundary: [e.g., Mobile client to API gateway]** $\rightarrow$ [REST. Public ingress route requiring simple client integration.]
```
