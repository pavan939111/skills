# Backend Review Readiness Guide

## 1. What Question This Answers
"Is the backend service logic, dependency injection, and error handling framework optimized for production operations?"

## 2. Why It Matters at the System-Design Stage
Incomplete backend designs result in resource leaks, un-handled API crashes, and logging gaps that delay incident resolutions.

## 3. Methodology / How to Work Through It
1. **Audit Dependency Injection:** Ensure controllers do not instantiate heavy singletons on every request.
2. **Review Error Handling:** Confirm catch blocks contain logging guidelines.
3. **Verify Middleware Checks:** Ensure CORS, rate-limiting, and compression middleware are defined.
4. **Execute Backend Checklist:** Log status.

## 4. Inputs Needed
- Selected backend frameworks.
- API routing designs.

## 5. Outputs Produced
- Feeds into backend development checklists.

## 6. Worked Checklist Example
- [x] Catch blocks log errors to console streams using structured JSON.
- [x] Connection pools match active thread allocations.
- [x] CORS middleware limits origins to secure subdomains.

## 7. Common Mistakes
- **Empty Catch Blocks:** Swallowing errors without writing details to console logs.
- **Unbounded Connection Pools:** Creating connection pools that saturate database ports.

## 8. AI Coding-Agent Guidelines
1. **Enforce Structured Logs:** Require JSON logging formats in all backend templates.
2. **Verify Thread Safety:** Check class instantiation scopes.
3. **Produce Backend Audit Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Backend Review Log: [System Name]

### 1. Code Quality & Integration Checks
- [ ] Structured JSON logging is implemented.
- [ ] Database connection pool limits match container limits.
- [ ] Rate limits and CORS parameters are configured.
- [ ] Global exception handlers catch unhandled thread crashes.

### 2. Sign-off Status
- **Status:** [Go / No-Go]
- **Outstanding Actions:** [e.g. Implement rate limiter middleware on authentication routes.]
```
