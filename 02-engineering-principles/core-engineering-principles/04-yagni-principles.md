# YAGNI (You Aren't Gonna Need It)

## 1. Definition & Core Concepts

YAGNI (You Aren't Gonna Need It) is a core principle of Extreme Programming (XP) which states: "Always implement things when you actually need them, never when you just foresee that you may need them."

Core pieces:
- **Speculative Features:** Code, parameters, or configurations written because a developer assumes they will be needed in the future, rather than to satisfy current requirements.
- **Cost of Delay:** Wasting engineering time writing and debugging speculative code today, delaying the delivery of core features that are needed now.
- **Cost of Carry:** The ongoing maintenance overhead (reading, testing, refactoring) of keeping unused, speculative code in the repository.
- **Build for Change:** Designing code to be clean and modular so that features are easy to add *when* they are needed, rather than guessing requirements in advance.

## 2. Why It Exists

Developers are naturally inclined to build flexible, generic systems. However, business requirements change rapidly. Code written for "future requirements" is almost always wrong because the actual future needs diverge from what was anticipated. This results in wasted effort, bloated codebases, and rigid architectures that are hard to modify.

## 3. What Breaks in Production Without It

- **Security Risks from Dead Code:** Speculative features and unused endpoints remain in the production codebase, creating an unnecessary attack surface for exploit.
- **Complex Refactoring Blocks:** A simple requirement change requires modifying an unused, over-engineered abstraction layer (e.g. dynamic field mapper), turning a one-day task into a weekly task.
- **Silent Boot Failures:** Complex configuration loaders built to handle future multi-tenant routing fail at startup due to missing, unused properties, causing outages.
- **Inflated Memory Usage:** Unused libraries and initialization hooks loaded on startup consume server memory, reducing node performance.

## 4. Best Practices

- **Build for the Present, Design for the Future:** Write simple, clean, and tested code that satisfies today's requirements. Do not build speculative abstractions, but write code that is easy to extend when requirements evolve.
- **Do Not Abstractions in Advance:** Do not write interfaces, abstract base classes, or generic factories for implementations that do not exist. Write concrete classes first, and extract interfaces only when you actually need to swap implementations.
- **Reject "Just In Case" Database Columns:** Do not add placeholder columns (`custom_data`, `reserved_field`) to database schemas. Add columns dynamically via migrations when they are actively needed.
- **Limit Config Options:** Do not add complex configuration parameters for settings that will never vary in production. Keep configuration focused.
- **Delete Unused Code Aggressively:** If a feature is retired or code becomes dead, delete it completely. Do not comment it out or keep it "just in case we need it again." Git maintains the history if it must be retrieved.

## 5. Common Mistakes / Anti-Patterns

- **Database Swap Abstraction:** Creating an repository interface layer to allow swapping from PostgreSQL to MongoDB "just in case," adding indirection to code when the database engine is never swapped in the project's lifetime.
- **Unused API Response Fields:** Adding extra fields to JSON payloads because "front-end might need it next year."
- **Homegrown Frameworks:** Building custom routing, validation, or caching frameworks inside a project instead of using standard libraries, under the assumption that existing libraries lack future flexibility.
- **Commenting Out Dead Code:** Leaving large blocks of commented-out code in source files instead of deleting them.

## 6. Security Considerations

- **Minimizing the Attack Surface:** The safest code is the code that was never written. By strictly adhering to YAGNI, you eliminate unused code branches, unused endpoints, and excess dependencies that could contain vulnerabilities.

## 7. Performance Considerations

- **Lean Execution Footprints:** Eliminating speculative logic blocks, dynamic hooks, and redundant dependencies keeps execution paths clean, reducing CPU execution steps and memory allocation requirements.

## 8. Scalability Considerations

- **Autonomy and Simplicity:** Lean, focused microservices containing only active code are easier to scale, debug, containerize, and deploy compared to bloated services containing dead features.

## 9. How Major Companies Implement It

- **Stripe:** Releases API features incrementally based on merchant demand. They avoid building speculative multi-currency or multi-country payout options until a merchant specifically requests them, keeping their early domain models clean.
- **Google:** Employs automated scanners (like "Dead Code Eliminator" tools) that scan build dependency graphs and automatically delete unused functions, classes, and imports to keep their monorepos lean.

## 10. Decision Checklist

- Apply **YAGNI** when: Thinking of adding variables, methods, configuration parameters, database columns, or interfaces that are not strictly required by the current active user story.
- Skip YAGNI (Pre-plan structures) ONLY when: Defining foundational architectural structures (e.g. database schema migrations, basic API routing paths) where changing them later would be extremely costly.

## 11. AI Coding-Agent Implementation Guidelines

- Never generate interfaces, abstract classes, or base structures for classes that have only a single implementation.
- Always delete retired or unused functions and imports from generated code — never comment them out.
- Never add placeholder parameters or arguments to functions to handle speculative use cases.
- Always write database schemas containing only active columns required by the current features.
- Never import new dependencies to solve a future hypothetical problem — rely on native APIs or existing packages.
- Always design code to be modular (Low Coupling) so that adding new features in the future does not require refactoring core components.

## 12. Reusable Checklist

- [ ] Every line of code, parameter, and function serves an active, verified requirement
- [ ] No abstract base classes or interfaces exist for single-implementation modules
- [ ] Commented-out dead code deleted from the repository
- [ ] No placeholder columns or tables exist in the database migrations
- [ ] Third-party libraries limited to active feature dependencies
- [ ] Configuration parameters limited to settings that actively vary in production
- [ ] APIs return only the data fields required by the active clients
- [ ] Code is modular, making it simple to add new logic when needed
