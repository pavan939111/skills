# AI Security Checklist

## 1. Definition & Core Concepts
The AI Security Checklist is the validation tool used to confirm that prompt injection defenses, jailbreak protections, tool sandboxes, PII filters, secrets management, output screens, and permissions scopes are properly configured before release.

## 2. Why It Exists / What Problem It Solves
It ensures that AI systems are deployed with robust security controls, protecting hosts, databases, and users from exploits and compliance violations.

## 3. What Breaks in Production Without It
- **Remote Code Execution (RCE):** Un-sandboxed filesystem tools execute commands on the host server.
- **Compliance Violations:** Ingesting credit numbers or patient details into public search indexes.
- **API Key Theft:** Models print private keys in response to prompt injections.

## 4. Best Practices
- **Run the checklist during security audits:** Verify sandbox limits.
- **Verify data boundaries:** Enforce least-privilege checks.
- **Validate moderations:** Ensure content filters are active.

## 5. Common Mistakes / Anti-Patterns
- **Superuser configurations:** Granting root API tokens.
- **Skipping output validation:** Directly outputting model text to downstream APIs.

## 6. Security Considerations
- **Sandboxed Execution:** Verify sandbox constraints are active on all command tools.

## 7. Performance Considerations
- **Parallel processing validations:** Ensure database connections are optimized.

## 8. Scalability Considerations
- **Compute Sizing:** Distribute task loads across worker pools.

## 9. How Major Companies Implement It
- **Microsoft:** Requires Copilot development teams to complete safety checklists before launch.
- **Google:** Enforces security-readiness gates on all automated workflow scripts.

## 10. Decision Checklist (Pipeline Validation)
- Use **Security Validation Checklist** when:
  - Deploying new agent tools, function schemas, or model connection routes.

## 11. AI Coding-Agent Guidelines
- Review the AI security checklist to confirm formatting and permission configurations are verified.

## 12. Reusable Checklist
- [ ] Ingress injection filters active (Llama Guard/regex checks)
- [ ] User input variables enclosed in strict XML delimiters
- [ ] Tool execution isolated inside ephemeral containers
- [ ] Local Named Entity Recognition (NER) scanner active on input routes
- [ ] Secrets and keys excluded from system prompts contexts
- [ ] Zod/Pydantic schema validation active for structured inputs
- [ ] Least-privilege API permissions active on all agent credentials
- [ ] Write operations require human approval gates
