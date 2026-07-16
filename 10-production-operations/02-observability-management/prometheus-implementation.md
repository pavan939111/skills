# Prometheus

## 1. Backend Application Context
Prometheus is a time-series database and monitoring tool that scrapes telemetry metrics from backend endpoints at scheduled intervals.

## 2. Backend-Specific Pitfalls
- **Blocking scrape requests:** Letting Prometheus scraping routes query slow databases to collect metrics, blocking API execution threads.

## 3. Code-Shape Example
`python
# Prometheus metrics scrape endpoint
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

@app.get("/metrics")
def metrics():
    # Return in-memory counter states instantly without DB queries
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Observability](../observability-management-guide.md)
