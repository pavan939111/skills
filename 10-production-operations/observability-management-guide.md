# Observability

## 1. Definition & Core Concepts

Observability is the measure of how well the internal states of a system can be inferred from knowledge of its external outputs (telemetry). It is built upon three core pillars:

- **Metrics:** Numeric, aggregatable values captured over intervals, tracking system behavior (e.g., counters for request rates, gauges for memory usage, histograms for latency percentiles).
- **Traces:** Graphical records representing the lifecycle and path of a request as it flows through a distributed system. A trace consists of nested **Spans**, where each span represents a discrete unit of work with start/end times and metadata.
- **Logs:** Timestamped records of discrete events (structured data) that provide rich textual context for specific errors or milestones.
- **Correlation/Exemplars:** The glue that links telemetry types together (e.g., attaching a specific `trace_id` to a high-latency metric sample so a developer can jump directly from a graph spike to the exact request trace).

## 2. Why It Exists

Modern applications run on distributed, cloud-native infrastructure where failures are rarely binary (e.g., a service is completely up or down) and instead present as degraded performance, partial outages, or localized latency spikes. Observability allows teams to debug "unknown unknowns" — failures they did not anticipate and could not write specific dashboard alerts for in advance.

## 3. What Breaks in Production Without It

- **Finger-Pointing in Outages:** Microservices call each other in complex graphs. Without distributed tracing, it is impossible to identify which downstream service is causing a 5-second API response time.
- **Alert Fatigue:** Monitoring thresholds set on CPU/Memory lead to constant, false alerts (paging developers at 3 AM for a transient spike), while real customer-facing errors pass unnoticed.
- **High Cardinality Metrics Crashes:** Appending unique IDs (like user IDs, email addresses, or transaction IDs) as metric dimensions overwhelms the time-series database (TSDB), leading to massive cloud bills or monitoring system outages.
- **High MTTR:** Investigating customer issues takes hours or days of parsing disconnected logs instead of seconds using correlated traces and exemplars.

## 4. Best Practices

- **Standardize on OpenTelemetry (OTel):** Use vendor-neutral OpenTelemetry APIs and SDKs for instrumentation, ensuring code remains decoupled from specific backends (Datadog, New Relic, Honeycomb, Prometheus).
- **Apply the RED Method for Services:** Track Request Rate, Errors (count/rate), and Duration (latency distribution: p50, p90, p99) for all inbound and outbound API boundaries.
- **Apply the USE Method for Resources:** Track Utilization (percentage of time busy), Saturation (extra queue depth/backlog), and Errors for system hardware and databases.
- **Implement Context Propagation:** Ensure HTTP, gRPC, and messaging headers propagate the trace context (e.g., W3C traceparent) across service boundaries.
- **Leverage Auto-Instrumentation:** Use runtime agents or middleware to capture database queries, HTTP client requests, and server routing metrics automatically without cluttering domain logic.
- **Avoid High Cardinality in Metrics:** Keep tags/dimensions focused on low-cardinality values (e.g., `http.status_code`, `service.name`, `error.type`). Never put raw user IDs, emails, or SQL queries in metric tags; place them in trace attributes or logs instead.

## 5. Common Mistakes / Anti-Patterns

- **Alerting on Raw Resource Utilization:** Alerting on high CPU usage (which might be expected during batch processing) rather than user-impact metrics like error rate and p99 latency.
- **Creating Custom Tracing Libraries:** Writing proprietary trace correlation logic rather than using industry-standard OpenTelemetry libraries.
- **No Trace Sampling in High-Throughput Paths:** Attempting to record 100% of traces in a high-volume system, leading to high network egress costs and collector overloads.
- **Forgetting to Close Spans:** Leaving spans open (failing to call `span.end()`), which leaks memory and corrupts trace timing measurements.

## 6. Security Considerations

- **Scrubbing Trace Attributes:** Ensure no passwords, authorization headers, or PII (e.g., phone numbers, credit card numbers) are attached to span attributes. Database query parameters should be sanitized (use parameterized queries to keep trace values abstract).
- **Secure Egress Transport:** Configure telemetry agents/collectors to send data over encrypted channels (TLS) with token-based authentication.

## 7. Performance Considerations

- **Head-Based Sampling:** For high-throughput apps, configure the OpenTelemetry SDK to sample traces at the entry point (e.g., sample 5% of requests randomly) to limit CPU and memory overhead of span creation.
- **Asynchronous Telemetry Exporting:** Export metrics and traces via asynchronous, batched background workers to prevent observability traffic from slowing down user requests.

## 8. Scalability Considerations

- **Telemetry Collectors:** Deploy local telemetry collectors (e.g., OpenTelemetry Collector) as sidecars or daemonsets. Applications push data to the local collector over low-latency loops (gRPC/HTTP), and the collector handles batching, retries, and shipping to remote backends.

## 9. How Major Companies Implement It

- **Netflix:** Employs an internal metrics pipeline processing billions of metrics points per minute, using dedicated time-series databases (like Atlas) that optimize query performance for microservice dependency trees.
- **Stripe:** Automatically injects tracing spans into database adapters and API endpoints, routing telemetry through collectors that redact PII and enrich spans with customer tier flags to analyze high-value user impacts.
- **Google:** Pioneered distributed tracing with Dapper, demonstrating that low-overhead context propagation (often less than 1% CPU cost) is essential for monitoring globally distributed services.

## 10. Decision Checklist

- Use **Distributed Tracing** when: The architecture is a microservices/SOA design, requests span multiple network boundaries, or you need to identify bottlenecks in complex call paths.
- Use **Basic Metrics & Logs** when: The application is a monolithic service with no external service-to-service calls (distributed traces offer low return on investment here, though internal method spans can still help debug complex asynchronous workflows).

## 11. AI Coding-Agent Implementation Guidelines

- Always use the OpenTelemetry API (or framework-equivalent standard wrappers) for instrumenting manual spans and metrics — never code directly to vendor-specific libraries.
- Always use auto-instrumentation SDKs for standard runtimes, database drivers, and HTTP packages.
- Always ensure trace context (traceparent headers) is extracted on server requests and injected on outbound HTTP/gRPC/Queue requests.
- Never write high-cardinality data (IDs, UUIDs, dynamic user values, SQL statement strings) as metric tags/dimensions. Use span attributes or log fields.
- Always implement an error boundary that marks tracing spans as errored (`span.setStatus(Error)`) and records the exception when a request fails.
- Always run telemetry exports asynchronously with memory-bounded queue buffers.

## 12. Reusable Checklist

- [ ] OpenTelemetry SDK integrated and configured at startup
- [ ] Inbound request middleware extracts trace context; outbound clients inject trace context
- [ ] RED Method metrics configured for all public endpoints
- [ ] No high-cardinality variables (e.g. user IDs, full URLs, emails) configured as metric dimensions
- [ ] Telemetry data exported asynchronously using a local agent or collector
- [ ] Tracing sampler configured appropriately for production load (e.g., 5-10% sampling for high volume)
- [ ] Spans correctly marked as `Error` and exceptions recorded inside catch blocks
- [ ] Trace and metric attributes scrubbed of PII and secrets
