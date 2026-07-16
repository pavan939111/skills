# CORS (Cross-Origin Resource Sharing)

## 1. Backend Application Context
CORS is a browser security mechanism that restricts cross-origin request permissions using custom HTTP response headers.

## 2. Backend-Specific Pitfalls
- **Using wildcards in production:** Setting Access-Control-Allow-Origin: * while allowing credentials, exposing backend resources to malicious sites.

## 3. Code-Shape Example
`python
# Configure explicit CORS origins
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.production-domain.com"], # Strict whitelisting
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"]
)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../security-fundamentals-policy.md)
