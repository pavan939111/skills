# Audit & Compliance

## 1. Definition & Core Concepts

Audit and compliance at the code level involves designing, writing, and securing code to satisfy regulatory, legal, and operational standards (e.g., SOC 2, HIPAA, GDPR, PCI-DSS) and providing verifiable evidence of system behavior.

Core pieces:
- **Immutable Audit Trail:** An unalterable, chronological log record of security-relevant events, state changes, and user actions (e.g., "User X changed Billing Plan to Y at Timestamp T").
- **PII / PHI Redaction:** Identifying and masking Personally Identifiable Information (PII) and Protected Health Information (PHI) before it is recorded in diagnostic logs or error tracking systems.
- **Cryptography Standards:** Utilizing approved, industry-standard cryptographic algorithms for encrypting data at rest and in transit.
- **Data Erasure Workflows (GDPR/CCPA):** Code pathways that ensure personal data can be completely purged (Right to be Forgotten) or anonymized across all primary database tables.

*(Boundary Note: Managing network firewall rules, database server storage-encryption-at-rest settings, or formal corporate compliance policy documentation is out of scope. This document covers code-level audit trail generation, data redaction, secure crypto usage, and regulatory code paths.)*

## 2. Why It Exists

Regulated industries and security standards mandate that applications track access to sensitive data and critical configurations. An audit log provides verifiable proof of who did what, when, and how. Without code-level compliance checks, applications risk violating privacy laws, failing SOC 2 audits, or leaving security teams unable to investigate data breaches.

## 3. What Breaks in Production Without It

- **Untraceable Operations:** A critical system setting is changed, causing an outage. Because there is no audit log tracking administrative modifications, the team cannot identify what changed, who changed it, or when.
- **Compliance Violations (Plaintext PII):** Developers log user email addresses, names, and phone numbers in plaintext log files. Auditors flag this as a critical GDPR/HIPAA violation, leading to audit failures and potential fines.
- **Broken Erasure Requests:** A user requests account deletion under GDPR. The application marks the user as `deleted`, but fails to clear associated PII in secondary tracking tables or backup records, violating compliance.
- **Cryptographic Failure:** Code uses outdated, weak hashing algorithms (like MD5 or SHA1) for encrypting passwords or signing tokens, allowing attackers to crack database records easily.
- **Audit Tampering:** Application administrators delete or modify their own audit logs inside the database to cover up unauthorized actions.

## 4. Best Practices

- **Generate Write-Once Audit Logs:** Design audit log entries to be immutable. Route audit events to dedicated write-once tables or write-once cloud log vaults (e.g., AWS CloudTrail, or append-only log databases) that application code cannot modify or delete.
- **Include Contextual Metadata in Audits:** Ensure every audit log entry contains: `timestamp` (UTC), `actor_id`, `actor_type`, `action_type`, `resource_id`, `client_ip`, and `status` (success/failure).
- **Use Approved Cryptography:** Standardize on secure algorithms. Use AES-GCM (256-bit) for data encryption, SHA-256/SHA-512 for data signatures, and bcrypt, Argon2, or PBKDF2 for password hashing.
- **Implement a Clean "Right to be Forgotten" Workflow:** Design account-deletion routines to completely overwrite PII fields (e.g., setting `first_name` to `"Deleted"`, hashing or nullifying emails) across all related child records, or utilize cascading anonymization.
- **Scrub PII in Logs Dynamically:** Implement global log filter middleware that parses log objects and masks known sensitive key patterns (e.g., `card_number`, `social_security_number`, `password`).
- **Enforce Separate Audit Log Systems:** Never mix operational/debug logs with audit logs. Debug logs are ephemeral (retained for days/weeks); audit logs are permanent (retained for years).

## 5. Common Mistakes / Anti-Patterns

- **Editable Audit Tables:** Allowing standard database connections to delete or update rows in audit tables (e.g., no database-level permissions separation).
- **Using Weak Hashes for Passwords:** Using fast hashes like MD5, SHA-256, or base64 encoding to secure user passwords. Use Argon2id or bcrypt.
- **Logging Authentication Tokens:** Printing Authorization headers, bearer tokens, or session IDs in system logs, allowing any log viewer to hijack active sessions.
- **Assuming Soft-Delete Equals Erasure:** Believing that changing `is_deleted = true` is sufficient to satisfy a GDPR deletion request. The raw PII remains in database storage indefinitely.

## 6. Security Considerations

- **Authorization to Audit Trails:** Restrict reading audit logs to a subset of administrative services or specific compliance roles. Ensure audit systems validate caller permissions strictly.
- **Audit System Fail-Closed:** If the audit log system goes offline or fails to write an entry, fail the corresponding mutation request (fail-closed) to prevent unrecorded mutations.

## 7. Performance Considerations

- **Asynchronous Audit Dispatches:** Write audit logs asynchronously via background queues to prevent auditing operations from adding latency to core database writes.
- **Batch Archiving:** Export and archive older audit tables to cold storage (e.g. S3 Glacier) periodically to keep database search performance fast.

## 8. Scalability Considerations

- **Time-Series Scaling:** Audit trails grow continuously. Use partitioned tables or time-series databases to scale audit storage economically without degrading query performance.

## 9. How Major Companies Implement It

- **Stripe:** Automatically logs all API queries and database mutations in a secure, append-only log cluster, ensuring full transparency of financial transactions for PCI-DSS compliance audits.
- **Netflix:** Monitors configuration changes across all cloud servers using automated security compliance tools that record state modifications and verify configuration posture matches SOC 2 guidelines.

## 10. Decision Checklist

- Use **Audit Logging** when: The operation changes security states (password changes, 2FA settings), modifies billing, grants user roles, deletes records, or accesses sensitive PII/PHI.
- Use **Standard Diagnostics Logging** when: Tracking software execution paths, service latency, or non-critical resource milestones.

## 11. AI Coding-Agent Implementation Guidelines

- Always separate audit logs from debug logs — direct audit logs to dedicated tables or append-only log channels.
- Never write code that allows updating or deleting rows in an audit table — enforce write-once patterns.
- Always use Argon2id or bcrypt libraries for password hashing, and AES-256-GCM for field-level encryption.
- Never print tokens, passwords, session cookies, or PII keys in standard logs.
- Always implement a dedicated erasure service or script that thoroughly purges or anonymizes PII data across all DB entities on user deletion.
- Always validate cryptographic signatures and verification payloads using standard, secure runtime libraries.

## 12. Reusable Checklist

- [ ] Security-sensitive events and state changes write to a dedicated, write-once audit log
- [ ] Audit log data is immutable (no update or delete paths exist in application code)
- [ ] Audit entries contain complete context: timestamp (UTC), actor, action, resource, IP, status
- [ ] PII and PHI redacted/masked automatically before writing to diagnostic logs
- [ ] Cryptographic operations use approved algorithms (AES-GCM, SHA-256, Argon2id/bcrypt)
- [ ] GDPR/CCPA data erasure (Right to be Forgotten) cleanly purges/anonymizes PII across all tables
- [ ] Sensitive passwords and tokens are never logged or stored in plaintext
- [ ] Audit logging failures fail-closed or alarm immediately
