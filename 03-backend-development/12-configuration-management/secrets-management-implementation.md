# Secrets Management

## 1. Backend Application Context
Secrets Management governs how backend services access sensitive credentials (API keys, database passwords, SSL certificates) securely, integrating with cloud key vaults (AWS Secrets Manager, Vault) at runtime.

## 2. Backend-Specific Pitfalls
- **Committing secret keys to Git:** Forgetting to gitignore local configuration files, exposing passwords in repositories.

## 3. Code-Shape Example
`python
# Fetching secrets from AWS Secrets Manager on startup
import boto3
import json

def load_secrets():
    client = boto3.client("secretsmanager", region_name="us-east-1")
    response = client.get_secret_value(SecretId="production/db")
    secrets = json.loads(response["SecretString"])
    return secrets
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Configuration Management](../../production_principles/foundations/01-configuration-management.md)
