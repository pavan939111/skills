# Defensive Programming

## 1. Definition & Core Concepts

Defensive Programming is a design methodology aimed at ensuring the continuous, correct function of a software system despite unexpected inputs, database anomalies, external service failures, or programmer mistakes.

Core pieces:
- **Guard Clauses:** Conditional checks placed at the very beginning of a function to validate inputs and exit/throw early if parameters are invalid.
- **Input Sanitization & Validation:** Treating all data (both external requests and internal database records) as untrusted until verified.
- **Assertions:** Code-level checks used during development to verify internal state assumptions (invariants) that must be true for execution to proceed.
- **Graceful Degradation:** Providing fallback states or safe default return values when a dependency fails, preserving core application execution.

## 2. Why It Exists

Applications execute in unpredictable production environments. Networks drop, databases return malformed values, files are missing, and developers make integration mistakes. Defensive programming ensures that these anomalies do not crash the application process, corrupt data, or create security vulnerabilities, allowing the system to handle failures gracefully.

## 3. What Breaks in Production Without It

- **Cascading NullPointerExceptions (NPEs):** Accessing fields on nested objects (`user.getBilling().getCard()`) without validating if objects are null, causing API requests to crash with 500 errors.
- **Index Out of Bounds Crashes:** Accessing array items directly (`items[0]`) without checking if the array is empty, crashing the execution thread.
- **Data Pollution from Malformed Inputs:** Storing invalid strings or negative values in database columns because the validation logic assumed database-level constraints would catch it.
- **Silent Failures due to Swallowed Exceptions:** Catching generic exceptions (`try { ... } catch (Exception e) {}`) and doing nothing, leaving operators blind to connection dropouts or query failures.

## 4. Best Practices

- **Use Guard Clauses to Fail Early:** Validate function inputs immediately. If invalid, throw an exception or return a validation error code. Keep the happy path flat and clean.
- **Never Trust External Inputs:** Validate all incoming payloads, request queries, headers, and files. Treat internal databases and third-party APIs as untrusted inputs that require parsing and format checks.
- **Check Boundaries Before Indexing:** Always check array/list lengths and string bounds before accessing specific indexes or slices.
- **Configure Connect and Read Timeouts:** Never make outbound network requests without configuring timeouts. Unbounded calls can hang threads indefinitely when connections drop.
- **Implement Safe Fallbacks:** If a database or cache query fails, catch the error, log a warning, and return an empty result set or default configuration value to keep the application responsive.
- **Avoid Over-Defensive Programming (Don't Hide Bugs):** Do not check for nulls or wrap every line in try/catch loops where it makes code unreadable or silences developer bugs. Assert expected states and let the program fail explicitly rather than running in a zombie state.

## 5. Common Mistakes / Anti-Patterns

- **Swallowing Exceptions:** Catching errors and returning `null`, forcing downstream methods to crash with confusing NullPointerExceptions.
- **Trusting Internal Data Formats:** Assuming database entries will always match your active data models. If a column is modified, the app crashes because the read model lacks fallback defaults.
- **Checking Nulls on Primitives:** Adding checks for null values on variables that cannot be null (like primitive integers in Java/Go), cluttering the codebase.
- **Catching Generic Runtime Exceptions:** Wrapping code in global `try/catch(Exception)` blocks and treating database outages, type errors, and syntax bugs identically.

## 6. Security Considerations

- **SQL and Command Injection Mitigation:** Parameterizing database inputs and escaping arguments before executing OS command strings to prevent exploitation.
- **Buffer Overflow Protection:** Sanitize input lengths before parsing variables into fixed-size memory buffers in unmanaged languages.

## 7. Performance Considerations

- **Hot-Loop Optimization:** Avoid running complex regex sanitization or heavy validation logic inside high-frequency execution loops. Perform validation once at the system boundary instead.

## 8. Scalability Considerations

- **Robust Thread Pool Maintenance:** Defensive coding prevents uncaught runtime exceptions from terminating worker threads or event loop nodes, maintaining consistent instance throughput.

## 9. How Major Companies Implement It

- **Amazon:** Implements a "Zero-Trust" internal network architecture. Every microservice treats requests from adjacent services with the same level of input sanitization and verification as requests from the public internet.
- **Google:** Standardizes on code assertions and precondition validators. Google codebases enforce strict validation of function parameters at API boundaries to catch logical drifts early in build pipelines.

## 10. Decision Checklist

- Use **Defensive Programming (Guard Clauses & Validation)** on: Every public API entry point, class constructors, public helper methods, database integrations, and third-party API integrations.
- Skip Defensive Checks (Use Fast Failure) when: Writing internal, private helper methods where parameters are already validated by caller boundaries, or when writing unit tests (where explicit failures are expected).

## 11. AI Coding-Agent Implementation Guidelines

- Always add guard clauses at the beginning of public functions to validate parameter types and ranges.
- Never access array indexes or string slices without first asserting the object contains items or has sufficient length.
- Always wrap external HTTP client calls and file I/O operations in try/catch blocks with explicit logging and fallback values.
- Never write empty catch blocks.
- Always use typed exceptions to differentiate between user input validation errors and internal system failures.
- Always specify connect and read timeouts on database and HTTP client pool configs.

## 12. Reusable Checklist

- [ ] Guard clauses implemented at the beginning of methods to validate parameters
- [ ] No array indexes accessed without checking bounds or collection length first
- [ ] External HTTP requests and database queries wrap execution in try/catch blocks
- [ ] Outbound network calls have explicit connect and read timeouts configured
- [ ] No empty catch blocks (all errors either handled, logged, or rethrown)
- [ ] Database updates validate business constraints before executing write commands
- [ ] Input data sanitized at the boundary (SQL injection and XSS prevented)
- [ ] Null values checked or avoided using Optionals/default fallbacks
