# Logging Strategy

### 1. The Question Decided
"How do we configure logging levels, format log payloads, and structure distributed tracking IDs?"

### 2. Options Compared
| Format | Plain Text | Structured JSON | Binary Logging |
|---|---|---|---|
| **Human Readability**| High | Low | None |
| **Parser Friendliness**| Low | High | High |
| **Volume Size** | Medium | Large | Small |

### 3. Decision Rule
- Enforce **Structured JSON** for all log outputs in staging and production to support ELK/Loki log parsing.
- Set default logging levels to **INFO** in production, raising to **DEBUG** dynamically via runtime toggles only when debugging.
- Require a unique **Correlation ID** attached to every request header to trace cross-service operations.

### 4. Red Flags to Revisit
- Secrets, credentials, or PII logged in plaintext due to missing input sanitization interceptors.
- Production logs disk exhaustion due to excessive logging at DEBUG level in loop operations.

### 5. Where to Go Next
- For logging middleware setups and trace ID configuration, see [Logging Management](../../10-production-operations/01-logging-management/index.md).
