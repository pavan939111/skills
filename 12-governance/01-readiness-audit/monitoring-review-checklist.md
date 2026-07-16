# Monitoring Review Checklist

## 1. Purpose
The Monitoring Review Checklist is an audit tool used to verify that Prometheus counters, OpenTelemetry tracing spans, and Kubernetes health probes are configured.

## 2. Checklist
- [ ] /livez and /readyz health endpoints active
- [ ] Prometheus metrics exclude high-cardinality label variables
- [ ] Tracing spans propagate traceparent headers
- [ ] Alert limits configured for CPU, memory, and error rate surges
- [ ] Grafana dashboards display active database connection counts

## 3. Cross-References
- [Observability reference](../../10-production-operations/02-observability-management/)
- [Metrics reference](../../10-production-operations/02-observability-management/metrics-implementation.md)

## 4. Sign-off Criteria
- Approved when telemetry data exports successfully to monitoring platforms.
