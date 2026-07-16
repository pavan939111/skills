# Security Review Checklist

## 1. Purpose
This checklist validates that database access paths, encryption settings, credentials management, Row-Level Security, auditing, and SQL injection protections comply with security and compliance standards. It should be run before deploying schemas containing user PII or when modifying database connection controls.

## 2. Checklist

### Authentication & Secrets
- [ ] Database credentials are stored in cloud secrets managers (no hardcoded passwords).
- [ ] Database port connections require SCRAM-SHA-256 password hashing. MD5 disabled.
- [ ] TLS (v1.3 preferred) is enforced for all client connections (`sslmode=verify-full`).
- [ ] Network paths restricted to private VPC subnets (no public IPs).

### Access Control & RLS
- [ ] Role privileges follow the Principle of Least Privilege (separate read/write/schema runner roles).
- [ ] Row-Level Security (RLS) is enabled and active for multi-tenant table schemas.
- [ ] RLS policies verified to prevent cross-tenant read/write leakage.
- [ ] Column-level privileges restrict access to sensitive fields (e.g. billing tokens).

### Data Protection & Cryptography
- [ ] Storage volumes are encrypted at rest using KMS Key Encryption Keys (KEK).
- [ ] Sensitive PII (SSN, credit cards) encrypted at the application tier or column level.
- [ ] Backups are encrypted during write, and decryption key access is restricted.

### Auditing & SQL Injection Prevention
- [ ] DB auditing logs active (e.g., pgAudit tracking DDL modifications and administrative reads).
- [ ] Application queries use parameterized values (prepared statements) to prevent SQL Injection.
- [ ] Stored procedures execute dynamic queries using parameter binding (`USING`).

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- Authentication
- Authorization
- [Row-Level Security](../07-security/row-level-security-strategy.md)
- Encryption at Rest
- [Encryption in Transit](../07-security/encryption-in-transit-strategy.md)
- [Secrets Management](../../03-backend-development/10-configuration-management/secrets-management-implementation.md)
- [Auditing](../07-security/auditing-strategy.md)
- [PII Protection](../07-security/pii-protection-strategy.md)
- [SQL Injection](../07-security/sql-injection-strategy.md)

## 4. Sign-off Criteria
The security review passes when:
1. 100% of checklist boxes are verified.
2. Code review confirms 100% parameter binding compliance (no string concats in SQL).
3. Network scan verifies zero database ports are exposed to the public internet.
4. RLS test scenarios verify that tenant database connections cannot read other tenant rows.
