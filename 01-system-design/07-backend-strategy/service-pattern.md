# Service Pattern Strategy

### 1. The Question Decided
"Which service logic pattern (Transaction Script vs. Active Record vs. Domain Model) should structure the core backend business tier?"

### 2. Options Compared
| Dimension | Transaction Script | Active Record | Domain Model (DDD) |
|---|---|---|---|
| **Cost (Development)** | Low | Low | High |
| **Complexity** | Low | Low-Medium | High |
| **Encapsulation** | Low (Logic in scripts) | Medium (Logic in entity) | High (Pure domain boundaries) |
| **Familiarity** | High | High | Medium |
| **Suitability** | Simple CRUD APIs | CRUD + Minor rules | Complex business logic |

### 3. Decision Rule
- **Choose Transaction Script/Active Record if:** The application logic is CRUD-centric with simple state changes (e.g. data catalogs, blog systems).
- **Choose Domain Model if:** The application has complex, overlapping business rules, multi-stage workflows, or strict state consistency boundaries.

### 4. Red Flags to Revisit
- Transaction script methods expand past 500 lines of code, becoming impossible to test or modify without regressions.
- Business rules are duplicated across multiple controllers because they lack a central domain model container.

### 5. Where to Go Next
- For implementation guidelines on service patterns and DDD coding setups, see [Service Layer Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development06-business-services/service-layer-implementation.md).
- For use case patterns design in code, see [Use Cases Implementation](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development06-business-services/use-cases-implementation.md).
