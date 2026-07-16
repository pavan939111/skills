# CSRF (Cross-Site Request Forgery)

## 1. Backend Application Context
CSRF exploits force client browsers to perform unauthorized actions on authenticated sites using automatic cookie transmissions.

## 2. Backend-Specific Pitfalls
- **Failing to protect state-changing routes:** Skipping CSRF protection on API POST/PUT endpoints that run mutations.

## 3. Code-Shape Example
`python
# Configure CSRF protection middleware
from fastapi.middleware.csrf import CSRFMiddleware

app.add_middleware(
    CSRFMiddleware,
    secret_key="secure-session-key",
    safe_methods=["GET", "HEAD", "OPTIONS"] # Mutations require tokens
)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../security-fundamentals-policy.md)
