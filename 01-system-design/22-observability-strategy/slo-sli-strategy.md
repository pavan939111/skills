# SLO and SLI Strategy

### 1. The Question Decided
"How do we define Service Level Indicators (SLIs) and set Service Level Objectives (SLOs) to manage our error budget?"

### 2. Options Compared
| SLI Focus | Availability | Latency | Quality |
|---|---|---|---|
| **Measurement** | Successful requests % | Rapid responses % | Degraded output % |
| **Typical Target** | > 99.9% successful status | > 95% requests < 200ms | < 1% fallback responses |
| **Alerting Impact** | Immediate (critical) | Warning (trend-based) | Low (cardinality metric) |

### 3. Decision Rule
- **Define core SLOs for web APIs**:
  - Availability SLO: 99.9% of HTTP requests return non-5xx status codes over a 30-day window.
  - Latency SLO: 95% of HTTP requests return in less than 200ms over a 30-day window.
- If the error budget is depleted (>100% of allowed downtime used), halt non-essential feature deployments and prioritize platform stability.

### 4. Red Flags to Revisit
- Setting unrealistic SLO targets (e.g., "five nines" 99.999% availability) on components that depend on external three-nines services.
- SLIs are calculated on client devices directly, resulting in dirty data due to spotty user networks.

### 5. Where to Go Next
- For metrics monitoring setups and alerts configurations, see [Observability Checklist](../../10-production-operations/02-observability-management/observability-checklist.md).
