# Source Validation

## 1. Definition & Core Concepts
Source Validation is the evaluation of incoming knowledge assets to verify their accuracy, legitimacy, and author permissions before they are approved for database ingestion.

## 2. Why It Exists / What Problem It Solves
AI models assume context documents are correct. If the ingestion pipeline consumes incorrect formatting logs, false manuals, or malicious instructions, the model will output corresponding errors or security vulnerabilities.

## 3. What Breaks in Production Without It
- **Hallucination Propagation:** RAG answers mislead users because the search database consumed unverified draft documents.
- **Accidental outages:** Ingesting bad configuration file schemas, which AI agents deploy to production.
- **Copyright Violations:** Importing third-party copyrighted datasets without license reviews, triggering legal challenges.

## 4. Best Practices
- **Implement Approval Workflows:** Require manual review (HITL) for new document imports.
- **Verify Cryptographic Signatures:** Validate file hash values and publisher certificates on download.
- **Run automated format checkers:** Validate file layouts against structural schema constraints (e.g. check CSV columns).

## 5. Common Mistakes / Anti-Patterns
- **Auto-ingesting raw directories:** Setting up crawlers that sync public Google Drive directories directly to production vector databases without review gates.
- **Ignoring document publish states:** Importing draft pages marked as "internal review only".

## 6. Security Considerations
- **Data Integrity:** Check file contents for SQL injection strings or shell scripts hidden inside document metadata fields.

## 7. Performance Considerations
- **Pre-filtering:** Discard duplicate or malformed files early in the pipeline to avoid running expensive OCR/embedding models.

## 8. Scalability Considerations
- **Validation Queues:** Run document validation checks in background queues to isolate processing failures.

## 9. How Major Companies Implement It
- **Wikipedia:** Enforces citation verification guidelines before allowing article modifications to index.
- **UpToDate:** Runs all medical clinical updates through multi-doctor validation boards before updating reference databases.

## 10. Decision Checklist (Validation Tiers)
- Use **Automated Validation** when:
  - Documents come from verified, read-only internal APIs.
- Use **Human-in-the-Loop Validation** when:
  - Source files are uploaded by external users, or contain high-risk regulatory data.

## 11. AI Coding-Agent Guidelines
- Always implement checksum validation checks (e.g. SHA-256) on incoming document objects before updating database records.

## 12. Reusable Checklist
- [ ] SHA-256 checksums verified on document ingestion
- [ ] Source files checked against license compliance guidelines
- [ ] Structural schemas (e.g., CSV columns, PDF structure) validated
- [ ] Human approval step active for public-uploaded documents
- [ ] Draft pages and expired files excluded from indexing routes
- [ ] Ingestion history and validation logs recorded in audit tables
