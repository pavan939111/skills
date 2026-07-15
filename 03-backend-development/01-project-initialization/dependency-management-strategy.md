# Dependency Management

## 1. Definition & Core Concepts
Dependency Management is the practice of declaring, locking, organizing, and updating third-party libraries (packages) imported into the backend codebase.

## 2. Why It Exists / What Problem It Solves
Software products reuse code from open-source libraries. Dependency management prevents version mismatch issues ("it worked on my machine") and ensures that container builds use identical, verified versions of library files.

## 3. What Breaks in Production Without It
- **Build Failures:** Deployment pipelines crash because a dependency version was updated upstream with breaking changes.
- **Silent Runtime Errors:** Applications crash in production due to transitively loaded package conflicts.
- **Security vulnerabilities:** Outdated or malicious packages are deployed to production without audits.

## 4. Best Practices
- **Use Lockfiles:** Always commit package lockfiles (e.g. package-lock.json, poetry.lock, go.sum) to Git.
- **Pin Direct Dependencies:** Explicitly declare exact package version numbers rather than using range characters (like ^ or *).
- **Implement Automated Scanners:** Use automated security dependency checkers (like Snyk, Dependabot) in build pipelines.

## 5. Common Mistakes / Anti-Patterns
- **Git-ignoring lockfiles:** Omitting lockfiles from repositories, leading to deployment builds installing different package versions.
- **Bloating the codebase:** Importing large, heavy packages for small features that could be written locally in a few lines.

## 6. Security Considerations
- **Supply Chain Attacks:** Attackers hijack popular open-source packages to inject malware. Verify downloads using checksums and lockfiles.

## 7. Performance Considerations
- **Sub-dependency Bloat:** Inspect dependency trees regularly to prune bloated transitive dependencies that increase container sizes and cold-start times.

## 8. Scalability Considerations
- **Internal Package Registries:** Use private package registries (e.g. Artifactory, AWS CodeArtifact) to cache libraries, preventing build stalls during public repository outages.

## 9. How Major Companies Implement It
- **Google:** Manages dependencies using a monorepo structure with automated check scripts, ensuring that all microservices use validated, unified package versions.

## 10. Decision Checklist (Package Pinning)
- Use **Strict Lockfile Pinning** when:
  - Deploying production microservices, secure payment interfaces, and enterprise banking APIs.
- Use **Flexible Semantic Versions (Staging/Dev)** when:
  - Running initial research experiments, prototype scripts, or local testing suites.

## 11. AI Coding-Agent Guidelines
- Always install packages using strict lockfile commands (e.g. 
pm ci or poetry install) in CI/CD pipeline script files.

## 12. Reusable Checklist
- [ ] Direct dependencies explicitly version-pinned in package lists
- [ ] Lockfiles committed to Git tracking exact package trees
- [ ] Security scanners (Snyk/Dependabot) active on code repositories
- [ ] License compliance checked to ensure open-source packages support commercial use
- [ ] Private package caches configured to protect against public registry outages
- [ ] Transitive dependencies pruned and audited periodically
