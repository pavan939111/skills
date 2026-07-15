# AI CRM Template

## 1. Definition & Core Concepts
An AI CRM is a template designed to analyze client communications (emails, meeting transcripts, calls), extract pipeline data (leads, deal sizes, sentiment), update customer relation records, and generate personalized sales materials.

## 2. Why It Exists / What Problem It Solves
Sales teams waste hours manual-logging details into CRM platforms (like Salesforce). An AI CRM automates this data logging by parsing text communications, identifying action items, extracting deal updates, and structuring records cleanly for database ingestion.

## 3. What Breaks in Production Without It
- **Stale Customer Records:** Salespeople fail to update contact records, leaving customer profiles out-of-date and causing lost opportunities.
- **Inaccurate Deal Forecasting:** Pipeline projections are based on inaccurate, unverified data records.
- **Personalization Failures:** Automated sales emails sound generic and ignore recent client communications.

## 4. Best Practices
- **Model Selection:** Use lightweight models (e.g. LLaMA-3-8B, GPT-4o-mini) for entity extraction, and high-reasoning models for draft email personalization.
- **Context/Prompt/Knowledge Strategy:** Feed raw meeting transcripts or email chains into entity extraction prompts. Use few-shot templates showing exactly how to extract structured JSON keys (e.g. `deal_stage`, `next_steps`).
- **Agent/RAG Pattern:** Implement a Workflow Pattern. Node A parses text and extracts deal fields; Node B runs database upserts; Node C drafts sales responses.
- **Evaluation:** Run JSON schema checkers on all extracted data objects. Validate tone and guidelines on email drafts.
- **Deployment:** Integrate extraction services into backend email webhook streams and transcript generation pipelines.

## 5. Common Mistakes / Anti-Patterns
- **Logging conversational pleasantries:** Saving unstructured comments (like "had a great chat about golf") as core CRM data fields, cluttering profiles.
- **Direct database updates without verification:** Allowing the AI to update deal values in the primary database without providing a validation dashboard for account executives.

## 6. Security Considerations
- **PII and Financial Data Security:** Customer interaction records contain highly sensitive details. Enforce strict RBAC and redact customer credit card numbers before processing transcripts.

## 7. Performance Considerations
- **Asynchronous Parsing:** Processing a 60-minute meeting transcript can take a long time. Queue extraction tasks on background worker nodes using message queues.

## 8. Scalability Considerations
- **Transactional Database Isolation:** Run CRM entity extraction jobs on replica databases to avoid locking primary transactional tables.

## 9. How Major Companies Implement It
- **Salesforce (Einstein AI):** Integrates background extraction models across email clients, automatically updating lead statuses, logging meetings, and drafting follow-up emails for salespeople.

## 10. Decision Checklist (AI CRM Architecture)
- **Model Selection:** GPT-4o-mini / LLaMA-3 (Extraction) -> GPT-4o (Draft Generation).
- **Extraction Format:** Strict JSON output schema matching CRM database tables.
- **User Dashboard:** Administrative validation panel displaying AI-extracted updates for sales sign-off.
- **Integration:** Email and calendar synchronization APIs.

## 11. AI Coding-Agent Guidelines
- Write extraction pipelines that parse text streams, map items to structured schemas, and dispatch validation alerts to sales dashboards.

## 12. Reusable Checklist
- [ ] Model system instructions enforce structured JSON output format
- [ ] Database updates require validation/approval sign-off from sales staff
- [ ] PII and credit card redaction middleware active on input processing
- [ ] Entity extraction jobs run asynchronously on replica databases
- [ ] Sales draft generation prompt uses recent conversation histories
- [ ] Data integration links cleanly with email, calendar, and CRM platforms
