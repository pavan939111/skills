# Context Versioning

## 1. Definition & Core Concepts
Context Versioning is the systematic management of prompt templates, system instructions, and RAG injection schemas using version control systems (like Git or specialized prompt registries).

## 2. Why It Exists / What Problem It Solves
Prompt text is code. Updating a system prompt can change model outputs, breaking API integrations. Versioning ensures prompt updates are tracked, tested, and can be rolled back on failures.

## 3. What Breaks in Production Without It
- **Silent System Failures:** A developer tweaks a system prompt to fix a typo, causing the model to output invalid JSON schemas in production.
- **Untraceable regressions:** Model accuracy drops, but the team cannot identify which prompt edit caused the failure due to lack of change history.
- **Rollback Blocks:** System outages cannot be resolved quickly because previous working prompts are undocumented.

## 4. Best Practices
- **Treat prompts as code:** Commit prompt templates as text files in Git alongside application code.
- **Implement SemVer for prompts:** Use Semantic Versioning (e.g. Major: schema changes; Minor: style changes; Patch: typos).
- **Run automated prompt tests:** Verify new prompt versions against evaluation datasets in CI pipelines before deployment.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoding Prompts in Code:** Writing massive system instructions directly inside application controllers (e.g., `const prompt = "..."`).
- **Database-Stored Prompts without history:** Storing prompts in databases without maintaining audit logs.

## 6. Security Considerations
- **Version Integrity:** Restrict edit access to production prompt registries to prevent unauthorized instruction changes.

## 7. Performance Considerations
- **Caching alignment:** Ensure prompt template formats do not change dynamically (e.g. variable naming updates) to maintain prompt caching.

## 8. Scalability Considerations
- **Runtime registry lookup:** If using external registries, cache prompt versions in Redis to avoid network delays during request processing.

## 9. How Major Companies Implement It
- **Netflix:** Tracks prompt variants in Git repositories, promoting versions to production via standard CI/CD pipelines.
- **Vercel:** Integrates prompt versioning and logging directly into their AI developer platforms.

## 10. Decision Checklist (Prompt Registries)
- Use **Git-Based Versioning** when:
  - The team is small, and prompt updates can follow standard code releases.
- Use **External Prompt Registries (e.g. Langfuse, Pezzo)** when:
  - Non-developers (PMs, writers) need to edit prompts in real-time.

## 11. AI Coding-Agent Guidelines
- Never hardcode system prompts in controller code files; always load prompt files using registry services or local file readers.

## 12. Reusable Checklist
- [ ] Prompt templates isolated from application source code files
- [ ] Git-based version history active for all templates
- [ ] Semantic versioning (SemVer) applied to prompt changes
- [ ] CI testing pipelines configured to validate prompt schemas
- [ ] Production prompt overrides restricted to authorized accounts
- [ ] Fallback prompt versions defined for emergency rollbacks
