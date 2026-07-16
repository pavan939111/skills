# Logging Review Checklist

## 1. Purpose
The Logging Review Checklist is an audit tool used to verify that log logs are structured, credentials are redacted, correlation IDs propagate, and log levels are correct.

## 2. Checklist
- [ ] Console logs output as structured JSON objects
- [ ] User passwords and credentials redacted
- [ ] Correlation IDs injected in middleware and sent downstream
- [ ] Log levels conform to rules (DEBUG for details, INFO for status)
- [ ] Distributed log collectors receive stdout/stderr streams

## 3. Cross-References
- [Logging reference](../../10-production-operations/01-logging-management/)
- [Correlation ID propagation](../../10-production-operations/01-logging-management/correlation-id-tracing-implementation.md)

## 4. Sign-off Criteria
- Approved when search platforms parse logs with correlation ID filters.
