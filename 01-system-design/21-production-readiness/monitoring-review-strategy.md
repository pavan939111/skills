# Monitoring Review Readiness Guide

## 1. What Question This Answers
"Are log aggregations, system metrics dashboards, and incident alerting rules configured to monitor application health in production?"

## 2. Why It Matters at the System-Design Stage
Without monitoring infrastructure, identifying issues requires manual inspection of servers, resulting in long outages and high MTTD.

## 3. Methodology / How to Work Through It
1. **Audit Logs Aggregations:** Ensure logs write to standard output as JSON.
2. **Review Metrics Triggers:** Verify CPU, memory, and error rate alert thresholds are defined.
3. **Check Tracing setups:** Confirm HTTP headers trace requests across service boundaries.
4. **Execute Monitoring Checklist:** Log status.

## 4. Inputs Needed
- SLA requirements from Uptime SLA Target.
- Chosen observability parameters.

## 5. Outputs Produced
- Feeds into monitoring dashboard templates.

## 6. Worked Checklist Example
- [x] Application logs use JSON format and publish to stdout.
- [x] Web requests include trace IDs to correlate hops.
- [x] Alert rules trigger notifications if P99 latency exceeds 500ms.

## 7. Common Mistakes
- **Verbose plaintext logs:** Logging huge, multi-line stack traces to text files, making parsing slow.
- **Alert Fatigue:** Setting alert thresholds too low, causing developers to ignore notifications.

## 8. AI Coding-Agent Guidelines
1. **Enforce JSON Logs:** Check that logs are structured as JSON.
2. **Require Trace Propagation:** Propagate trace headers across services.
3. **Produce Monitoring Audit Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Monitoring Review Log: [System Name]

### 1. Observability Checks
- [ ] Structured JSON logging outputs to stdout.
- [ ] Centralized metrics dashboard tracks CPU/RAM/Error rates.
- [ ] Alert rules are linked to notifications targets.
- [ ] Trace headers propagate across service boundaries.

### 2. Sign-off Status
- **Status:** [Go / No-Go]
- **Outstanding Actions:** [e.g. Map application logs to central collector.]
```
