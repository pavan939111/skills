# PII Protection (Personally Identifiable Information)

## 1. Definition & Core Concepts

Personally Identifiable Information (PII) Protection is the database design discipline of identifying, classifying, segregating, and securing data that can be used to distinguish or trace an individual's identity (e.g., names, email addresses, phone numbers, physical addresses, tax IDs) to ensure user privacy and compliance.

Core PII concepts:
- **Data Classification:** Categorizing schema columns based on sensitivity (e.g., Public, Restricted, Highly Sensitive/PII).
- **Pseudonymization:** Replacing direct user identifiers with artificial identifiers (surrogates) so the data cannot be attributed to a specific person without additional, separately secured lookup keys.
- **Dynamic Masking:** Redacting or partially obscuring PII values during query execution for unauthorized roles (e.g. showing `m***@company.com`).
- **Column-Level Encryption:** Cryptographically encrypting individual sensitive columns (using keys managed in a KMS) before storing them, decrypting them only for authorized queries.
- **GDPR "Right to be Forgotten" (Hard Deletes):** The compliance requirement to completely remove or permanently anonymize a user's PII from all database tables, archives, and backups upon request.

*(Boundary Note: Code-level PII parsing algorithms, client-side encryption libraries, and UI field masking controls belong in `backend-development/`. This document covers database-level column classifications, column encryption, database masking, and deletion paths.)*

## 2. Why It Exists / What Problem It Solves

Database breaches occur. If an attacker gains read access to a database containing plaintext PII, they can steal customer identities, leading to severe reputational damage and legal liability. Global privacy regulations (GDPR, CCPA, HIPAA) mandate that organizations protect PII. Implementing PII protection at the database tier ensures that even if database tables are compromised, sensitive user identity columns remain encrypted or masked.

## 3. What Breaks in Production Without It

- **Catastrophic Identity Theft Leaks:** Attackers execute SQL injection or read storage backup files, dumping millions of plaintext customer emails, addresses, and phone numbers.
- **GDPR Non-Compliance Fines:** Failing to delete a customer's PII completely because their email was duplicated across 15 separate tables and logging schemas.
- **Encryption Index Exclusions:** Encrypting a PII column (like email) in application code, making it impossible to index. The database must execute slow full-table scans for basic login queries (exact match queries). (An optimized hash-matching index is required).
- **Unauthorized Employee Access:** Customer support staff query databases to resolve issues, viewing plaintext user phone numbers and home addresses when they only need to view names, violating privacy policies.

## 4. Best Practices

- **Classify and Document PII Columns:** Maintain a data classification schema. Clearly tag PII columns in DDL schemas and database metadata dictionaries.
- **Segregate PII Vertically (Table Splitting):** Move sensitive PII columns into a separate, highly secured table (e.g. `user_pii`) linked by a 1:1 foreign key. This allows applying strict encryption and access policies to the PII table while keeping the main profile table open.
- **Encrypt Sensitive PII Columns:** Encrypt columns like tax IDs, SSNs, or credit card numbers. Use database-native encryption functions or KMS integration.
- **Implement Deterministic Hash Indexes for Encrypted Lookups:** If you must query an encrypted column (like searching by email during login), store a cryptographic hash of the email (e.g., SHA-256) in a separate indexed column. Search using the hash to find the row quickly without decrypting the table.
- **Enforce Hard-Delete / Anonymization Cascades:** Ensure that user deletion workflows physically delete (hard delete) PII from active tables and execute anonymization scripts to wipe PII from analytical backups.

## 5. Common Mistakes / Anti-Patterns

- **Plaintext PII Storage:** Storing names, addresses, and phone numbers in plaintext VARCHAR columns by default.
- **Duplicating PII Across Tables:** Copying customer emails into `orders`, `shipments`, and `payments` tables for query convenience, making GDPR compliance audits impossible. Use foreign keys linking to a single `user_pii` source of truth instead.
- **PII as Join Keys:** Joining tables on PII columns (like email), which degrades join performance and leaks data.
- **Anonymizing active tables partially:** Using soft deletes (`is_deleted = true`) and leaving PII active in deleted rows, violating GDPR data minimization principles.

## 6. Security Considerations

- **Blind Indexes for Encrypted Queries:** To search encrypted columns securely, generate a blind index (hashing the plaintext value with a server-side secret salt) and store it in a dedicated column. This allows exact-match queries without exposing the database to frequency analysis attacks.

## 7. Performance Considerations

- **Encryption / Decryption Latency:** Encrypting columns at the database tier adds CPU overhead. Restrict encryption to highly sensitive fields (passwords, tax IDs, credit cards), and protect standard PII (names, emails) using network isolation, access controls, and table segmentation.

## 8. Scalability Considerations

- **PII Deletion at Scale:** High-volume databases must execute PII deletions efficiently. Segment PII into dedicated partitions to allow dropping entire partition blocks during compliance cleanups.

## 9. How Major Companies Implement It

- **Stripe:** Isolates sensitive cardholder and merchant PII in secure vault databases, using pseudonymized tokens in standard operational databases to prevent PII leakage.
- **Netflix:** Utilizes automated data classification engines to scan database schemas, tagging PII columns and enforcing column masking policies for all non-production database copies.

## 10. Decision Checklist (PII Protection Matrix)

Apply PII controls based on the following:

- Use **Vertical Table Segregation & RLS** when:
  - Storing basic PII (names, emails, phone numbers).
  - Columns are frequently queried or joined.
- Use **Column-Level Encryption & Blind Indexes** when:
  - Storing highly sensitive PII (SSNs, tax IDs, banking credentials).
  - Access must be blocked even for database administrators (DBAs).
  - Queries only perform exact-match lookups.
- Use **Physical Hard Delete / Anonymization** when:
  - Processing user account deletion requests (GDPR compliance).

## 11. AI Coding-Agent Implementation Guidelines

- Never store highly sensitive PII (SSNs, credit cards, tax IDs) in plaintext columns.
- Always recommend vertical partitioning to isolate PII from general operational data.
- Always include blind index column declarations (hashed values) when encrypting searchable PII fields.
- Never duplicate PII across multiple database tables.
- Always write user deletion scripts that execute hard deletes or complete anonymization on PII rows.

## 12. Reusable Checklist

- [ ] Data classification tags defined for all PII columns in DDL schemas
- [ ] PII columns segregated into a dedicated table (vertical partitioning)
- [ ] Highly sensitive attributes (SSNs, tax IDs) encrypted using KMS integration
- [ ] Exact-match searches on encrypted columns query blind index columns (salted hashes)
- [ ] No PII columns duplicated across tables (reference keys used instead)
- [ ] Deletion pathways physically remove (hard delete) PII to comply with GDPR
- [ ] Access privileges to PII tables restricted to authorized database roles
- [ ] Non-production database clones fully masked or anonymized before use
