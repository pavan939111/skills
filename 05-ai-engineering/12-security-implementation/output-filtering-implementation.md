# Output Filtering

## 1. Definition & Core Concepts
Output Filtering is the security boundary step that scans and validates model completions before they are returned to users or executed by database scripts, checking for safety violations, PII leaks, and formatting errors.

## 2. Why It Exists / What Problem It Solves
LLMs are probabilistic and can generate harmful, toxic, or insecure text despite prompt instructions. Output filtering serves as a final gatekeeper, catching and blocking unsafe outputs before they affect client systems.

## 3. What Breaks in Production Without It
- **Toxic UI completions:** Chat assistants output offensive or discriminatory statements to customers.
- **Malformed payload crashes:** Systems crash because the model returned free-form text instead of JSON.
- **Cross-site scripting (XSS):** Models generate text containing malicious script tags, which run in user browsers.

## 4. Best Practices
- **Implement Output Moderations:** Run model responses through toxicity classifiers (e.g. Llama Guard) in real-time.
- **Enforce JSON schema parsing:** Validate outputs against strict schemas (Zod/Pydantic) before returning records.
- **Sanitize HTML characters:** Escape script tags (e.g. `<script>`) to prevent execution in user browsers.

## 5. Common Mistakes / Anti-Patterns
- **Assuming prompt rules are enough:** Believing that instructing the model to "be safe" prevents toxic outputs.
- **Returning raw JSON code blocks without parsing:** Directly outputting model text to downstream APIs.

## 6. Security Considerations
- **Override protections:** Block outputs that contain system instruction details.

## 7. Performance Considerations
- **Filter Latency:** Keep output scanners fast (under 50ms) to maintain low perceived latency.

## 8. Scalability Considerations
- **Concurrency checks:** Size worker threads to handle output validations under high QPS.

## 9. How Major Companies Implement It
- **Microsoft:** Uses Azure AI Content Safety filters to scan and block unsafe completions.
- **OpenAI:** Operates a global moderation service to filter outputs.

## 10. Decision Checklist (Filter Tiers)
- Enforce **Toxicity Classifiers + HTML Sanitization** on:
  - All public-facing conversational interfaces and search portals.
- Enforce **Schema Validation** when:
  - Data is consumed by API endpoints or databases.

## 11. AI Coding-Agent Guidelines
- Always wrap model client calls in sanitization filters that escape script tags before displaying outputs in UI screens.

## 12. Reusable Checklist
- [ ] Toxicity content filters active on output routes
- [ ] Zod/Pydantic schema validation active for structured inputs
- [ ] HTML sanitization active (script tags escaped)
- [ ] Dynamic variable checks block system instructions exposures
- [ ] Output verification latency monitored
- [ ] Unit tests verify filtering under toxic completions
