# Aggregator Strategy

### 1. The Question Decided
"How does the system merge data from multiple backend microservices before returning it to the client, and where does this query aggregation execute?"

### 2. Options Compared
| Dimension | Client-Side Aggregation | Gateway Aggregation (BFF) | Chained Service Aggregation |
|---|---|---|---|
| **Bandwidth (Client)**| High (Multiple HTTP requests) | Low (Single payload) | Low |
| **Request Latency** | High | Low (Parallel RPC calls) | High (Sync blocking chains) |
| **Complexity** | Low | Medium | High |
| **SPOF Risk** | Low | High | High |

### 3. Decision Rule
- **Choose Gateway Aggregation if:** The client interface requires merged data from multiple microservices (e.g., user profile page needs data from Order service, Profile service, and Recommendation service) and we want to optimize client bandwidth.
- **Enforce Async execution:** Ensure the aggregator service calls downstream paths in parallel (using threads/promises) rather than sequentially.

### 4. Red Flags to Revisit
- Web dashboards load slowly because the front-end executes 10 separate HTTP requests to different microservices.
- Gateway threads exhaust because the aggregator executes downstream calls sequentially, blocking on slow network responses.

### 5. Where to Go Next
- For sequence flows and request alignments, see Sequence Diagrams Reference.
- For component dependency guidelines, see Component Interactions Design.
