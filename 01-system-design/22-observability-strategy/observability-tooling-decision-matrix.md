# Observability Tooling Decision Matrix

### 1. The Question Decided
"Should we deploy an open-source self-hosted telemetry stack (Prometheus, Grafana, Jaeger) or adopt a SaaS observability platform (Datadog, Dynatrace, New Relic)?"

### 2. Options Compared
| Criteria | Self-Hosted Open Source | SaaS Observability Platform |
|---|---|---|
| **Licensing Cost** | Zero (infrastructure costs only) | High (per-host or per-gigabyte billing) |
| **Operational Overhead** | High (managing TSDB scaling, backups) | Minimal (agent setup only) |
| **Data Retention Controls**| Absolute | Bounded by SaaS billing plan tier |

### 3. Decision Rule
- **Choose SaaS Platforms** (Datadog) for startups or small engineering teams where managing TSDB databases diverts valuable resources.
- **Choose Self-Hosted Stacks** (Prometheus/Grafana) for enterprise codebases with strict data retention laws, high log volumes, or large budgets.

### 4. Red Flags to Revisit
- Hidden SaaS licensing costs (such as log indexing bills exceeding the host monitoring budget).
- Self-hosted metrics storage crashes during production incidents due to insufficient disk IOPS configurations.

### 5. Where to Go Next
- For configuring exporters and monitoring boards, see [Grafana Integration](../../10-production-operations/02-observability-management/grafana-implementation.md).
