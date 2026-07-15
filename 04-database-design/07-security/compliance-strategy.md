# Database Compliance (Regulatory Standards)

## 1. Definition & Core Concepts

Database Compliance is the engineering and operational discipline of aligning database security controls, storage policies, access logs, and data lifecycles with legal regulations and industry certifications (e.g., SOC 2, GDPR, PCI-DSS, HIPAA).

Core compliance frameworks at the database layer:
- **SOC 2 Type II:** Verifies database security, availability, processing integrity, confidentiality, and privacy over a continuous audit window.
- **GDPR / CCPA:** Enforces user data privacy, requiring **Data Residency** (storing EU citizen data in the EU), data minimization, and the **Right to be Forgotten** (hard deletes/anonymization).
- **PCI-DSS (Payment Card Industry):** Restricts the storage, transmission, and processing of credit cardholder data (PAN), mandating encryption, auditing, and physical segregation of Cardholder Data Environments (CDE).
- **HIPAA (Healthcare):** Governs Protected Health Information (PHI), requiring strict database auditing, access logs, encryption, and business associate agreements (BAA) with database hosting providers.

*(Boundary Note: Code-level compliance dashboards, legal agreements documentation, and corporate compliance training are out of scope. This document covers database-level storage isolation (CDE), data residency replication, database encryption standards, compliance access logging, and purging DDL.)*

## 2. Why It Exists / What Problem It Solves

Organizations that fail database audits face heavy penalties (e.g. GDPR fines up to 4% of global turnover or losing the ability to process credit cards). Non-compliant databases are also more vulnerable to attacks. Compliance frameworks define baseline database security rules (like auditing admin commands, encrypting data, and restricting port access) that protect users and verify security posture to external partners.

## 3. What Breaks in Production Without It

- **Loss of Payment Processing Status (PCI Audits):** Storing raw credit card details (PAN or CVV codes) in plaintext inside standard user tables. When the auditor detects this, they suspend payment processing, halting sales.
- **VPC Scope Creep Cost Bloat:** Mixing compliance-scoped tables (like medical histories) in the same physical database instance as general application tables. The entire database server, replication network, and application fleet fall under auditing scope, multiplying compliance audit costs by 10x.
- **GDPR Fines from Data Residency Violations:** Replicating EU customer PII database tables to US-based read replicas without user consent, violating GDPR international transfer boundaries and incurring fines.
- **Backup Deletion Failures:** Retaining deleted user PII indefinitely inside historical snapshot files, failing compliance reviews.

## 4. Best Practices

- **Segregate Scoped Databases Physically (CDE Isolation):** Isolate PCI or HIPAA scoped data into dedicated, separate database instances and VPC subnets. Keep the general application database out of compliance scope by using tokenization (e.g., referencing a secure card token instead of storing the card).
- **Enforce Database-Tier Encryption:** Configure full disk encryption (TDE) for storage and `sslmode=verify-full` for connection transits, satisfying basic encryption compliance rules.
- **Log all Administrative and Schema Changes:** Enable query logs and auditing extensions (like pgAudit) to record all DDL and access modifications by database superusers.
- **Implement Automated Data Retention Purging:** Schedule automated SQL partitions drops or batch deletion routines to remove expired compliance data automatically.
- **Deploy Geographic Nodes for Data Residency:** Use regional database tables or distributed nodes positioned within target geographical boundaries (e.g., EU-only database clusters) to enforce data residency compliance.

## 5. Common Mistakes / Anti-Patterns

- **Mixing Scoped Data:** Storing credit card details or medical PHI inside general logs or catalog tables, dragging the entire system into audit scope.
- **Plaintext PII Backup Storage:** Writing unencrypted backup files to public S3 buckets.
- **Bypassing Access Reviews:** Leaving stale developer or administrator roles active in the database catalog long after they have left the company.
- **No Purging Policies:** Keeping user profiles and financial histories indefinitely in active tables instead of archiving them.

## 6. Security Considerations

- **Tamper-Evident Audit Trails:** For compliance audits, ensure database audit logs are streamed to write-once (WORM) storage where they cannot be modified, even by database root superusers.

## 7. Performance Considerations

- **Auditing Overhead:** Compliance-mandated auditing (especially logging all write modifications to sensitive tables) adds disk write overhead. Isolate audit logging to a separate physical disk partition to prevent table query page lookups from slowing down.

## 8. Scalability Considerations

- **Data Locality Sharding:** In globally scaled systems, design partitioning keys around country codes (e.g. `country_code`) to automatically shard and route customer records to regional database nodes, satisfying local data residency laws.

## 9. How Major Companies Implement It

- **Stripe:** Isolates credit cardholder data in dedicated PCI-DSS Level 1 certified vault databases, restricting access to a minimal, isolated application cluster and using secure tokens in all downstream billing databases.
- **Healthcare Providers:** Deploy database architectures where patient PHI is stored separately from user accounts, using encrypted columns and detailed database audit logging to satisfy HIPAA controls.

## 10. Decision Checklist (Compliance Auditing Framework)

Evaluate database compliance scopes:

- Use **PCI-DSS Storage Controls (CDE Isolation)** when:
  - Storing credit card primary account numbers (PAN), expiration dates, or cardholder names.
  - Tokenization is not possible.
- Use **Data Residency Routing (Regional Clusters)** when:
  - Operating globally and processing PII of users located in regions with strict data laws (EU - GDPR, Switzerland, China).
- Use **HIPAA Controls (BAA agreements, Detailed Logs)** when:
  - Database stores Protected Health Information (PHI) like medical records, diagnostics, or patient treatment plans.

## 11. AI Coding-Agent Implementation Guidelines

- Never store raw payment card details (PAN, CVV) in general database schemas.
- Always recommend isolating compliance-scoped tables (PCI, HIPAA) into separate database instances.
- Always include automated partition pruning or data retention purging cron scripts in database setups.
- Never write database configuration files that store audit logs on the primary table disk partition.
- Always enforce geographic routing column checks for databases spanning multiple national regions.

## 12. Reusable Checklist

- [ ] Compliance-scoped tables (PCI, HIPAA) physically isolated in dedicated database servers
- [ ] Database credentials, snapshots, and backups encrypted at rest and in transit
- [ ] Data residency compliance satisfied via geographic table sharding and routing rules
- [ ] Write-once logging (WORM) configured for database schema and access audits
- [ ] Automated data purging and retention cycles active (prevents permanent PII storage)
- [ ] Access controls and database roles audited quarterly to prune obsolete accounts
- [ ] No raw credit cardholder details (PAN/CVV) present in standard operational tables
- [ ] Host providers hold matching compliance certifications (BAA signed for HIPAA)
