# Refresh Tokens

## 1. Definition & Core Concepts
A Refresh Token is a long-lived, secure credential used to request new, short-lived access tokens without forcing the user to log in again.

## 2. Why It Exists / What Problem It Solves
Access tokens (JWTs) should be short-lived to minimize security impact if stolen. However, logging users out every 15 minutes creates a bad experience. Refresh tokens allow the client to renew access tokens silently in the background.

## 3. What Breaks in Production Without It
- **Frequent Logouts:** Users are forced to re-enter passwords every few minutes.
- **Over-exposure of Credentials:** Clients repeatedly send raw username/password credentials across the network to maintain active sessions.

## 4. Best Practices
- **Store in Secure Cookies:** Send refresh tokens to clients inside HTTP-only, Secure cookies restricted to the /auth/refresh path.
- **Implement Refresh Token Rotation:** Issue a new refresh token on every usage, invalidating the old one. If an old token is reused, revoke the entire family (stealing detection).
- **Store in Revocation Lists:** Persist active refresh token hashes in databases to allow immediate revocation.

## 5. Common Mistakes / Anti-Patterns
- **Exposing refresh tokens in JSON:** Returning refresh tokens in JavaScript-readable JSON payloads, exposing them to XSS theft.
- **Unlimited lifespans:** Configuring refresh tokens without absolute expiration limits.

## 6. Security Considerations
- **Replay Attacks:** Enforce token rotation and invalidate the token family if a reuse anomaly is detected.

## 7. Performance Considerations
- **Asynchronous Revocation Checks:** Use fast in-memory databases (Redis) to check token revocation states.

## 8. Scalability Considerations
- **Independent Refresh Endpoints:** Isolate the /auth/refresh route on separate lightweight servers to manage token renewal traffic.

## 9. How Major Companies Implement It
- **Auth0 / Google:** Implement strict refresh token rotation schemes, immediately invalidating access tokens when old refresh tokens are submitted.

## 10. Decision Checklist (Refresh Token Integration)
- Use **Refresh Tokens** when:
  - Utilizing short-lived JWT access tokens in interactive web or mobile applications where persistent logins are required.
- Use **Session Auth** when:
  - The application architecture is stateful and relies on direct session cookies.

## 11. AI Coding-Agent Guidelines
- Write refresh controllers that validate signatures, check reuse states, rotate tokens, and handle revocation logic.

## 12. Reusable Checklist
- [ ] Access token lifespan set under 15 minutes; refresh tokens long-lived
- [ ] Refresh token rotation active (new token issued on every refresh)
- [ ] Token family revoked immediately if reuse is detected
- [ ] Refresh token stored in HTTP-only, Secure cookie on refresh route
- [ ] Active refresh token hashes stored in database to support revocation
- [ ] Absolute expiration limits configured for refresh tokens
