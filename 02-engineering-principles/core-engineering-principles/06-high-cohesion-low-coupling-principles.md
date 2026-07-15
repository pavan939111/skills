# High Cohesion & Low Coupling

## 1. Definition & Core Concepts

High Cohesion and Low Coupling are core software design principles used to build modular, maintainable, and testable applications.

- **Cohesion:** Measures how focused and closely related the responsibilities of a single class, module, or package are. *High Cohesion* means a module does one clear job, and all its internal methods are dedicated to that job.
- **Coupling:** Measures the degree of direct dependency and interconnection between different modules. *Low Coupling* means modules are highly independent; changing the internal implementation of Module A has little or no impact on Module B.

## 2. Why It Exists

As systems grow, they become complex. If coupling is high, the system exhibits the "Ripple Effect": modifying a database field in the Billing module breaks code inside the Notification, Inventory, and User modules because they all depend directly on the Billing class's internals. High cohesion and low coupling localize changes, making code updates safer and testing much simpler.

## 3. What Breaks in Production Without It

- **The Ripple Effect (Fragile Code):** A bug fix in one class causes silent compilation or runtime errors in five other unrelated features because of tight, undocumented dependencies.
- **Mock Explosion in Tests:** Writing a simple unit test for a single class requires instantiating 15 mock objects because the class is tightly coupled to half the codebase.
- **Scattered Domain Logic:** A business rule is updated, but bugs occur because the related logic was scattered across multiple low-cohesion classes, and the developer forgot to update all locations.
- **Microservice Lockstep Deploys:** Supposedly independent microservices are so tightly coupled via shared databases or synchronous API dependencies that they cannot be deployed individually, requiring coordinated "big bang" releases.

## 4. Best Practices

- **Connect Modules via Interfaces:** Never depend directly on concrete classes for external dependencies. Depend on interfaces/abstractions. This allows swapping implementations (e.g., swapping a PostgreSQL repository for a MySQL one) without touching the consuming module (low coupling).
- **Group by Common Purpose (High Cohesion):** Design classes so that all methods operate on the same core dataset and serve a single business actor (e.g. keeping all tax-calculation logic inside `TaxCalculator`, rather than mixing it with `UserInvoiceFormatter`).
- **Limit Constructor Dependencies:** If a class requires more than 3 to 4 dependencies in its constructor, it is likely doing too much (low cohesion) and is too tightly coupled. Split it into smaller collaborator classes.
- **Use Event-Driven Communication:** Instead of Service A calling Service B directly (tight coupling), have Service A publish an event (e.g., `OrderPlaced`) to a message broker. Service B subscribes to the event, decoupling them in runtime space.
- **Avoid Shared Mutable State:** Do not share global variables, static maps, or shared database instances directly between modules. Keep module states encapsulated.

## 5. Common Mistakes / Anti-Patterns

- **The God Class (Low Cohesion):** Creating a single `UserService` that handles validation, database CRUD, email notifications, payment API coordination, and logging formatting.
- **Feature Envy (Tight Coupling):** Method A in Class A repeatedly calls getters on Class B to calculate something. The logic should reside inside Class B instead.
- **Database-Level Coupling:** Having multiple microservices write directly to the same database tables. This locks their data schemas and prevents independent updates.
- **Inappropriate Intimacy:** Class A directly accesses and modifies private fields or internal states of Class B, bypassing Class B's public interface methods.

## 6. Security Considerations

- **Blast Radius Reduction:** Low coupling limits the security blast radius. If an attacker exploits a vulnerability in a loosely coupled file-parsing module, they cannot easily traverse into the security token validation module if they are separated by clean, validated interfaces.

## 7. Performance Considerations

- **Interface Indirection:** Connecting everything via interfaces and layers introduces a slight CPU execution overhead due to polymorphism lookups. However, this is negligible in 99% of business applications; prioritize clean architecture over micro-optimization.

## 8. Scalability Considerations

- **Monolith-to-Microservices Path:** A monolithic codebase designed with high cohesion and low coupling can be easily split into independent microservices because the domain boundaries are already defined and isolated by clean interfaces.

## 9. How Major Companies Implement It

- **Uber:** Implements Domain-Driven Design (DDD). They group microservices into "Domains" containing highly cohesive services, and enforce low coupling between domains by routing all communication through clean gRPC interfaces with strict payload contracts.
- **Amazon:** Enforces a "two-pizza team" rule where teams own independent services. Services are prohibited from sharing databases or reading internal states directly; they communicate exclusively via published public APIs.

## 10. Decision Checklist

- Enforce **High Cohesion & Low Coupling** on: Core business logic, domain models, database abstractions, integration adapters, and microservice interfaces.
- Accept **Tighter Coupling** ONLY when: Creating local, highly specialized helper sub-classes (e.g., a custom data-builder class created specifically for a single test suite).

## 11. AI Coding-Agent Implementation Guidelines

- Always design classes to do one focused job — if a class handles both calculations and networking/persistence, split it.
- Never import concrete repository or service classes directly inside domain controllers — always inject them via interfaces or abstractions.
- Always keep class constructor argument lists small (limit to maximum 4 dependencies).
- Never allow external classes to modify class properties directly — enforce encapsulation by keeping fields private.
- Always use event publishers or public API contracts to communicate across service boundaries.
- Never write domain logic that directly depends on specific database engine drivers.

## 12. Reusable Checklist

- [ ] Each class/module has a single, focused purpose (high cohesion)
- [ ] Modules interact via interfaces/abstractions, not concrete classes (low coupling)
- [ ] Constructors limit dependencies to maximum 4 arguments (split if exceeded)
- [ ] No global mutable variables or shared database instances bypass boundaries
- [ ] No "Feature Envy" (methods reside where the data they manipulate lives)
- [ ] All class properties are private, protecting internal states
- [ ] Inter-service calls use event brokers or public API endpoints
- [ ] Unit tests for a module mock dependencies cleanly, requiring minimal mocks (<4)
