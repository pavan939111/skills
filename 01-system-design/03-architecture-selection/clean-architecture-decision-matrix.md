# Clean Architecture

## 1. What Question This Answers
"How do we structure a software application to isolate core business rules (entities, use cases) from external infrastructure dependencies (databases, web servers, frameworks), ensuring maintainability and ease of testing?"

## 2. Why It Matters at the System-Design Stage
A common architectural failure is coupling business logic directly to database schemas and frameworks (e.g. putting calculations directly in SQL queries or framework route handlers). When the database engine must be changed (e.g., migrating from Postgres to DynamoDB) or the framework upgrades, the entire codebase must be rewritten. Clean Architecture solves this by enforcing concentric dependency layers: dependencies can only point inward. The core business rules are unaware of the database or framework.

## 3. Methodology / How to Work Through It
1. **Define the Domain Core (Entities):** Model core business data objects and rules that are completely framework-agnostic.
2. **Define Use Cases (Interactors):** Outline application-specific business workflows (e.g. processing a check, registering a user).
3. **Declare Interface Adapters (Gateways):** Write interfaces (ports) that translate data between use cases and external systems.
4. **Isolate Infrastructure (Frameworks/Drivers):** Place databases, web servers, CDNs, and UI frameworks in the outermost layer.
5. **Enforce the Dependency Rule:** Ensure that code in inner circles has zero references to classes or packages defined in outer circles.

## 4. Inputs Needed
- Product user flows and business rules from [User Flows](../../00-product-analysis/user-flows-analysis.md).
- Architectural patterns selection targets.

## 5. Outputs Produced
- Feeds into [Component Design](../../13-architecture-decision-records/index.md) and code-tier directory structures.

## 6. Worked Example (User Registration Pipeline)
- **Domain Entity:** `User` class (holds validation logic, has no reference to database libraries or ORMs).
- **Use Case:** `RegisterUserUseCase` class (coordinates check: does email exist, hash password, write to catalog).
- **Interface Port:** `UserRepository` interface (declares `save(user)` and `existsByEmail(email)`). Use case interacts only with the interface.
- **Infrastructure Adapter:** `PostgresUserRepository` class (implements `UserRepository`, imports ORM libraries, writes SQL to Postgres database).
- **Control Flow:** Web router (Express/Spring) triggers the Use Case, passing input parameters. Use case runs, calling the `UserRepository` interface, which delegates to the `PostgresUserRepository` adapter.

## 7. Common Mistakes
- **Leaking ORM Entities into the Domain Core:** Importing ORM decorators directly into domain entity classes, coupling them to database schemas.
- **Direct Database Imports in Use Cases:** Allowing use cases to import SQL query runners or database driver clients directly.
- **No Boundary Interfaces:** Skipping interface declarations and calling concrete infrastructure classes directly, blocking testing and mocking.

## 8. AI Coding-Agent Guidelines
1. **Isolate Business Entities:** Never import framework libraries (like Express, Django, pg) into core domain directories.
2. **Define Repository Interfaces:** Write clean contracts for all database operations.
3. **Enforce Inward Dependencies:** Enforce import directions via compiler rules or linters.
4. **Produce Clean Architecture spec:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Clean Architecture Blueprint: [System Name]

### 1. Concentric Layer Structure
- **Layer 1: Entities (Core Domain):** [Folder: `/domain/entities` | Framework-agnostic business rules]
- **Layer 2: Use Cases (Interactors):** [Folder: `/domain/usecases` | Coordinates business workflow execution]
- **Layer 3: Interface Adapters (Gateways):** [Folder: `/adapters` | Repository interfaces, controllers]
- **Layer 4: Infrastructure (Frameworks):** [Folder: `/infrastructure` | Database drivers, Express web routes]

### 2. Dependency Rule Enforcement
- **Dependency Flow:** `/infrastructure` → `/adapters` → `/domain/usecases` → `/domain/entities` (Dependencies point strictly inward).
- **Boundary Contract example:**
  - `/domain/usecases` declares: `interface TransactionRepository { save(tx); }`
  - `/infrastructure` implements: `class PostgresTransactionRepository implements TransactionRepository { ... }`
```
