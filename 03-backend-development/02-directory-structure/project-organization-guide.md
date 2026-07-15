# Structure Checklist

## 1. Definition & Core Concepts
The Structure Checklist is an operational gate checklist used to audit and verify that a backend repository's directory layout, file naming casing, module boundaries, and layering schemes conform to architectural standards.

## 2. Why It Exists / What Problem It Solves
As multiple developers contribute to a codebase, directory layouts and naming conventions tend to drift, leading to folder bloat and tight coupling. The structure checklist provides a gate check to enforce layout standards.

## 3. What Breaks in Production Without It
- **Build and Run Failures:** case-sensitivity import bugs crash deployments because naming rules were not validated on dev environments.
- **Dependency Entanglement:** Modules import code across boundary files, making it impossible to scale or isolate services.

## 4. Best Practices
- **Automate Structure Audits:** Use linter tools (like Dependency Cruiser or ESLint import limits) to programmatically block imports that bypass boundaries.
- **Enforce naming reviews during PRs:** Require pull request code reviews to check naming casing conformity before merges.
- **Refactor Early:** Split folders that grow beyond 20 files into separate feature subdirectories.

## 5. Common Mistakes / Anti-Patterns
- **Ignoring structure drift:** Letting developers commit ad-hoc folder conventions to save time, creating technical debt.
- **Using complex import overrides:** Configuring complex import mapping aliases that confuse compilation checkers.

## 6. Security Considerations
- **Boundary Audits:** Confirm that directory layouts keep configuration files and security credentials isolated from public routing layers.

## 7. Performance Considerations
- **Optimized Compilation Scans:** Standardized layouts speed up compiler scans, reducing build times.

## 8. Scalability Considerations
- **Decoupled Folder Structures:** Modular folder designs allow teams to partition codebases easily when splitting monoliths into microservices.

## 9. How Major Companies Implement It
- **Netflix:** Applies automated pipeline rules that block PR merges if file imports violate structural module boundaries.

## 10. Decision Checklist (Structure Sign-off)
- Approve **Directory Structure Sign-off** when:
  - Casing matches naming conventions, files reside in standard folders, and imports respect layer boundaries.
- Reject **Directory Structure Sign-off** when:
  - Circular imports exist, files are named inconsistently, or database imports bleed into controller folders.

## 11. AI Coding-Agent Guidelines
- Write tests or run linter commands that validate module import boundaries and check for case-sensitivity import conflicts.

## 12. Reusable Checklist
- [ ] File names conform to kebab-case guidelines without case mismatches
- [ ] Directory layout matches the chosen pattern (layered/modular/clean)
- [ ] Module import boundaries respected (no circular imports)
- [ ] Path aliases (e.g. @src/...) active to prevent relative import paths
- [ ] Build files target separate, git-ignored distribution folders
- [ ] Code linters configured to check file layout and naming casings
- [ ] Database credentials isolated from public static folders
