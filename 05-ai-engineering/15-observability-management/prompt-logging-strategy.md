# Prompt Logging

## 1. Definition & Core Concepts
Prompt Logging is the systematic capture, storage, and indexing of all inputs (system prompts, user queries, few-shot examples, dynamic context) and outputs (LLM generated responses, stop reasons, raw API metadata) associated with LLM interactions in production.

## 2. Why It Exists / What Problem It Solves
LLMs are probabilistic and highly sensitive to slight context variations. Unlike deterministic databases, debugging LLM behavior requires seeing the exact text payload sent to the API and the precise generation returned. Prompt logging provides a retrospective audit trail for performance debugging, user dispute resolution, and dataset curation.

## 3. What Breaks in Production Without It
- **Silent regressions:** Changes in user queries or system prompts cause degraded outputs, but developers cannot diagnose why without seeing the historical payloads.
- **Inability to debug hallucinations:** When a customer complains that the AI gave bad advice, there is no way to reproduce or explain the event.
- **Compliance failures:** Systems processing financial or medical data cannot prove what instructions were executed.

## 4. Best Practices
- **Log the raw API payload:** Do not just log the template; log the fully resolved JSON payload sent to the LLM endpoint (including temperature, top_p, etc.).
- **Generate unique request IDs:** Tag every LLM request with a unique ID that can be correlated with backend trace IDs and frontend user sessions.
- **Implement asynchronous logging:** Route log writes to a message queue or background thread pool so logging does not block the application response loop.

## 5. Common Mistakes / Anti-Patterns
- **Logging only user inputs:** Skipping system prompts or retrieved context, which makes reproducing the model's environment impossible.
- **Hardcoding log backends:** Writing logs synchronously to a primary transactional database (e.g. Postgres), causing database locks during high-throughput API traffic.

## 6. Security Considerations
- **PII scrubbing:** Intercept prompts to redact personally identifiable information (PII) before writing logs to disk.
- **Access control:** Restrict access to raw prompt logs since they contain sensitive enterprise intellectual property and user inputs.

## 7. Performance Considerations
- **Network latency:** Use non-blocking, asynchronous logger agents (e.g., Fluentd, Winston, or Logstash) to batch and push logs.

## 8. Scalability Considerations
- **Storage sizing:** Prompt logs grow exponentially. Implement lifecycle rules to transition logs older than 30 days to cold storage (e.g. S3 Glacier) or delete them.

## 9. How Major Companies Implement It
- **Stripe:** Routes all LLM prompts through an internal gateway proxy that automatically extracts, sanitizes, and logs payloads to Elasticsearch.
- **Airbnb:** Uses Kafka to process streaming prompt events, feeding downstream evaluation pipelines and vector databases.

## 10. Decision Checklist (Prompt Logging Strategies)
- Use **Full Payload Logging** when:
  - Operating medical, legal, or high-risk financial applications requiring strict auditing.
- Use **Sampled Logging (e.g., 5-10% of traffic)** when:
  - Running very high-throughput consumer services with cost-sensitive storage constraints.

## 11. AI Coding-Agent Guidelines
- Ensure that any wrappers around LLM client calls include error handlers that capture and log the input payload along with the exception.

## 12. Reusable Checklist
- [ ] Raw JSON input and output payloads logged asynchronously
- [ ] Correlation IDs match backend transactional logs
- [ ] PII scrubbing middleware active on logging pipelines
- [ ] Access controls and encryption applied to prompt log storage
- [ ] Log retention policies configured for automated archival
- [ ] System parameters (temperature, max_tokens, stop_sequences) logged per request
