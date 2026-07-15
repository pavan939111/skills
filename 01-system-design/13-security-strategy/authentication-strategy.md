# Authentication Strategy

### 1. The Question Decided
"Which authentication strategy (Stateless JWT, Stateful Session cookie, OAuth2/OIDC, or API Keys) secures our service interfaces?"

### 2. Options Compared
| Dimension | Stateless JWT | Stateful Session | OAuth2 / OIDC | API Keys |
|---|---|---|---|---|
| **Cost (Infra)** | Low | Medium (Requires Redis cache) | Medium | Low |
| **Complexity** | Low | Low | High | Low |
| **Revocation** | Hard (Needs blacklist) | Instant (Delete session) | Instant | Instant |
| **B2B SaaS fit** | Good | Fair | Best Match | Fair |
| **Third-Party API**| Poor | Poor | Best Match | Best Match |

### 3. Decision Rule
- **Choose Stateless JWT if:** Building high-scale, multi-service architectures where validating tokens cryptographically at the edge (without querying a database) is required.
- **Choose Stateful Session cookies if:** Building standard consumer web monoliths where instant session revocation and minimal client-side cookie management are preferred.

### 4. Red Flags to Revisit
- The authentication server experiences high load because every API query requires a database read to verify the user session.
- Stolen JWT tokens cannot be revoked before their expiration time, creating a security exposure.

### 5. Where to Go Next
- For database-level client connection audits and access control, see [Data Layer Authentication](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/07-security/authentication-strategy-implementation.md).
- For implementing JWT token parsing and validation middleware in backend code, see [Backend Authentication Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/08-authentication/index.md).
