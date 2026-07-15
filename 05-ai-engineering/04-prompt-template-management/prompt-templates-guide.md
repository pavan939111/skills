# Prompt Templates

## 1. Definition & Core Concepts
Prompt Templates are parameterized string files that serve as reusable blueprints for constructing prompts, separating the constant instruction text from variable inputs (e.g. user search queries, document context).

## 2. Why It Exists / What Problem It Solves
Hardcoding full prompts inside application logic is difficult to maintain. Templates separate the wording of prompts from application code, letting developers update instruction text without rebuilding services.

## 3. What Breaks in Production Without It
- **Prompt Injection Exploits:** Merging dynamic inputs using direct string concatenation allows users to escape templates and execute arbitrary instructions.
- **Unmaintainable Codebases:** Modifying prompt phrasing requires editing and deploying core backend code files.
- **Gaps in Data Variables:** Assembled prompts fail to parse because required input variables were missing or null.

## 4. Best Practices
- **Use standard template engines:** Format prompts using Mustache, Jinja2, or specialized template utilities that support variable validation.
- **Isolate prompt directories:** Save templates in dedicated folders (e.g., `src/prompts/`) as raw text files (not code files).
- **Sanitize inputs:** Check for control characters (e.g. system tokens) in user inputs before rendering templates.

## 5. Common Mistakes / Anti-Patterns
- **JavaScript template literals:** Using raw backticks (`` `...` ``) directly in controller code to build prompts.
- **Missing variable validation:** Dispatching incomplete templates when dynamic parameters are missing.

## 6. Security Considerations
- **Prompt Escaping:** Users submit text blocks containing system-style delimiters (e.g. `[System Instruction]`) to trick the model. Sanitize input variables.

## 7. Performance Considerations
- **Caching consistency:** Keep template layouts identical to maintain provider prompt caching hits.

## 8. Scalability Considerations
- **Registry integrations:** Use cached local templates to prevent latency bottlenecks from remote registry calls during request paths.

## 9. How Major Companies Implement It
- **LangChain:** Standardizes prompt template objects, allowing developers to define placeholders and input validation rules.
- **GitHub:** Manages prompt files in isolated registries, deploying updates via automated release tags.

## 10. Decision Checklist (Template Architecture)
- Use **Local File Templates** when:
  - Prompts are updated during code releases.
- Use **Remote Prompt Registries** when:
  - Product managers need to update prompt text in real-time.

## 11. AI Coding-Agent Guidelines
- Always load prompt templates from external text files using clean file readers instead of writing large string variables in application code.

## 12. Reusable Checklist
- [ ] Prompt templates isolated from application source code files
- [ ] Parameterized placeholders (e.g., `{{variable}}`) clearly defined
- [ ] User input variables checked for system delimiter characters
- [ ] Unit tests verify prompt rendering under missing variable states
- [ ] Prompt files stored in Git for change history
- [ ] Fallback static template configurations defined for registry failures
