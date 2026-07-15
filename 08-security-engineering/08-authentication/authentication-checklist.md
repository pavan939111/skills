# Authentication Checklist

## 1. Definition & Core Concepts
The Authentication Checklist is a quality gate audit tool used to verify that JWT signing, OIDC integrations, session controls, refresh rotation rules, and MFA setups conform to security standards before production deploy.

## 2. Why It Exists / What Problem It Solves
Failing to audit authentication configurations leads to account takeovers, token forgery, session vulnerabilities, and compliance blocks. The checklist ensures all logins are secure and authenticated.

## 3. What Breaks in Production Without It
- **Account Takeovers:** Weak encryption keys allow attackers to forge user tokens.
- **Data Theft:** Session fixation vulnerabilities allow attackers to hijack user sessions.

## 4. Best Practices
- **Standardize JWT Signature Verifications:** Ensure all microservices use shared JWKS configurations to check signatures.
- **Audit Token Lifespans:** Confirm that access tokens expire quickly.
- **Verify Secure Cookie Attributes:** Check that session and refresh tokens use HttpOnly, Secure, SameSite settings.

## 5. Common Mistakes / Anti-Patterns
- **Logging secrets:** Writing user passwords or TOTP secret keys to application logs.
- **Skipping PKCE on public clients:** Deploying standard OAuth code flows on mobile apps, exposing token exchanges.

## 6. Security Considerations
- **Secure Password Hashing:** Use standard hashing algorithms (Argon2id, bcrypt) with high work factors to store credentials.

## 7. Performance Considerations
- **In-Memory Cache for Sessions:** Verify that session lookups are cached in Redis to minimize database read latencies.

## 8. Scalability Considerations
- **Stateless Verification Routing:** Ensure microservice gateways handle JWT checks without querying relational tables.

## 9. How Major Companies Implement It
- **Fintech Platforms:** Require all authentication code changes to pass automated vulnerability scans and security checklist sign-offs.

## 10. Decision Checklist (Authentication Sign-off)
- Approve **Authentication Release** when:
  - Password hashing is secure, token signatures use RS256, cookies configure HttpOnly, and MFA is verified.
- Reject **Authentication Release** when:
  - Passwords stored in plaintext, None signature is allowed in JWT, or session IDs are guessable.

## 11. AI Coding-Agent Guidelines
- Write integration tests that simulate authentication flows, checking for correct cookie attributes and token expirations.

## 12. Reusable Checklist
- [ ] Passwords hashed using Argon2id or bcrypt (no SHA/MD5)
- [ ] Access tokens use short lifespans and asymmetric signing (RS256)
- [ ] Cookies set HttpOnly, Secure, and SameSite parameters
- [ ] Refresh token rotation active and family revocation tested
- [ ] PKCE configuration enabled on mobile and frontend OAuth flows
- [ ] MFA TOTP setup verified using a test check code before activation
