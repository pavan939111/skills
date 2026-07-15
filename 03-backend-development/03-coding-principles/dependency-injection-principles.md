# Dependency Injection in Backend Development

## 1. Backend Application Context
Dependency Injection (DI) is the design pattern of passing dependency instances into classes (typically via constructors) rather than letting classes instantiate their own dependencies internally:
- **Constructor Injection:** Pass database repository instances into service constructors during bootstrap initialization.
- **DI Containers:** Use framework containers (like NestJS @Module bindings, Spring @Autowired, or FastAPI Depends) to manage the creation and lifetime of singleton classes.
- **Testing Mocks:** Substitute real payment gateway clients with mock clients in test suites by passing different instances during constructor creation.

## 2. Backend-Specific Pitfalls
- **Instantiating classes in service code:** Writing self.repo = PostgresUserRepository() inside a constructor, coupling the service directly to PostgreSQL and blocking mock database tests.
- **Over-registering transient lifecycles:** Creating new class instances on every single API request, increasing memory garbage collector workloads. Use singleton lifecycle configurations by default.

## 3. Code-Shape Example
`python
# Constructor Dependency Injection
class StripePaymentGateway:
    def charge(self, amount: int):
        stripe.charge(amount)

class CheckoutService:
    def __init__(self, payment_gateway):
        self.gateway = payment_gateway  # Dependency Injected

    def process_checkout(self, amount: int):
        self.gateway.charge(amount)

# Application Bootstrap Setup (DI Container instantiation)
payment_gateway = StripePaymentGateway()
checkout_service = CheckoutService(payment_gateway)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [SOLID Principles](../../production_principles/02-core-engineering-principles/01-solid-principles.md) (Dependency Inversion)
