# PII Protection in AI Systems

## 1. Definition & Core Concepts
PII Protection in AI Systems is the process of identifying, masking, or anonymizing Personally Identifiable Information (SSNs, emails, phone numbers, addresses) in user prompts before they reach external APIs, and filtering PII from model outputs.

## 2. Why It Exists / What Problem It Solves
Sending raw PII to third-party LLM APIs violates compliance laws (GDPR, HIPAA). Masking ensures that models process tasks using anonymized placeholders (e.g. `[CLIENT_NAME]`) instead of real-world details, protecting user privacy.

## 3. What Breaks in Production Without It
- **Compliance Violations:** Sending patient health details or credit numbers to external endpoints, triggering regulatory audits.
- **Data Leaks:** Attacking systems retrieve private details that were cached in public model pools.
- **Audit Failures:** Ingesting un-scrubbed PII into search indexes.

## 4. Best Practices
- **Use Local PII Scrubbers:** Run local Named Entity Recognition (NER) models (e.g., Presidio) to mask inputs before API submission.
- **Implement Placeholder Mapping:** Map masked details locally (e.g., `user_1` $\rightarrow$ `John Doe`), re-injecting details into outputs when returning text to users.
- **Audit telemetry logs:** Ensure debug traces mask sensitive customer fields.

## 5. Common Mistakes / Anti-Patterns
- **Relying on model promises:** Believing that instructing the model to "ignore personal details" is sufficient for data privacy.
- **Scrubbing output but not input:** Sending raw PII to provider servers, violating compliance even if final UI outputs look scrubbed.

## 6. Security Considerations
- **Metadata Leaks:** Check that document metadata fields (e.g. author name, file tags) are scrubbed during ingestion.

## 7. Performance Considerations
- **Scrubber Latency:** Keep local NER runs fast (under 50ms) to preserve responsive UI routes.

## 8. Scalability Considerations
- **Concurrency checks:** Size worker threads to handle NER processing under high request volumes.

## 9. How Major Companies Implement It
- **Microsoft:** Integrates automated PII classifiers into Azure AI search pipelines to scrub inputs.
- **Stripe:** Mask credit cards numbers and address strings dynamically at API boundaries.

## 10. Decision Checklist (PII Enforcements)
- Enforce **Local PII Scrubbing + Placeholder Mapping** on:
  - All applications integrating third-party APIs that process customer-specific data.
- Skip **PII Scrubbing** only when:
  - Deploying fully offline, self-hosted models in isolated private subnets.

## 11. AI Coding-Agent Guidelines
- Programmatically invoke local PII scrubbers (like Microsoft Presidio) before forwarding prompt contexts to external endpoints.

## 12. Reusable Checklist
- [ ] Local Named Entity Recognition (NER) scanner active on input routes
- [ ] PII properties (SSNs, credit cards, emails) masked using placeholders
- [ ] Placeholder maps stored locally (not sent to external APIs)
- [ ] Document metadata fields audited and scrubbed on ingestion
- [ ] Telemetry logs filter out customer identifiers
- [ ] Unit tests verify masking on diverse input schemas
