# Tracing

## 1. Backend Application Context
Tracing tracks requests as they flow across microservices and databases, linking distributed execution logs using nested spans.

## 2. Backend-Specific Pitfalls
- **Orphaned spans:** Failing to propagate context headers (W3C traceparent) across asynchronous worker threads or gRPC calls, breaking trace links.

## 3. Code-Shape Example
`python
# Instrumenting downstream requests with trace context
import requests
from opentelemetry import inject

def call_downstream_service():
    headers = {}
    # Inject current span trace context into HTTP headers
    inject(headers)
    return requests.get("https://internal.service/api/data", headers=headers)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Observability](../observability-management-guide.md)
