# Agent Self-Correction

## 1. Definition & Core Concepts
Agent Self-Correction is the mechanism where an agent processes error logs, exception traces, or validator failures returned by system tools and automatically adjusts its parameters to retry the action.

## 2. Why It Exists / What Problem It Solves
APIs fail, database queries throw syntax errors, and network limits are reached. Self-correction prevents these errors from crashing workflows, allowing the agent to read the error message, rewrite the query or parameters, and retry.

## 3. What Breaks in Production Without It
- **Brittle Workflows:** A minor SQL syntax error crashes the entire user-facing report page.
- **Accidental State Hangs:** Workflows get stuck because a single external API connection failed once.
- **Support Overhead:** Developers must manually resolve minor formatting issues that the agent could correct.

## 4. Best Practices
- **Return detailed error messages:** Feed raw compiler error stack traces or schema exceptions directly back to the model.
- **Implement fallback values:** Define default behaviors if the maximum self-correction limit is reached.
- **Configure exponential backoffs:** Handle rate limits (HTTP 429) using wait intervals.

## 5. Common Mistakes / Anti-Patterns
- **Generic error logs:** Feeding vague error messages (e.g. "Action failed") back to the model, which lacks enough detail for correction.
- **Unbounded retry loops:** Retrying failed API calls endlessly without decay rules.

## 6. Security Considerations
- **Information Leakage:** Ensure internal stack traces passed to the model do not contain databases credentials.

## 7. Performance Considerations
- **Execution delays:** Self-correction loops take time. Decouple these workflows from synchronous client connections.

## 8. Scalability Considerations
- **Concurrency checks:** Track queue sizes when handling multiple retries.

## 9. How Major Companies Implement It
- **Replit:** Connects terminal errors directly back to code repair prompts, correcting syntax issues.
- **Retool:** Implements validation retries in workflows scripts to handle API updates.

## 10. Decision Checklist (Correction Triggers)
- Use **Self-Correction Loops** when:
  - Task execution tools provide descriptive error codes (e.g., compilers, JSON schema parsers).
- Avoid **Self-Correction Loops** when:
  - Tool errors are fatal (e.g., authentication failures).

## 11. AI Coding-Agent Guidelines
- Ensure that stack traces passed to self-correction prompts are sanitized of internal passwords and secrets.

## 12. Reusable Checklist
- [ ] Detailed compiler/schema error stack traces captured
- [ ] Safe text sanitization active on error outputs
- [ ] Retry limit capped (default: max 3 attempts)
- [ ] System notifications trigger on loop timeout failures
- [ ] Fallback responses defined for fatal exceptions
- [ ] Retry latency traces visible on tracing dashboards
