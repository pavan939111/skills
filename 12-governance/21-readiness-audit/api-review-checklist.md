# API Review Checklist

## 1. Purpose
The API Review Checklist is an audit tool used to verify that public-facing endpoints respect rest guidelines, serialize camelCase properties, version paths, and document parameters.

## 2. Checklist
- [ ] HTTP verbs align with CRUD database actions
- [ ] Route structures nested inside v1/v2 namespaces
- [ ] Parameter payloads validated using strongly-typed DTOs
- [ ] Output responses map to success/error JSON envelopes
- [ ] OpenAPI documentation specs compiled and served

## 3. Cross-References
- [API development reference](../05-api-development/)
- [DTO schemas](../05-api-development/dtos.md)

## 4. Sign-off Criteria
- Approved when all endpoints return standardized error formats, enforce page limits, and match Swagger files.
