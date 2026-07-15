# Principle of Least Astonishment

## 1. Definition & Core Concepts

The Principle of Least Astonishment (POLA), also known as the Principle of Least Surprise, states that a component of a system (code interface, API, configuration, or utility) should behave in a way that matches the user's (developer's, operator's) prior knowledge and expectations. The system behavior should not surprise or astonish them.

Core pieces:
- **Predictable APIs:** Methods, arguments, and return types behave exactly as their names and standard system conventions imply.
- **Side-Effect-Free Queries:** Query methods (getters, check methods) retrieve data without modifying system state or writing to databases.
- **Consistent Conventions:** Standardizing naming and behaviors across the codebase (e.g. if one service uses `findUser(id)`, another should not use `retrieveUserRecord(id)`).
- **Explicit Failure Modes:** Throwing clear, typed exceptions rather than returning magic numbers (like `-1`, `false`, or `null`) to indicate errors.

## 2. Why It Exists

Developers rely on mental models to reason about code. When code deviates from standard patterns (e.g., a getter method that secretly executes a slow database query or updates account states), the developer's mental model breaks. This leads to programming errors, difficult-to-trace production bugs, and increased code review times.

## 3. What Breaks in Production Without It

- **Silent Database Corruption:** A developer calls `user.getSettings()` to check configuration values. Unbeknownst to them, the getter function contains side-effect code that inserts missing settings rows, causing transaction failures or unexpected database locks.
- **Thread Blockages (Slow Getters):** A conditional loop checks `if (user.isActive)` in a loop. Because the `isActive` getter executes a synchronous HTTP API check under the hood instead of checking an in-memory boolean, server threads quickly exhaust, slowing down the application.
- **Unchecked Error Propagation:** A function returns `null` or a magic number `-1` when a database connection fails, instead of throwing an exception. Consuming code assumes the call succeeded, causing downstream processes to parse invalid data and crash.
- **Config-Driven Incidents:** A configuration parameter called `TIMEOUT` expects milliseconds. A developer configures it as `30` (meaning seconds). The application sets the timeout to 30 milliseconds, causing all API calls to fail instantly in production.

## 4. Best Practices

- **Align Names with Behaviors:** Ensure method names accurately reflect what they do. If a method is called `validateInput()`, it should perform validation and return a boolean or throw. It must *never* modify database rows or send emails.
- **Keep Queries Side-Effect Free:** Getter methods and boolean checks (`isActive`, `hasPermission`) must be pure and lightweight. Never perform database inserts, writes, or network I/O inside properties or getters.
- **Standardize Return Values:** Return empty collections (e.g., `[]`, `Set.of()`) when searches yield no results, rather than returning `null` or throwing `NotFoundException`.
- **Enforce Codebase-Wide Consistency:** Standardize operations across services. Use consistent naming verbs (e.g. `create`, `update`, `delete`, `find`) and parameter signatures.
- **Fail Loudly and Explicitly:** When a failure occurs, throw a descriptive, typed exception rather than returning silent error indicators (like returning `false` for database failure).
- **Document Units in Configurations:** Explicitly name variables to include units of measure (e.g. `TIMEOUT_IN_MS`, `MAX_PAYLOAD_BYTES`) to avoid setup mistakes.

## 5. Common Mistakes / Anti-Patterns

- **Side-Effects in Getters:** Performing state changes or database mutations inside getter functions or properties.
- **Misleading Variable Names:** A variable called `isCompleted` that evaluates to `false` for successful but pending jobs, but `true` for failed jobs.
- **Magic Return Values:** Returning `-1` on search failures, or `999` to represent infinity, forcing callers to write special conditional checks.
- **Unexpected API Type Shifts:** An endpoint returning a JSON list on success, but a plain text string error message on failure, crashing JSON client parsers.

## 6. Security Considerations

- **Predictable Authorization Gating:** Security interceptors and methods must behave predictably. If a method is named `isAuthorized(user)`, developers assume it checks privileges. If it actually only checks if the user is logged in (but not their role), developers will use it incorrectly, exposing access vulnerabilities.

## 7. Performance Considerations

- **Property Latency Contraction:** Avoid performing heavy operations (like XML parsing or JSON serialization) inside properties or accessor methods. Keep properties fast to prevent CPU starvation in loops.

## 8. Scalability Considerations

- **Lower Cognitive Load:** Predictable code makes the system simple to maintain, refactor, and scale across growing developer teams, minimizing human error rates during code integrations.

## 9. How Major Companies Implement It

- **AWS SDK Designers:** Maintain strict API design guidelines. Every service SDK conforms to uniform method naming (e.g. `Describe*`, `List*`, `Put*`), pagination parameters, and exception models, ensuring developers can use any AWS SDK intuitively.
- **Google's Style Guides:** Mandate that getters must be fast and side-effect free. Any operation that requires heavy calculation or IO must be named as a standard verb method (e.g., `calculateTotals()` or `fetchDbRecords()`) rather than a property.

## 10. Decision Checklist

- Enforce **Principle of Least Astonishment** on: Every public API definition, service interface, configuration key naming, and shared utility class.
- Skip POLA considerations ONLY when: Writing intentionally obfuscated code for security/licensing validation checks (where surprising/misleading hackers is a goal).

## 11. AI Coding-Agent Implementation Guidelines

- Always name variables, functions, and parameters to explicitly describe their contents and behavior.
- Never write write operations or network calls inside getter methods or properties.
- Always return empty collections instead of `null` values when database query outputs are empty.
- Always include measurement units in configuration keys (e.g., `CACHE_TTL_IN_SEC`).
- Never use magic number error indicators — throw explicit exceptions for error states.
- Always keep API response structures uniform across success and failure results.

## 12. Reusable Checklist

- [ ] Method names match their execution actions (no hidden operations)
- [ ] Accessors and getters are lightweight and contain no side-effects (no DB/API writes)
- [ ] Configuration variable names include units of measure (e.g., `TIMEOUT_MS`)
- [ ] No magic numbers (e.g., `-1`, `999`) used as return values or status flags
- [ ] Empty database or collection searches return empty arrays/sets, not `null`
- [ ] Method naming verbs consistent across the entire codebase
- [ ] Exceptions thrown explicitly on system failures
- [ ] API responses maintain consistent JSON structure across success and error outcomes
