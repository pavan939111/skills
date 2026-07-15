# Agent Permissions & Scoping

## 1. Definition & Core Concepts
Agent Permissions & Scoping is the security framework that enforces least-privilege constraints on the tools, directories, database tables, and API routes an agent can access during execution.

## 2. Why It Exists / What Problem It Solves
Autonomous agents run code dynamically. If permissions are unscoped, prompt injection attacks can hijack the agent loop to delete database indices, fetch internal directories, or mutate account settings.

## 3. What Breaks in Production Without It
- **Data Leakages:** Attackers bypass database controls, querying tables they are unauthorized to read.
- **Accidental Deletions:** Agents delete system files because paths were not jailed.
- **Financial losses:** Agents trigger refunds or transfers without authorization limits checkouts.

## 4. Best Practices
- **Enforce Least Privilege:** Restrict agent API credentials to the absolute minimum required for the task.
- **Implement Directory Jails (chroot):** Jail filesystem tools to prevent directory traversal exploits (relative paths blocks).
- **Configure Action Thresholds:** Require human approval (HITL) for high-risk actions (e.g. database updates, wire transfers).

## 5. Common Mistakes / Anti-Patterns
- **Superuser configurations:** Granting agents full administrator or root API tokens.
- **Unrestricted path writes:** Allowing agents to write files to any folder on the host server.

## 6. Security Considerations
- **Boundary Verification:** Test permissions configurations using automated injection suites in CI pipelines.

## 7. Performance Considerations
- **Permissions checking overhead:** Optimize database lookup speeds for permissions validations.

## 8. Scalability Considerations
- **Policy management:** Keep policy configurations centralized (e.g. AWS IAM, database roles) rather than scattered in code.

## 9. How Major Companies Implement It
- **Microsoft:** restrains search agents to channels the user session is authorized to read.
- **Stripe:** Restricts automated agent code execution to secure, read-only sandboxes.

## 10. Decision Checklist (Permissions Tiers)
- Use **Read-Only Permissions** when:
  - Designing RAG pipelines or informational search agents.
- Use **Human-in-the-Loop Permissions** when:
  - The workflow contains API write mutations or financial transactions.

## 11. AI Coding-Agent Guidelines
- Programmatically check that path normalization validations are active before running any filesystem tool.

## 12. Reusable Checklist
- [ ] Least-privilege API permissions active on all agent credentials
- [ ] Filesystem tools restricted to sandbox directories (chroot active)
- [ ] User session permissions validated before routing queries
- [ ] Write operations require human approval gates
- [ ] Absolute path overrides blocked by default
- [ ] Unit tests verify permission boundaries under injection runs
