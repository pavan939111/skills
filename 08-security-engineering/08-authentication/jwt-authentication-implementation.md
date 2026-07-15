# JWT Authentication

## 1. Definition & Core Concepts
JSON Web Token (JWT) Authentication is a stateless authentication pattern where user profiles and metadata are encoded as secure, signed JSON payloads that clients pass in HTTP headers.

## 2. Why It Exists / What Problem It Solves
It eliminates the need for servers to store session states in database tables, simplifying scaling for distributed microservice environments.

## 3. What Breaks in Production Without It
- **Session DB Bottlenecks:** Databases fail under concurrent traffic because every API check requires querying session tables.
- **Microservice Scaling blocks:** Users get logged out when routed to a new server container that lacks local session caches.

## 4. Best Practices
- **Use Strong Signature Keys:** Sign JWTs using secure algorithms (e.g. RS256/EdDSA) with keys rotated periodically.
- **Keep Tokens Short-lived:** Configure access tokens to expire within 10-15 minutes, relying on refresh tokens for updates.
- **Store in Secure Headers:** Deliver tokens in HTTP-only, secure, and same-site cookies to prevent XSS theft.

## 5. Common Mistakes / Anti-Patterns
- **Storing secrets in payloads:** Including passwords, keys, or private variables in the visible JWT payload.
- **Using the 'none' algorithm:** Permitting verification of tokens signed with algorithm "none".

## 6. Security Considerations
- **Signature Validations:** Always validate signatures, expiration dates, and audience keys before parsing claims.

## 7. Performance Considerations
- **Cryptographic Validation Costs:** Cryptographic verification is CPU-intensive. Use fast, compiled libraries.

## 8. Scalability Considerations
- **Stateless Decoupling:** Enable services to validate tokens independently using shared public keys (JWKS).

## 9. How Major Companies Implement It
- **Auth0 / Okta:** Provide standard JSON Web Key Sets (JWKS) to let microservice clusters validate user tokens locally.

## 10. Decision Checklist (JWT Validation)
- Use **Asymmetric Signing (RS256)** when:
  - Tokens are validated across multiple independent microservices owned by different teams.
- Use **Symmetric Signing (HS256)** when:
  - Single monoliths sign and validate tokens within a single process.

## 11. AI Coding-Agent Guidelines
- Write token verification middleware that catches expired exceptions and extracts roles without decrypting secrets.

## 12. Reusable Checklist
- [ ] Asymmetric signing algorithms (RS256) used for signatures
- [ ] Access token lifespan configured to expire quickly (15 minutes)
- [ ] None algorithm blocked in jwt parsing library configurations
- [ ] No private or sensitive fields included in token payloads
- [ ] Tokens stored in HTTP-only, Secure, SameSite cookies on clients
- [ ] JWKS endpoint exposes active public signature keys
