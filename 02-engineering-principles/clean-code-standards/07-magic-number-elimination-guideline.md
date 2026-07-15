# Magic Number Elimination

## 1. Definition & Core Concepts

Magic Number Elimination is the clean-code-standards practice of replacing unnamed, literal numerical values or string constants in source code with descriptively named constants, enums, or configuration variables.

Core pieces:
- **Magic Number:** Any raw numeric literal (e.g., `86400`, `3.14`, `10`) embedded directly in calculation or conditional statements without explanation.
- **Magic String:** Any raw string literal (e.g., `'active'`, `'admin'`) used repeatedly in comparison or routing statements, increasing the risk of typographical errors.
- **Named Constants:** Variables declared as read-only constants whose names clearly explain their value (e.g., `SECONDS_IN_A_DAY = 86400`).
- **Enums:** Groupings of related constants (e.g. `OrderStatus.PENDING`) that restrict variable assignments to defined values.

## 2. Why It Exists

Unnamed literals are opaque. A developer reading `if (user.status === 3)` or `sleep(3600)` must guess what `3` and `3600` represent. If that value needs to change, the developer must locate and edit every occurrence in the codebase. If they miss one, the application enters an inconsistent state, leading to silent production failures.

## 3. What Breaks in Production Without It

- **Typographical Code Drift (Magic Strings):** A developer compares a status string using a typo (e.g., `if (job.status === 'compelted')` instead of `'completed'`). The check silently evaluates to `false` forever, bypassing clean-up logic and leaving dead jobs in the system.
- **Divergent Constant Values:** The value `86400` (seconds in a day) is hardcoded in five different caching files. A requirement changes to cache for 12 hours instead. The developer updates four files but misses the fifth, causing data drift.
- **Misconfigured Timeouts:** A hardcoded network timeout is set as `30` in code. The developer assumed it meant seconds, but the underlying library expects milliseconds. The connection times out in 30 milliseconds, causing API requests to fail.
- **Undebuggable Database Values:** Relational database tables store status values as integers (`1`, `2`, `3`). Because the code maps these values inline (e.g., `if (state === 2)`), it is impossible to understand SQL data exports without a lookup manual.

## 4. Best Practices

- **Replace Literals with Named Constants:** Instead of `sleep(1800)`, use `const CACHE_TTL_IN_SECONDS = 1800; sleep(CACHE_TTL_IN_SECONDS);`.
- **Use Enums for State Lists:** Use enums or union types (e.g. `OrderStatus.CANCELLED`) rather than raw string comparisons.
- **Centralize Shared Constants:** Place global values (e.g., tax constants, pagination defaults) in a dedicated `constants.ts` or `enums.py` file.
- **Define Constants Near Usage if Private:** If a constant is used only within a single class or file, declare it at the top of that file as a private static constant.
- **Name Constants Descriptively:** Make names self-explanatory and include units of measure (e.g., `MAX_LOGIN_ATTEMPTS = 5`, `MAX_FILE_SIZE_BYTES = 10485760`).
- **Allow Zero/One Exceptions:** The numbers `0` and `1` are generally acceptable as raw literals when used as index boundaries, loop initializations, or standard math offsets.

## 5. Common Mistakes / Anti-Patterns

- **Inline Status Codes:** Using raw integers to track business states in code (e.g. `if (order.status === 4)`).
- **Duplicating Constants Locally:** Declaring `const TIMEOUT = 5000;` in five separate files instead of exporting it from a single config helper.
- **Too Generic Constant Names:** Naming constants `NUMBER` or `VALUE` which tells the reader nothing.
- **Using Magic Strings for Permissions:** Comparing user roles using raw strings inline (`if (user.role === 'admin')`).

## 6. Security Considerations

- **Authorization Gating Hardening:** Using enums/constants for role-based access control (e.g. `Role.ADMIN` instead of string `'admin'`) prevents authorization bypass vulnerabilities caused by character casing mismatches (e.g. `'Admin'` vs `'admin'`).

## 7. Performance Considerations

- **Compiler Inlining:** Modern compilers and runtimes inline static constants at compile time. There is zero runtime performance penalty for using named constants. Prioritize readability.

## 8. Scalability Considerations

- **Single Source of Truth Updates:** Replacing magic numbers ensures that updating core parameters (like interest rates or timeout thresholds) requires changing only one constant file, ensuring fast deployments.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict string-enum payloads in their API contracts. Every status, error code, and category is defined statically in type definitions, ensuring SDK clients compile-check inputs before calling endpoints.
- **Google's C++/Java Guides:** mandate that any number other than 0 or 1 must be declared as a named constant. Static analyzer checks automatically block PRs containing hardcoded literals in calculation logic.

## 10. Decision Checklist

- Use **Named Constants & Enums** for: All configuration parameters, status codes, timeouts, pagination limits, regex patterns, mathematical constants, and user roles.
- Allow **Literal Numbers (0, 1)** ONLY for: Initializing loops, checking array lengths (`length === 0`), or offset index math (`index - 1`).

## 11. AI Coding-Agent Implementation Guidelines

- Never write raw numbers (except 0 and 1) or string literals in comparison statements — assign them to constants.
- Always use enums or typed union definitions for state and status variables.
- Always append units of measure suffixes to constants representing time or capacity limits (e.g., `_MS`, `_BYTES`).
- Never duplicate constant declarations across multiple files — centralize shared values.
- Always declare private constants at the top of the file scope rather than inlining them.

## 12. Reusable Checklist

- [ ] All literal numbers (except 0 and 1) replaced with named constants
- [ ] Comparison strings and status variables managed via enums/union types
- [ ] Shared constants centralized in a single module or configuration file
- [ ] Private constants defined at the top of the file scope
- [ ] Constant names include units of measure (e.g., `TIMEOUT_MS`, `LIMIT_BYTES`)
- [ ] No hardcoded numbers exist in SQL database queries or domain model states
- [ ] Role comparisons use defined enum states (no raw role strings)
- [ ] Constants are read-only (e.g., `const`, `readonly`, `final`)
