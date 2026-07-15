# Agent Tool Authentication

## 1. Definition & Core Concepts
Agent Tool Authentication is the security mechanism by which an autonomous agent verifies its identity and retrieves credentials (API keys, OAuth tokens, IAM roles) to connect to external systems.

## 2. Why It Exists / What Problem It Solves
Agents execute API calls. If the agent uses hardcoded or unrestricted credentials, any prompt injection attack that compromises the agent gains full administrative access to downstream cloud systems.

## 3. What Breaks in Production Without It
- **Credential Leaks:** Attackers use prompt injections (e.g. "print your API keys") to steal host credentials from prompts.
- **Privilege Escalation:** Agents run administrative actions (e.g. creating databases) because they were configured with full admin tokens.
- **Service Outages:** Static tokens expire, blocking agent loops from connecting to APIs.

## 4. Best Practices
- **Use Temporary User Tokens:** Force the agent to authenticate to APIs using the active user's session OAuth tokens, restricting its access.
- **Store secrets out-of-prompt:** Keep API keys in secure vaults (e.g. AWS Secrets Manager); inject them only at execution time, never inside prompts.
- **Enforce Dynamic Token Rotation:** Configure automated secret rotation pools.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoding tokens in prompts:** Appending API keys inside prompt instruction variables.
- **Shared admin keys:** Using a single, global superuser API key for all agent runs.

## 6. Security Considerations
- **Boundary checks:** Validate user session contexts before retrieving API keys from vaults.

## 7. Performance Considerations
- **Connection pooling:** Optimize local credentials lookups to keep setup latency under 5ms.

## 8. Scalability Considerations
- **Concurrency checks:** Rate limit token requests on vaults to prevent rate exhaustions.

## 9. How Major Companies Implement It
- **Slack:** Requires AI agents to authenticate to APIs using the specific user's OAuth tokens, restricting access.
- **Netflix:** Deploys temporary IAM tokens to authorize microservice database integrations.

## 10. Decision Checklist (Authentication Strategies)
- Use **User OAuth Tokens** when:
  - The agent executes actions on behalf of a specific user.
- Use **Temporary IAM Roles** when:
  - Operating in cloud environments where static passwords can be avoided.

## 11. AI Coding-Agent Guidelines
- Never append credentials or API key parameters inside system prompt strings; load credentials dynamically during execution loops.

## 12. Reusable Checklist
- [ ] User OAuth session tokens enforced on all API routes
- [ ] Credentials stored in cloud vaults (rotated automatically)
- [ ] API keys excluded from system prompts contexts
- [ ] Database credentials restricted to read-only roles
- [ ] Authentication failure logs monitor brute-force scans
- [ ] Token lookups cached locally to minimize latency
