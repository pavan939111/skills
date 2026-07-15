# Compliance

## 1. Definition & Core Concepts
Compliance in AI Engineering is the practice of designing and operating systems in accordance with regulatory laws, industry standards, and privacy frameworks (such as the EU AI Act, GDPR, HIPAA, COPPA, and ISO/IEC 42001).

## 2. Why It Exists / What Problem It Solves
Governments are enacting strict regulatory controls on AI systems to protect personal privacy, prevent discriminatory decisions, and ensure transparency. Compliance ensures that organizations avoid massive regulatory fines, maintain data sovereignty, and secure trust with enterprise clients.

## 3. What Breaks in Production Without It
- **Regulatory Fines:** Deploying non-compliant high-risk systems under the EU AI Act, resulting in multi-million dollar penalties.
- **GDPR Violations:** Storing user prompt histories containing PII in databases without user deletion capabilities (Right to be Forgotten).
- **HIPAA Infringements:** Sending patient data to third-party model providers that lack Business Associate Agreements (BAAs).

## 4. Best Practices
- **Implement Data Localization:** Route traffic and store embeddings inside geographic regions required by local regulations (e.g. EU data boundaries).
- **Secure BAAs for Medical Data:** Ensure all external LLM provider services comply with HIPAA and sign formal BAAs before sending patient data.
- **Support Data Erasure:** Build pipelines that allow users to request deletion of their conversation logs and vector embeddings.

## 5. Common Mistakes / Anti-Patterns
- **Using public consumer endpoints:** Sending proprietary enterprise or customer data to default API endpoints that use prompt histories for training base models.
- **Neglecting training data lineage:** Building fine-tuning datasets using copyrighted or restricted customer data without permission.

## 6. Security Considerations
- **PII Leakage in Context:** Sanitize user data and remove PII before routing queries to external API endpoints.

## 7. Performance Considerations
- **Compliance proxy routing:** Running local sanitization proxies or regional route selectors can add minor network hops. Optimize proxy networks to keep transit under 50ms.

## 8. Scalability Considerations
- **Multi-region deployment orchestration:** Run isolated container clusters in EU, US, and APAC regions to comply with data sovereignty regulations.

## 9. How Major Companies Implement It
- **Microsoft:** Offers Azure OpenAI endpoints that guarantee complete data isolation, zero customer data reuse for base model training, and regional boundary locks to comply with GDPR.

## 10. Decision Checklist (Compliance Categorization)
- Enforce **High-Risk AI Act Controls** (audits, logs, bias checks) when:
  - Designing systems for credit scoring, employment selection, biometric classification, or critical infrastructure operations.
- Enforce **Standard Privacy Controls** when:
  - Building general content generation or semantic document search applications.

## 11. AI Coding-Agent Guidelines
- Write data storage layers that tag customer conversations with expiration timers and implement deletion routines for user requests.

## 12. Reusable Checklist
- [ ] BAAs and data privacy agreements signed with all model providers
- [ ] User conversation data opt-out of model training pipelines active
- [ ] Regional data storage and routing boundaries enforced
- [ ] Data erasure (GDPR Right to be Forgotten) supported on conversation tables
- [ ] EU AI Act risk tier identified and compliance tasks documented
- [ ] Fine-tuning dataset origin licenses audited and approved
