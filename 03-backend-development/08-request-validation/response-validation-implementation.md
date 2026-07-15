# Response Validation

## 1. Definition & Core Concepts
Response Validation is the check performed on outgoing API payloads before they are serialized and sent to clients, ensuring they conform to API contracts.

## 2. Why It Exists / What Problem It Solves
It prevents the accidental exposure of internal database fields, system details, or sensitive user information.

## 3. What Breaks in Production Without It
- **Information Leakage:** Database passwords or internal system IDs are returned to clients.
- **Contract Drift:** Response structures change, breaking client applications.

## 4. Best Practices
- **Map to Explicit DTOs:** Convert entities to output DTOs using serializer mappers.
- **Enforce Strict Schemas:** Validate outputs against schemas in integration tests.
- **Strip Private Fields:** Redact password hashes, security keys, and internal IDs.

## 5. Common Mistakes / Anti-Patterns
- **Direct Entity Serialization:** Returning database model instances directly in responses.

## 6. Security Considerations
- **Data Protection:** Confirm that PII is masked or encrypted before sending.

## 7. Performance Considerations
- **Efficient Serialization:** Keep serialization steps fast to avoid blocking event loops.

## 8. Scalability Considerations
- **Consistent Contracts:** Verify API version schemas match client specifications.

## 9. How Major Companies Implement It
- **Google:** Defines strict response contracts, automatically stripping fields not defined in the specification.

## 10. Decision Checklist (Response Design)
- Use **Output DTO Classes** when:
  - Returning sensitive data that requires strict sanitization.

## 11. AI Coding-Agent Guidelines
- Write mapper functions that translate entities to DTOs, validating that sensitive fields are omitted.

## 12. Reusable Checklist
- [ ] Output payloads mapped to explicit DTO objects
- [ ] Password hashes and security keys redacted from outputs
- [ ] API responses match documented OpenAPI schemas
- [ ] System stack traces stripped from production error responses
- [ ] Output properties use camelCase formatting consistently
- [ ] Integration tests validate response schemas
