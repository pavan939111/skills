# Database Authentication

## 1. Definition & Core Concepts

Database Authentication is the security mechanism that verifies the identity of users, application services, or admin processes attempting to connect to the database engine.

Core authentication mechanisms:
- **Password-Based Authentication:** Verifying credentials using cryptographic hashing. Modern standard is **SCRAM-SHA-256** (Salted Challenge Response Authentication Mechanism, replacing weak MD5/SHA-1 formats).
- **IAM Database Authentication:** Using cloud provider Identity and Access Management (e.g. AWS IAM) to generate short-lived, temporary access tokens (valid for 15 minutes) for database connections, eliminating static passwords.
- **Certificate-Based Authentication:** Verifying client identity using Transport Layer Security (TLS) client certificates (mTLS), where only clients possessing a valid certificate signed by the trusted Certificate Authority (CA) are allowed to connect.
- **Integrated/GSSAPI Authentication:** Authenticating users via centralized enterprise directory services like Active Directory or Kerberos.

*(Boundary Note: Code-level user login auth, JWT verification logic in backend middleware, and OAuth provider code belong in `backend-development/`. This document covers database-port authentication, database engine users, connection certificates, and SCRAM configurations.)*

## 2. Why It Exists / What Problem It Solves

The database is the ultimate target of attackers. If authentication at the database port (e.g., `5432` for Postgres, `3306` for MySQL) is weak, attackers can execute brute-force credentials guessing, access raw tables, or inject scripts. Database authentication ensures that only verified connection requests can establish a session, protecting the storage layer from unauthorized access.

## 3. What Breaks in Production Without It

- **Brute-Force Connection Intrusion:** Leaving database ports exposed with weak or default passwords (e.g. `root`/`password`), allowing automated internet scanners to brute-force access and hold data for ransom.
- **Credential Leaks from Version Control:** Committing plain-text database passwords inside application repository configuration files. If the repository is compromised, attackers gain full access to the database.
- **Authentication Bypass from MD5 Hashing:** Using deprecated MD5 password hashing in PostgreSQL. Attackers capture network authentication exchanges and use pre-calculated rainbow tables to decrypt passwords.
- **Service Outages from Expired Certificates:** Using client certificates for connection authentication without configuring automated rotation. When certificates expire, application servers are blocked from connecting, causing a complete system outage.

## 4. Best Practices

- **Enforce SCRAM-SHA-256 Password Hashing:** Configure the database engine to accept only SCRAM-SHA-256 encrypted passwords (e.g., `password_encryption = 'scram-sha-256'` in PostgreSQL pg_hba.conf). Reject MD5.
- **Use Short-Lived IAM Tokens:** Eliminate static database passwords on application servers. Configure services to authenticate using IAM roles and retrieve temporary (15-minute) database connection tokens.
- **Implement Mutual TLS (mTLS) Client Certificates:** Require client certificate verification (`sslmode=verify-full`) to ensure only authorized hosts can connect to the database.
- **Disable Default Database Users:** Rename or disable default superuser accounts (like `sa` or `postgres`) and set highly complex random passwords for recovery accounts.
- **Configure Host-Based Access Control (HBA):** Restrict connection authorization database-side. In PostgreSQL, configure `pg_hba.conf` to accept connections only from explicit VPC subnet IP ranges, blocking all external requests.

## 5. Common Mistakes / Anti-Patterns

- **Default Credentials:** Leaving `postgres/postgres` or `root/root` passwords active on production installations.
- **Open Port Access (`0.0.0.0/0`):** Allowing connection requests from any IP address instead of restricting access to the application subnet.
- **Plaintext Passwords in Git:** Hardcoding database credentials in application code repositories.
- **Using MD5/Password Authentication over Public Networks:** Sending passwords over unencrypted connections without SSL, exposing them to packet sniffing.

## 6. Security Considerations

- **SCRAM Challenge Exchanges:** SCRAM prevents password sniffing by performing cryptographic verification without ever transmitting the actual password hash over the network, providing security even if TLS fails.

## 7. Performance Considerations

- **Connection Setup Latency:** Verifying client certificates (TLS handshake) or validating IAM temporary tokens adds millisecond latency to connection initialization. Use connection pooling (like PgBouncer) to keep connections warm and avoid authentication overhead on every request.

## 8. Scalability Considerations

- **Centralized Secrets Vaults:** Manage database credentials using vaults (AWS Secrets Manager, HashiCorp Vault) configured with automated rotation scripts, updating the database and application connection pools concurrently.

## 9. How Major Companies Implement It

- **Stripe:** Enforces client-certificate (mTLS) authentication across all sharded database nodes, prohibiting password-based database access from application instances.
- **Netflix:** Utilizes short-lived IAM roles and temporary token generators to authorize database connections for microservices, eliminating persistent credentials across their cloud infrastructure.

## 10. Decision Checklist (Authentication Methods Matrix)

Select the database authentication method:

- Use **IAM Token Authentication (Temporary Keys)** when:
  - Operating in public cloud environments (AWS, GCP, Azure).
  - You want to eliminate static database passwords from configuration files.
  - Connection pooling (PgBouncer) is active to mitigate token parsing latency.
- Use **Mutual TLS (mTLS) Certificate Authentication** when:
  - Deploying private Kubernetes clusters or on-premises servers.
  - Strict network access boundary controls are required.
- Use **SCRAM-SHA-256 Password Authentication** when:
  - IAM or certificate infrastructures are unavailable.
  - Always enforce connection constraints over SSL/TLS (`sslmode=require`).

## 11. AI Coding-Agent Implementation Guidelines

- Never write database configuration files that permit unencrypted MD5 password logins.
- Always restrict database client host connections (`pg_hba.conf` / security groups) to private subnet IP ranges.
- Always recommend short-lived IAM or mTLS certificate authentication for cloud database setups.
- Never include raw plaintext credentials in database connection string code templates.
- Always disable or rename the default administrator superuser account.

## 12. Reusable Checklist

- [ ] SCRAM-SHA-256 password hashing active (MD5 disabled)
- [ ] Database ports restricted to private VPC subnet IP ranges (no `0.0.0.0/0` access)
- [ ] Static passwords replaced with temporary IAM tokens or TLS client certificates (mTLS)
- [ ] Default admin accounts (`postgres`, `sa`, `root`) disabled or renamed
- [ ] All database connections require SSL/TLS verification (`sslmode=verify-full`)
- [ ] Database secrets rotated automatically using secrets managers (e.g., Vault, AWS Secrets Manager)
- [ ] Connection pool (PgBouncer) deployed to handle connection authentication latency
- [ ] Database authentication failures logged and monitored for brute-force patterns
