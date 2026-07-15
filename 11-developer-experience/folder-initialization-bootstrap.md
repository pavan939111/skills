# Folder Initialization

## 1. Definition & Core Concepts
Folder Initialization is the baseline process of creating directories, files, Git repositories, lint settings, and formatting configurations to establish a standardized workspace for development.

## 2. Why It Exists / What Problem It Solves
Standardizing folder shapes across organization services ensures that developers can easily navigate different codebases. Automated initialization enforces style guides, configures git rules, and configures basic setups in a single command.

## 3. What Breaks in Production Without It
- **Code Style Fragmentation:** Developers commit code with conflicting tab sizing, quotes styles, or indentation, creating massive unreadable diffs.
- **Git Garbage Accumulation:** Large log directories, local build binaries, or database files are committed to repositories because .gitignore was not initialized.

## 4. Best Practices
- **Define standard gitignore rules:** Initialize repository directories with standard templates (e.g., GitHub's Python or Node .gitignore).
- **Enforce Linter Configurations:** Include style configurations (like .eslintrc, pyproject.toml with Ruff, or .prettierrc) at the root level.
- **Add EditorConfig specifications:** Use .editorconfig files to enforce consistent tab sizing, newline rules, and trim properties in developer IDEs.

## 5. Common Mistakes / Anti-Patterns
- **Ad-hoc directory creations:** Allowing developers to invent their own directory naming conventions, creating disorganized structures.
- **Committing local node_modules or venv directories:** Storing compiled dependency folders in Git, bloat repositories.

## 6. Security Considerations
- **Gitignore Audits:** Ensure that build outputs, database secrets, and local developer .env files are blocked from Git commits by default.

## 7. Performance Considerations
- **Pruned File Scans:** Correctly configured workspaces speed up linter runs, unit testing, and directory search tools (like ripgrep).

## 8. Scalability Considerations
- **Scaffolding Templates:** Create organization-level CLI generators (e.g. Yeoman or Cookiecutter templates) to bootstrap new services.

## 9. How Major Companies Implement It
- **Google:** Mandates that all internal repositories compile with automated style linters during check-in, keeping the codebase unified.

## 10. Decision Checklist (Code Linter Selection)
- Use **Ruff / ESLint / Prettier** when:
  - Establishing standardized formatting and quality rules for Python or JavaScript/TypeScript codebases.
- Use **Default Framework Formatters** when:
  - Working on small sandbox tools with minimal style requirements.

## 11. AI Coding-Agent Guidelines
- Inspect the workspace root files (e.g., checking for .editorconfig or pyproject.toml) to align code formatting with the repository's style guides.

## 12. Reusable Checklist
- [ ] .gitignore configured to exclude local builds, virtual environments, and .env files
- [ ] .editorconfig template defines line endings, indentation, and charsets
- [ ] Code linters and formatters (ESLint/Prettier/Ruff) configured and active
- [ ] Git repository initialized with a main/master branch structure
- [ ] Standard documentation file (README.md) created at root
- [ ] Workspace settings block tracking of massive cache folders
