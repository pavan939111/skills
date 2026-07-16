# Metrics Strategy

### 1. The Question Decided
"Which metric types (counters, gauges, histograms) do we record for application performance monitoring, and how do we manage cardinality?"

### 2. Options Compared
| Metric Type | Counters | Gauges | Histograms |
|---|---|---|---|
| **Measurement** | Cumulative values (always increases) | Current point-in-time value | Distribution of values (latencies) |
| **Cardinality Impact** | Low | Low | High (per-bucket metrics) |
| **Typical Target** | Request rates, error count | Memory usage, thread pool size | API response latency distributions |

### 3. Decision Rule
- Use **Histograms** for API latencies to measure percentiles (p95, p99), keeping buckets bounded.
- Use **Counters** for request rates and error frequencies.
- Use **Gauges** for resources (CPU, Memory, connections).
- Avoid attaching dynamic high-cardinality values (e.g. user IDs, UUIDs) to metric tags.

### 4. Red Flags to Revisit
- Cardinality explosion causing database performance drops in the telemetry collector (e.g., Prometheus memory usage spikes).
- Bucket bounds are set too wide, making latency percentiles look artificially flat.

### 5. Where to Go Next
- For service instrumentation setup and metrics exports, see [Metrics Implementation](../../10-production-operations/02-observability-management/metrics-implementation.md).
