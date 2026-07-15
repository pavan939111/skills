# Knowledge Engineering Checklist

## 1. Definition & Core Concepts
The Knowledge Engineering Checklist is the validation tool used to confirm that document processing, metadata tagging, validation rules, and synchronization pipelines are properly configured before launching RAG databases.

## 2. Why It Exists / What Problem It Solves
It provides a consistent check for developers, ensuring that ingested data is clean, formatted, secure, and synchronized.

## 3. What Breaks in Production Without It
- **Stale Context Outages:** RAG search engines continue to return old prices or deleted information because the sync pipeline failed.
- **VRAM Out of Memory Crashes:** Ingesting large, un-chunked files that exceed model memory limits.
- **Regulatory Audits Failure:** Ingesting un-scrubbed PII or unauthorized documents into search indexes.

## 4. Best Practices
- **Run the checklist during ingestion code reviews:** Verify parsing steps.
- **Verify data integrity checkouts:** Run daily sync audits.
- **Validate metadata indices:** Ensure B-Tree coverage.

## 5. Common Mistakes / Anti-Patterns
- **Ignoring document deletes:** Leaving stale vector records active.
- **Manual document checks only:** Skipping automated format validations.

## 6. Security Considerations
- **PII Scrubbing:** Verify that all PII checkers are active on document upload pipelines.

## 7. Performance Considerations
- **Parallel processing validations:** Ensure document conversion workers scale horizontally.

## 8. Scalability Considerations
- **Storage Limits:** Track disk usage of raw, metadata, and vector stores.

## 9. How Major Companies Implement It
- **Microsoft:** Requires all Azure Cognitive Search ingestion templates to pass internal format and safety checklists.
- **Google:** Enforces data-ingestion safety reviews on all enterprise search pipelines.

## 10. Decision Checklist (Pipeline Audits)
- Use **Knowledge Ingestion Checklist** when:
  - Deploying new document parser scripts, metadata tags, or CDC sync connections.

## 11. AI Coding-Agent Guidelines
- Review the knowledge engineering checklist to confirm formatting and permission configurations are verified before launching data pipelines.

## 12. Reusable Checklist
- [ ] Ingestion files converted to clean UTF-8 text (navigation nodes stripped)
- [ ] PDF layout parsing handles multi-column text and tables correctly
- [ ] Metadata fields (e.g. `tenant_id`, `created_at`) indexed in database
- [ ] PII scrubbers active on all upload paths
- [ ] Checksum verification rules active during import
- [ ] Change Data Capture (CDC) pipelines synchronize deletions instantly
- [ ] Graph query depth limits configured
- [ ] Daily sync drift audits scheduled
