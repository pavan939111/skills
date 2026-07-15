# Prompt Versioning

## 1. Definition & Core Concepts
Prompt Versioning is the practice of tracking, labeling, and releasing changes to prompt templates, system instructions, and RAG schemas using git or specialized prompt registries.

## 2. Why It Exists / What Problem It Solves
System prompts are executable code instructions. Modifying a prompt to fix one issue can cause regressions in other areas. Versioning allows teams to release prompt updates safely, track changes, and roll back on failures.

## 3. What Breaks in Production Without It
- **Silent formatting regressions:** Tweaking system instructions causes the model to output invalid JSON, breaking downstream API endpoints.
- **Untraceable changes:** Output quality drops, but the team cannot locate which git commit or edit caused the change.
- **Service downtime:** Outages cannot be resolved quickly due to lack of rollback prompts.

## 4. Best Practices
- **Treat prompts as code:** Commit prompt text files in git repositories alongside backend services.
- **Enforce SemVer rules:**
  - *Major:* Schema changes (e.g. changing output JSON fields).
  - *Minor:* Instructional style tweaks (e.g. changing tone).
  - *Patch:* Formatting fixes, typo repairs.
- **Automate prompt promotion:** Run regression test scripts in CI pipelines before deploying prompt changes.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoding prompts in files:** Storing system instructions as large string variables inside controllers.
- **Database prompts without history:** Storing prompts in databases without maintaining audit logs.

## 6. Security Considerations
- **Version checks:** Restrict write permissions to production prompt registries to authorized pipelines.

## 7. Performance Considerations
- **Caching consistency:** Keep template layouts identical to maintain provider prompt caching hits.

## 8. Scalability Considerations
- **Registry caching:** Cache prompt versions locally to prevent network database calls during user query routes.

## 9. How Major Companies Implement It
- **Netflix:** Tracks prompt variants in git repositories, promoting versions to production via standard CI/CD pipelines.
- **Vercel:** Integrates prompt versioning and logging directly into their AI developer platforms.

## 10. Decision Checklist (Versioning Systems)
- Use **Git-based Versioning** when:
  - Prompt updates are managed by developers and released along with code versions.
- Use **Registry Databases (e.g. Langfuse, Pezzo)** when:
  - Product managers or writers need to update prompts in real-time.

## 11. AI Coding-Agent Guidelines
- Never deploy prompt updates without validating that the new prompt version passes validation schema tests.

## 12. Reusable Checklist
- [ ] Prompt templates isolated from application source code files
- [ ] Semantic versioning (SemVer) applied to prompt changes
- [ ] Git-based version history active for all templates
- [ ] CI testing pipelines configured to validate prompt schemas
- [ ] Production prompt overrides restricted to authorized accounts
- [ ] Fallback prompt versions defined for emergency rollbacks
