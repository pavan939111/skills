# Alerting Strategy

### 1. The Question Decided
"How do we route alerts based on severity, avoid alert fatigue, and configure automated runbooks?"

### 2. Options Compared
| Severity Level | P1 (Critical/PagerDuty) | P2 (Warning/Slack) | P3 (Info/Email) |
|---|---|---|---|
| **Action Timing** | Immediate (within 15 mins) | Next business day | Weekly review |
| **Channel** | Voice Call, SMS | Slack Alert Room | Dashboard review |
| **Trigger Rule** | Core SLO violation (error budget) | Approaching SLO thresholds | Non-critical resource usage |

### 3. Decision Rule
- Route P1 alerts **only** when a core SLO error budget is burning rapidly (symptom-based alerting).
- Route P2 warning alerts for resource limits (e.g. disk space > 80% or memory growth trends).
- Ensure every alert payload includes a direct URL to a standard troubleshooting runbook.

### 4. Red Flags to Revisit
- Alert fatigue due to noisy gauges (e.g., paging engineers whenever CPU spikes to 90% momentarily).
- Stale runbook URLs that point to dead wiki pages during active incidents.

### 5. Where to Go Next
- For production operations management and telemetry checklist details, see [Observability Checklist](../../10-production-operations/02-observability-management/observability-checklist.md).
