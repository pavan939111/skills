# Attribute-Based Access Control (ABAC)

## 1. Definition & Core Concepts
Attribute-Based Access Control (ABAC) is an authorization pattern that evaluates access rights by matching rules against attributes of the subject (user), resource (object), action (HTTP verb), and environment (context variables).

## 2. Why It Exists / What Problem It Solves
RBAC is static and cannot handle dynamic conditions (e.g. "Only allow doctors in the oncology department to read medical records of active oncology patients between 9 AM and 5 PM"). ABAC evaluates these parameters dynamically to enforce fine-grained security policies.

## 3. What Breaks in Production Without It
- **Data Leakage in Shared Tenants:** Users in role "editor" edit documents owned by other users because RBAC only checks the role, not the owner attribute.
- **Operational Non-compliance:** Access rules cannot enforce dynamic regulatory conditions (like geographic location locks).

## 4. Best Practices
- **Define Attribute Schemas:** Structure attributes cleanly (e.g. subject: department, resource: owner_id, environment: equest_ip).
- **Use Policy Decision Points (PDP):** Route authorization evaluations to a centralized PDP module that processes attributes against active rules.
- **Implement Fail-Closed Policies:** Ensure that if any attribute evaluation returns errors or is missing, authorization defaults to access denied.

## 5. Common Mistakes / Anti-Patterns
- **Writing inline ABAC checks:** Nesting complex attribute evaluations (if-else chains) inside business services, cluttering logic. Use a policy engine.
- **Querying too many databases:** Fetching attributes dynamically from multiple database tables on every API call, slowing down responses.

## 6. Security Considerations
- **Attribute Spoofing:** Ensure that subject attributes (like user department or ID) are loaded from verified session data, never client headers.

## 7. Performance Considerations
- **Attribute Caching:** Cache subject and resource attributes in Redis to prevent slow database queries on hot path checks.

## 8. Scalability Considerations
- **Standardized Policy Languages:** Use standardized frameworks (like Open Policy Agent - OPA) to compile and distribute policies.

## 9. How Major Companies Implement It
- **AWS:** Implements IAM policies using ABAC, evaluating tags attached to IAM users and resources to determine access permissions dynamically.

## 10. Decision Checklist (ABAC vs RBAC)
- Use **ABAC** when:
  - Security policies require dynamic parameter evaluations (ownership, department match, environment variables).
- Use **RBAC** when:
  - Access is based purely on static user job descriptions.

## 11. AI Coding-Agent Guidelines
- Write authorization middleware that loads subject, resource, and environment context, passing them to a centralized policy validation checker.

## 12. Reusable Checklist
- [ ] Policy definitions evaluate subject, resource, and environment fields
- [ ] Subject attributes retrieved from verified session contexts (no client inputs)
- [ ] Centralized policy engine (e.g. OPA) processes attribute matches
- [ ] Failure paths default to access denied (fail-closed logic)
- [ ] Attribute parameters cached in memory to optimize check latencies
- [ ] Policy configuration rules version-controlled in the repository
