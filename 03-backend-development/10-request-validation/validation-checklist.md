# Validation Checklist

## 1. Definition & Core Concepts
The Validation Checklist is an audit tool used to verify that request parsing, response schemas, sanitizers, and custom validation rules are configured correctly.

## 2. Why It Exists / What Problem It Solves
It ensures that endpoints are protected against bad data inputs and information leaks.

## 3. What Breaks in Production Without It
- **Security Exploits:** Malicious inputs cause remote executions or database injections.

## 4. Best Practices
- **Audit All Routes:** Verify validation rules exist for every request parameter.
- **Verify Error Payload Formats:** Confirm validation failures return HTTP 400 with a details list.

## 5. Common Mistakes / Anti-Patterns
- **Skipping validations on testing routes:** Leaving testing routes un-validated.

## 6. Security Considerations
- **Defense in depth:** Validate at both the API Gateway, Controller, and Service boundaries.

## 7. Performance Considerations
- **Compiled Validation Models:** Ensure validation schemas compile on startup.

## 8. Scalability Considerations
- **Unified Schema Syncing:** Document and update specifications in OpenAPI formats.

## 9. How Major Companies Implement It
- **SaaS Enterprises:** Mandate that all PRs pass automated schema validation checks before release.

## 10. Decision Checklist (Validation Review)
- Approve **Validation Release** when:
  - Input validations are active, sanitization blocks XSS, and error responses return HTTP 400.

## 11. AI Coding-Agent Guidelines
- Review validation configurations and error output formats for all new endpoints.

## 12. Reusable Checklist
- [ ] Inputs (query, headers, body) validated at API entry points
- [ ] DTO schema decorators enforce types, ranges, and formats
- [ ] Text inputs sanitized to prevent XSS and SQL injection
- [ ] Failed validations return HTTP 400 with error details
- [ ] Output responses map to DTOs to hide private database columns
- [ ] Regex patterns checked to prevent CPU recursion bottlenecks
