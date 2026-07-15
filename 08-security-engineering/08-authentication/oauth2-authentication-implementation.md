# OAuth2 and OpenID Connect (OIDC)

## 1. Definition & Core Concepts
OAuth2 is an authorization framework that enables applications to obtain limited access to user accounts. OpenID Connect (OIDC) is an identity layer built on top of OAuth2 that provides single-sign-on (SSO) authentication.

## 2. Why It Exists / What Problem It Solves
It lets users log into third-party apps using centralized accounts (Google, Microsoft, GitHub) without sharing their passwords, and allows services to delegate token validation.

## 3. What Breaks in Production Without It
- **Account Vulnerability:** Applications store user passwords locally, exposing the database to credential theft attacks.
- **Brittle Integrations:** Custom integration scripts break on third-party security updates because they lack standard protocol mappings.

## 4. Best Practices
- **Use Authorization Code Flow with PKCE:** Always use the PKCE extension for mobile and single-page apps to block code interception.
- **Verify Issuer Signatures:** Validate OIDC ID tokens against the provider's official JWKS endpoints.
- **Configure Strict Redirect Whitelists:** Register exact callback redirect URLs in identity servers.

## 5. Common Mistakes / Anti-Patterns
- **Using Implicit Flow:** Transmitting access tokens directly in URL hash fragments, exposing them to history leaks.
- **Skipping State Checks:** Failing to validate CSRF state tokens during login redirections.

## 6. Security Considerations
- **Token Leakage:** Ensure authentication callback handlers strip code and state variables from browser address bars.

## 7. Performance Considerations
- **Metadata Caching:** Cache OIDC provider configuration documents and public keys to avoid blocking request pipelines.

## 8. Scalability Considerations
- **Federated Identity Providers:** Decouple login logic from application servers, using OIDC gateways (Keycloak, Okta) to unify logins.

## 9. How Major Companies Implement It
- **Google / GitHub:** Expose OIDC single-sign-on endpoints that let millions of users authenticate across applications safely.

## 10. Decision Checklist (SSO Selection)
- Use **OIDC Single Sign-On** when:
  - Building SaaS products, enterprise apps, or customer portals requiring unified logins across providers.
- Use **Direct JWT/Session Auth** when:
  - Developing small, isolated tools with local email-password storage requirements.

## 11. AI Coding-Agent Guidelines
- Write redirection handlers that generate random state values and verify them post-callback.

## 12. Reusable Checklist
- [ ] PKCE authorization flow configured for client logins
- [ ] State parameters validated on authentication callbacks
- [ ] OIDC ID token signature verified against provider JWKS
- [ ] Redirect URLs explicitly whitelisted in the identity server
- [ ] Access tokens stored securely away from localStorage (cookies/backend)
- [ ] Provider configuration parameters cached in memory
