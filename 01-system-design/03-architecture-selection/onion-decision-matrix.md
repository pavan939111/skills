# Onion Architecture

## 1. What Question This Answers
"How do we structure an application using concentric layers where the Domain Model is the absolute core, and all dependencies flow strictly inward toward this center?"

## 2. Why It Matters at the System-Design Stage
Onion Architecture is a specialized variation of Clean and Hexagonal Architectures focusing on Domain-Driven Design (DDD). It places the Domain Model (entities, value objects) at the absolute center of the system. The Application Core (use case services) wraps the domain. The UI, testing frameworks, database drivers, and security layers form the outer skins. By enforcing that all coupling points toward the center, the business domain model remains pure, highly testable, and completely decoupled from framework and database details.

## 3. Methodology / How to Work Through It
1. **Design the Domain Model Core:** Model core domain objects (Entities, Value Objects) that capture business rules and rules constraints.
2. **Design Domain Services:** Implement domain-level interfaces and calculators that operate across multiple entities.
3. **Design the Application Core (Services):** Write application services that implement use cases, managing transaction controls.
4. **Declare Repository Interfaces:** Place database interface contracts in the Application Core layer.
5. **Implement Outer Infrastructure Layers:** Place the concrete databases, controllers, web frameworks, and file storage systems in the outermost layer.

## 4. Inputs Needed
- Product domain definitions and workflows from [User Flows](../../00-product-analysis/user-flows-analysis.md).
- System-level non-functional constraints.

## 5. Outputs Produced
- Feeds into code-tier repository structures and [Component Design](../../13-architecture-decision-records/index.md).

## 6. Worked Example (SaaS Pricing Engine)
- **Domain Model (Center):** `SubscriptionPlan` entity (calculates discount rules based on user age, has no DB dependencies).
- **Domain Services:** `PricingCalculator` (calculates VAT based on user location country codes).
- **Application Services:** `ProcessSubscriptionUseCase` (reads user plan, runs `PricingCalculator`, saves state using repository interface).
- **Repository Interface:** `SubscriptionRepository` (declared in Application Service layer).
- **Infrastructure (Outer Skin):** `PostgreSQLSubscriptionRepository` (implements the interface, queries database) and `GraphQLRouter` (handles user API requests).

## 7. Common Mistakes
- **Database Model Pollution:** Letting database entities (e.g. TypeORM or Hibernate classes) infect the central Domain Model core, coupling business logic to table schemas.
- **Outward Dependency Leaks:** Importing router classes or API controllers inside the domain core.
- **No Domain Services Segregation:** Mixing application use case coordination (e.g. emailing users) with pure domain calculations inside entity classes.

## 8. AI Coding-Agent Guidelines
1. **Protect the Domain Core:** Never allow imports of external libraries (Express, Django, database drivers) inside the `/domain` folder.
2. **Interface Repository Definition:** Declare all repository contracts inside application-level services folders.
3. **Use Domain Objects:** Ensure database adapters map database entities to clean domain model objects before returning them to services.
4. **Produce Onion Design Blueprint:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Onion Architecture Blueprint: [System Name]

### 1. Concentric Layer Definitions
- **Layer 1: Domain Model (Center):** [Folder: `/core/domain/model` | Entities, Value Objects, Domain Exceptions]
- **Layer 2: Domain Services:** [Folder: `/core/domain/services` | Domain-level calculations across entities]
- **Layer 3: Application Services:** [Folder: `/core/application` | Use cases, repository interfaces]
- **Layer 4: Infrastructure (Outer Skin):** [Folder: `/infrastructure` | Database repositories, API routes]

### 2. Inward Dependency Enforcement
- **Dependency Flow Rules:** `/infrastructure` imports `/core/application` imports `/core/domain`. Inner layers import nothing from outer layers.
- **Interface Segregation:**
  - `/core/application/UserRepo.ts` defines: `save(user: User): void`
  - `/infrastructure/db/PgUserRepo.ts` imports `UserRepo` and implements it using SQL.
```
