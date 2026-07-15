# Encryption in Transit

## 1. Definition & Core Concepts

Encryption in Transit is the security practice of encrypting network traffic and queries passed between database clients (application servers) and database server nodes, preventing network eavesdropping and interception.

Core transit concepts:
- **SSL/TLS (Secure Sockets Layer / Transport Layer Security):** Cryptographic protocols used to secure network connections. Modern standard is **TLS 1.3** (or minimum TLS 1.2).
- **SSL Connection Modes (PostgreSQL `sslmode`):**
  - *require:* Connection must be encrypted, but client does not verify the database server's certificate. (Vulnerable to MITM attacks).
  - *verify-ca:* Connection is encrypted, and client verifies the server certificate against a trusted Certificate Authority (CA).
  - *verify-full:* Connection is encrypted, client verifies the server certificate, and verifies that the database host name matches the certificate name. (Most secure).
- **Mutual TLS (mTLS):** Two-way certificate verification where both the server verifies the client's certificate and the client verifies the server's certificate.
- **TLS Handshake:** The initial cryptographic negotiation that establishes secure keys, adding network round-trip overhead.

*(Boundary Note: Code-level TLS driver parameters, application CA certificate file loading, and web HTTPS certificate managers belong in `backend-development/` and network docs. This document covers database-level SSL settings, server certificate generation, sslmode parameters, and handshake latency overhead.)*

## 2. Why It Exists / What Problem It Solves

Database queries and results are transmitted over networks. Plaintext queries contain customer emails, billing metrics, or password hashes; query results return raw tables. Without encryption in transit, anyone who sniffs network packets inside the VPC or performs a Man-in-the-Middle (MITM) attack can read this data and steal database credentials. Encryption in transit ensures that all query traffic is mathematically scrambled before leaving the host network cards.

## 3. What Breaks in Production Without It

- **Credential Snipping via MITM Attacks:** Using `sslmode=require` without certificate validation. Attackers spoof the database IP address. The application server connects and transmits database credentials to the attacker's server, thinking it is the database.
- **Connection Failures from Certificate Expirations:** Using self-signed database certificates without setting up automated rotation. When certificates expire, application connections fail, causing an outage.
- **API Latency Spikes (No Pooling with TLS):** Executing query connections without connection pooling. The application opens a new connection for every query. The TLS handshake requires multiple network round-trips to negotiate keys, increasing API latency from 2ms to 50ms.
- **Compliance Violations:** Storing transaction data in PCI-DSS or HIPAA scoped databases while transmitting queries in plaintext, failing audits.

## 4. Best Practices

- **Enforce TLS 1.3 for Connections:** Configure the database server to accept only secure TLS 1.3 or TLS 1.2 connections, disabling weak TLS 1.0, 1.1, and deprecated SSL protocols.
- **Configure Client Connections to use `verify-full`:** Enforce strict certificate verification (`sslmode=verify-full` in PostgreSQL, `ssl-mode=VERIFY_IDENTITY` in MySQL) on all application connections.
- **Use Mutual TLS (mTLS) for Cluster Node Replication:** Require two-way certificate validation for inter-node communication (replication and consensus streams) to ensure rogue servers cannot join the cluster.
- **Amortize Handshake Cost via Connection Pools:** Use connection pooling (PgBouncer, ProxySQL) to keep connection channels open, avoiding the TLS handshake overhead on every query.
- **Enforce Database-Tier SSL Requirements:** Configure database settings to reject unencrypted connection attempts (e.g. `ssl = on` and `force_ssl = on` in PostgreSQL pg_hba.conf).
- **Monitor Certificate Expiry Times:** Set up monitoring alerts to track database certificate expiration times (warning at 30 days remaining) to ensure rotations are scheduled.

## 5. Common Mistakes / Anti-Patterns

- **`sslmode=disable` in Production:** Transmitting database traffic in plaintext.
- **`sslmode=require` without verification:** Assuming "require" is secure, leaving the system vulnerable to MITM attacks.
- **Self-Signed Certificates without CA Checks:** Using self-signed certificates without verifying the CA chain.
- **No Connection Pooling with TLS:** Creating new TLS connection channels for every SQL statement.

## 6. Security Considerations

- **Cipher Suite Hardening:** Disable weak, deprecated cipher suites (e.g., those using RC4, 3DES, or MD5 hashes) in the database configuration files. Accept only strong ciphers like AES-GCM or CHACHA20-POLY1305.

## 7. Performance Considerations

- **Handshake Round-Trips:** The TLS handshake adds CPU and network round-trip overhead. Use connection pooling to ensure connections are established once and reused.

## 8. Scalability Considerations

- **Centralized CA Distribution:** Use a centralized, trusted Certificate Authority (e.g., cloud provider CA, Let's Encrypt) to sign database certificates, ensuring all clients can verify them automatically.

## 9. How Major Companies Implement It

- **Stripe:** Prohibits plaintext database connections. All query paths, reporting tools, and replication streams must use `sslmode=verify-full` with client certificates signed by private CAs.
- **Google:** Enforces TLS encryption for all SQL and Spanner traffic by default, isolating database networks and encrypting packets at the infrastructure layer.

## 10. Decision Checklist (Transit Encryption Modes)

Configure client connection strings based on the following:

- Use **`sslmode=verify-full` / `VERIFY_IDENTITY`** when:
  - Connecting production application servers and microservices.
  - The database has a defined, verified DNS domain name or hostname.
  - Strong protection against MITM attacks is required.
- Use **`sslmode=verify-ca` / `VERIFY_CA`** when:
  - The database hostname varies dynamically (e.g., dynamically allocated IPs in Kubernetes), but certificate validation is still required.
- Never use **`sslmode=require`** in:
  - Production environments (does not protect against host spoofing/MITM).

## 11. AI Coding-Agent Implementation Guidelines

- Always use `sslmode=verify-full` in production connection string templates.
- Never generate database configuration scripts containing `ssl = off` or permitting unencrypted connections in production.
- Always recommend connection pooling to amortize TLS handshake latency.
- Never write DDL configurations that allow weak cipher suites or outdated TLS protocols (TLS 1.0/1.1).
- Always include database certificate expiration alerts in monitoring playbooks.

## 12. Reusable Checklist

- [ ] Database server configured to accept only TLS 1.2 or TLS 1.3 connections
- [ ] Client connection configuration uses `sslmode=verify-full` (identity verification active)
- [ ] Database rejects unencrypted connection attempts (`force_ssl` enabled)
- [ ] Inter-node replication and consensus traffic secured via mutual TLS (mTLS)
- [ ] Connection pool (PgBouncer) active to reuse established TLS connection channels
- [ ] Deprecated TLS ciphers (RC4, 3DES) disabled in database configuration
- [ ] Automated monitoring alerts set for database certificate expiration times
- [ ] Client applications configured with trusted CA certificate paths
