# Permission-Based Authorization

## 1. Definition & Core Concepts
Permission-Based Authorization is the practice of checking for specific, granular permissions (e.g. delete:users, export:reports) before executing actions, rather than checking for broad roles.

## 2. Why It Exists / What Problem It Solves
Checking roles directly (e.g. if (user.role === 'manager')) makes code rigid. If you want to create a new role or modify a role's permissions, you must edit the code. Permission-based authorization decouples code logic from role assignments, allowing permissions to be updated dynamically via configurations.

## 3. What Breaks in Production Without It
- **Code Refactoring Campaigns:** Adding a new role (like "SuperEditor") requires editing if statements across dozens of codebase files.
- **Lack of Granular Control:** Inability to restrict specific actions (like deleting records) to a subset of users within a role.

## 4. Best Practices
- **Define Standard Permission Strings:** Use a consistent naming format (e.g. ction:resource like ead:users, write:billing).
- **Enforce at Route Controller Level:** Place permission requirements directly on controllers using route decorators (e.g., @RequirePermission('write:orders')).
- **Store in Token Claims:** Embed the user's granular permissions list inside JWT claims to allow fast, local checks.

## 5. Common Mistakes / Anti-Patterns
- **Mixing roles and permissions in checks:** Writing code that checks for both roles and permissions in a single, confusing condition block.
- **Too granular permissions:** Defining permissions for every single database column, complicating configurations.

## 6. Security Considerations
- **Scope Tampering Prevention:** Ensure permissions embedded in client-side tokens are signed and verified against signature keys.

## 7. Performance Considerations
- **Token size bloat:** Including hundreds of permissions in a JWT payload increases header sizes. Cache large permissions lists in Redis.

## 8. Scalability Considerations
- **Centralized Permission Registry:** Maintain a single catalog of all defined permission keys in the organization.

## 9. How Major Companies Implement It
- **Auth0 / Keycloak:** Enforce scope-based and permission-based access checks, mapping user selections to specific token scopes.

## 10. Decision Checklist (Permission Design)
- Use **Permission-Based Checks** when:
  - Building applications with multiple roles, evolving feature paths, or where permissions need dynamic mapping.
- Use **Simple Role Checks** when:
  - The application has 1 or 2 static roles (e.g., User vs Admin) that will not change.

## 11. AI Coding-Agent Guidelines
- Annotate API routes with required permission tokens, ensuring checking middleware intercepts requests before service execution.

## 12. Reusable Checklist
- [ ] API routes check for permission strings (e.g., write:orders), not roles
- [ ] Permission strings use consistent naming syntax (ction:resource)
- [ ] Route middleware checks for required permissions in user token scopes
- [ ] Default permissions configured with least-privilege configurations
- [ ] User permissions cached in Redis to minimize database lookups
- [ ] Integration tests verify that routes reject users lacking target permissions
