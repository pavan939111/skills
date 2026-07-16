# Data Masking and Anonymization

### 1. The Question Decided
"How do we sanitize PII and sensitive data inside database environments (non-production, reporting, backups) to ensure compliance?"

### 2. Options Compared
| Sanitization Pattern | Dynamic Data Masking (DDM) | Static Anonymization (Tokenization) | Pseudo-anonymization |
|---|---|---|---|
| **Execution** | Done at query runtime | Permanent override in storage | Reversible hash tokens |
| **Use Case** | Read shielding for call centers | Sanitizing developer databases | Reversible analytics |
| **Performance** | Adds query parsing overhead | Zero query overhead | High encryption cost |

### 3. Decision Rule
- Enforce **Static Anonymization** for non-production environments; all staging, dev, and test databases must be populated with anonymized snapshots.
- Use **Dynamic Data Masking** for database client boundaries where users should only see masked values (e.g. `XXXX-XXXX-1234`).

### 4. Red Flags to Revisit
- Plaintext PII data (social security numbers, cards) loaded into staging environments because a backup dump script skipped masking.
- Data values are tokenized using weak hashing algorithms, allowing attackers to crack values.

### 5. Where to Go Next
- For database security policies and threat compliance, see [Database Security Strategy](../07-security/index.md).
