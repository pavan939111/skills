# API Key Authentication

## 1. Definition & Core Concepts
API Key Authentication is the practice of identifying and authorizing clients (typically developer scripts or system integrations) using unique, long-lived token strings passed in request headers.

## 2. Why It Exists / What Problem It Solves
User-facing JWTs expire quickly. System-to-system integrations require long-lived credentials to execute background calls without human logins. API keys provide a simple, machine-friendly authentication channel.

## 3. What Breaks in Production Without It
- **Integration Blockages:** Automation scripts fail because they cannot handle interactive MFA or token refresh flows.
- **Spend Surges:** Un-tracked API requests consume server resources without billing attribution.

## 4. Best Practices
- **Hash Keys in Storage:** Store API keys in database tables as hashed representations (e.g. SHA-256) rather than raw strings.
- **Include Key Prefixes:** Prefix keys with identifiers (e.g. sk_live_...) to help developers identify environments and enable secrets scanners to flag exposures.
- **Enforce Rate Limits:** Bind API keys to rate limit buckets to prevent integration loops from crashing servers.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoding keys:** Committing system API keys to Git repositories.
- **Storing raw keys in database tables:** Allowing database read leaks to expose all client integration access keys.

## 6. Security Considerations
- **Key Revocation:** Provide quick revocation and rotation APIs for users when keys are compromised.

## 7. Performance Considerations
- **Fast Lookup Caching:** Cache hashed API keys in memory (Redis) to avoid querying relational database tables on every API call.

## 8. Scalability Considerations
- **Usage-based Billing:** Track usage counters per API key to feed billing systems (Stripe/Lago) asynchronously.

## 9. How Major Companies Implement It
- **Stripe:** Utilizes hashed API keys prefix-coded with environment indicators, validating them against memory caches under 10ms.

## 10. Decision Checklist (API Key Usage)
- Use **API Key Auth** when:
  - Building developer APIs, webhook clients, or background server integrations.
- Use **OIDC/JWT Auth** when:
  - Building interactive client browser frontends or mobile user flows.

## 11. AI Coding-Agent Guidelines
- Write API key checkers that hash incoming headers and query validation databases, applying rate limits.

## 12. Reusable Checklist
- [ ] API keys stored as hashed values in databases (SHA-256)
- [ ] Keys prefix-coded to indicate environment and scope (e.g. sk_live_)
- [ ] Rate limits configured per key to block abuse
- [ ] API key rotation and revocation interfaces implemented
- [ ] Key verification logs cached in memory (Redis)
- [ ] Key scanners configured in Git repos to flag key leaks
