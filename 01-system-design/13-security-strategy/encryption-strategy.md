# Encryption Strategy

### 1. The Question Decided
"Where and how is data encrypted (at rest, in transit, and at field-level), and what key rotation policies are enforced?"

### 2. Options Compared
| Dimension | Volume Encryption (At Rest) | Column Encryption (Application-level) | Crypto Shredding |
|---|---|---|---|
| **Cost** | Low (AWS KMS) | Medium (CPU overhead) | Medium |
| **Complexity** | Low | High | High |
| **Safety Target** | Protects raw disks | Protects database compromise | GDPR data compliance |
| **Key Management**| Managed by cloud provider | Managed by application | Managed per user |

### 3. Decision Rule
- **Standardize on tiered encryption:**
  - *If* storing data on cloud disks or backups, *then* enforce **Volume Encryption** (AES-256 via KMS).
  - *If* storing sensitive PII (SSNs, medical charts), *then* enforce **Application-level Column Encryption** using envelope encryption.

### 4. Red Flags to Revisit
- Raw customer credit cards or PII appear in plaintext inside database backups.
- Field-level search queries become impossible because encrypted columns cannot be indexed using standard database B-Trees.

### 5. Where to Go Next
- For database disk-level and tablespace encryption setup, see [Encryption at Rest](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/07-security/encryption-at-rest-strategy-implementation.md).
- For network transport security (TLS v1.3) configuration, see [Encryption in Transit](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/07-security/encryption-in-transit-strategy.md).
- For app-level envelope encryption patterns, see [Application & Column Encryption](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/07-security/column-encryption-strategy-implementation.md).
