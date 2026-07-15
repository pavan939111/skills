# Code Formatting

## 1. Definition & Core Concepts

Code Formatting is the practice of maintaining a consistent visual layout and style of source code (indentation, spacing, line breaks, brace placement, line length, and import sorting) to maximize readability.

Core pieces:
- **Automated Formatters:** Tools that parse and rewrite source code to conform to a defined style schema (e.g., Prettier, Black, GoFmt, RustFmt, ClangFormat).
- **Style Rules Configuration:** Version-controlled configuration files (e.g., `.prettierrc`, `pyproject.toml`) that dictate the team's style standards.
- **Line Length Limits:** Restricting code line length (typically 80 or 120 characters) to ensure code can be read comfortably on standard monitors without horizontal scrolling.
- **Import Ordering:** Sorting import statements alphabetically and grouping them by scope (standard libraries, third-party packages, internal modules).

## 2. Why It Exists

Code readability is directly linked to visual consistency. When developers write code using different formatting styles (e.g., mixing spaces and tabs, placing braces on new lines, writing 300-character single-line statements), the codebase becomes visually noisy. Formatting debates slow down peer reviews, and unformatted git diffs obscure the actual logical changes.

## 3. What Breaks in Production Without It

While formatting does not directly cause application runtime failures, it leads to:
- **Obscured Bugs in PRs:** A developer commits a small bug fix alongside hundreds of lines of auto-reformatted whitespace changes. Peer reviewers miss the bug because it is buried in formatting noise.
- **Vulnerability Injection during Merge Conflicts:** Inconsistent formatting generates false merge conflicts during integration, leading to human errors when resolving conflicts.
- **Maintenance Drag:** Developers waste time manually formatting lines or arguing about brackets styles during code reviews rather than focusing on business logic.

## 4. Best Practices

- **Automate Formatting Completely:** Never format code manually. Use standard formatting libraries (e.g., Prettier for JS/TS, Black for Python, gofmt for Go) and configure IDEs to auto-format on save.
- **Enforce Gating in CI:** Integrate a formatting check stage in the CI/CD pipeline (e.g. `prettier --check .`) to reject any pull request containing unformatted files.
- **Limit Max Line Length:** Enforce a strict line limit (default to 120 characters) in your formatter settings to prevent long horizontal statements.
- **Separate Formatting from Logic in PRs:** If a file requires major reformatting, commit the formatting changes in a separate pull request *before* writing logical modifications. Never mix formatting sweeps and business logic changes in the same commit.
- **Sort Imports Alphabetically:** Sort import lists to quickly locate dependencies and prevent duplicate imports. Use import sorting plugins in formatters.
- **Commit Formatting Rules to Version Control:** Always keep `.prettierrc`, `.editorconfig`, or equivalents in the root of the repository.

## 5. Common Mistakes / Anti-Patterns

- **Formatting Wars in Code Reviews:** Developers wasting time arguing about tabs vs spaces, trailing commas, or bracket placement. Establish a standard, automate it, and move on.
- **Bypassing Formatter Checks:** Using git options like `--no-verify` to bypass local pre-commit hooks and push unformatted code.
- **Manual Spaces Alignment:** Aligning variable assignments horizontally using manual spaces. This is hard to maintain and gets broken by auto-formatters.
- **Mixing Tabs and Spaces:** Mixing indentation characters in the same file, causing rendering issues in different code editors.

## 6. Security Considerations

- **Auditable Structures:** Cleanly formatted, consistent code is easier to scan using static analysis security tools (SAST) and manual security reviews, ensuring vulnerability patterns stand out.

## 7. Performance Considerations

- Code formatting has zero runtime performance impact. Compilers and minifiers strip comments and formatting before execution. Prioritize readability.

## 8. Scalability Considerations

- **Repository Scaling:** As teams scale, standardized code formatting ensures that files written by different engineers look identical, maintaining repository cohesion.

## 9. How Major Companies Implement It

- **Go (Golang) Community:** Standardized the `go fmt` tool from day one. All Go code globally is formatted identically, eliminating style debates.
- **Google:** Mandates automated formatting on check-in. Code review tools automatically refuse review requests if the diff deviates from the organization's automated formatting profiles.

## 10. Decision Checklist

- Use **Automated Code Formatting** on: Every software repository, code project, and script directory from day one.
- Skip Formatter Enforcement ONLY when: Editing third-party vendor library files stored vendor-side, or writing throwaway scratch files.

## 11. AI Coding-Agent Implementation Guidelines

- Always check for existing formatter config files in the workspace and format generated code to match their rules.
- Never write lines of code that exceed 120 characters in length.
- Always organize and sort imports alphabetically.
- Never commit formatting-only modifications inside commits that contain functional business logic edits.
- Always use standard formatting blocks (like spaces instead of tabs if specified by the project style).

## 12. Reusable Checklist

- [ ] Formatter configuration file committed to repository root
- [ ] Code formatting checks integrated into CI/CD pipeline (fails on violations)
- [ ] Format-on-save configured in developer workspace settings
- [ ] Maximum line length limited to 80 or 120 characters in formatter settings
- [ ] Imports sorted alphabetically and grouped by scope
- [ ] Indentation uses spaces or tabs consistently (no mixing)
- [ ] No formatting-only changes mixed with business logic in the same PR
- [ ] Code has zero manual horizontal alignments
