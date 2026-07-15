# Knowledge Versioning

## 1. Definition & Core Concepts
Knowledge Versioning is the practice of tracking modifications, revisions, and releases of knowledge assets using unique identifiers (version hashes or dates) to support reproducibility and audit trails in AI search pipelines.

## 2. Why It Exists / What Problem It Solves
Factual text changes. Versioning lets developers verify what information a model used to answer a question at a specific point in time, facilitating audit runs, updates tracking, and database rollbacks.

## 3. What Breaks in Production Without It
- **Unverifiable Hallucinations:** A model gives incorrect medical advice, but auditing is impossible because the source document was updated and the original version was not saved.
- **Breaking API Integrations:** Ingesting new document versions that break expected prompt variables.
- **Rollback Failures:** A bad sync event corrupts the knowledge database, and the team cannot restore previous working versions.

## 4. Best Practices
- **Implement Version Tags:** Store `document_version` or `git_commit_hash` as metadata fields in all vector records.
- **Use Immutable Records (WORM):** Write changes as new database rows with incremented version numbers (soft updates) instead of replacing existing rows.
- **Track output reference maps:** Log version tags in all completion trace records.

## 5. Common Mistakes / Anti-Patterns
- **In-place updates on mutable tables:** Overwriting existing document text columns without preserving historical revisions.
- **Dynamic URL references:** Linking to live documents (which change) instead of pointing to static, versioned PDFs.

## 6. Security Considerations
- **Audit Compliance:** Regulated spaces (like HIPAA or PCI) require retaining historical versions of files for audit tracking.

## 7. Performance Considerations
- **Index constraints:** Versioning creates multiple duplicate rows. Enforce query filters to read only the latest active version by default.

## 8. Scalability Considerations
- **Storage Growth:** Implement compression or tier older document versions to cold storage (e.g. Glacier) to save costs.

## 9. How Major Companies Implement It
- **Confluence:** Maintains historical page version trees, letting editors review differences and roll back changes.
- **GitHub:** Uses git commit trees to version code databases, providing stable references for copilot indexers.

## 10. Decision Checklist (Versioning Models)
- Use **Immutable Row Versioning** when:
  - Regulatory compliance requires full audit trails of historical information states.
- Use **Overwrite with backup logs** when:
  - Storage budget is tight, and historical revisions are secondary to active records.

## 11. AI Coding-Agent Guidelines
- Ensure RAG queries default to filtering by `is_active = true` or `version = latest` to prevent the model from reading obsolete context versions.

## 12. Reusable Checklist
- [ ] Document versioning identifiers (`version_id`) present in database schemas
- [ ] Soft updates (inserts with new version) used instead of hard SQL `UPDATE` queries
- [ ] Default RAG search filters target only active versions
- [ ] Version properties logged in trace diagnostics
- [ ] Audit retention policies configured for older versions
- [ ] Automated recovery tests check version rollback states
