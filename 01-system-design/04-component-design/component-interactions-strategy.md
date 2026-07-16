# Component Interactions

## 1. What Question This Answers
"How do the internal layers and classes of a service (controllers, use cases, domain entities, adapters) interact chronologically to execute a single user request, and what rules preserve layer boundaries?"

## 2. Why It Matters at the System-Design Stage
Even with clean architecture directories, developers can write code that bypasses layers (e.g. calling a repository directly from a web router). Component interactions design maps the chronological flow of requests, enforcing layer boundaries. This ensures that:
- API parameters are validated at the ingress boundary before use cases run.
- Use cases manage business operations using domain entities, completely decoupled from database mechanics.
- Database adapters translate table results back to clean domain types before returning them to controllers.

## 3. Methodology / How to Work Through It
Trace request lifecycles chronologically:
1. **Request Ingress:** Client API hit triggers the web router, delegating to the `Controller`.
2. **Input Validation:** Controller parses JSON body parameters, runs validations, and maps them to a DTO (Data Transfer Object).
3. **Use Case Execution:** Controller passes the DTO to the `UseCase` service class.
4. **Domain Logic:** Use case loads domain `Entities` from the database via the `Repository` interface port, executing business logic.
5. **Database Egress:** Repository implementation adapter writes modifications to the database (and commits transaction).
6. **Response Outgress:** Use case returns domain results. Controller maps domain records to response schemas, returning HTTP payload.

## 4. Inputs Needed
- Folder structures and module parameters from Module Design.
- User flows and validation rules.

## 5. Outputs Produced
- Feeds into [Data Flow Design](../../13-architecture-decision-records/index.md) and code-tier sequence controllers.

## 6. Worked Example (User Registration Request Flow)
1. **Controller:** `UserController` receives `POST /users` (body: name, email).
2. **DTO mapping:** Controller maps body to `RegisterUserDTO`, verifying email regex.
3. **Use Case:** Controller calls `RegisterUserUseCase.execute(dto)`.
4. **Port Check:** Use case queries `UserRepository.existsByEmail(dto.email)`.
5. **Adapter Run:** `PgUserRepositoryAdapter` runs SQL check against Postgres, returning boolean.
6. **Entity Action:** Use case instantiates `User` entity, running password hashing.
7. **Save Egress:** Use case calls `UserRepository.save(user)`. Pg adapter writes user to SQL database.
8. **HTTP Return:** Controller receives success, maps User entity details to `UserResponseJSON`, returning HTTP 201.

## 7. Common Mistakes
- **Direct Router-to-DB calls:** Bypassing use cases and domain models, writing SQL queries directly inside HTTP route handlers.
- **Leaking DB Entities to Client Responses:** Returning raw ORM database entities directly as HTTP JSON responses, exposing database schema columns.
- **Skipping DTOs:** Passing raw, unvalidated HTTP request body objects directly to domain entity creators.

## 8. AI Coding-Agent Guidelines
1. **Always Use DTOs:** Never pass raw request payloads directly to business services.
2. **Enforce Boundary Maps:** Standardize the sequence of class calls: Controller $\rightarrow$ Use Case $\rightarrow$ Entity $\rightarrow$ Repository.
3. **Map Model Translations:** Always translate database-specific objects to domain models before returning them to controllers.
4. **Produce Component Interactions Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Component Interaction Lifecycle: [Service Name]

### 1. Chronological Call Sequence
- **Step 1 (Ingress):** [e.g. Client triggers `POST /invoices` -> Web Router -> `InvoiceController`]
- **Step 2 (Validation):** [e.g. `InvoiceController` maps payload to `CreateInvoiceDTO`, verifying non-null bounds.]
- **Step 3 (Usecase delegation):** [e.g. Controller invokes `CreateInvoiceUseCase.execute(dto)`]
- **Step 4 (Port execution):** [e.g. Use case queries `TenantRepository` port to verify tenant active status]
- **Step 5 (Domain Rule validation):** [e.g. Use case instantiates `Invoice` entity, checking tax rules]
- **Step 6 (Egress write):** [e.g. Use case calls `InvoiceRepository.save(invoice)`. Pg adapter commits write to disk.]
- **Step 7 (Response):** [e.g. Controller translates invoice domain state to JSON, returning HTTP 201.]

### 2. Boundary Isolation Checks
- **No ORM models in Controllers:** Web routing classes must never import database entities.
- **No Controller imports in Domain:** Domain entities must have zero dependencies.
```
