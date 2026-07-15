# Prompt Library

## 1. Definition & Core Concepts
A Prompt Library is a centralized repository of validated, secure, and optimized prompt templates used across all application domains and services (e.g. system prompts, agents rules, SQL generators).

## 2. Why It Exists / What Problem It Solves
It prevents duplication and inconsistency. A centralized library ensures that all developers and services utilize the same tested prompts (e.g. standardizing JSON extraction phrasing), simplifying global updates.

## 3. What Breaks in Production Without It
- **Inconsistent Output Styles:** Different features return varying JSON formats or chat tones because developers wrote independent prompts for identical tasks.
- **Security Vulnerabilities:** Some services deploy prompts missing safety guardrails, exposing endpoints to injections.
- **Maintenance Debt:** Updating a billing format requires updating 10 different code files instead of a single prompt file.

## 4. Best Practices
- **Centralize template files:** Save all prompts in a single, shared directory (e.g., `src/shared/prompts/`) accessible by all services.
- **Document variables requirements:** Include markdown headers in prompt files listing expected input parameters (e.g. `Required: user_name, task_details`).
- **Enforce schema checks:** Pair templates with corresponding Zod/Pydantic validation schemas.

## 5. Common Mistakes / Anti-Patterns
- **Copy-Pasting Prompts:** Duplicating prompt strings across different microservice codebases.
- **Undocumented templates:** Leaving prompts without context descriptions, forcing developers to guess what the prompt does.

## 6. Security Considerations
- **Auditing Access:** Audit the prompt library regularly to ensure all templates comply with safety and PII policies.

## 7. Performance Considerations
- **Template consolidation:** Standardize prompt designs to maximize provider prompt caching hit rates.

## 8. Scalability Considerations
- **Dependency checks:** Ensure changes to a shared prompt template do not break downstream consumer services.

## 9. How Major Companies Implement It
- **Salesforce:** Maintains centralized prompt builder directories that validate inputs, inject safety boundaries, and route requests.
- **Microsoft:** Configures unified prompt registries to standardize Copilot layouts across different office suites.

## 10. Decision Checklist (Library Architecture)
- Standardize on a **Shared Git-based Library** when:
  - All services live in a monorepo, or prompts are managed by developers.
- Deploy a **Prompt Registry Service** when:
  - Prompts are shared across multiple isolated repositories.

## 11. AI Coding-Agent Guidelines
- Never write hardcoded prompt strings in microservice code; always load templates from the centralized prompt library.

## 12. Reusable Checklist
- [ ] Centralized prompt library directory established
- [ ] Variables requirements documented inside each template file
- [ ] Templates paired with corresponding JSON validation schemas
- [ ] Duplicate prompts removed from all codebase folders
- [ ] Safety and jailbreak guardrails standardized across templates
- [ ] Unit tests verify template compilation under empty variables
