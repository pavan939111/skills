# Data Sanitization

## 1. Definition & Core Concepts
Data Sanitization is the process of cleaning, escaping, or stripping input values to prevent cross-site scripting (XSS), SQL injection, and path traversal vulnerabilities.

## 2. Why It Exists / What Problem It Solves
User input cannot be trusted. Sanitization removes malicious scripts, formats strings, and prepares data for database storage or rendering.

## 3. What Breaks in Production Without It
- **XSS Attacks:** Unsanitized HTML tags are executed in other users' browsers.
- **SQL Injections:** Special characters bypass query boundaries.

## 4. Best Practices
- **Sanitize HTML Inputs:** Strip <script> tags using libraries like DOMPurify.
- **Escape SQL Values:** Use parameterized queries to bind inputs.
- **Normalize Strings:** Trim spaces and normalize unicode strings.

## 5. Common Mistakes / Anti-Patterns
- **Custom Regex Sanitizers:** Writing custom regex checks that fail to match advanced scripts.

## 6. Security Considerations
- **XSS Prevention:** Sanitize inputs before database storage and encode output data on rendering.

## 7. Performance Considerations
- **Lightweight Sanitizers:** Use optimized libraries to avoid blocking request loops.

## 8. Scalability Considerations
- **Gateway Filters:** Sanitize requests at API gateways to protect downstream services.

## 9. How Major Companies Implement It
- **Salesforce:** Enforces strict HTML escaping on all inputs to protect customer portals.

## 10. Decision Checklist (Sanitization Actions)
- Use **HTML Sanitizers** when:
  - Users submit rich text inputs that will be rendered in browsers.

## 11. AI Coding-Agent Guidelines
- Write sanitizers that trim strings, strip HTML tags, and prepare text inputs.

## 12. Reusable Checklist
- [ ] Rich text inputs run through a verified HTML sanitizer library
- [ ] Database variables bind using parameterized SQL queries
- [ ] String parameters trimmed and normalized on input
- [ ] File paths sanitized to prevent traversal attacks (../)
- [ ] Output encoding active for rendering dynamic user data
- [ ] Test suites check inputs with malicious scripts
