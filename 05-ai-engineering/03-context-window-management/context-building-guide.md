# Context Building

## 1. Definition & Core Concepts
Context Building is the programmatic aggregation of data sources (user profile state, database records, search context, conversation history) to construct the final prompt payload submitted to the LLM.

## 2. Why It Exists / What Problem It Solves
Raw user inputs lack context. Programmatically building context ensures the model receives all necessary details (e.g. system dates, user permissions, relational tables) to generate accurate, personalized answers.

## 3. What Breaks in Production Without It
- **Hallucinated Answers:** Models generate generic or false answers because context queries failed to append real-time database facts.
- **Leaked Admin Files:** Context building scripts accidentally retrieve internal system files and inject them into public user prompts.
- **Malformed Outputs:** Prompts missing formatting instructions return raw text instead of target JSON schemas.

## 4. Best Practices
- **Use Prompt Templates:** Define structured, parameter-driven prompt layouts (e.g. using mustache or template variables).
- **Asynchronously aggregate data:** Query databases and API targets in parallel (using promises/threads) to speed up prompt construction.
- **Sanitize inputs:** Escape special control characters in user inputs before merging them into templates.

## 5. Common Mistakes / Anti-Patterns
- **Direct String Concatenation:** Merging user inputs directly using `+` operations, leaving prompts vulnerable to injection attacks.
- **Over-fetching data:** Appending irrelevant database rows to prompts, wasting context limits.

## 6. Security Considerations
- **Boundary Leakage:** Ensure that context builders only retrieve database records that the active user session is authorized to view.

## 7. Performance Considerations
- **Parallel processing:** Aggregate RAG lookups, session history, and system configurations concurrently to keep latency low.

## 8. Scalability Considerations
- **Serialization overhead:** Sizing application CPU to handle string templates rendering under high concurrency.

## 9. How Major Companies Implement It
- **GitHub Copilot:** Builds context by scanning open editor tabs, importing definitions from import statements, and merging local edits.
- **Salesforce:** Assembles context dynamically by pulling customer record maps from CRM systems before triggering prompt completions.

## 10. Decision Checklist (Context Assemblies)
- Use **Static Templates** when:
  - Input parameters are uniform (e.g. translating simple words).
- Use **Dynamic Context Building** when:
  - Prompt requires database facts, user history, or search context.

## 11. AI Coding-Agent Guidelines
- Decouple context building logic from API controllers, isolating prompt generation in dedicated template classes.

## 12. Reusable Checklist
- [ ] Prompt templates isolated in dedicated directories
- [ ] User input parameters sanitized and escaped
- [ ] Database context fetches restricted to active tenant credentials
- [ ] Context aggregation queries run in parallel
- [ ] Formatting guidelines and schema constraints included in templates
- [ ] Unit tests verify template assemblies under empty variables states
