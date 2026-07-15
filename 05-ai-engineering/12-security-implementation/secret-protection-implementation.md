# Secret Protection in AI Contexts

## 1. Definition & Core Concepts
Secret Protection in AI Contexts is the security practice of detecting and filtering API keys, database passwords, SSL certificates, and security tokens from agent prompts, context windows, and tool output variables.

## 2. Why It Exists / What Problem It Solves
AI models read text variables dynamically (e.g. scanning git logs or file directories). If files contain un-masked keys, the model ingests them into its context window, making them vulnerable to prompt extraction attacks.

## 3. What Breaks in Production Without It
- **API Key Theft:** Attackers use prompt injections to force agents to print secrets retrieved from database or environment variables.
- **Accidental Key Exposure:** Debug trace logs publish raw database credentials, violating compliance.
- **Tool failures:** Agents pass credentials to third-party endpoints, exposing systems.

## 4. Best Practices
- **Run local secret scanners:** Scan file inputs for API keys patterns (e.g. using regex matching common providers like AWS, Stripe) before prompt assembly.
- **Scrub tool output payloads:** Sanitize command execution traces of passwords.
- **Store secrets out-of-prompt:** Retrieve secrets at runtime during tool execution steps, never within the prompt variables blocks.

## 5. Common Mistakes / Anti-Patterns
- **Injecting env variables into system prompts:** Placing all system configurations directly inside agent variables blocks.
- **Ignoring shell outputs:** Passing raw bash outputs (which can print password inputs) directly back to models.

## 6. Security Considerations
- **Telemetry encryption:** Encrypt debug trace tables at rest.

## 7. Performance Considerations
- **Regex filter optimizations:** Run fast key scanners to keep latency under 10ms.

## 8. Scalability Considerations
- **Rate limits checks:** Ensure credential lookups are cached to avoid vault bottlenecks.

## 9. How Major Companies Implement It
- **GitHub:** Runs automated secret scans on all committed files to prevent key leakages.
- **Stripe:** Automatically invalidates API keys if they appear in public search indexes or payloads.

## 10. Decision Checklist (Secrets Scrubbing)
- Enforce **Secrets Scanners** on:
  - Any agent executing terminal commands, reading filesystem directories, or scanning codebases.
- Skip **Secrets Scanners** only when:
  - Prompt inputs are static templates.

## 11. AI Coding-Agent Guidelines
- Programmatically verify that credentials are masked in all tool output logs before sending variables back to the model.

## 12. Reusable Checklist
- [ ] Secrets scanners configured to match API key patterns
- [ ] Credentials excluded from prompt template variables
- [ ] Shell outputs and API error traces sanitized of passwords
- [ ] Debug trace tables encrypt credentials
- [ ] Automated security tests verify secrets masking
- [ ] Key rotation scripts configure automatic alerts
