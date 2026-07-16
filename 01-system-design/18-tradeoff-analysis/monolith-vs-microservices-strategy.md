# Monolith vs. Microservices Trade-off Analysis

## 1. What Question This Answers
"How do we compare Monolithic, Modular Monolithic, and Microservices architectures, and how do we decide which style fits our scaling needs and team limits?"

## 2. Why It Matters at the System-Design Stage
A premature transition to microservices creates massive operational debt: network routing latencies, distributed tracing needs, deployment orchestration pipelines, and data consistency issues. On the other hand, sticking to a classic monolith can create code merge bottle-necks in large teams. This analysis compares the paradigms head-to-head, allowing the architect to justify the simplicity of modular monoliths vs. the infinite scale of microservices.

## 3. Methodology / How to Work Through It
1. **Analyze Organization Capacity:** Evaluate team sizes (microservices require multiple independent sub-teams).
2. **Review Compute Independence:** Check if different modules require separate CPU, RAM, or hosting environments.
3. **Compare Deployment Velocities:** Determine if teams are blocked by a single, shared release pipeline.
4. **Size Network Latency Budgets:** Calculate the latency cost of distributed RPC hops (gRPC/REST) against the low latency of in-memory monolith methods.
5. **Enforce Bounded Data Contexts:** Map how databases will be partitioned per service.

## 4. Inputs Needed
- Product timelines, team resources, and budgets from Business Constraints.
- Target peak QPS and capacities.

## 5. Outputs Produced
- Feeds directly into [Architecture Selection](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Standard SaaS Project)
- **Monolith:** High developer velocity, low infrastructure costs, fast in-memory execution, but shared deployment queue.
- **Microservices:** Independent scaling, isolated team releases, but high operational latency, complex tracing, and Saga transactions needed.
- **Modular Monolith (Selected):** Best balance. Keeps code separated into clean folders with strict boundaries, but packages them in a single deployment binary, avoiding network card delays and extra hosting costs.

## 7. Common Mistakes
- **Selecting Microservices for small teams:** Splitting a project into 10 services with 4 developers, causing massive infrastructure overhead.
- **Distributed Monolith:** Deploying separate services but sharing a single database, inheriting all the network complexity with none of the release isolation benefits.

## 8. AI Coding-Agent Guidelines
1. **Audit Team Size:** Do not suggest microservices if team <15. Recommend Modular Monoliths first.
2. **Detail Network Latency:** Include estimated RPC network hop durations when comparing microservices.
3. **Produce Architecture Comparison Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Monolith vs. Microservices Comparison: [System Name]

### 1. Comparative Matrix
| Metric / Feature | Monolith | Modular Monolith | Microservices |
|---|---|---|---|
| **Operational Overhead**| Low | Low-Medium | High (K8s, tracing needed) |
| **Release Velocity** | Shared release queue | Shared queue | Independent releases |
| **Failure Isolation** | Low (Process crash) | Low (Process crash) | High (Isolates crashes) |
| **Data Joins** | Native SQL | Native SQL (Cross-module) | Prohibited (Eventual sync) |
| **Network Hop Latency** | <0.1ms (In-memory) | <0.1ms (In-memory) | 2ms - 10ms (gRPC/REST) |

### 2. Selection Rationale
- **Target Selection:** [e.g. Modular Monolith]
- **Justification:** [e.g. Small team (5 developers) requires fast deployments. Modular folder structure ensures clean code boundaries for future microservice extraction.]
```
