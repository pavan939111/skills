# Authorization Strategy

### 1. The Question Decided
"Which authorization model (RBAC - Role-Based, ABAC - Attribute-Based, or ReBAC - Relationship-Based) governs service access permissions?"

### 2. Options Compared
| Dimension | Role-Based (RBAC) | Attribute-Based (ABAC) | Relationship-Based (ReBAC) |
|---|---|---|---|
| **Cost (Compute)** | Low | Medium | High |
| **Complexity** | Low | High | Very High |
| **Granularity** | Coarse (User -> Role) | Fine (User + IP + Time -> Access) | Fine (User -> Document parent) |
| **B2B SaaS fit** | Good | Fair | Best Match |

### 3. Decision Rule
- **Choose Role-Based (RBAC) if:** Authorization checks are static and simple (e.g. `is_admin`, `is_editor`), routing access by user groups.
- **Choose Relationship-Based (ReBAC) if:** Access is nested and parent-child bound (e.g. "allow user to view document if they own the parent folder").

### 4. Red Flags to Revisit
- Access rules drift because authorization logic is hardcoded inside multiple API routes instead of using a central policy engine.
- A "role explosion" occurs where the team creates 50 different user roles to satisfy fine-grained tenant requirements.

### 5. Where to Go Next
- For database-level roles, privileges, and row-level security setups, see [Data Layer Authorization](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/07-security/authorization-strategy-implementation.md).
- For implementing permission checks and policy engine middleware in backend code, see [Backend Authorization Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/02-authorization/index.md).
