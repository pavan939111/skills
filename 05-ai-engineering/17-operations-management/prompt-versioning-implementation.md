# Prompt Versioning

## 1. Definition & Core Concepts
Prompt Versioning is the systematic practice of managing prompts as versioned code assets. It treats system prompts, user templates, few-shot examples, and parameters (temperature, stop sequences) as configuration artifacts that are tracked, versioned, and rolled out independently of application code.

## 2. Why It Exists / What Problem It Solves
Hardcoding prompts in application source code makes it difficult to deploy prompt updates or test prompt changes quickly. Prompt versioning decouples prompts from code deployments, allowing teams to roll out new prompt variations, run tests, and execute rollbacks without triggering a full application deployment.

## 3. What Breaks in Production Without It
- **Code Deployment Bottlenecks:** A simple typo correction in a system prompt requires a full CI/CD compile, test, and release cycle (which can take 15-30 minutes).
- **Lack of Traceability:** When output quality degrades, developers cannot trace the issue because there is no commit history or deployment log showing when the prompt was modified.
- **Untested Prompts in Production:** Engineers make ad-hoc prompt edits directly in server consoles, bypassing code review and automated testing.

## 4. Best Practices
- **Store Prompts as Configuration:** Keep prompts in structured formats (YAML, JSON, or Markdown files with frontmatter) inside Git repositories or specialized Prompt Registries.
- **Use Semantic Versioning:** Assign versions (e.g., `v1.2.0`) to prompts, incrementing major versions when schemas change, minor versions for instruction adjustments, and patch versions for copy tweaks.
- **Link Prompts to Evaluations:** Every prompt version must be tagged with the identifier of the evaluation test suite run that validated it.

## 5. Common Mistakes / Anti-Patterns
- **Hardcoding Prompts in Code:** Writing long system prompt strings inside backend route handlers or class files.
- **Using Unversioned DB Storage:** Storing prompts in a mutable database table without maintaining change histories or commit tracking.

## 6. Security Considerations
- **Prompt Injection Defense Versioning:** Track safety guidelines and jailbreak blocks as versioned rules so that security patches are rolled out instantly to all active models.

## 7. Performance Considerations
- **Caching Versioned Prompts:** Store prompt templates in fast in-memory stores (e.g. Redis) with clear cache invalidation rules so that prompt fetching does not add database queries to client request flows.

## 8. Scalability Considerations
- **Multi-environment Syncing:** Ensure prompt versions are automatically synced across development, staging, and production environments via automated pipelines.

## 9. How Major Companies Implement It
- **Netflix:** Uses an internal prompt management platform that hosts prompt configurations in a versioned repository, serving them to microservices via a fast config-delivery API.

## 10. Decision Checklist (Prompt Management Tools)
- Use **Git-based Prompt Storage (YAML/Markdown)** when:
  - You want prompts to go through standard Git code review (pull requests) and build pipelines.
- Use a **Managed Prompt Registry (e.g., LangSmith, Portkey)** when:
  - Non-technical product managers or prompt engineers need to edit and test prompts directly via a web UI.

## 11. AI Coding-Agent Guidelines
- Decouple prompt strings from logic controllers, referencing them via versioned configuration files or registry fetching utilities.

## 12. Reusable Checklist
- [ ] Prompts extracted from code files and stored in structured config formats
- [ ] Git history or database change tracking configured for prompt records
- [ ] Semantic versioning applied to prompt templates
- [ ] Active prompt versions retrieved via configuration service or registry API
- [ ] Prompt metadata includes baseline evaluation run scores
- [ ] Pull Request reviews required for production prompt updates
