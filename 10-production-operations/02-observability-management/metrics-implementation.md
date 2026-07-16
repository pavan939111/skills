# Metrics

## 1. Backend Application Context
Metrics measure application performance and resource consumption (e.g. response latency, error count, active connection pools), exporting telemetry logs for monitoring.

## 2. Backend-Specific Pitfalls
- **High-cardinality label variables:** Adding dynamic IDs (like user_id) to metric tags, causing metric database memory exhaustion. Use status codes and paths only.

## 3. Code-Shape Example
`python
# Prometheus latency tracking metrics configuration
from prometheus_client import Histogram

REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP Request Latency",
    labels=["method", "endpoint"] # Low-cardinality labels
)

def handle_request(method, endpoint):
    with REQUEST_LATENCY.labels(method=method, endpoint=endpoint).time():
        return execute_logic()
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Observability](../observability-management-guide.md)
