# CI/CD

## 1. Definition & Core Concepts

Continuous Integration (CI) and Continuous Deployment (CD) are automated practices for verifying, packaging, and deploying code changes.

Core pieces:
- **Continuous Integration (CI):** Automating the build, lint, format, type-check, and testing phases every time code is pushed or merged to the main branch.
- **Continuous Deployment/Delivery (CD):** Automating the rollout of successfully built code to target environments (development, staging, production). Continuous Delivery promotion is manual, while Continuous Deployment is fully automated.
- **Reproducible Builds:** Ensuring that running a build command at any time, on any machine, produces the exact same binary/artifact.
- **Immutable Artifacts:** Building the application code once into a single package (e.g., Docker image or package tarball) and promoting that exact same package across environments.
- **Pipeline as Code:** Defining CI/CD workflows inside version-controlled configuration files (e.g., YAML) in the repository.

*(Boundary Note: Platform-specific syntax like writing a GitHub Actions YAML or configuring GitLab Runner hardware setup is out of scope. This document covers code-level build reproducibility, pipeline stages, and deployment verification principles.)*

## 2. Why It Exists

Manual deployments are error-prone and time-consuming. Developers forget to run tests, mismatch environment dependencies, or configure settings incorrectly. CI/CD pipelines automate these processes, guaranteeing that no code reaches production without passing formatting, type-safety, security scanning, and automated testing.

## 3. What Breaks in Production Without It

- **Dependency Drift:** Not committing package lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`). A dependency releases a breaking change, and the production build crashes during deployment despite passing tests locally.
- **Environment-Locked Artifacts:** Baking staging environment settings (e.g. staging database URL) into the code build. This forces rebuilding the image for production, violating the "build once, run anywhere" rule and risking deploying untested changes.
- **CI Pipeline Bottlenecks:** Pipelines with zero caching that take 45 minutes to execute. During a production outage, deploying a critical one-line hotfix is blocked by the slow pipeline.
- **Bypassed Quality Controls:** Allowing developers to force-push changes directly to the main branch without passing the automated testing suite, leading to broken builds.

## 4. Best Practices

- **Always Commit Lockfiles:** Commit `package-lock.json`, `poetry.lock`, `Cargo.lock`, or `Gemfile.lock`. Ensure the build step uses installation commands that respect lockfiles strictly (e.g., `npm ci`, `poetry install --no-root`).
- **Build Immutable Images Once:** Compile code and build the container image once at the beginning of the pipeline. Use the exact same image hash for staging testing and production deployment. Inject environment configurations via variables at runtime, never compile time.
- **Fail Fast:** Structure pipeline stages from fastest to slowest. Run linters, format checkers, and type-checks first (seconds), followed by unit tests, integration tests (minutes), and finally deployment.
- **Cache Dependency Layers:** Configure your pipeline tool to cache package manager folders (e.g., `~/.npm`, `~/.cache/pip`) and use multi-stage Docker builds to leverage layer caching.
- **Implement Pre-Merge Gating:** Require pull requests to pass all CI checks and gain peer approvals before they can be merged into the main branch.
- **Automate Dependency Vulnerability Audits:** Run scanners (e.g., `npm audit`, `snyk`) during the build stage to fail builds if critical security vulnerabilities are introduced.

## 5. Common Mistakes / Anti-Patterns

- **"Works on My Machine" Build Scripts:** Writing build scripts that rely on global tools or directories installed on a developer's local laptop, failing when run in clean CI containers.
- **Running Tests Against Persistent DBs:** Hooking integration tests in CI pipelines to persistent, shared databases (e.g., staging DB) instead of ephemeral, local databases (Testcontainers), leading to test failures due to concurrent runs.
- **Baking Production Secrets into Code:** Inlining API keys or encryption secrets into build YAML configs, exposing them in git logs.
- **Manual SSH Deployments:** Deploying by running manual terminal commands (`git pull` via SSH) on live production servers, leaving no audit trail and leading to config drift.

## 6. Security Considerations

- **Secure Pipeline Secrets:** Retrieve deployment credentials, SSH keys, and cloud tokens dynamically via the CI/CD provider's encrypted variable store. Never commit secrets to configuration files.
- **Build Provenance:** Enable automated signing of built artifacts (e.g., Cosign for Docker images) to verify the integrity of files before deployment.

## 7. Performance Considerations

- **Prune Dev Dependencies:** When packaging the production artifact, prune developer-only packages (e.g., test runners, compilers, linters) to keep image sizes small. For Node.js, run `npm prune --production`.

## 8. Scalability Considerations

- **Parallel Run Configurations:** Split integration tests into parallel jobs based on directory segments in the CI workflow, preventing test suites from bottlenecking developer feedback loops as the codebase grows.

## 9. How Major Companies Implement It

- **Netflix:** Developed Spinnaker to automate multi-region CD. They enforce immutable image deployments and use automated canary analysis, comparing metrics of new deployments against baseline versions before promoting.
- **Stripe:** Enforces strict CI execution pipelines where thousands of tests run on every commit. They prioritize developer feedback, building highly optimized, parallelized runner pools to keep test times under a few minutes.

## 10. Decision Checklist

- Enable **Reproducible Build Enforcement** on: Every software project from day one (by committing lockfiles and verifying clean-slate builds).
- Implement **Continuous Deployment (CD)** when: Automated test suites have high coverage, the application is stateless, and rollbacks can be automated.
- Implement **Continuous Delivery (Manual Promotion)** when: Release windows must coordinate with business stakeholders, marketing, or regulatory validation processes.

## 11. AI Coding-Agent Implementation Guidelines

- Always ensure lockfiles are present and match dependency file changes.
- Never write build or deployment commands that depend on global host system state — isolate build logic within container files (Dockerfiles) or local scripts.
- Always use runtime environment variables to configure app nodes — never inject environment-specific URLs or secrets during the build phase.
- Always write Dockerfiles using multi-stage builds to optimize image size and cache dependency layers.
- Never hardcode deployment secrets or keys inside CI workflow configuration files.
- Always configure dependency install steps in CI to use clean, lockfile-locked commands (e.g., `npm ci`, `yarn install --frozen-lockfile`).

## 12. Reusable Checklist

- [ ] Lockfiles committed and in sync with package manifest files
- [ ] Build process uses lockfile-locked commands (e.g., `npm ci`, `pip install -r requirements.txt` with hashes)
- [ ] Single, immutable container image built once and promoted to all environments
- [ ] Environment variables injected at runtime, not compiled into the build
- [ ] Pipeline is split into ordered stages (Lint/Format -> Unit Tests -> Integration Tests -> CD)
- [ ] CI caches dependency layers (npm, pip, docker cache) to minimize build duration
- [ ] No secrets or keys written in pipeline files or build manifests
- [ ] Dev dependencies pruned from final production deployment artifacts
- [ ] PR merge gating requires successful CI checks
