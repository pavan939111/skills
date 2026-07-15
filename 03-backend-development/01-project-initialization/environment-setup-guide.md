# Environment Setup

## 1. Definition & Core Concepts
Environment Setup is the technical practice of structuring, loading, and isolating environment configurations (such as database URLs, API keys, port settings, and feature flags) across different environments (Development, Staging, Production).

## 2. Why It Exists / What Problem It Solves
Backend code interacts with different servers depending on the environment (e.g., a developer's local database vs the production database cluster). Environment setup injects these target coordinates dynamically, allowing the same code bundle to run unchanged across environments.

## 3. What Breaks in Production Without It
- **Secrets Leaked in Git:** Hardcoding database passwords in codebase files, exposing them to anyone with repository access.
- **Production Data Wipes:** Development tests run on local machines accidentally query and erase production database records.
- **Inflexible Configurations:** Developers must modify code files to change API URLs, stalling deployments.

## 4. Best Practices
- **Use .env Files for Local Dev:** Store configuration key-values in local .env files, and ensure .env is added to .gitignore.
- **Provide Environment Templates:** Commit a .env.example template file listing required config keys with dummy values.
- **Load via System Variables:** In production, inject configuration values directly from system environment paths or cloud secret managers.

## 5. Common Mistakes / Anti-Patterns
- **Committing secret keys to Git:** Forgetting to gitignore .env or configuration config files containing real credentials.
- **Failing to validate variables on start:** Letting the application start with missing environment variables, leading to runtime failures deep inside code loops.

## 6. Security Considerations
- **Secret Encryption:** Encrypt staging and production secrets at rest inside security vaults (e.g. AWS Secrets Manager, Vault, GCP Secret Manager).

## 7. Performance Considerations
- **In-Memory Config Caching:** Read environment variables into memory once during application startup. Do not read file values on hot execution loops.

## 8. Scalability Considerations
- **Dynamic Configuration Injection:** Use centralized configurations servers (like Consul, Spring Cloud Config) to push runtime config updates to active pods.

## 9. How Major Companies Implement It
- **Airbnb:** Feeds configuration parameters to containers using centralized configurations services that isolate developer access from production keys.

## 10. Decision Checklist (Configuration Management)
- Use **Environment Variables & Local .env** when:
  - Building typical backend services, container applications, or cloud microservices.
- Use **Secure Key Vaults (AWS/GCP/Vault)** when:
  - Storing sensitive credentials, financial API keys, and corporate certificates.

## 11. AI Coding-Agent Guidelines
- Write config wrapper classes that parse environment strings, cast types (e.g. port strings to integers), and assert that all required keys exist during boot.

## 12. Reusable Checklist
- [ ] .env file added to .gitignore to prevent secret leaks
- [ ] .env.example template file committed with all required config keys
- [ ] Variables validated and parsed into structured classes during startup
- [ ] Database credentials and keys loaded via system environment variables
- [ ] Production credentials stored in secure, encrypted cloud vault services
- [ ] Local tests use isolated environment variables (separate mock database)
