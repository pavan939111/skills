# Authorization Checklist

## 1. Definition & Core Concepts
The Authorization Checklist is a quality gate audit tool used to verify that RBAC roles, ABAC policies, permission checks, policy engine rules, and resource-level ownership controls are securely configured before release.

## 2. Why It Exists / What Problem It Solves
Failing to audit authorization rules leads to IDOR vulnerabilities, cross-tenant leakages, privilege escalations, and compliance blocks. The checklist ensures all transactions are authorized.

## 3. What Breaks in Production Without It
- **Data Breaches:** Attackers harvest sequential ID URLs to download thousands of customer records.
- **Compliance Failures:** Audits reveal that normal users can access administrative endpoints due to missing filters.

## 4. Best Practices
- **Implement Fail-Closed Defaults:** Ensure that if any authorization check fails or is missing, access is denied by default.
- **Audit IDOR Protections:** Run automated tests that attempt to query resource IDs using different user sessions.
- **Validate Permission scopes:** Check that new API routes enforce granular permission decorators.

## 5. Common Mistakes / Anti-Patterns
- **Testing with admin keys only:** Skipping authorization checks under restricted user profiles during test runs.
- **Hardcoding role checks:** Writing static role name validations inside business classes.

## 6. Security Considerations
- **Secure Policy Storage:** Version-control and encrypt policy configurations to prevent unauthorized modifications.

## 7. Performance Considerations
- **Cached Permissions:** Cache user permission scopes in Redis to minimize database lookups.

## 8. Scalability Considerations
- **Consistent Gateways:** Enforce authorization rules at the API Gateway level where possible to maintain consistency.

## 9. How Major Companies Implement It
- **Fintech Platforms:** Require all authorization code adjustments to pass strict security checklist sign-offs and automated IDOR penetration tests before release.

## 10. Decision Checklist (Authorization Sign-off)
- Approve **Authorization Release** when:
  - Granular permissions are checked, IDOR tests pass, RLS is active, and the policy engine is configured.
- Reject **Authorization Release** when:
  - Ownership filters are missing, raw roles are hardcoded, or public IDs use auto-incrementing integers.

## 11. AI Coding-Agent Guidelines
- Write integration tests that simulate unauthorized access attempts, verifying that routes correctly return HTTP 403 Forbidden.

## 12. Reusable Checklist
- [ ] API routes enforce granular permission decorators (e.g. write:orders)
- [ ] Resource database queries filter on verified tenant or user session IDs
- [ ] Public-facing resource identifiers use secure UUIDs (no integers in URLs)
- [ ] IDOR tests verify that users cannot query other tenants' objects
- [ ] Policy engine sidecars run on fail-closed configurations
- [ ] User role and permission mappings cached in memory (Redis)
