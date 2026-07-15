# Observability Checklist

## 1. Backend Application Context
The Observability Checklist is an audit tool used to verify that metrics collections, distributed traces, and health endpoints conform to monitoring standards before deployment.

## 2. Backend-Specific Pitfalls
- **Signing off checks with broken health routes:** Permitting deployment rollouts without testing database connection check loops.

## 3. Code-Shape Example
`markdown
### Observability PR Review Guidelines:
- [ ] /livez and /readyz health endpoints configured and tested
- [ ] Prometheus metrics exclude high-cardinality tags (no user IDs)
- [ ] OpenTelemetry traceparent headers propagated across network calls
- [ ] Database connection metrics export pool active/idle counts
- [ ] Centralized logs output in structured JSON format to stdout
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Observability](../../production_principles/foundations/03-observability-management-guide.md)
