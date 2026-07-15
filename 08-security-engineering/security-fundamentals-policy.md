# Security

## 1. Definition & Core Concepts

Application security at the code level is the practice of writing source code that is resistant to unauthorized access, exploitation, and data leakage. It relies on defending the application against malicious inputs, insecure execution flows, and supply chain vulnerabilities.

Core pieces:
- **Defense in Depth:** Implementing multiple layers of security controls so that if one layer fails, downstream controls prevent a breach.
- **Input Validation & Sanitization:** Ensuring all incoming data matches strict structural, type, and length constraints before processing.
- **Output Encoding:** Escaping data before rendering or inserting it into other interpreters (HTML, shell, database) to prevent injection attacks.
- **Least Privilege (Execution):** Running application code with the minimum set of operating system and database permissions required to function.
- **Secure Defaults:** Designing modules and classes so that their safest configuration is the default behavior.

*(Boundary Note: While security touches authentication, authorization protocols (OAuth/OIDC), and API design, those are detailed in `backend-development/`. Database-level role definitions and table-level access policies live in `database-design/`. This document focuses on code-level security practices, secure coding discipline, and OWASP mitigation.)*

## 2. Why It Exists

Applications are exposed to automated scanning and targeted exploitation immediately upon deployment. Security is not an operational patch applied after development; it is a code-level quality attribute. A single code-level vulnerability (e.g., remote code execution or SQL injection) can compromise the host operating system, leak customer databases, or lead to total system takeover.

## 3. What Breaks in Production Without It

- **Injection Exploitation:** Malicious payloads passed into SQL databases, OS commands, or HTML templates run directly, leading to data exposure, shell access, or cross-site scripting (XSS).
- **Service Denial via ReDoS:** Poorly written regular expressions (exponential backtrace) allow attackers to cause 100% CPU usage with tiny, crafted input strings, denying service to legitimate users.
- **Supply Chain Vulnerabilities:** Outdated dependencies with known critical CVEs (Common Vulnerabilities and Exposures) are exploited to bypass application-level defenses.
- **Insecure Deserialization:** Unmarshaling untrusted serialized payloads (e.g., in Python, Java, or Node.js) allows attackers to trigger arbitrary code execution in the runtime environment.
- **Credential Harvesting:** Hardcoded cryptographic keys, salt values, or database credentials are committed to source control and discovered by scrapers.

## 4. Best Practices

- **Validate Input via Whitelisting:** Define strict schemas (type, regex format, length limits) using validation libraries. Reject inputs that do not match the schema, rather than attempting to clean or sanitize invalid data.
- **Always Parameterize Queries:** Never construct SQL queries, shell commands, or external requests via string concatenation. Use parameterized queries/prepared statements, and execution boundaries.
- **Audit Dependencies Regularly:** Integrate automated scanners (e.g., `npm audit`, `snyk`, `trivy`, GitHub Dependabot) into the CI/CD pipeline and block builds containing unresolved critical-severity vulnerabilities.
- **Enforce Output Encoding:** Encode data according to its destination context (e.g., HTML escape, URL escape, shell argument quoting) before rendering.
- **Avoid Dynamic Code Execution:** Never use execution functions like `eval()`, `exec()`, or dynamic class loading with user-controlled input.
- **Use Cryptographically Secure Randomness:** Use system entropy APIs (e.g., `/dev/urandom`, Node's `crypto.randomBytes`, Java's `SecureRandom`) for generating IDs, salts, or tokens. Never use standard pseudo-random number generators (like math.random) for security-sensitive values.
- **Mitigate Regular Expression DOS (ReDoS):** Set execution timeouts for regex matching, and check regex patterns for nested quantifiers that cause catastrophic backtracking.

## 5. Common Mistakes / Anti-Patterns

- **Client-Side Security Fallacy:** Relying solely on browser-side validation (HTML inputs, JS checks) and neglecting server-side validation of incoming request payloads.
- **The "Sanitize Instead of Reject" Pattern:** Trying to strip out script tags or bad characters while allowing the request to proceed. This is highly bypassable via creative payload encoding.
- **Commiting Cryptographic Keys:** Placing encryption/signing keys directly in code for convenience, rather than retrieving them from environment variables or secrets managers.
- **Catching and Swallowing Security Failures:** Logging authentication/authorization failures at low log levels or swallowing validation errors, leaving security teams blind to brute-force or injection attacks.
- **Running Processes as Root:** Configuring Dockerfiles or application processes to run as `root` user, amplifying the blast radius of a remote code execution exploit.

## 6. Security Considerations

- **Memory Safety:** In unmanaged languages (C/C++), sanitize inputs to prevent buffer overflows and use memory-safe alternatives. In managed languages, keep memory usage bounded to prevent Out-Of-Memory (OOM) Denial of Service.
- **Timing Attacks:** Use constant-time comparison functions (e.g., `crypto.timingSafeEqual`) when validating signatures, hashes, or passwords to prevent side-channel leaks.

## 7. Performance Considerations

- **Algorithmic Complexity Control:** Impose size limits on incoming payloads (e.g., maximum body size limits in body parsers) before parsing (JSON parsing of a 100MB object can block the single-threaded Node loop for seconds).
- **Cryptographic Operations Offloading:** Offload resource-intensive operations like SSL/TLS termination and signature verification to dedicated API gateways or proxies where appropriate, or cache validated tokens (with tight expirations) to reduce cryptographic CPU overhead.

## 8. Scalability Considerations

- **Stateless Verification:** Design security checks (like token validations or scope matches) to be stateless (e.g., using cryptographic signatures) to avoid bottlenecking requests on a central session database.

## 9. How Major Companies Implement It

- **Google:** Mandates "Safe-by-Default" APIs. Instead of reminding engineers to escape HTML, Google frameworks use typed wrappers (e.g., SafeHtml) that refuse to compile if unescaped strings are passed to rendering engines.
- **Netflix:** Employs automated security scanning throughout the development lifecycle, utilizing tools like "Security Monkey" and dependency pipelines to automatically block or flag configurations that deviate from security profiles.
- **Stripe:** Implements app-level cryptographic wrappers around their ORMs, automatically encrypting/decrypting sensitive fields in-transit before they reach databases, ensuring database compromises do not expose raw cardholder data.

## 10. Decision Checklist

- Use **Input Validation Libraries (e.g., Zod, Pydantic)** on: All API request payloads, query params, webhook entry points, and read operations from external file sources.
- Use **Constant-Time Comparison** when: Validating tokens, API secrets, cryptographic signatures, or password hashes.
- Reject build when: Dependency scanner finds a known, exploitable vulnerability (CVE) with a severity score above the defined risk threshold (e.g., high/critical).

## 11. AI Coding-Agent Implementation Guidelines

- Always parse and validate all incoming variables, request payloads, and file imports against a strict, type-safe schema at the code boundaries.
- Never use raw string concatenation or interpolation when building database queries, system terminal commands, or URL requests.
- Always use the language's cryptographically secure random number generator when generating tokens, identifiers, or salts.
- Never run processes as root in generated Docker/deployment configurations — always add a non-privileged user and switch to it (`USER node` or similar).
- Always use safe regex functions and avoid complex nested quantifiers (`(a+)+`) that cause catastrophic backtracking; specify search timeouts where the library supports it.
- Never use dynamic code evaluation (`eval()`, `exec()`, new Function) with inputs that are external or user-supplied.

## 12. Reusable Checklist

- [ ] All inputs validated via server-side schemas/whitelists before business logic execution
- [ ] Database queries use parameterized placeholders/prepared statements; no raw concatenation
- [ ] Output escaping/encoding implemented for the correct target context
- [ ] No hardcoded secrets, keys, or passwords committed to repository
- [ ] Process runs as a non-privileged user (no root in Docker/runtime)
- [ ] Cryptography uses secure random generators, not standard pseudo-random math modules
- [ ] Security exceptions/failures logged with context but without leaking sensitive metadata
- [ ] Dependency vulnerabilities audited and blocked for high/critical CVEs in CI pipeline
- [ ] Regex patterns reviewed for ReDoS vulnerabilities; timeouts applied
