# Convention over Configuration

## 1. Definition & Core Concepts

Convention over Configuration (CoC), also known as Coding by Convention, is a software design paradigm that seeks to minimize the number of decisions that a developer has to make, reducing configuration boilerplate without sacrificing flexibility.

Core pieces:
- **Sensible Defaults:** Designing systems to work out-of-the-box using standard settings (e.g., assuming a database port, default logging format) without requiring explicit configuration files to boot.
- **Standardized Directory Layouts:** Organizing source code files in uniform structures recognized by the framework or team (e.g., placing tests in `tests/`, controller files in `controllers/`).
- **Implicit Mapping:** Dynamically mapping code components based on naming conventions (e.g., mapping a controller called `ProductController` to route `/products` automatically) instead of writing explicit routing XML/YAML files.
- **Configuration Overrides:** Ensuring that while conventions handle 90% of cases, developers can explicitly override settings via environment variables or configs for specialized needs.

## 2. Why It Exists

In early software frameworks (e.g., J2EE), starting a project required writing thousands of lines of XML configuration files to map classes to database tables, wire dependencies, and define server ports. This boilerplate slowed development, increased configuration errors, and made codebases hard to read. CoC removes this friction, letting developers focus on writing business logic.

## 3. What Breaks in Production Without It

- **Configuration Drift Errors:** Different environments (dev, staging, prod) silently diverge because they rely on hundreds of manually configured settings properties rather than inheriting standard defaults, leading to runtime failures.
- **Massive Configuration Files:** Projects contain bloated `config.json` or `application.properties` files with thousands of lines of boilerplate. A single typo in an unused setting crashes the application.
- **Bypassed Quality Checks:** Running unit tests locally requires complex configuration setups (DB strings, API keys). Because setting up tests is too difficult, developers bypass running them.
- **Inconsistent Folder Layouts:** Each developer structures directories differently, making it difficult for automated CI pipelines to locate build artifacts or test suites.

## 4. Best Practices

- **Adhere to Framework Folder Conventions:** Adopt the standard folder structures of your framework (e.g. NestJS, Spring Boot, Next.js, Django). Never create custom folder layouts unless the default structures are proven insufficient.
- **Establish Secure-by-Default Settings:** Provide sensible, safe default configurations (e.g., logging output default to JSON, cache enabled). Ensure default database settings point to safe local sandboxes (never production servers).
- **Use Environment Overrides:** Design settings modules to read environment variables as overrides on top of local conventions.
- **Zero-Config Developer Bootstrap:** Ensure that a new developer can clone the repository and run the application locally with a single command (e.g., `npm run dev`), relying entirely on default convention configurations.
- **Name Classes and DB Entities Consistently:** Use uniform naming schemas (e.g., model classes name singular CamelCase: `UserInvoice`, database tables name plural snake_case: `user_invoices`) to allow ORMs to automatically map relationships.

## 5. Common Mistakes / Anti-Patterns

- **Custom Directory Inventions:** Designing custom, complex project layouts (e.g. creating folders like `my-apis/`, `src-code/`, `logic-files/`) that confuse new developers and break automated tooling.
- **Requiring Configurations for Everything:** Forcing developers to configure settings (like log paths or port numbers) explicitly in files before the application can boot.
- **Inconsistent Naming Verbs:** Naming similar controllers differently (e.g. using `UserController` but then creating `BillingHandler` and `PaymentEndpoint`), breaking routing mapping conventions.
- **Hardcoded Overrides in Source Control:** Committing environment-specific override values directly in the primary configuration files.

## 6. Security Considerations

- **Secure Default Configurations:** Ensure default configurations are hardened. Disable debug/development dashboards in non-local environments automatically unless an override flag is explicitly enabled. Default credential placeholders must fail production validations.

## 7. Performance Considerations

- **Reduced Startup Parsing:** Minimizing massive configuration XML/YAML files reduces startup parsing time and configuration file size, allowing applications to boot faster in cloud environments.

## 8. Scalability Considerations

- **Consistent Onboarding:** Standardizing folder layouts and conventions allows teams to scale. Developers can move between different microservice repositories without needing to learn a new file layout or configuration scheme.

## 9. How Major Companies Implement It

- **Spring Boot / Ruby on Rails (Java/Ruby):** Popularized Convention over Configuration. Spring Boot scans the classpath, detects loaded dependencies (like PostgreSQL driver), and automatically configures database connection pools with default parameters, requiring zero XML setup.
- **Google:** Mandates standardized project layout structures and build rules (using Bazel) across all repositories, ensuring uniform build, test, and run behaviors.

## 10. Decision Checklist

- Use **Convention over Configuration** on: Choosing project layouts, ORM database mappings, routing schemes, and application setting defaults.
- Skip Conventions (Use Explicit Configuration) when: Building highly custom, multi-tenant integration gateways, legacy enterprise system connections, or when framework conventions conflict with performance bottlenecks.

## 11. AI Coding-Agent Implementation Guidelines

- Always structure generated project code folders according to the standard layout of the language/framework.
- Never write explicit routing configuration files if the framework supports folder-based or naming-based auto-routing.
- Always write config initializers that use sensible, safe default values if environment variables are not supplied.
- Never commit environment-specific override configurations (e.g. staging database credentials) to git.
- Always name files, classes, databases, and variables according to the conventions of the target language (e.g., snake_case in Python, camelCase in JavaScript).

## 12. Reusable Checklist

- [ ] Project folder structure conforms strictly to framework standards (no custom layouts)
- [ ] Application boots out-of-the-box locally with zero initial configuration required
- [ ] Naming conventions used for classes, files, and database tables
- [ ] Database connection settings and configurations support environment overrides
- [ ] Default configuration values are secure (debug pages disabled by default)
- [ ] No explicit XML/YAML mappings used where dynamic naming mapping is supported
- [ ] Development databases point to localhost sandboxes by default
- [ ] Documentation explains how to override default conventions via environment variables
