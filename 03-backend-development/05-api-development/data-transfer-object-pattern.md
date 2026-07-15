# Data Transfer Objects (DTOs)

## 1. Definition & Core Concepts
A Data Transfer Object (DTO) is an object container designed to move structured data between software layers (e.g. from controller to service) and serialize/deserialize payloads for network transmission.

## 2. Why It Exists / What Problem It Solves
Without DTOs, applications pass raw database entities or HTTP payloads directly into business layers. This couples domain logic with database schemas and client formats. DTOs isolate these layers, defining explicit schemas for every input and output.

## 3. What Breaks in Production Without It
- **Data Mass Assignment Vulnerability:** Attackers submit extra parameters in HTTP requests (like is_admin: true) that are saved directly to database tables because the controller passed raw inputs to the repository.
- **API Response Schema Leakage:** Internal database column names or password hash fields are accidentally leaked to clients because raw entities were serialized.

## 4. Best Practices
- **Define Separate DTOs per Request:** Create distinct DTOs for create (e.g. CreateUserDto) vs update (e.g. UpdateUserDto) requests.
- **Implement Validation Rules:** Attach validation rules (using decorators like class-validator or schemas like Joi/Zod) directly to input DTOs.
- **Prune Extra Fields:** Configure DTO deserializers to strip out any fields not explicitly defined in the schema class.

## 5. Common Mistakes / Anti-Patterns
- **Reusing DTOs across features:** Sharing a single user DTO between registration, profile edits, and admin updates, causing validation errors.
- **Letting DTOs bleed into repositories:** Passing DTOs to database drivers, coupling transport logic with data storage.

## 6. Security Considerations
- **Input Sanitization:** Configure DTO parsers to strip HTML script tags and parse inputs strictly to prevent XSS attacks.

## 7. Performance Considerations
- **Optimized Mappers:** Use compiled mapping utilities to translate entities to DTOs quickly on hot API loops.

## 8. Scalability Considerations
- **Contract Enforcement:** Share DTO schemas with frontend teams using automated OpenAPI generators to ensure API contract alignment.

## 9. How Major Companies Implement It
- **Enterprise Software Teams:** Utilize strongly-typed DTOs across Java and C# microservices, enforcing strict JSON mapping compliance at code entry points.

## 10. Decision Checklist (DTO Implementations)
- Use **Strongly-typed DTO Classes** when:
  - Building production APIs that require validation, type safety, and clean isolation from database models.
- Use **Simple Dictionary Inputs** when:
  - Writing lightweight scripts, playgrounds, or quick prototype code.

## 11. AI Coding-Agent Guidelines
- Write input and output DTO classes for all new API controllers, mapping incoming JSON bodies before running services.

## 12. Reusable Checklist
- [ ] DTO schemas represent every API request input and output
- [ ] Validation decorators (Zod/class-validator) configured on DTO fields
- [ ] Deserializer configuration strips undeclared parameters (mass assignment block)
- [ ] DTOs map cleanly between controllers and services
- [ ] Password hashes and internal keys omitted from output DTOs
- [ ] DTO changes synced automatically with OpenAPI schema generators
