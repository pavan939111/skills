# ADR 0005: Stateless JWT Authentication

*   **Status**: Accepted
*   **Date**: 2026-07-16
*   **Deciders**: Principal Architect, Security Lead

---

## 1. Context & Problem Statement

As user traffic scaled, session-based stateful authentication created scalability bottlenecks. Session stores (Redis) experienced connection spikes and high memory usage, and backend instances spent excessive processing cycles verifying session keys on every API call.

---

## 2. Decision

We will implement a **Stateless JWT Authentication** model:
1.  **Access Tokens**: Expose short-lived JWT access tokens (15-minute expiration) signed using asymmetric RS256 private keys.
2.  **Transport Channel**: Store access tokens in HTTP-only, secure, SameSite=Strict cookies to protect against Cross-Site Scripting (XSS).
3.  **Refresh Tokens**: Issue long-lived refresh tokens (7-day expiration) stored in a database table to support rolling access token requests.

---

## 3. Consequences

*   **Scalability**: Backend servers verify access tokens statelessly in memory using the public key, removing database queries for session lookups.
*   **Token Revocation**: Revoking compromised sessions requires querying the database refresh table or waiting 15 minutes for the access token to expire.
*   **Key Lifecycle**: Enforces asymmetric cryptographic key rotations on a 90-day cycle.
