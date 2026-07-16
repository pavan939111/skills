# Observability Review Checklist

## 1. Purpose
This checklist acts as a production readiness gate to review prompt logging mechanisms, trace analysis metrics, token usage calculations, cost attribution models, and alert dashboards before feature launch.

## 2. Checklist

### Logging & Tracing
- [ ] Raw JSON API input and output payloads logged asynchronously in the background.
- [ ] Correlation IDs link user frontends, backend services, database operations, and LLM calls.
- [ ] Trace spans correctly capture and nest agent planning steps and tool execution returns.

### Metric Monitoring & Cost
- [ ] Token count fields (input, output, cached) parsed and saved per query transaction.
- [ ] Cost attribution logic maps API expenditures to specific user profiles and features.
- [ ] Real-time pricing directories updated to match model provider cost updates.

### Alerting & Health
- [ ] Alert limits configured for API provider outages, latency spikes, and cost surges.
- [ ] Heartbeat query tasks run hourly to verify vector database and model availability.
- [ ] Log sanitation middleware active on logging pipelines (PII redactions verified).

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- Prompt Logging
- [Trace Analysis](../15-observability-management/trace-analysis.md)
- [Token Monitoring](../15-observability-management/token-monitoring-strategy.md)
- [Observability Checklist](../../10-production-operations/02-observability-management/observability-checklist.md)

## 4. Sign-off Criteria
The observability review passes when:
1. 100% of checklist points are verified.
2. System dashboards display real-time graphs for requests-per-minute, token consumption, latency, cost per tenant, and API error rates.
3. Test alert triggers successfully deliver PagerDuty/Slack notifications when mock API provider timeouts are injected.
