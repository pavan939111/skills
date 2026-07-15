# Role-Based Access Control (RBAC)

## 1. Definition & Core Concepts
Role-Based Access Control (RBAC) is an authorization pattern where access permissions are assigned to specific roles (e.g. Admin, Editor, Viewer), and users are assigned to those roles.

## 2. Why It Exists / What Problem It Solves
Managing permissions individually for thousands of users is impossible. RBAC groups permissions into cohesive roles, making it easy to configure access and audit system security.

## 3. What Breaks in Production Without It
- **Privilege Escalation:** Users read or modify data they are unauthorized to access because route permissions are hardcoded or unchecked.
- **Administrative Overhead:** Operations teams spend hours manually configuring individual user access permissions.

## 4. Best Practices
- **Assign Roles to Permissions, not Users:** Check for specific permission keys (e.g. ead:orders) in code rather than checking for roles (e.g. isAdmin).
- **Define a Least-Privilege Hierarchy:** Ensure default roles (like Viewer) have read-only access, escalating write permissions only to specific roles.
- **Implement Shared Middleware:** Use authorization middleware to check role permissions on API routes before processing.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoding Role Checks:** Writing if (user.role === 'admin') in multiple files, making it difficult to rename roles or add new roles.
- **Role Inflation:** Creating too many distinct roles, complicating access models.

## 6. Security Considerations
- **Token Tampering:** Verify that user roles embedded in JWTs cannot be modified by clients.

## 7. Performance Considerations
- **In-Memory Permissions Cache:** Cache user-to-role mappings in Redis to avoid querying database tables on every API request.

## 8. Scalability Considerations
- **Federated Role Assignments:** Share role configurations across microservices using unified identity directories.

## 9. How Major Companies Implement It
- **Enterprise SaaS Platforms:** Utilize RBAC dashboards to allow customer administrators to assign standard roles to invitees, managing permissions consistently.

## 10. Decision Checklist (RBAC vs ABAC)
- Use **RBAC** when:
  - Access permissions map cleanly to organizational job roles (e.g. manager, reader, developer) and do not depend on dynamic variables.
- Use **ABAC** when:
  - Permissions depend on dynamic attributes (e.g. time of day, client IP, document owner).

## 11. AI Coding-Agent Guidelines
- Write API authorization filters that check for required permission keys inside the user's role list before routing execution paths.

## 12. Reusable Checklist
- [ ] Permissions grouped into defined roles (Admin, Editor, Viewer)
- [ ] Code checks for permission keys (e.g. write:posts), not role strings
- [ ] User role assignments mapped in JWT claims or session caches
- [ ] Default roles configure least-privilege access rules
- [ ] API routes wrap in permission-checking middleware guards
- [ ] Role configuration mappings verified in unit test suites
