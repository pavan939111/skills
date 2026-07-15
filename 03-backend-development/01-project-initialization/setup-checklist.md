# Setup Checklist

## 1. Definition & Core Concepts
The Setup Checklist is a structured audit tool used to verify that a backend workspace has completed all project setup, framework selection, environment configuration, and templating steps before starting business logic development.

## 2. Why It Exists / What Problem It Solves
Starting development without a validated setup leads to inconsistencies, missing environment vars, skipped lint settings, and un-runnable local Docker profiles. The setup checklist enforces organization baselines before code development starts.

## 3. What Breaks in Production Without It
- **Deploy Pipeline Failures:** Services crash on deploy because dependencies or configurations were never validated against staging profiles.
- **Developer Friction:** New team members spend days attempting to run the project locally because setup steps were undocumented or skipped.

## 4. Best Practices
- **Integrate setup checks in CI/CD:** Ensure that early pipeline stages compile the project, run lint checks, and verify configuration schemas.
- **Maintain a Clear README:** Document the local setup, build commands, and environmental variable variables in README.md.
- **Run Setup Checks on Staging:** Deploy the project template to a staging environment early to confirm the network and configuration paths.

## 5. Common Mistakes / Anti-Patterns
- **Skipping local Docker validation:** Developing without validating that the local docker-compose setup matches the runtime.
- **Manual variable configurations:** Relying on manual developer configurations instead of automated .env loaders.

## 6. Security Considerations
- **Locked Git Permissions:** Verify that only authorized developer tokens can commit configurations or push dependency upgrades.

## 7. Performance Considerations
- **Automated setup scripts:** Use setup scripts (e.g. in/setup) to automate database creation and package installation, saving time.

## 8. Scalability Considerations
- **Consistent Infrastructure Scaffolding:** Maintain unified setup procedures to ensure that hundreds of microservices can be operated consistently by operations teams.

## 9. How Major Companies Implement It
- **Airbnb:** Enforces an automated checklist verification step that must be completed and logged before an engineer can check in code for new service repositories.

## 10. Decision Checklist (Bootstrapping Sign-off)
- Approve **Project Setup Sign-off** when:
  - All repository, dependencies, environments, linter, testing, and Docker structures are verified and passing.
- Reject **Project Setup Sign-off** when:
  - Critical setup files (.gitignore, lockfiles, .env.example) are missing or tests fail to execute.

## 11. AI Coding-Agent Guidelines
- Write automated verification tasks that check for essential configuration files, dependency integrity, and linter conformity before merging workspace code.

## 12. Reusable Checklist
- [ ] Target framework selected, licensed, and approved for use
- [ ] Dependencies version-pinned and locked in repository tracking files
- [ ] Isolated virtualenv or package manager container configurations active
- [ ] .env.example template includes all runtime configuration keys
- [ ] Standard .gitignore and .editorconfig files active in repository
- [ ] Dockerfile and docker-compose configurations build successfully
- [ ] Local unit tests execute and pass baseline checks
- [ ] README file documents environment setup and execution steps
