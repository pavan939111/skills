# Folder Conventions

## 1. Definition & Core Concepts
Folder Conventions are the structured layout specifications that define where configurations, source code, data migrations, testing assets, build distributions, and public assets reside in the project repository.

## 2. Why It Exists / What Problem It Solves
A standardized folder layout ensures that any developer joining a project immediately knows where to find route definitions, database tables, local docker configurations, or test scripts, reducing setup times.

## 3. What Breaks in Production Without It
- **Broken Deployments:** Build scripts fail or include unnecessary local folders (like virtual environments) because output pathways were unstructured.
- **Accidental Config Expositions:** Storing configuration secrets in folders that are publicly served by web servers.

## 4. Best Practices
- **Standardize Root Folders:** Maintain a clean root layout: /src (source code), /tests (testing), /config (environment assets), /migrations (DB histories).
- **Separate Public Assets:** Keep static assets (images, public files) in an isolated /public or /static folder.
- **Isolate Build Output:** Ensure all compiler outputs write to a dedicated, ignored folder (e.g., /dist or /build).

## 5. Common Mistakes / Anti-Patterns
- **Dumping everything in the root:** Placing controllers, models, and test scripts directly in the repository root folder.
- **Nesting directories too deeply:** Creating 10 layers of subfolders (e.g., src/app/core/services/impl/user/data/...), adding unnecessary path lengths.

## 6. Security Considerations
- **Restricted Access Paths:** Ensure web servers route public queries exclusively to /public assets, blocking paths to /src or /config directories.

## 7. Performance Considerations
- **Excluding Build Paths:** Configure package compilers and deployment pipelines to ignore testing and documentation directories, reducing container sizes.

## 8. Scalability Considerations
- **Monorepo Directory Layouts:** In large multi-service systems, organize projects into unified /apps and /packages workspace structures.

## 9. How Major Companies Implement It
- **Spotify:** Scaffolds all new services with Backstage templates that enforce standard root layouts, Docker coordinates, and CI configurations.

## 10. Decision Checklist (Folder Design Patterns)
- Use **Standard Root Layout (/src, /tests, /config)** when:
  - Bootstrapping standard web services, backend APIs, or background worker systems.
- Use **Monorepo Directory Layout (/apps, /packages)** when:
  - Managing multiple interrelated service packages or microservices in a single repository.

## 11. AI Coding-Agent Guidelines
- Follow the repository's existing directory structure when adding new code modules, routing configurations, or test suites.

## 12. Reusable Checklist
- [ ] Root directories separate source code (/src) from testing assets (/tests)
- [ ] Build outputs target dedicated, Git-ignored compilation folders (/dist)
- [ ] Public asset folders kept completely isolated from codebase files
- [ ] Database migrations logged in a centralized /migrations folder
- [ ] Docker configurations stored in root or /docker directories
- [ ] Absolute imports and path aliases configured to avoid long relative paths (e.g., ../../../../)
