# Tool Security

## 1. Definition & Core Concepts
Tool Security is the protection framework that ensures external scripts, databases, and APIs called by AI agents are secured against execution hijacking, parameter manipulation, and resource locks.

## 2. Why It Exists / What Problem It Solves
AI agents select and execute tools based on dynamic parameters they generate. If tool inputs are unvalidated, prompt injections can manipulate the agent to run dangerous actions (e.g. executing shell commands, dropping databases tables).

## 3. What Breaks in Production Without It
- **Remote Code Execution (RCE):** The agent runs shell commands on the host server because terminal tools lacked sandbox bounds.
- **Unauthorized Data Access:** Agents retrieve private files using directory traversal escapes (e.g., `../../etc/passwd`).
- **Database Corruptions:** SQL tools execute destructive commands dynamically.

## 4. Best Practices
- **Use Ephemeral Sandboxes:** Execute all tool commands inside isolated containers (e.g., Docker, gVisor) with strict CPU/memory limits.
- **Validate parameter schemas:** Enforce schema validation (Zod/Pydantic) on all model-generated tool inputs before execution.
- **Apply Read-Only credentials:** Restrict database connections to read-only roles by default.

## 5. Common Mistakes / Anti-Patterns
- **Exposing the Host Filesystem:** Letting agents write files directly on the host server.
- **Skipping validations:** Trusting model-generated parameters without schema checks.

## 6. Security Considerations
- **Boundary controls:** Ensure sandboxed containers have disabled host network access.

## 7. Performance Considerations
- **Execution delays:** Container warm-ups take time. Keep a pool of warm sandbox instances to optimize latency.

## 8. Scalability Considerations
- **Disk limits:** Auto-expire and cleanup container filesystems on loop exits.

## 9. How Major Companies Implement It
- **Replit:** Sandbox workspace operations inside isolated VMs, protecting hosts from code execution exploits.
- **Stripe:** Exposes tools through secure APIs, validating request parameters on the server side.

## 10. Decision Checklist (Sandbox Enforcements)
- Enforce **Sandboxed Container Execution** on:
  - Any tool that executes code, runs terminal commands, or edits local files.
- Use **Schema Validated APIs** when:
  - Interacting with structured database endpoints.

## 11. AI Coding-Agent Guidelines
- Programmatically validate path variables using directory normalization (`path.resolve`) to prevent traversal exploits.

## 12. Reusable Checklist
- [ ] Tool execution isolated inside ephemeral containers
- [ ] Parameter validations (Zod/Pydantic schemas) active
- [ ] Database credentials restricted to read-only roles
- [ ] Network access disabled inside sandbox runtimes
- [ ] Container disk write size limits configured
- [ ] Unit tests check path traversal escapes attempts
