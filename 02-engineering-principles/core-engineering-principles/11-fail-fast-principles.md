# Fail Fast

## 1. Definition & Core Concepts

Fail Fast is a system design principle where execution halts immediately when an anomaly, validation failure, or invalid state is detected, rather than attempting to continue execution in a corrupted or unpredictable state.

Core pieces:
- **Boundary Validation:** Checking types, ranges, formats, and permissions immediately when data enters a module, API, or service.
- **Startup Verification:** Running configuration and connection validations at process boot, crashing the process immediately if parameters are invalid or dependencies unreachable.
- **Assertive Programming:** Using assertion statements to verify internal state invariants that must be true for the code to function correctly.
- **Fail-Safe Crash:** Allowing a process to terminate (crash) during unrecoverable errors, relying on orchestrators (like Kubernetes) to launch a clean, healthy instance.

## 2. Why It Exists

When software attempts to proceed despite encountering an invalid state or minor failure (e.g., catching a database exception and silently returning `null` or an empty object), the true error is suppressed. The application continues running in a corrupted state, eventually failing much later in a different part of the codebase. This makes debugging incredibly difficult and risks saving corrupt data.

## 3. What Breaks in Production Without It

- **Silent Data Corruption:** An application receives a request with an invalid user profile format. Instead of rejecting it, the code proceeds, saving missing fields to the database and corrupting customer profiles.
- **Zombie Container Processes:** A service runs out of available database connections. Instead of crashing the process, code catches the connection error and continues. The server remains online, responding with blank pages, preventing load balancers from detecting the node is dead.
- **Indebuggable Late-Stage Failures:** A missing database configuration variable is ignored at startup. Two hours later, a user triggers a billing transaction that attempts to query that database, causing a transaction crash in the middle of payment processing.
- **Resource Leaks:** Swallowing initialization errors in background workers. The worker stops processing the queue, but the container remains running, leaking memory and threads.

## 4. Best Practices

- **Validate Inputs at the Boundary:** Parse and validate all incoming HTTP payloads, configuration strings, and file inputs immediately using validation libraries (Zod, Pydantic, envalid). Reject invalid inputs immediately.
- **Validate Configuration at Boot:** Fail fast during application initialization if required environment variables are missing, malformed, or if database connections cannot be established. Crash the process with a clean error message.
- **Never Swallow Exceptions Silently:** Avoid empty catch blocks (`try { ... } catch (Exception e) {}`). If you catch an exception, you must log it, handle it (e.g., fallback), or rethrow/propagate it.
- **Allow Crash on Unrecoverable Error:** If the application encounters an unrecoverable error (e.g., Out of Memory, corrupted state, exhausted connection pool), log a fatal message and exit the process (`process.exit(1)`) so the orchestrator can restart it.
- **Use Code Assertions:** Write assertions for developer errors and internal invariants (e.g. `assert(userId !== null, "User ID must be set before billing")`).

## 5. Common Mistakes / Anti-Patterns

- **Returning Null/Magic Values on Error:** Catching database connection failures and returning `null` or `-1` instead of throwing an exception, leading to subsequent NullPointerExceptions elsewhere.
- **Swallowing Unhandled Promise Rejections:** Failing to register unhandled rejection handlers, allowing NodeJS or browser runtimes to continue execution silently after asynchronous failures.
- **Soft Warnings for Missing Core Configs:** Logging "Warning: DATABASE_URL not set, using localhost" in production configurations, leading to startup failure later.
- **Catching Generic Exceptions Globally:** Wrapping entire controller scripts in giant try/catch blocks that swallow specific type and syntax errors.

## 6. Security Considerations

- **Blocking Malicious Inputs early:** Fail-fast input validation stops SQL injection, cross-site scripting (XSS), and buffer overflow attacks at the gateway boundary before they reach database engines or calculation layers.

## 7. Performance Considerations

- **Resource Preservation:** Rejecting invalid requests instantly at the boundary prevents the application from wasting database connections, CPU cycles, and memory processing requests that are doomed to fail.

## 8. Scalability Considerations

- **Orchestrator Reboot Loops:** Cloud platforms (Kubernetes) rely on containers failing fast (exiting with code > 0) to trigger self-healing automated restarts. A zombie container that stays online while failing calls blocks autoscaling.

## 9. How Major Companies Implement It

- **Google:** Employs strict assertion frameworks (like Java's Guava Preconditions) globally in their codebases. Code explicitly asserts preconditions (`checkArgument`, `checkState`) at method entries, immediately halting thread execution if invariants are violated.
- **Stripe:** Validates incoming REST API request formats using strict JSON Schemas at their edge gateways, returning validation error collections instantly to API clients to prevent processing garbage data downstream.

## 10. Decision Checklist

- Use **Fail Fast** on: Application startup configurations, API input validations, contract parameters, database transactions, and unrecoverable runtime states.
- Skip Fail Fast (Use Fail-Safe Recovery) when: Handling minor, transient errors that can be retried (e.g., network timeout on non-critical API) or when handling user input errors in interactive UIs (where displaying validation hints is preferred to crashing).

## 11. AI Coding-Agent Implementation Guidelines

- Always write configuration verification schemas that validate all environment variables at startup and call `process.exit(1)` on failure.
- Never catch exceptions without either logging them with complete stack traces, applying a fallback, or rethrowing them.
- Always validate request parameters at HTTP API endpoints using structured schemas before executing business logic.
- Never write empty catch blocks.
- Always crash background workers if they lose connection to their messaging queues and fail to reconnect after a bounded number of retries.
- Always use language assertion operators to document and enforce state preconditions.

## 12. Reusable Checklist

- [ ] All environment variables and settings validated at startup; app crashes on errors
- [ ] Input validation schemas configured for all API endpoint inputs (validation at boundary)
- [ ] No empty catch blocks exist in the codebase (no swallowed exceptions)
- [ ] Unrecoverable exceptions log a fatal message and exit/crash the process
- [ ] Unhandled promise rejections and exceptions caught and logged at process level
- [ ] Input verification errors return immediate client failure codes (e.g. HTTP 400)
- [ ] Preconditions and state invariants enforced using assertions
- [ ] Worker processes terminate if messaging queue connection is lost permanently
