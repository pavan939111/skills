# Secrets Management

## 1. Definition & Core Concepts

Database Secrets Management is the security discipline of storing, retrieving, rotating, and auditing database access credentials (passwords, connection strings, private keys, API tokens) using secure, centralized secrets vaults, eliminating hardcoded credentials.

Core secrets concepts:
- **Secrets Vault:** A secure, encrypted storage service designed for credentials management (e.g. AWS Secrets Manager, HashiCorp Vault, Azure Key Vault).
- **Dynamic Credentials:** The practice of generating unique, short-lived database user credentials on the fly for specific application sessions, expiring them automatically.
- **Dual-User Credential Rotation:** A rotation strategy where the database supports two active user accounts for a service concurrently, allowing one to be updated while the other handles active connections, preventing downtime.
- **Connection String Injection:** Passing database connection details dynamically into container environments at runtime (e.g., using Kubernetes secrets injection).

*(Boundary Note: Code-level secrets-manager client SDK integrations, server environment variable parsers, and web application environment file syntax belong in `backend-development/`. This document covers database-level credentials provisioning, rotation logic, connection string safety, and vault boundaries.)*

## 2. Why It Exists / What Problem It Solves

If database passwords are hardcoded in source code or stored in plaintext environment files on application disks, they will eventually be compromised (e.g. committed to GitHub or read by attackers during server compromises). Secrets management isolates credentials in dedicated vaults, encrypts them, limits access using IAM policies, and rotates them periodically, minimizing the risk and blast radius of credential leaks.

## 3. What Breaks in Production Without It

- **Credential Exposure via Git Leaks:** A developer accidentally commits a `.env` file containing production database passwords to a public GitHub repository. Automated bots scan the repository, extract the credentials, and download database tables.
- **Service Downtime during Password Rotation:** Rotating a database password manually. When the password updates, active application connection pools throw authentication exceptions and crash.
- **System-Wide Outage from Vault Rate Limiting:** Designing application code to fetch database credentials from a secrets manager on every SQL connection request. Under heavy traffic, the secrets manager hits rate limits and blocks requests, crashing the application.
- **Bypassed Rotation Auditing:** Keeping a static database password for years without rotation, giving terminated employees continued database access.

## 4. Best Practices

- **Never Commit Credentials to Code Repositories:** Exclude all passwords and connection strings from git. Ensure `.env` and configuration files are registered in `.gitignore`.
- **Use Dual-User Rotation to Prevent Downtime:** For services requiring high availability, configure two database users (e.g., `app_user_a` and `app_user_b`). Rotate their passwords alternately:
  1. Rotate `app_user_a` password in the database and KMS.
  2. Deploy the updated password to application connection pools.
  3. Verify all connections use the new password.
  4. Rotate `app_user_b` password.
- **Cache Secrets Locally to Avoid Rate Limits:** Retrieve database credentials from the secrets manager *once* during application bootstrap, or cache them locally with a TTL (e.g., 5 minutes) to avoid rate limit locks.
- **Inject Secrets via Container Orchestrators:** Inject database credentials into container environments at runtime as environment variables using secure configuration tools (e.g., Kubernetes Secrets or AWS ECS Task Definitions).
- **Enforce IAM Least Privilege on Secrets:** Restrict access to database secrets using IAM policies, ensuring only the specific application service role is authorized to read its designated secret payload.

## 5. Common Mistakes / Anti-Patterns

- **Hardcoded Credentials:** Committing database connection strings directly in source code.
- **Querying Secrets Manager on Every Connection:** Fetching passwords from KMS on every query instead of caching connection pools.
- **Static Master Password Usage:** Using a single database password for years without rotation.
- **Broad Secret Access Permissions:** Allowing all developers and services to read production database credentials.

## 6. Security Considerations

- **Secrets Audit Logging:** Enable detailed audit logging on the secrets manager. Monitor and alert on any access requests made by unauthorized users or machines to detect credential leaks.

## 7. Performance Considerations

- **Initialization Latency:** Fetching credentials from an external secrets manager during cold starts increases application boot time by a few milliseconds. Cache the credentials in memory to avoid query path delays.

## 8. Scalability Considerations

- **Multi-Environment Isolation:** Separate secrets vaults across distinct environments. Ensure developer credentials have no access permissions to staging or production secrets vaults.

## 9. How Major Companies Implement It

- **Netflix:** Generates dynamic, temporary database credentials for microservices using HashiCorp Vault. Connection credentials expire automatically, ensuring short-lived access windows.
- **Stripe:** Rotates database keys and credentials automatically using automated rotation workflows, verifying connection pool health before deprecating old passwords.

## 10. Decision Checklist (Secrets Management Framework)

Choose the secrets retrieval strategy:

- Use **Container Secrets Injection (Runtime Env)** when:
  - Deploying containerized microservices (Kubernetes, AWS ECS).
  - Credentials only need to be read at startup.
  - Simple, standardized operations are preferred.
- Use **Dynamic Secrets (Secrets Manager Client API)** when:
  - Highly secure environments require frequent credentials rotations (e.g. hourly rotation).
  - Application connections are managed dynamically by local managers.
- Never use **Static Local Configuration Files** for:
  - Storing production database connection credentials.

## 11. AI Coding-Agent Implementation Guidelines

- Never hardcode database connection strings or passwords in generated code files.
- Always recommend storing credentials in secure environment variables (`process.env`).
- Always write DDL/DML scripts that assume credentials rotation (e.g., configuring dual-user database profiles).
- Never write database connection code that queries a secrets manager on every transaction request.
- Always include `.gitignore` configurations that block committing env credentials files.

## 12. Reusable Checklist

- [ ] All database credentials excluded from version control code repositories
- [ ] Database credentials retrieved from a secure secrets manager (AWS Secrets Manager, Vault)
- [ ] Credentials cached locally in memory (no secrets manager calls on query paths)
- [ ] Dual-User rotation pattern implemented to prevent database connection downtime
- [ ] Secrets injected into container runtimes as environment variables
- [ ] IAM access policies restrict secret read permissions to specific application roles
- [ ] Environment file names (e.g., `.env`) registered in `.gitignore`
- [ ] Access logging and alerts active on secrets vault read events
