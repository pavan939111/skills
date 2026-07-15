# Self-Documenting Code

## 1. Definition & Core Concepts

Self-Documenting Code is the practice of writing source code that is so clear, expressive, and well-structured that its intent, design, and execution flow can be understood directly without the need for explanatory inline comments.

Core pieces:
- **Intention-Revealing Constructs:** Using variable and function names that explain *what* they represent and *why* they exist.
- **Replacing Comments with Functions:** Extracting complex logical blocks or conditional checks into helper functions with descriptive names (e.g. replacing `// check if user can post` with `if (user.canPost())`).
- **Explaining Variables:** Storing complex boolean calculations in well-named local variables to break down conditionals.
- **Strong Typing & Enums:** Using types, interfaces, and enums to document valid parameters and return types at the compiler level.

## 2. Why It Exists

Comments can lie. As code is modified and refactored over time, developers frequently update the code logic but forget to update the corresponding comments. This leads to outdated, misleading comments that cause developers to make incorrect assumptions. Self-documenting code ensures that the "documentation" (the code itself) is always accurate and in sync with reality.

## 3. What Breaks in Production Without It

- **Logical Misunderstandings (Drift):** A comment reads `// checks if account is active`. A developer modifies the underlying code to check if the account is `active OR trial`. They leave the comment unchanged. A later developer reads the comment, assumes it only checks active users, and writes billing code that incorrectly bills trial users.
- **Bypassed Validations:** A method takes generic parameters (`data: any` or a raw string list). Callers pass incorrect types, leading to runtime exceptions because the code contract was not self-documented via types.
- **Cluttered Codebases:** Files are filled with massive blocks of comments that explain poor code structure, making files twice as long and hard to read, hiding bugs.
- **Outdated Workaround Bugs:** Inline comments document a workaround for a library bug. The library is upgraded, but the workaround remains in code because the comment was ignored, slowing performance.

## 4. Best Practices

- **Show, Don't Tell:** Write code that reads like natural prose. If you feel the need to write an inline comment to explain what a block does, extract that block into a function named after the comment instead.
  - *Bad:* `// check if order is eligible for free shipping` followed by `if (order.total > 50 && order.items < 10) ...`
  - *Good:* `if (order.isEligibleForFreeShipping()) ...`
- **Use Explaining Variables:** Break up complex math or conditional expressions by assigning segments to descriptive constants.
- **Document "Why", Not "What":** Write comments only to document non-obvious design decisions, workarounds for external bugs, business logic constraints, or regulatory requirements. Never write comments explaining *how* standard code syntax works.
- **Leverage Types and Enums:** Use strict interfaces, type definitions, and enums instead of raw strings and generic objects. Types enforce contracts at compile time, documenting inputs.
- **Delete Commented-Out Code:** Never commit commented-out code blocks. They clutter files and confuse readers. Rely on git history to retrieve old code.

## 5. Common Mistakes / Anti-Patterns

- **Restating the Code in Comments:** Writing comments that merely translate syntax (e.g. `// check if customer is null` above `if (customer === null)`).
- **The "Apology" Comment:** Writing a comment to apologize for bad naming or poor structure (e.g. `// Sorry, this is a hack to get billing working, will refactor later`) instead of fixing the code.
- **Outdated Design Docs in Comments:** Writing long essays explaining class design that eventually drifts from the actual implementation. Keep design docs in markdown files, not source code.
- **Using Comments to Track History:** Leaving comments like `// Edited by John on 12/05/2024` or `// V2 changes`. Use Git for version history tracking.

## 6. Security Considerations

- **Clear Authorization Auditing:** Secure operations (like role verification) must be self-documenting. If authorization checks are hidden inside complex, comment-explained helper methods, security auditors cannot easily verify they are applied to all routes.

## 7. Performance Considerations

- **No Compiler Overhead:** Compilers and build bundlers strip comments and type definitions completely during build. Writing self-documenting code has zero runtime performance impact. Prioritize readability.

## 8. Scalability Considerations

- **Consistent Onboarding:** Codebases that are self-documenting require less explanation and training for new developers, reducing onboarding time and human errors as teams grow.

## 9. How Major Companies Implement It

- **Google's Style Guides:** Mandate that comments should only explain things that are not obvious from the code. Google code reviews require developers to refactor code to be self-documenting before adding comments, and block check-ins containing commented-out code blocks.
- **Stripe:** Designs APIs and SDKs where parameter names and objects are self-documenting, allowing developers to use Stripe features using IDE autocomplete hints without constantly reading documentation pages.

## 10. Decision Checklist

- Enforce **Self-Documenting Code** on: All production code, database entities, API contracts, helper utilities, and test suites.
- Use **Code Comments** ONLY when: Documenting workarounds for external library bugs, explain complex mathematical formulas (e.g. physics engine calculations), or recording complex business/legal constraints.

## 11. AI Coding-Agent Implementation Guidelines

- Always write code that is self-explanatory — avoid writing inline comments that translate standard syntax.
- Always extract complex boolean conditions into descriptively named variables or helper functions.
- Never commit blocks of commented-out code.
- Always use enums and strong type interfaces instead of raw strings or generic object types.
- Always write comments explaining *why* a design decision was made if it deviates from standard patterns.
- Never write "apology" comments — refactor poor code immediately instead.

## 12. Reusable Checklist

- [ ] Code reads like natural prose; no comments required to explain syntax
- [ ] Complex conditionals replaced with named boolean variables or helper functions
- [ ] Comments limited to documenting *why* (decisions, constraints, bug workarounds)
- [ ] No commented-out dead code blocks committed to repository
- [ ] Type interfaces and enums used to document API parameters and status values
- [ ] No "apology" comments written (bad code refactored instead)
- [ ] No history tracking or author name comments in files (Git used instead)
- [ ] Naming choices reveal intent, eliminating the need for explanatory labels
