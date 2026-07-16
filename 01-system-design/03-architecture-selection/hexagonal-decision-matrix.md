# Hexagonal Architecture (Ports and Adapters)

## 1. What Question This Answers
"How do we isolate the application core using Ports (interfaces) and Adapters (implementations) to allow switching external technologies (databases, web protocols, notification gateways) without modifying business code?"

## 2. Why It Matters at the System-Design Stage
Hexagonal Architecture (Ports and Adapters) is a physical layout implementation of Clean Architecture principles. It solves the problem of tech coupling. By encapsulating the application core behind defined ingress and egress ports, the core remains unaware of whether it is being triggered by a REST API, a CLI command, or a test runner (ingress adapters), or whether it is saving data to a Postgres DB, a Mock cache, or a cloud bucket (egress adapters). This enables local, mock-free testing, protects code from tech migrations, and isolates core business logic.

## 3. Methodology / How to Work Through It
1. **Identify the Application Core:** Define the business domain service that executes the functional use cases.
2. **Declare Inbound Ports (Driving Ports):** Write interfaces defining what actions clients can trigger in the application core (e.g. `OrderUseCasePort`).
3. **Declare Outbound Ports (Driven Ports):** Write interfaces defining what external actions the core must trigger (e.g. `DatabasePort`, `NotificationPort`).
4. **Implement Adapters:**
  - *Driving Adapters (Ingress):* Express routers, GraphQL resolvers, or CLI scripts that call the driving ports.
  - *Driven Adapters (Egress):* Postgres repository classes or SendGrid email client classes that implement the driven ports.

## 4. Inputs Needed
- Product flows and functional requirements from [Functional Requirements](../../00-product-analysis/functional-requirements-analysis.md).
- Third-party legacy APIs and database integration rules.

## 5. Outputs Produced
- Feeds into code-tier folder layouts and [Component Design](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Order Payment Integration)
- **Application Core:** `PaymentProcessorService` (manages validation, charges logic).
- **Driving Port (Inbound):** `ProcessPaymentUseCase` interface.
- **Driving Adapter:** `RESTPaymentController` (receives HTTP POST `/payment`, parses body, calls `ProcessPaymentUseCase.execute()`).
- **Driven Port (Outbound):** `PaymentGatewayPort` (defines `chargeCard(amount)`).
- **Driven Adapter:** `StripePaymentAdapter` (implements `PaymentGatewayPort`, makes API calls to Stripe SDK).
- **Result:** To replace Stripe with PayPal, we write a `PayPalPaymentAdapter` implementing `PaymentGatewayPort` and swap it via Dependency Injection (DI) configuration, leaving the core business code unmodified.

## 7. Common Mistakes
- **Leaking Infrastructure Models into Ports:** Defining ports that return database-specific ORM model instances (e.g. returning a Postgres entity) instead of clean domain records, exposing database details to the core.
- **No Dependency Injection:** Hardcoding concrete adapters creation inside the core (e.g. `PaymentGatewayPort gateway = new StripePaymentAdapter();`), breaking port decoupling.
- **Confusing Driving and Driven Ports:** Writing inbound REST endpoints as driven ports, breaking request flows.

## 8. AI Coding-Agent Guidelines
1. **Separate Ports and Adapters:** Keep ports (interfaces) in the core domain directories and adapters (implementations) in outer directories.
2. **Enforce Type Mappings:** Do not allow database-native objects to cross port boundaries. Use clean domain model objects.
3. **Map Dependency Injection:** Require dependency injection configurations to link ports to active adapters at boot.
4. **Produce Hexagonal Design specs:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Hexagonal Architecture Design: [System Name]

### 1. Application Core Boundaries
- **Core Domain:** [Folder: `/core/domain` | Contains business entities, validations]
- **Core Services:** [Folder: `/core/services` | Implements driving ports, coordinates business use cases]

### 2. Ports (Interfaces)
- **Driving Ports (Inbound - Ingress):**
  - `/core/ports/inbound/CreateUserUseCase.ts` (defines `execute(name, email)`)
- **Driven Ports (Outbound - Egress):**
  - `/core/ports/outbound/UserPersistencePort.ts` (defines `save(user)`)
  - `/core/ports/outbound/NotificationPort.ts` (defines `sendEmail(userId, msg)`)

### 3. Adapters (Implementations)
- **Driving Adapters (Inbound):**
  - `/adapters/inbound/UserController.ts` (REST API client controller)
- **Driven Adapters (Outbound):**
  - `/adapters/outbound/PostgresUserAdapter.ts` (implements `UserPersistencePort`)
  - `/adapters/outbound/SendGridEmailAdapter.ts` (implements `NotificationPort`)
```
