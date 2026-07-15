# Observability Checklist

## 1. Definition & Core Concepts
The Observability Checklist is a structured framework for defining, implementing, and auditing logging, tracing, token tracking, cost monitoring, and alerting configurations across production AI systems.

## 2. Why It Exists / What Problem It Solves
AI deployments are complex and span multiple abstraction layers (application, gateway, database, model provider). Without a unified checklist, teams frequently deploy AI features without basic protections like token limits, cost caps, or structured tracing, leading to outages, budget overruns, and un-debuggable failures.

## 3. What Breaks in Production Without It
- **Incomplete Telemetry:** Launching a RAG system and logging prompt texts but forgetting to track vector retriever response times, hiding performance bottlenecks.
- **Alerting Blind Spots:** GPU resource exhaustions, API provider outages, and database failures occur without triggering automated engineer alerts.
- **Budget Violations:** Runaway loops or malicious DoS attacks go unnoticed until the monthly bill arrives.

## 4. Best Practices
- **Standardize Logging Schemas:** Enforce a single JSON log format across all services that interact with LLMs, containing core fields like `request_id`, `model_name`, `token_count`, and `duration_ms`.
- **Pre-configure Alerts:** Set up automated Slack, email, or PagerDuty alerts for API error rates, latency spikes, and high-cost anomalies.
- **Implement Heartbeat Monitoring:** Schedule automated tests (synthetic queries) to verify that external LLM APIs and internal vector DBs are responsive.

## 5. Common Mistakes / Anti-Patterns
- **Ad-Hoc Log Formats:** Letting different developers log LLM calls differently, making centralized log parsing impossible.
- **Ignoring Silent Failures:** Failing to alert on empty retriever results, toxic inputs, or groundedness score failures.

## 6. Security Considerations
- **Log Sanitation Audits:** Run regular checks to verify that PII scrubbing filters are working and that no customer passwords or API secrets are written to public logs.

## 7. Performance Considerations
- **Telemetry Overhead:** Optimize logging middleware to ensure telemetry processing (like calculating token counts or formatting JSON) does not increase response latency.

## 8. Scalability Considerations
- **Log Indexing Costs:** Large volume text logs are expensive to store and index. Set sensible retention limits and utilize index-free logging (e.g. Loki) where appropriate.

## 9. How Major Companies Implement It
- **Uber:** Applies an automated production-readiness check that rejects new AI service deployments unless they implement the company's standard logging, cost tracking, and trace collection libraries.

## 10. Decision Checklist (Observability Levels)
- Enforce **High-Detail Telemetry** when:
  - Working on high-risk, regulatory-compliant features (e.g., patient diagnostics, banking transactions).
- Enforce **Basic Metric Logging** when:
  - Building internal tools or features with low usage and minimal business risk.

## 11. AI Coding-Agent Guidelines
- Write setup scripts that automatically bootstrap new AI features with tracing, logging, and error-boundary configurations.

## 12. Reusable Checklist
- [ ] Centralized JSON log schema defined for all LLM calls
- [ ] Asynchronous prompt and response logging active
- [ ] Correlation IDs propagate across all tool and workflow steps
- [ ] Real-time token and cost attribution running per tenant
- [ ] Latency metrics timed separately for search, model, and parsing
- [ ] Alerts configured for API failures, token rate limits, and spend spikes
- [ ] PII scrubbing middleware active on logging pipelines
- [ ] synthetic query checks verifying system health hourly
