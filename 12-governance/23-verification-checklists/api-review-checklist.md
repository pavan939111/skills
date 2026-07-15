# API Review Checklist

## 1. Purpose
The API Review Checklist is an audit tool used to verify that new endpoints implement versioning, correct status codes, DTO schemas, and pagination limits.

## 2. Checklist
- [ ] Route nested within version directories (e.g. /api/v1/)
- [ ] Payload arguments validated using DTO classes
- [ ] Error payloads format JSON responses consistently
- [ ] List queries configure limit parameters (default and max)
- [ ] OpenAPI documentation annotations updated and generated

## 3. Cross-References
- [API development reference](../05-api-development/)
- [Response formatting](../05-api-development/response-formatting.md)

## 4. Sign-off Criteria
- Approved when endpoints match Swagger specs, handle validation errors, and enforce pagination limits.
