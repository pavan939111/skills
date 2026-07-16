# Compliance Requirements

## 1. What Question This Answers
"What regulatory and compliance standards (GDPR, PCI-DSS, HIPAA, SOC2) apply to this system, and how do they restrict data storage, encryption, and audit tracking?"

## 2. Why It Matters at the System-Design Stage
Compliance is not a checkbox added before launch. It is a fundamental system design constraint. For example, complying with PCI-DSS requires complete physical or logical isolation of the cardholder data environment (CDE) from standard databases. Complying with GDPR requires designing schemas that support complete data deletion (Crypto Shredding) and regional data residency. Failing to design for these early results in architectural rewrites and heavy regulatory fines.

## 3. Methodology / How to Work Through It
1. **Identify Target Regulations:** Determine the regulatory environment of the business (e.g. GDPR for EU users, HIPAA for health records, PCI-DSS for credit cards).
2. **Define Data Residency Bounds:** Verify if data must be physically stored within specific national or continental boundaries.
3. **Map Encryption Tiers:** Define key management strategies (KMS, KEK/DEK) and specify what data must be encrypted at rest and in transit.
4. **Design Audit Trails:** Determine the logging depth required (e.g. tracking who read which record) and ensure logs are tamper-proof.
5. **Establish De-identification Rules:** Define how customer data will be anonymized, pseudonymized, or crypto-shredded when deleted.

## 4. Inputs Needed
- Product compliance guidelines and business constraints from [Product Analysis Constraints](../../00-product-analysis/constraints-analysis.md).
- Legal compliance mandates per country of operation.

## 5. Outputs Produced
- Feeds into [Security Strategy](../../13-architecture-decision-records/index.md) and [Database Selection](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Healthcare Scheduling API)
- **Compliance Target:** HIPAA (health data security) and GDPR (user privacy).
- **Residency:** EU patient records must stay in the EU. US records in the US.
- **System Design Decisions:**
  - *Data Isolation:* Split databases geographically. Maintain a `patient-database-eu` in Frankfurt and `patient-database-us` in N. Virginia.
  - *Audit Logging:* Configure database-native pgAudit triggers to log all DDL, DML, and read queries on patient charts, shipping logs to write-locked CloudWatch groups.
  - *Encryption:* Encrypt patient names and diagnosis columns using application-level AES-256 envelope encryption.
  - *GDPR Deletion:* Implement Crypto Shredding. Store user encryption keys in KMS. Deleting a patient deletes their KMS key, making historical logs unreadable.

## 7. Common Mistakes
- **Applying Compliance Post-Launch:** Trying to add row-level security or audit tracking after the database schema has been built.
- **Storing Raw Card Data:** Attempting to store credit card numbers in standard tables instead of utilizing tokenized payment vaults.
- **No Log Tamper Protection:** Storing audit logs in standard tables where a database admin can easily delete or modify records.

## 8. AI Coding-Agent Guidelines
1. **Identify Compliance Targets:** Ask: "What specific regulatory environments apply? (GDPR, PCI, HIPAA, SOC2)."
2. **Confirm Data Residency:** Ask: "Must user data remain within specific geographic regions?"
3. **Draft Safety Designs:** Integrate database auditing, column encryption, and RLS policies into the schema design.
4. **Produce Compliance Requirements Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Compliance & Regulatory Design: [System Name]

### 1. Regulatory Context
- **Compliance Environments:** [e.g. GDPR, HIPAA, SOC2 Type II]
- **Target Auditors:** [e.g., Financial security auditors]

### 2. Data Residency & Regional Boundaries
- **European User Data:** [e.g. Stored in AWS region `eu-central-1` (Frankfurt).]
- **US User Data:** [e.g. Stored in AWS region `us-east-1` (N. Virginia).]
- **Data Transfer Rules:** [e.g., No PII transfers permitted across regional databases.]

### 3. Encryption & Audit Log Requirements
- **Encryption at Rest:** Enforced via KMS-managed keys on all storage volumes and backups.
- **Field-Level Encryption:** [e.g., Patient diagnosis columns encrypted at application layer using AES-256 envelope pattern.]
- **Audit Logging Depth:** [e.g., Log all administrative read and write operations on target tables, ship to write-locked storage.]

### 4. GDPR Deletion & Crypto Shredding
- **Deletion Strategy:** [e.g. Crypto Shredding active. Individual user records encrypted with unique user-specific keys. Deleting the user key renders the database records unreadable.]
```
