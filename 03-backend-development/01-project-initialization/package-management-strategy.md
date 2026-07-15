# Package Management

## 1. Definition & Core Concepts
Package Management is the operational execution of installing, upgrading, removing, and auditing software packages within the development environment using CLI tools (e.g. 
pm, pip, 
pm-cli, poetry, 
uget, cargo).

## 2. Why It Exists / What Problem It Solves
Package managers automate the retrieval and configuration of external files, handling nested dependency trees, managing project script shortcuts, and keeping package manifests updated.

## 3. What Breaks in Production Without It
- **Manual Config Scrambles:** Developers copy-paste library source files manually into the project, leading to code bloat and un-upgradable codebases.
- **Inconsistent Environments:** Coworkers spend hours resolving version conflicts because they manually download different library files.

## 4. Best Practices
- **Enforce Clean Installs:** Use package manager clean install commands (e.g., 
pm ci instead of 
pm install) on CI build systems.
- **Isolate Environments:** Use virtual environments (e.g., env, conda, pipenv, poetry) or isolated container runtimes to prevent system-level package conflicts.
- **Group Development Packages:** Separate runtime dependencies from development utilities (like linters, compilers, and test run tools).

## 5. Common Mistakes / Anti-Patterns
- **Installing packages globally:** Running global package installs (e.g., 
pm install -g or pip install without virtualenv), polluting system-level python or node paths.
- **Mixing package managers:** Using both yarn and 
pm in the same node project, scrambling lockfiles.

## 6. Security Considerations
- **Command Injection via Scripts:** Review and disable arbitrary installation scripts (e.g., npm preinstall/postinstall) in package managers unless verified.

## 7. Performance Considerations
- **Layer Caching:** Structure Dockerfiles to copy package list manifests and run package installs before copying source code, utilizing Docker layer caches.

## 8. Scalability Considerations
- **Automated Update Pipelines:** Schedule automated weekly dependency check workflows to scan for patches and run test suites before merging updates.

## 9. How Major Companies Implement It
- **Netflix:** Utilizes cached, audited package structures stored in private artifact repositories to guarantee reproducible builds across thousands of daily builds.

## 10. Decision Checklist (Package Managers)
- Use **Poetry / Pipenv (Python) or NPM/Yarn (Node)** when:
  - Building modern backend apps requiring strict lockfile tracking and isolated environments.
- Use **Pip / Simple Package Lists** when:
  - Writing single-file scripts or lightweight cloud functions with minimal dependencies.

## 11. AI Coding-Agent Guidelines
- Verify the package manager conventions of the repository (e.g. checking for package.json vs pyproject.toml) before installing new libraries.

## 12. Reusable Checklist
- [ ] Virtual environment configured and active for local running
- [ ] Single, unified package manager active in the codebase
- [ ] Package manifests separate production and development dependencies
- [ ] Dockerfiles configure package install stages to use layer caching
- [ ] Outdated packages list reviewed for security updates regularly
- [ ] Global installs disabled in local and CI/CD pipelines
