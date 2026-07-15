# Session-Based Authentication

## 1. Definition & Core Concepts
Session-Based Authentication is a stateful authentication pattern where the server generates a unique session ID upon login, stores it in database memory, and returns the ID to the client inside a secure cookie.

## 2. Why It Exists / What Problem It Solves
It provides a reliable, easily revocable authentication channel for web applications. Since the server controls the session database, it can terminate user sessions immediately on logout, password resets, or fraud events.

## 3. What Breaks in Production Without It
- **Session Hijack Proliferation:** Compromised client-side tokens (like JWTs) remain valid until expiration, leaving systems unable to force immediate revokability on security threats.

## 4. Best Practices
- **Store in Secure Cookies:** Configure cookies with HttpOnly, Secure, and SameSite=Strict attributes to protect against XSS and CSRF.
- **Set Idle Expiration Timers:** Set session expiration limits (e.g., inactive for 30 minutes) and cleanup inactive sessions.
- **Regenerate IDs on Login:** Re-generate session IDs after successful logins to prevent session fixation attacks.

## 5. Common Mistakes / Anti-Patterns
- **Storing sessions in server memory:** Keeping sessions in local process memory, preventing horizontal scaling. Use Redis.
- **Using guessable session IDs:** Generating sequential or low-entropy session strings instead of cryptographically secure random values.

## 6. Security Considerations
- **CSRF Tokens:** Session cookies are automatically sent by browsers. Always implement CSRF protection tokens alongside sessions.

## 7. Performance Considerations
- **Distributed Session Caching:** Use fast, in-memory databases (like Redis) to load sessions, keeping checks under 5ms.

## 8. Scalability Considerations
- **Session DB Sharding:** Partition session caches across Redis clusters to support high concurrent logins.

## 9. How Major Companies Implement It
- **GitHub / Amazon:** Use secure session cookies for web-browser interfaces, backed by fast distributed session clusters that support immediate user logouts.

## 10. Decision Checklist (Stateful vs Stateless)
- Use **Session-Based Auth** when:
  - Designing web portals where immediate revocation capability is required on security events.
- Use **JWT Auth** when:
  - Building stateless microservice graphs or mobile APIs where database session lookups are a performance bottleneck.

## 11. AI Coding-Agent Guidelines
- Configure session middlewares to regenerate session cookies on auth updates and store payloads in Redis caches.

## 12. Reusable Checklist
- [ ] Session ID cookie configured with HttpOnly, Secure, SameSite attributes
- [ ] Session ID regenerated upon login to prevent session fixation
- [ ] Sessions stored in distributed cache (Redis) instead of local memory
- [ ] CSRF tokens validated alongside session-based routes
- [ ] Idle and absolute session expiration timeouts configured
- [ ] Session database cleanup scripts active for expired sessions
