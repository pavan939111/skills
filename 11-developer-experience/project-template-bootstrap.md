# Project Template

## 1. Definition & Core Concepts
A Project Template (or bootstrap boilerplate) is a pre-structured, skeleton codebase configured with the baseline framework, routing models, dependency libraries, configuration parsers, and testing suites.

## 2. Why It Exists / What Problem It Solves
Bootstrapping a production-grade service requires configuring database pools, logging formats, exception middleware, docker setups, and testing frameworks. A reusable project template permits developers to start writing business logic immediately without spending days building configurations.

## 3. What Breaks in Production Without It
- **Inconsistent Configurations:** Microservices log in different formats, use conflicting authentication systems, or lack health checks, making operations difficult.
- **Inefficient Setup Times:** Developers spend days repeating configuration steps for every new API endpoint or worker service.

## 4. Best Practices
- **Implement a Skeleton API:** Include a simple, working API endpoint (e.g. /healthz or /api/v1/ping) that exercises configuration systems and verifies DB connection health.
- **Provide Docker Configurations:** Include production-ready Dockerfile and local docker-compose.yml configurations in the template.
- **Configure Baseline Test Suites:** Bootstrap the template with unit and integration testing libraries, complete with a sample passing test.

## 5. Common Mistakes / Anti-Patterns
- **Bloating the template:** Including niche libraries or heavy frontend assets inside a general backend service template. Keep it minimal.
- **Hardcoding template names:** Leaving dummy package names or paths in configuration files.

## 6. Security Considerations
- **Vulnerability Checks on Boilerplate:** Regularly audit and upgrade dependency versions inside the base template to prevent new services from inheriting security flaws.

## 7. Performance Considerations
- **Pre-configured DB Pool Sizing:** Ensure the base database client inside the template is configured with optimal connection pooling and timeouts by default.

## 8. Scalability Considerations
- **CI/CD Integration Pipeline:** Build standard GitHub Action or GitLab CI YAML configurations into the template to automate builds.

## 9. How Major Companies Implement It
- **Spotify:** Utilizes an internal portal (Backstage) to host software templates, allowing engineers to bootstrap a microservice with standard metrics, logging, and security in seconds.

## 10. Decision Checklist (Template Scope)
- Use **Enterprise Starter Boilerplates** when:
  - Building standard, persistent microservices that require logging, tracing, DB integrations, and health metrics.
- Use **Minimal Framework Scaffolds** when:
  - Initializing small developer tools, scripts, or single-purpose worker scripts.

## 11. AI Coding-Agent Guidelines
- Reference the boilerplates' routing patterns and configuration conventions when adding new service controllers or data access files.

## 12. Reusable Checklist
- [ ] Reusable boilerplate matches organization framework standards
- [ ] Working health check (/healthz) endpoint verifies DB connections
- [ ] Dockerfile and docker-compose configurations included
- [ ] Testing frameworks bootstrapped with passing integration tests
- [ ] CI/CD pipeline configuration file included in project root
- [ ] Configuration manager parses variables dynamically
