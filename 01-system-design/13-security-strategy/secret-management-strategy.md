# Secret Management Strategy

### 1. The Question Decided
"How does the system inject and secure environment secrets (API keys, database passwords, keys), and what mechanisms prevent key exposures?"

### 2. Options Compared
| Dimension | Plaintext Env Files | Managed Vault (e.g. HashiCorp Vault) | Hosted Secret Manager (AWS/GCP) |
|---|---|---|---|
| **Cost** | Low | High (Dedicated cluster) | Low (Pay-per-secret) |
| **Complexity** | Low | High | Medium |
| **Rotation** | Manual | Automatic | Automatic |
| **Safety** | Low (Access risks) | Extremely High | High |

### 3. Decision Rule
- **Choose Hosted Secret Managers if:** Running in AWS/GCP and deploying server VMs or containers that require automated secret rotation and IAM authentication limits.
- **Choose Managed Vault if:** Building multicloud, on-premise deployments requiring localized secret storage and encryption-as-a-service APIs.

### 4. Red Flags to Revisit
- Private API keys are leaked on public GitHub repositories because environment files were committed to git.
- Application startups fail because connection secrets expired, and there was no fallback notification setup.

### 5. Where to Go Next
- For operational security principles, secret injection, and rotation schedules, see [Security Foundations](../../08-security-engineering/security-fundamentals-policy.md).
- For configuring environment variables and runtime settings in backend code, see [Configuration Management Guide](../../03-backend-development/10-configuration-management/configuration-management-strategy.md).
