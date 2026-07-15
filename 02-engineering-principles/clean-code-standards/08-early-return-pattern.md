# Early Return Pattern

## 1. Definition & Core Concepts

The Early Return Pattern (also known as the Bouncer Pattern or Guard Clauses) is a code design structure where functions evaluate unhappy paths, validation failures, or edge cases first and exit immediately (by returning or throwing) at the top of the scope, leaving the successful "happy path" flat and unnested at the bottom of the function.

Core pieces:
- **Guard Clause:** An initial conditional statement that checks for invalid arguments, null references, or error states and exits immediately.
- **Flat Hierarchy:** Structuring code to minimize the indentation level (depth) of execution branches.
- **The Happy Path:** The successful execution sequence of a function that executes when all validation preconditions are met.

## 2. Why It Exists

Standard structural programming historically advocated for a single entry and single exit point in functions, leading developers to write massive nested `if/else` loops. This creates a "Pyramid of Doom" (deep horizontal indentation) where the core business logic (happy path) is buried inside nested blocks, making the code hard to read, trace, and debug. Early return keeps the happy path flat, readable, and focused.

## 3. What Breaks in Production Without It

- **Hidden Logical Bugs:** Developers write complex nested loops. Due to high indentation levels, edge cases (e.g. what happens when a database value is null) are hidden, leading to uncaught runtime exceptions in production.
- **Maintenance Regressions:** An engineer attempts to add a check inside a deeply nested block. Because the nested context is complex, they make incorrect assumptions about available variables, introducing regressions.
- **Poor Test Coverage:** Writing test scripts that hit all nested permutations of a 5-level nested conditional is difficult, leaving deep logic paths untested.

## 4. Best Practices

- **Validate Preconditions First:** Check for null arguments, missing fields, or unauthorized requests at the very beginning of the function. Return or throw immediately if check fails.
- **Keep the Happy Path Flat:** Write the successful execution logic at the bottom level of the function indentation (no nesting).
- **Eliminate the `else` After `return`:** If an `if` block exits the function, do not write a corresponding `else` block. Write the follow-up code directly below.
  - *Bad:* `if (err) { return false; } else { doWork(); }`
  - *Good:* `if (err) { return false; } doWork();`
- **Restrict Indentation Depth:** Limit code nesting to a maximum of 2 levels of indentation. If a block requires more, extract helper functions.

## 5. Common Mistakes / Anti-Patterns

- **The Pyramid of Doom:** Wrapping the entire logic of a 100-line function inside a massive `if (user !== null)` statement, shifting all code to the right.
- **Error Handling at the Bottom:** Writing code where validation checks are at the top, but the corresponding error values or exceptions are defined at the very bottom of the function, forcing the reader to scroll down to understand what happens on failure.
- **Multiple Intertwined Returns:** Writing multiple early returns scattered throughout a long function, making it hard to track the final returned values (keep early returns clean and confined to the validation phase).

## 6. Security Considerations

- **Clear Authorization Gates:** Placing early-return permission checks (`if (!hasRole) return Forbidden;`) at the top of route controllers ensures authorization is validated before any business calculations run, preventing access bypasses.

## 7. Performance Considerations

- **Short-Circuit Evaluation:** Exiting early on validation failures avoids executing expensive database queries or memory allocations later in the function, saving system resources.

## 8. Scalability Considerations

- **Maintainable Logics:** Keeping code flat reduces the cognitive load required to read and review code, helping teams maintain uniform delivery speeds.

## 9. How Major Companies Implement It

- **Go (Golang) Community:** Enforces early return as the idiomatic language standard. In Go, almost all functions verify `if err != nil { return err }` immediately, keeping success flows completely flat.
- **Google's Style Guides:** Recommend using guard clauses to reduce indentation. They encourage refactoring nested conditions during peer reviews to maintain clean code hierarchy.

## 10. Decision Checklist

- Use **Early Return** in: Every function, route controller, class method, and script loop that requires validation checks, permissions gates, or error boundary filters.
- Skip Early Return ONLY when: Implementing complex state machines or mathematical pipelines where single-exit points are required to execute resource cleanup routines (though modern `try-finally` blocks resolve this cleanly).

## 11. AI Coding-Agent Implementation Guidelines

- Always check parameters and exit early using guard clauses at the beginning of functions.
- Never write `else` blocks after a conditional block that contains a `return` or `throw` statement.
- Always keep the main success path (happy path) at the flat, root indentation level of the function.
- Never write code blocks containing more than 2 levels of indentation nesting.
- Always position error-handling responses immediately adjacent to the validation check statement.

## 12. Reusable Checklist

- [ ] Unhappy paths (null checks, validation failures) handled first at the top of the function
- [ ] Guard clauses exit immediately via `return` or `throw`
- [ ] No `else` blocks written after a returning conditional block
- [ ] The successful happy path is flat and unnested at the bottom of the scope
- [ ] Code nesting indentation does not exceed 2 levels
- [ ] Authorization and credential checks run as initial guard clauses
- [ ] Output variables and exception statements reside directly inside the guard block
- [ ] Resource cleanups (e.g., closing streams) executed safely in `finally` blocks
