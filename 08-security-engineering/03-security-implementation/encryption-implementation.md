# Encryption

## 1. Backend Application Context
Encryption protects sensitive data at rest and in transit, securing database fields and credentials.

## 2. Backend-Specific Pitfalls
- **Using legacy cryptographic algorithms:** Storing password hashes using MD5 or SHA-1 instead of Argon2id or bcrypt.

## 3. Code-Shape Example
`python
from cryptography.fernet import Fernet

def encrypt_ssn(raw_ssn: str, key: bytes) -> bytes:
    # Enforce symmetric encryption for sensitive data at rest
    cipher = Fernet(key)
    return cipher.encrypt(raw_ssn.encode())
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../security-fundamentals-policy.md)
