# Error Handling Checklist

## 1. Backend Application Context
The Error Handling Checklist is an audit tool used to verify that global exception catch-all handlers, custom error classes, response codes, retries, and fallbacks are configured correctly before release.

## 2. Backend-Specific Pitfalls
- **Signing off checklists with unhandled routes:** Forgetting to verify that asynchronous worker threads catch exceptions, leading to process crashes.

## 3. Code-Shape Example
`markdown
### Error Handling PR Review Guidelines:
- [ ] Global exception middleware catches both standard and async errors
- [ ] System stack traces stripped from production API outputs
- [ ] Custom exception classes inherit from base domain exception classes
- [ ] Dynamic retries use exponential backoffs with jitter
- [ ] Failures logged with correlation IDs for trace mapping
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Error Handling & Exception Strategy](../../production_principles/reliability-coding-practices/01-error-handling-exception-strategy-implementation.md)
