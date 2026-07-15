# Function Design

## 1. Definition & Core Concepts

Function Design is the clean-code-standards discipline of writing methods and functions that are small, focused, and perform a single logical task with minimal side-effects.

Core pieces:
- **Smallness:** Functions should be brief (ideally under 20 lines) and have minimal nesting.
- **Single Responsibility Principle (SRP) at Function Level:** A function should do one thing, do it well, and do it only.
- **One Level of Abstraction:** All statements inside a single function must operate at the same level of conceptual abstraction (e.g. not mixing high-level business workflow statements with low-level string splitting).
- **Command Query Separation (CQS):** A function should either be a command (perform an action, mutating state) or a query (retrieve data and return it, side-effect free), but never both.
- **Minimal Arguments:** Bounding the number of function parameters:
  - *Niladic:* 0 arguments (ideal).
  - *Monadic:* 1 argument.
  - *Dyadic:* 2 arguments.
  - *Triadic:* 3 arguments (avoid where possible).
  - *Polyadic:* 4+ arguments (requires refactoring into parameter objects).

## 2. Why It Exists

Large, multi-purpose functions are difficult to read, test, and maintain. When a function executes many unrelated tasks, changing one detail risks breaking other unrelated behaviors. Small, single-purpose functions are simple to isolate in unit tests, have predictable execution flows, and reduce cognitive load.

## 3. What Breaks in Production Without It

- **Untestable Edge Cases:** A 150-line function contains multiple nested conditionals. It is impossible to write unit tests that cover all execution branches, allowing logic bugs to leak to production.
- **Silent State Corruption (Violating CQS):** A query function named `getUserProfile()` secretly updates a "last-accessed" timestamp in the database. When called in a read-only transaction loop, it triggers write lockups.
- **Flag Parameter Collateral Damage:** Passing a boolean flag (e.g. `save(user, true)`) to trigger secondary behaviors. A developer misinterprets the flag's purpose, leading to unintended database modifications.
- **Thread Blockages:** A function mixes CPU-bound calculations with blocking disk I/O, stalling application worker threads.

## 4. Best Practices

- **Enforce Smallness:** Keep functions under 20 lines of code. If a function is longer, it is likely doing more than one thing and should be split.
- **Apply the Stepdown Rule:** Organize code so that functions read like top-down narrative prose. Every function should be followed by the helper methods that it calls.
- **Maintain a Single Abstraction Level:** Do not mix high-level business domain methods (e.g. `chargeCard()`) with low-level implementation details (e.g., parsing raw regex or trimming whitespace) in the same function scope.
- **Enforce Command Query Separation (CQS):** Ensure query functions have no side-effects and modify no state. Ensure command functions return `void`/`null` or execution status, but not query data.
- **Eliminate Flag Arguments:** Never pass a boolean flag to a function to toggle its behavior. Split it into two distinct, descriptive functions (e.g. instead of `render(isHtml)`, write `renderHtml()` and `renderText()`).
- **Wrap Multi-Parameters in Objects:** If a function requires more than 3 parameters, consolidate them into a single typed config object or class (Parameter Object pattern).

## 5. Common Mistakes / Anti-Patterns

- **The Swiss Army Knife Function:** A function that validates input, updates the database, sends an email, and formats a response in one scope.
- **Boolean Flag Parameters:** Passing booleans (e.g., `processPayment(order, true)`) to modify internal control flows.
- **Output Arguments:** Passing an object into a function to be mutated as a way of returning data, which confuses readers. Pass input and return new output instead.
- **Deep Nesting (Pyramid of Doom):** Writing functions with nested `if`, `for`, and `try` blocks beyond 2 levels of indentation.

## 6. Security Considerations

- **Clear Validation Boundaries:** Bounded functions with distinct parameters are simple to audit for security checks, ensuring validation logic is not bypassed in complex routing pathways.

## 7. Performance Considerations

- **Microsecond Call Stack Overhead:** Decomposing code into many small functions adds minor call-stack framing overhead. In 99% of web backends, this cost is completely unmeasurable, and JIT compilers inline hot methods automatically. Prioritize clean structure over premature loop flattening.

## 8. Scalability Considerations

- **Modular Refactoring:** Small, highly focused functions make it simple to refactor code blocks into separate classes, modules, or services as requirements grow.

## 9. How Major Companies Implement It

- **Google's Code Guidelines:** Mandate short functions with strict cyclomatic complexity limits. Code reviews block merges if a single method performs multiple responsibilities or contains nested indentation blocks.
- **Linux Kernel Style Guides:** Advocate that functions should be brief, do one thing, and fit comfortably on a single screen page.

## 10. Decision Checklist

- Enforce **Clean Function Design** rules on: All business logic services, helper utilities, data transformers, and API controller methods.
- Allow **Longer Monolithic Functions** ONLY when: Implementing highly specialized, linear mathematical algorithms or compiler parser generators where splitting the execution path breaks code flow or increases complexity.

## 11. AI Coding-Agent Implementation Guidelines

- Always limit generated function lengths to under 20 lines of code.
- Never use boolean parameter flags to toggle a function's logical branches — write separate functions instead.
- Always verify that all lines of a function operate at the same level of abstraction.
- Never write functions containing more than 3 parameters — wrap them in parameter objects.
- Always separate data modification operations (commands) from retrieval operations (queries).
- Never use output arguments to mutate parameter objects — return a new instance instead.

## 12. Reusable Checklist

- [ ] Functions are short (ideally <20 lines) and fit on a single screen
- [ ] Functions do one thing and do it completely (Single Responsibility)
- [ ] Indentation nesting depth does not exceed 2 levels
- [ ] No boolean flag parameters used to branch internal function logic
- [ ] Function arguments limited to maximum 3 (Parameter Objects used for 4+)
- [ ] One level of abstraction maintained throughout the function body
- [ ] Command Query Separation (CQS) respected (queries have zero side-effects)
- [ ] Code reads top-down following the Stepdown Rule
