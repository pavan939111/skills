# Tracing Strategy

### 1. The Question Decided
"How do we map distributed tracing boundaries, configure trace sampling ratios, and propagate trace contexts?"

### 2. Options Compared
| Sampling Strategy | 100% Full Tracing | Probabilistic Sampling | Adaptive/Tail-based Sampling |
|---|---|---|---|
| **Coverage** | 100% (Complete) | Low-Medium (Random) | High (focuses on errors/latency) |
| **Storage Cost** | Very High | Low | Medium-High |
| **Performance Impact**| High | Low | Medium |

### 3. Decision Rule
- Use **Adaptive/Tail-based Sampling** if budget allows, to capture traces that contain errors or take > 500ms.
- Fall back to **Probabilistic Sampling** (e.g., 5% to 10% sample rate) for high-traffic public microservices to keep storage costs manageable.

### 4. Red Flags to Revisit
- Sampling rate drops too low, causing transient errors to be missed completely.
- Context propagation headers are stripped by internal proxy routers, breaking the trace graph.

### 5. Where to Go Next
- For OpenTelemetry distributed tracing implementation details, see [Tracing Implementation](../../10-production-operations/02-observability-management/tracing-implementation.md).
