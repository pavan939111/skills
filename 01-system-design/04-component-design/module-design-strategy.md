# Module Design

## 1. What Question This Answers
"How do we organize the internal code structure, directory paths, and class groupings of a service module to ensure encapsulation and prevent structural drift?"

## 2. Why It Matters at the System-Design Stage
Even if service boundaries are correct, the internal code structure of a module can decay over time. Without a clear module design, developers write ad-hoc directory layouts, mix database logic with HTTP routes, and bypass boundary rules. Module design establishes a standardized folder layout and code structure. This ensures code cleanliness, speeds up onboarding, and enforces the separation of concerns.

## 3. Methodology / How to Work Through It
1. **Choose an Internal Architecture Pattern:** Standardize on a pattern (e.g. Hexagonal, Clean, or layered folder designs).
2. **Define Directory Layouts:** Specify exact directory structures for controllers, domains, repositories, and interfaces.
3. **Declare Interface Segregations:** Group classes into distinct logic tiers:
   - *Inbound Interface:* Web controllers, CLI handlers.
   - *Core Business Logic:* Use cases, services, entities.
   - *Outbound Infrastructure:* Repositories, API adapters.
4. **Enforce Boundary Control Linters:** Define lint rules to block invalid folder imports.
5. **Decouple using dependency injection:** Wire component dependencies dynamically.

## 4. Inputs Needed
- Architectural selections from Modular Monolith or Clean Architecture.
- Domain models definitions.

## 5. Outputs Produced
- Feeds into Dependency Design and code repositories.

## 6. Worked Example (Standard Payment Module)
- **Directory Layout:**
  - `/payment-service`
    - `/src`
      - `/domain` (entities: `Invoice`, `Transaction`)
      - `/application` (usecases: `ProcessPaymentUseCase`, repository ports)
      - `/infrastructure`
        - `/db` (PostgreSQL models, repositories)
        - `/web` (API controllers, routes)
- **Dependency Flow:** `/infrastructure/web` triggers `/src/application`, which queries `/src/domain`.

## 7. Common Mistakes
- **Spaghetti Folder Structure:** Having no directory standards, allowing developers to create folders arbitrarily.
- **Leaking DB logic to routes:** Exposing raw SQL execution blocks inside HTTP router controllers.
- **Shared Domain models:** Sharing domain entity files across separate service directories, creating dependencies.

## 8. AI Coding-Agent Guidelines
1. **Enforce Layered Directories:** Always structure generated code templates using the standardized directory layout.
2. **Isolate SQL in Repositories:** Never write database queries in web controller files.
3. **Use Dependency Injection:** Configure DI classes to link interfaces to adapters at boot.
4. **Produce Module Design Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Module Directory Structure & Design: [Service Name]

### 1. Standardized Directory Layout
```
[service-root]/
├── src/
│   ├── domain/               (Pure business entities & validations)
│   │   └── User.ts
│   ├── application/          (Use cases, repository ports/interfaces)
│   │   ├── ports/
│   │   │   └── UserRepository.ts
│   │   └── CreateUser.ts
│   └── infrastructure/       (API routes, database adapters, configurations)
│       ├── controllers/
│       │   └── UserController.ts
│       └── db/
│           └── PostgresUserRepository.ts
```

### 2. Layer Communication Rules
- **Web Requests Ingress:** Routes connect to `UserController`, which parses inputs and executes `CreateUser` use case.
- **Database Egress:** Use case calls `UserRepository` interface port, implemented by `PostgresUserRepository` adapter.
- **Dependency Isolation:** No file in `/domain` or `/application` may import files from `/infrastructure`.
```
