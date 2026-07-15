# Architecture Review Readiness Guide

## 1. What Question This Answers
"Is the high-level system architecture design ready for implementation, and have we resolved all design boundary dependencies?"

## 2. Why It Matters at the System-Design Stage
A production readiness architecture review is the final checkpoint before writing code. Running a design review ensures that the proposed monolith, microservices, or modules boundaries align with performance budgets, team organization, and security policies.

## 3. Methodology / How to Work Through It
1. **Verify Boundary Isolation:** Check if components are decoupled using bounded contexts.
2. **Review API Contracts:** Ensure API gateway routes and backend schemas are registered.
3. **Audit Resilience Paths:** Confirm circuit breakers, timeouts, and retry jitter rules are defined.
4. **Run Go/No-Go Check:** Assess against the readiness checklist.

## 4. Inputs Needed
- High-level architecture selections.
- Component boundary definitions.

## 5. Outputs Produced
- Architecture sign-off logs.

## 6. Worked Checklist Example (Modular Monolith)
- [x] All modules communicate via clean in-memory folder interfaces (no direct SQL table crossings).
- [x] Every public HTTP endpoint is behind the API Gateway.
- [x] Third-party integrations are wrapped in circuit breakers.

## 7. Common Mistakes
- **Shared Databases in microservices:** Allowing service containers to read/write to the same SQL tables, creating hidden coupling.
- **Missing Timeouts:** Leaving network API connection timeouts unbounded.

## 8. AI Coding-Agent Guidelines
1. **Require clean boundaries:** Verify that no component imports files directly from another component's private folders.
2. **Confirm Gateway routing:** Ensure all client-facing APIs route through the gateway.
3. **Produce Architecture Audit Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Architecture Review Log: [System Name]

### 1. Structural Checks
- [ ] Bounded contexts are defined and documented.
- [ ] Ingress traffic routes entirely through the API gateway.
- [ ] External dependencies have fallback handlers.
- [ ] The database has no shared schemas across independent microservice domains.

### 2. Sign-off Status
- **Status:** [Go / No-Go]
- **Outstanding Actions:** [e.g. Add fallback caching to Catalog API.]
```
