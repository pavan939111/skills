# Small Functions

## 1. Definition & Core Concepts

Small Functions is the clean-code-standards principle that states functions should be tiny — typically under 15 lines of code, and ideally between 3 to 10 lines. A function's size is a direct measure of its complexity.

Core pieces:
- **Tiny Line Counts:** Restricting function bodies to a single screen view (ideally <15 lines) to ensure the entire logic can be grasped at a single glance.
- **Minimal Cyclomatic/Cognitive Complexity:** Keeping execution paths (conditionals, loops) minimal, aiming for a cyclomatic complexity score of under 5 per function.
- **Extract Method Pattern:** The refactoring technique of taking a block of code inside a larger function and extracting it into a new, descriptively named helper function.
- **Block Indentation Extraction:** Enforcing that the blocks within `if`, `else`, `while`, and `for` statements should be exactly one line long, consisting of a call to a helper function.

*(Boundary Note: General function parameter counts and Command Query Separation belong in `02-function-design-guideline.md`. This document focuses on function size boundaries, complexity metrics, and extraction mechanics.)*

## 2. Why It Exists

Large functions (often called "God functions" or "spaghetti code") compile many responsibilities, variables, and loops into a single scope. They are hard to read, impossible to test completely, and slow down code reviews. Decomposing code into small functions makes the application self-documenting (descriptive helper names act as documentation) and ensures each method has a clear, isolated purpose.

## 3. What Breaks in Production Without It

- **Indebuggable Stack Traces:** An error occurs in production. The stack trace points to `ProcessOrder()`, a 400-line function. Because the function is so large, identifying which line or condition triggered the failure takes hours.
- **Untested Logic Paths:** A large function contains dozens of logical branches. Developers cannot construct test datasets to cover every combination, letting edge-case bugs slip into production.
- **Variable Collisions:** In a long function, variables are declared at the top and mutated throughout the scope. Developers accidentally reuse or overwrite variables, causing silent logic errors.
- **High Regression Rates:** Modifying a small feature requires editing a massive function, leading to accidental changes in unrelated behaviors within the same scope.

## 4. Best Practices

- **Target 3 to 10 Lines:** Aim to keep the majority of functions under 10 lines of code. Treat any function exceeding 20 lines as a candidate for decomposition.
- **Limit Indentation Depth:** A function should contain no more than one or two levels of indentation. Extract loops and nested `if` blocks into their own helper functions.
- **Extract Conditional Blocks:** The body of an `if` or `else` statement should be a single line that calls a helper function. This documents the condition's outcome.
  - *Bad:* `if (isValid) { // 10 lines of data processing }`
  - *Good:* `if (isValid) { processUserData(user); }`
- **Avoid Shared Scope Mutations:** Keep variables local. Small functions pass values explicitly, avoiding global or class-level mutable variables.
- **Read from Top to Bottom (Stepdown Rule):** Arrange functions in your source file so that calling functions are placed above the helper functions they invoke, matching standard reading patterns.

## 5. Common Mistakes / Anti-Patterns

- **The Monolithic Initialization Routine:** Writing a single, massive 100-line startup function to load configurations, connect databases, and spin up servers.
- **Giant Switch-Case Statements:** Writing massive switch blocks directly inside controllers to handle routing or state transitions. Extract each case into a strategy class or helper function.
- **Over-Extraction (Micro-Functions):** Extracting every single line of code into a separate function, making the codebase hard to navigate due to excessive indirection (balance smallness with logical coherence).
- **Inline String Formatting:** Mixing database queries and low-level string padding calculations in the same function scope.

## 6. Security Considerations

- **Clear Auditing Boundaries:** Small, focused functions are simple to review for security validators (e.g. verifying that input sanitization is executed before data persistence), leaving no place for vulnerability patterns to hide.

## 7. Performance Considerations

- **JIT Inlining Optimizations:** Modern JIT compilers (V8, JVM, .NET CLR) analyze code execution. They automatically inline small, simple functions (replacing the function call with the actual execution block) at runtime, eliminating call-stack overhead. Writing small functions often makes code *faster* because it aligns with compiler optimization pathways.

## 8. Scalability Considerations

- **Codebase Navigability:** Standardizing on small functions keeps files clean and readable, allowing engineering teams to merge changes with minimal conflict rates as the team scales.

## 9. How Major Companies Implement It

- **Google:** Enforces automated complexity analyzers (like cyclomatic complexity limits) in CI pipelines. Merges are automatically blocked if a developer pushes methods that exceed set complexity scores or line limits.
- **Linux Kernel Project:** Demands that functions be brief and do one thing. Code patches containing long, multi-branch functions are rejected by maintainers during review processes.

## 10. Decision Checklist

- Use **Small Functions (Decomposition)** on: All business logic components, request controllers, helper modules, database layers, and script tasks.
- Allow **Longer Monolithic Functions** ONLY when: Implementing raw mathematical equations, graphic rendering shaders, or complex state machine parsers where splitting the path degrades mathematical readability.

## 11. AI Coding-Agent Implementation Guidelines

- Always decompose generated functions so that they remain under 15 lines of code.
- Never write nested loops or nested conditionals deeper than 2 levels of indentation within a single function.
- Always extract the bodies of `if`, `else`, and loop statements into helper functions if they contain more than 2 lines of logic.
- Always arrange functions top-down, with callers positioned directly above callees.
- Never declare persistent state variables inside long procedural loops.

## 12. Reusable Checklist

- [ ] Function body is tiny (ideally <10 lines, maximum 15)
- [ ] Indentation nesting depth does not exceed 2 levels
- [ ] Conditional `if`/`else` block bodies are one-line calls to helper functions
- [ ] Functions do exactly one logical task (Single Responsibility)
- [ ] Cyclomatic complexity score of each function is low (<5)
- [ ] Code files follow the Stepdown Rule (callers above callees)
- [ ] No local variables are mutated across long, unrelated sections of code
- [ ] Unit tests test individual helper functions in isolation
