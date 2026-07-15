# Meaningful Naming

## 1. Definition & Core Concepts

Meaningful Naming is the clean-code-standards discipline (popularized by Robert C. Martin's *Clean Code*) of choosing names for variables, functions, arguments, classes, packages, and source files that explicitly reveal their intent, structure, and domain significance.

Core pieces:
- **Intention-Revealing Names:** A name must tell you why it exists, what it does, and how it is used. If a name requires a comment to explain it, the name is not meaningful.
- **Pronounceable & Searchable Names:** Choosing names that fit natural verbal discussion and are easily located using standard IDE global search tools.
- **Noun Classes & Verb Methods:** Naming classes after nouns or noun phrases (e.g., `UserAccount`, `InvoiceRepository`) and methods after verbs or verb phrases (e.g., `save()`, `calculateTotal()`).
- **Domain-Specific Terminology:** Using terms consistent with the business domain (Ubiquitous Language) and software design patterns.

## 2. Why It Exists

Naming is the primary communication mechanism in source code. Code is read significantly more often than it is written. Vague, misleading, or short names force readers to scan the implementation details of surrounding lines to guess what a variable represents, increasing cognitive load and bug rates.

## 3. What Breaks in Production Without It

- **Accidental Logic Corruption:** A developer modifies a conditional check that uses variables named `d` and `days`. They assume `d` represents "days", but it actually represented "date of creation" in milliseconds, leading to transaction routing bugs.
- **Code Review Blindness:** Code reviews fail to spot logical flaws because variables are named with generic words (e.g., `temp`, `data`, `obj`), obscuring the business data flow.
- **Search and Replace Disasters:** An engineer attempts to rename a globally used status variable named `id`. Because the name is too generic, the global refactor replaces unrelated properties, breaking builds.
- **Domain Mismatch Bugs:** Developers name code concepts differently from what the business or client apps call them, leading to miscommunications that result in incorrect code assumptions.

## 4. Best Practices

- **Choose Intention-Revealing Names:** Instead of `int d;`, use `int daysSinceLastLogin;` or `int elapsedDays;`.
- **Avoid Single-Letter Variables:** Use single-letter names (`i`, `j`, `k`) only as loop counters inside tiny, local blocks. Never use them for persistent variables or arguments.
- **Eliminate Noise Words:** Avoid redundant suffix and prefix clutter. Use `User` instead of `UserObject` or `UserDataInfo`. Avoid encoding types in names (e.g. use `users` instead of `userList` or `userArray`).
- **Use Consistent Verbs:** Select one verb for each abstract concept. If you use `fetch` to retrieve data from a database, use it everywhere. Do not mix `fetch`, `retrieve`, `get`, and `lookup` across different classes.
- **Avoid Misleading Abbreviations:** Do not abbreviate names to save keystrokes (e.g., using `cnt` instead of `count`, or `cust` instead of `customer`). Keystrokes are cheap; developer reading time is expensive.
- **Format According to Language Idioms:** Adhere to language-specific casing rules (e.g., camelCase for variables in JavaScript, snake_case in Python, PascalCase for classes in C#/Java).

## 5. Common Mistakes / Anti-Patterns

- **Obfuscated Abbreviations:** Using names like `modDate` instead of `modifiedAt`, or `genInvoice` instead of `generateInvoice`.
- **Hungarian Notation:** Prefixing variable names with type indicators (e.g., `strName`, `iCount`, `bActive`), which is obsolete in modern typed languages.
- **The "Temp" Variable Trap:** Naming variables `temp`, `data`, or `value` inside long functions, forcing the reader to track the value lifecycle to understand its meaning.
- **Misspelled Names:** Pushing misspelled variables (e.g. `receiveTransaction`) that break search indexing and look unprofessional.

## 6. Security Considerations

- **Secure Naming Contexts:** Ensure variable names do not expose system internal configurations (e.g. naming an internal API key variable `BYPASS_AUTH_KEY`), giving attackers hints if code stacks are printed in error logs.

## 7. Performance Considerations

- Naming is completely abstracted during compilation and packaging (for compiled/minified languages). There is zero runtime performance penalty for using long, descriptive variable names. Prioritize readability.

## 8. Scalability Considerations

- **Developer Onboarding Speed:** Clear, descriptive naming conventions allow new engineers to read and understand code flows quickly, scaling development speed without requiring constant explanation meetings.

## 9. How Major Companies Implement It

- **Google:** Enforces strict code style guides that dictate naming rules down to spelling and acronym capitalization (e.g. using `XmlHttpRequest` instead of `XMLHTTPRequest`). They mandate peer reviews specifically targeting naming accuracy.
- **Stripe:** Designs public API interfaces with meticulous naming precision. Every parameter, attribute, and endpoint is reviewed for semantic clarity, ensuring their developer-facing interfaces are intuitive.

## 10. Decision Checklist

- Enforce **Meaningful Naming Rules** on: All code elements, database schemas, API parameters, configurations, and repository folder names.
- Skip Detailed Naming ONLY when: Writing quick local scratchpad scripts that will be deleted within hours.

## 11. AI Coding-Agent Implementation Guidelines

- Always choose descriptive, self-documenting names for variables, arguments, and methods.
- Never use abbreviations to shorten name lengths (e.g., write `customer` instead of `cust`).
- Always name classes using nouns (PascalCase) and functions/methods using verbs (camelCase or snake_case).
- Never include structural type suffixes in variable names (e.g., write `users` instead of `usersList`).
- Always check and conform to the naming casings of the target language.
- Never use generic names (e.g., `data`, `temp`, `obj`, `res`) inside function scopes.

## 12. Reusable Checklist

- [ ] Variable names reveal intent clearly without comments
- [ ] No single-letter names used (except local loop counters)
- [ ] Class names are nouns/noun phrases; method names are verbs/verb phrases
- [ ] Language-specific casing standards followed (e.g. camelCase vs snake_case)
- [ ] No type indicators or Hungarian prefixes in names (e.g., no `strValue`, `intLimit`)
- [ ] Naming verbs are consistent across classes (no mixing `get`/`fetch`/`retrieve`)
- [ ] No abbreviations used (e.g., `modifiedAt` instead of `modDate`)
- [ ] Noise words (`Object`, `Info`, `Data`) omitted from class and variable names
