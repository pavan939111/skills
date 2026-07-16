# Data Masking and Anonymization

## 1. Definition & Core Concepts
Data Masking and Anonymization are database security techniques used to protect sensitive data (such as Personally Identifiable Information - PII) by replacing original values with masked, tokenized, or pseudo-randomized alternatives.

Key techniques:
- **Static Data Masking (SDM):** Permanently overwrites sensitive columns inside database copies. Used when generating developer databases or sandbox environments from production backups.
- **Dynamic Data Masking (DDM):** Intercepts queries at runtime, masking values (e.g., changing card numbers to `XXXX-XXXX-XXXX-1234`) based on the query user's database role.
- **Pseudo-anonymization:** Replaces identifying values with reversible cryptographic tokens, preserving data analytical utility while protecting identity.

## 2. Why It Exists / What Problem It Solves
It prevents security breaches. Developers and analysts require realistic data to build, debug, and test features. Exposing production databases containing raw customer credentials to staging or local environments increases the risk of data leaks.

## 3. What Breaks in Production Without It
- **PII Leakage in Staging:** A developer pulls a production database backup into a staging database to troubleshoot a bug. An attacker compromises the staging container, stealing customer data.
- **Compliance Violations:** The company fails audits and receives heavy GDPR/HIPAA regulatory fines for exposing raw user details to unauthorized personnel.
- **SQL Parsing Degradation:** Implementing bad dynamic masking algorithms inside database triggers slows down query speeds.

## 4. Best Practices
- **Sanitize Backups Automatically:** Integrate static data masking steps directly into database backup extraction pipelines.
- **Use Database-Native Dynamic Masking:** Utilize native engine features (such as PostgreSQL Row-Level Security and Column Masking, or MySQL Enterprise Masking) rather than writing custom trigger scripts.
- **Enforce Cryptographic Tokenization:** Replace email addresses or user IDs with standard HMAC tokens using isolated security keys to preserve search properties.

## 5. Common Mistakes / Anti-Patterns
- **Masking at the Application Level Only:** Relying on frontend code to mask strings, exposing raw database contents to direct API queries.
- **Reversible Simple Hashing:** Using weak hashing algorithms (like MD5) without random salts, allowing attackers to decode values.
- **Soft Deleting without Purging:** Setting an `is_deleted` flag but leaving identifying PII in the table columns.

## 6. Security Considerations
- **Salt Management:** Store hashing salts in external Key Management Systems (KMS) with restricted access.
- **Irreversible Static Sanitization:** Ensure that static database anonymization changes are physically committed to disk, preventing reverse transactions.

## 7. Performance Considerations
- **Query Overhead on Dynamic Masking:** Dynamic masking adds CPU runtime parsing steps to SELECT commands. Always benchmark the latency impact on database engines.

## 8. Scalability Considerations
- **Index Preservation:** When anonymizing columns, ensure that the masked values do not degrade indexes (e.g., avoid converting unique emails into identical `XXXX` strings, which breaks unique constraints).

## 9. How Major Companies Implement It
- **Stripe:** Tokenizes and isolates all credit card numbers, storing them in dedicated vault databases. Application nodes only see secure reference tokens.
- **Netflix:** Sanitizes production telemetry datasets before loading them into analytics pipelines, replacing IP addresses and names with randomized tokens.

## 10. Decision Checklist (Masking Strategy)
- Use **Static Data Masking (SDM)** when:
  - Preparing database clones for local development, staging environments, or testing suites.
- Use **Dynamic Data Masking (DDM)** when:
  - Protecting active databases where users or tools need restricted access based on roles.

## 11. AI Coding-Agent Guidelines
- Never design database schemas where raw credit cards, social security numbers, or secrets are stored in plaintext.

## 12. Reusable Checklist
- [ ] Database sanitization pipeline configured to run automatically on backup extractions
- [ ] Sensitive columns (passwords, cards, SNN) identified and cataloged
- [ ] Irreversible static masking algorithms applied to development clones
- [ ] Salted HMAC/SHA-256 configured for pseudo-anonymized analytical columns
- [ ] Dynamic masking policies applied to database reporting user roles
- [ ] Unique constraints verified to not crash when columns are masked
- [ ] KMS-managed keys secure the hashing salts\n