# Principle of Least Privilege

## 1. Definition & Core Concepts

The Principle of Least Privilege (PoLP) states that any module, process, or user must be able to access only the information and resources that are necessary for its legitimate purpose, and nothing more.

Core pieces:
- **Process Scoping (Execution):** Running runtime processes with minimal OS-level privileges (e.g., non-root users inside Docker containers).
- **Database Role Scoping:** Configuring application services with database credentials that restrict write/delete capabilities to only the tables they manage.
- **API Token Scoping:** Using cryptographic tokens (e.g. scoped API keys or OAuth scopes) that restrict actions to specific endpoints and methods.
- **File System Restrictions:** Restricting read/write file execution rights to specific temporary directories in the runtime container.

*(Boundary Note: While database role creation, network firewalls, and cloud service IAM setups are handled in database and cloud docs, this document covers code-level credential routing, process execution configurations, and token authorization check boundaries.)*

## 2. Why It Exists

Applications eventually experience code-level bugs or external library exploits (e.g. remote code execution). If a service runs with administrator privileges or connects to the database as the database owner, a single exploit allows attackers to destroy databases, access internal files, or compromise the host machine. PoLP minimizes the security blast radius of any exploit.

## 3. What Breaks in Production Without It

- **Total Host Takeover:** A remote code execution vulnerability (RCE) is exploited in a PDF generator. Because the Docker container runs as `root`, the attacker immediately gains root access to the host VM, compromising adjacent services.
- **Accidental Table Drops:** A reporting service has a bug or SQL injection vulnerability. Because the service connects to the database using the database owner (DBO) account, the query drops tables, deleting customer data.
- **Cloud Account Leak:** A microservice requires reading files from an S3 bucket. It is configured with a global AWS IAM key containing wildcard (`*`) admin permissions. An attacker compromises the microservice and deletes the entire cloud environment.
- **File System Tampering:** Application files are written with open permissions (`chmod 777`). An attacker uploads a script and overwrites the application's source files directly.

## 4. Best Practices

- **Never Run Containers as Root:** Explicitly configure deployment files (Dockerfiles, Kubernetes specs) to create a non-privileged user and switch to it using the `USER` directive.
- **Use Read-Only DB Connections for Reporting:** Configure your reporting and analytics code to use a separate connection pool authenticated with a database user who has read-only permissions on select tables.
- **Scope Down API Keys and Service Accounts:** Generate API keys with granular scopes (e.g., `read:orders`) instead of master API keys. Scope internal service credentials to the minimum necessary actions.
- **Use Sandbox Environments for Dynamic Code:** If your application must execute user-provided code, run it inside isolated sandbox runtime environments (e.g., gVisor, Firecracker) that block all host and network access.
- **Set Restrictive File Permissions:** Configure file write operations with the minimum required permissions (e.g., `chmod 600` or `chmod 644` for files, never `777`).
- **Enforce Token Boundary Validations:** Always validate caller permissions and scopes at the API gateway or controller entry points before executing logic.

## 5. Common Mistakes / Anti-Patterns

- **Wildcard IAM Policies:** Granting `s3:*` or `dynamodb:*` service policies in cloud settings, rather than naming specific resources and actions.
- **Using DBA Accounts for Apps:** Connecting standard application ORMs to the database using `postgres` or `sa` admin credentials.
- **Creating Master Keys for Local Dev:** Developers generating full admin keys for local testing and committing them to git settings files.
- **Unrestricted Directory Writes:** Allowing the application to write to directories containing system binaries.

## 6. Security Considerations

- **Workload Identity Integration:** Prefer temporary, dynamic credentials (like Kubernetes Workload Identity, AWS IAM Roles for Service Accounts) over static, long-lived access key strings stored in configuration settings files.

## 7. Performance Considerations

- **Scoped Cache Access:** When implementing multi-tenant architectures, scope cache keys with tenant prefixes. This enforces tenant isolation at the data access layer without requiring expensive cross-db queries.

## 8. Scalability Considerations

- **Decentralized Authorization:** Enforce scope checks statelessly using signed tokens (like JWTs containing scopes), allowing scaled nodes to verify permission levels without calling a central database on every request.

## 9. How Major Companies Implement It

- **Stripe:** Implements restricted API keys. Merchants can generate keys with read-only permissions for specific resources (e.g., read-only access to disputes), ensuring compromised keys cannot trigger refunds or balance transfers.
- **AWS:** Heavily enforces IAM Least Privilege policy templates. Google Cloud similarly utilizes service accounts that expire dynamically and scope database connections strictly through regional proxies.

## 10. Decision Checklist

- Apply **Principle of Least Privilege** to: Every Docker container, database connection configuration, IAM role policy, and API authorization check layer.
- Skip granular scoping ONLY when: Writing single-instance, private command-line utility tools that execute in secure developer sandboxes.

## 11. AI Coding-Agent Implementation Guidelines

- Always add a non-root `USER` directive in generated Dockerfiles.
- Never write database configuration code that defaults to admin database credentials.
- Always use separate connection classes or methods to route read-only operations to read-only database connections.
- Never generate IAM policies or configuration files using wildcard (`*`) action selectors.
- Always write authorization middleware checks that explicitly verify required scopes or roles before executing mutations.
- Always write write actions using restrictive file permission settings.

## 12. Reusable Checklist

- [ ] Container processes run as non-privileged users (no root user execution)
- [ ] Database credentials split into distinct read-only (reporting) and read-write roles
- [ ] API routes validate specific scopes (e.g. `read:data`) at the controller boundary
- [ ] Cryptographic secrets manager IAM permissions scoped to specific keys (no wildcards)
- [ ] Temporary files written with restrictive permissions (no `777` permissions)
- [ ] Workload Identity used instead of long-lived static API access keys where possible
- [ ] User-submitted scripts executed in secure sandboxes
- [ ] Internal microservice calls authenticated using scoped service-to-service tokens
