# Encryption at Rest

## 1. Definition & Core Concepts

Encryption at Rest is the security practice of encrypting database files, indices, temporary files, transaction logs (WAL), and backup files while they reside on physical disks, preventing unauthorized access if the storage media is stolen or compromised.

Core encryption concepts:
- **TDE (Transparent Data Encryption):** Engine-level encryption where data is encrypted before writing to disk and decrypted when loaded into memory. This is transparent to application queries.
- **Envelope Encryption:** A two-tier key hierarchy:
  - *DEK (Data Encryption Key):* The key used to encrypt the actual database block files.
  - *KEK (Key Encryption Key):* The master key used to encrypt and protect the DEK, stored in an external Key Management Service (KMS).
- **KMS (Key Management Service):** Centralized secure key managers (e.g. AWS KMS, HashiCorp Vault) that manage key lifecycles and rotations.
- **Full Disk Encryption (FDE):** Operating system or cloud infrastructure-level encryption that encrypts the entire physical storage volume (e.g., BitLocker, dm-crypt).

*(Boundary Note: Application-level encryption algorithms, client-side SDK cryptographic functions, and user password hashing code belong in `backend-development/`. This document covers database engine TDE, disk volume encryption, database backups encryption, and KMS key integration.)*

## 2. Why It Exists / What Problem It Solves

If database storage volumes are not encrypted, anyone who gains physical access to the server drives or steals backup files (e.g., SQL dump files stored in S3) can read all data in plaintext, bypassing database access controls. Encryption at rest ensures that if database files or backups are copied or compromised, the data remains unreadable without the cryptographic keys.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Catastrophic Data Loss from Key Loss:** Losing or misconfiguring the Key Encryption Key (KEK) or KMS access credentials. Without the KEK, the database cannot decrypt the DEK, making the entire database unreadable, resulting in permanent data loss.
- **Failed Backup Restores:** Restoring an encrypted database backup to a new server during a disaster recovery event. The restore fails because the new server does not have access to the KMS keys or the encryption configuration files were not backed up.
- **Severe Performance Drops from Client-Side Loop Encryption:** Attempting to encrypt every field in application code before saving to a SQL database. This prevents index utilization, breaks search filters, and generates CPU overhead compared to database-native TDE.
- **Compliance Penalties (SOC 2 / PCI-DSS):** Failing security compliance audits due to storing transaction logs, temp files, or backups in plaintext on cloud storage buckets.

## 4. Best Practices

- **Use Transparent Data Encryption (TDE) or Volume Encryption:** Default to cloud-provided disk encryption (e.g. AWS EBS encryption) or database engine TDE, as they optimize performance using hardware-accelerated CPU instructions.
- **Implement Envelope Encryption with External KMS:** Store the database DEK locally, but encrypt it using a KEK managed in a dedicated external KMS (like AWS KMS or HashiCorp Vault). Never store encryption keys on the same physical disk as the database.
- **Configure Automated Key Rotation:** Set up automated key rotation policies in your KMS (e.g., rotate the KEK annually) to limit the lifetime of individual keys.
- **Always Encrypt Database Backup Files:** Ensure that database backup files (snapshots, logical dumps) are encrypted during generation using KMS keys.
- **Regularly Test Restoring Encrypted Backups:** Conduct monthly disaster recovery tests by restoring encrypted backups to a clean, isolated database server to verify key access paths.

## 5. Common Mistakes / Anti-Patterns

- **Keys Stored on Database Disks:** Saving the master encryption keys in the same storage folder as the database files.
- **Plaintext Backups:** Encrypting the active database tables but writing backup files or logs to unencrypted S3 buckets.
- **Client-Side Encryption for Index Fields:** Encrypting columns that are frequently targeted in `WHERE` and `JOIN` filters, preventing the database from using B-Tree indexes.
- **No Key Rotation Policies:** Using a single, static master encryption key indefinitely.

## 6. Security Considerations

- **Hardware Security Modules (HSM):** For high-security compliance (FIPS 140-2 Level 3), ensure the KMS is backed by physical Hardware Security Modules that isolate cryptographic key operations from the host operating system.

## 7. Performance Considerations

- **Hardware Acceleration (AES-NI):** Modern CPU architectures include native AES-NI instructions. Database engines and operating systems utilize these instructions to perform encryption/decryption in hardware, keeping performance overhead under 1% to 2%.

## 8. Scalability Considerations

- **Distributed Key Access:** In distributed databases, ensure all shard nodes have authorized access to the centralized KMS to retrieve decrypted DEKs during node startup.

## 9. How Major Companies Implement It

- **Stripe:** Uses envelope encryption backed by Hardware Security Modules to protect primary financial databases, ensuring that encryption keys are isolated from the main application server disks.
- **Amazon:** Automatically enforces KMS-driven encryption on all RDS and DynamoDB instances, ensuring that physical disks, snapshots, and replicas are encrypted by default.

## 10. Decision Checklist (Encryption Sizing Framework)

Select the encryption at rest strategy:

- Use **Transparent Data Encryption (TDE) or Volume Encryption** when:
  - Designing standard transactional databases containing operational data.
  - Performance must be protected using CPU hardware acceleration.
  - Queries require index seeks on encrypted tables.
- Use **Column-Level/Client-Side Encryption** ONLY when:
  - Storing highly sensitive variables (like passwords, keys, or SSNs) that must be hidden even from database administrators (DBAs).
  - The column is not targeted in range queries or joins.

## 11. AI Coding-Agent Implementation Guidelines

- Always include storage volume encryption configurations in database deployment playbooks.
- Never recommend storing database encryption keys on the same physical server disk as the database.
- Always verify that database backup configurations specify encryption keys.
- Never encrypt database columns in application code if they are used as index or join keys.
- Always recommend external KMS integration for managing Master Keys (KEKs).

## 12. Reusable Checklist

- [ ] Transparent Data Encryption (TDE) or Full Disk Encryption (FDE) active
- [ ] Database Master Keys (KEKs) stored in an external, dedicated KMS
- [ ] Automated key rotation policy active in KMS settings
- [ ] All database backups, snapshots, and transaction logs encrypted
- [ ] Key access permissions restricted to authorized database roles via KMS policies
- [ ] Restoring encrypted backups verified on clean test servers (disaster recovery check)
- [ ] High-write databases utilize hardware-accelerated CPU instructions (AES-NI check)
- [ ] No plaintext PII or keys written to temporary disk file locations
