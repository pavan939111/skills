# DevOps

## 1. Definition & Core Concepts

DevOps is a set of practices, cultural philosophies, and tools that integrate software development (Dev) and IT operations (Ops) to deliver high-quality applications rapidly and reliably.

Core pieces:
- **Dev-Prod Parity:** Keeping local development, staging, and production environments as identical as possible (in terms of OS, libraries, and backing services) to minimize runtime surprises.
- **12-Factor App Methodology:** A methodology for building SaaS applications that are portable, scalable, and cloud-native (e.g., config in environment, stateless processes, logging to stdout, fast startup/shutdown).
- **Infrastructure as Code (IaC) Integration:** Structuring application repositories to include parameterized infrastructure configuration definitions alongside source code.
- **Containerization:** Packaging an application with its entire runtime environment (dependencies, system libraries, configuration) into a portable container image (e.g., Docker).

*(Boundary Note: Managing Terraform state, configuring Kubernetes cluster ingress routing, or setting up CI server hardware belongs in cloud/infrastructure engineering books. This document covers code-level container parity, environment management, and 12-factor compliance.)*

## 2. Why It Exists

Historically, developers wrote code and handed it off to operations teams to deploy. This "throw it over the wall" culture led to conflicts when code failed in production due to environmental differences ("works on my machine"). DevOps practices align dev and ops by containerizing apps and standardizing code structures, ensuring code behaves identically in dev and prod.

## 3. What Breaks in Production Without It

- **Dev-Prod Disparity Crashes:** Code developed on macOS uses case-insensitive file loading. When deployed to a Linux-based production Docker container, it crashes immediately with `File Not Found` errors.
- **Slow Scalability (Long Boot Times):** An application that takes 3 minutes to start because it compiles templates or downloads packages at startup. During sudden traffic surges, autoscalers cannot boot new nodes fast enough, causing outages.
- **Port Conflict Collisions:** Hardcoding port numbers or domain names inside code files, preventing multiple instances of the service from running on the same host machine.
- **Disk Leaks from Local Logs:** Writing logs to local container directories. Since containers have ephemeral storage, these logs eventually exhaust the container's disk limit, causing the container engine to kill the process.

## 4. Best Practices

- **Build Portability into Container Images:** Use lightweight base images (e.g., Node alpine, Python slim, or distroless) to keep image sizes small. Smaller images download faster during scaling events and have a smaller security attack surface.
- **Run Containers in Local Dev:** Enforce using Docker Compose or minikube locally for development, utilizing the exact same base OS and dependency versions that will be deployed in production.
- **Separate Config from Code (12-Factor):** Store all configuration settings (database credentials, API endpoints, feature flags) in environment variables. Never commit configs to git.
- **Log to Stdout/Stderr:** Write all logs directly to the standard output streams. Let the container orchestrator aggregate, index, and rotate log streams.
- **Maximize Disposability (Fast Boot/Shutdown):** Design code to start quickly (under 5 seconds) and handle termination signals (`SIGTERM`) gracefully, allowing containers to scale out or deploy updates without interrupting active traffic.
- **Expose Service Ports via Environment Variables:** Do not hardcode port configurations (e.g., listen on `3000`). Read the port from `process.env.PORT` to allow orchestrators to map ports dynamically.

## 5. Common Mistakes / Anti-Patterns

- **Global CLI Dependency Assumptions:** Relying on tools (e.g., `git`, `curl`, `imagemagick`) being pre-installed on the host operating system, causing deployment to fail in minimal production containers.
- **Compiling Code Inside Production Containers:** Downloading compilers, dev tools, and raw source code into production containers, leading to bloated images and security vulnerabilities. Use multi-stage builds instead.
- **Mutable Server Configurations:** Manually changing files on a running container or server instance instead of updating the repository's Dockerfile and redeploying.
- **Hardcoding Local Paths:** Referencing paths like `C:\app` or `/home/user` that do not exist in target deployment containers.

## 6. Security Considerations

- **Run Containers as Non-Root Users:** By default, containers run as the root user. If compromised, an attacker can gain host system root access. Always add a dedicated user inside the Dockerfile (e.g., `USER node`) and switch to it.
- **Scan Base Images:** Regularly scan Docker images for OS-level vulnerabilities during the CI build process using tools like Trivy or Grype.

## 7. Performance Considerations

- **Multi-Stage Docker Builds:** Use multi-stage Dockerfiles. Stage 1 compiles and tests the code. Stage 2 copies only the compiled output (e.g., Javascript dist, binary executable) and production dependencies into a clean base image, reducing output size.

## 8. Scalability Considerations

- **Treat Backing Services as Attached Resources:** Database caches, SMTP servers, and message brokers should be connected via URLs/credentials read from the environment, allowing nodes to point to different regional services dynamically.

## 9. How Major Companies Implement It

- **Netflix:** Adheres strictly to the "immutable infrastructure" principle. Rather than patching running servers, they build a new Amazon Machine Image (AMI) or container for every deploy, guaranteeing consistency across thousands of instances.
- **Amazon:** Enforces two-pizza team ownership where teams own the entire lifecycle of their microservices: they design, build, test, deploy, monitor, and maintain the code in production.

## 10. Decision Checklist

- Use **Containerization (Docker)** when: Deployed code relies on specific runtime versions, OS libraries, has multiple team contributors, or runs on cloud container orchestrators (Kubernetes/ECS).
- Skip containerization ONLY when: Writing simple, serverless functions (where the provider manages the container sandbox automatically) or single-file scripts with zero dependencies.

## 11. AI Coding-Agent Implementation Guidelines

- Always provide a standard `Dockerfile` using a multi-stage build pattern for every new service generated.
- Never write hardcoded host IP addresses, system domain names, or static port numbers inside application configuration files.
- Always include a `docker-compose.yml` file to spin up local backing services (databases, caches) matching production versions.
- Never write files to the local container disk unless they are temporary and deleted within the request loop.
- Always configure the container to run under a non-privileged `USER` account.
- Always read server port configurations from environment variables (`PORT`), defaulting to a standard port locally if unset.

## 12. Reusable Checklist

- [ ] Dev-prod parity: Local development runs inside container environments matching production
- [ ] Multi-stage Dockerfile configured, producing a lightweight runtime image
- [ ] Container runs under a non-root user account (`USER` defined in Dockerfile)
- [ ] Application reads all configuration from environment variables (12-Factor App)
- [ ] Logs written strictly to standard output (`stdout`/`stderr`), not local files
- [ ] Application starts fast (<5 seconds) and handles graceful termination signals
- [ ] Ports and backing service connections configured dynamically via env variables
- [ ] No global OS dependencies assumed in source code; all binaries packaged in container
