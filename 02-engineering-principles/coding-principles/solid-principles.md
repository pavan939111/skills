# SOLID Principles in Backend Development

## 1. Backend Application Context
In backend services, SOLID principles guide the structure of API routers, service business layers, and data access repositories:
- **Single Responsibility (SRP):** Controllers handle HTTP request parsing and status code mapping only; services contain business logic; repositories handle SQL query operations.
- **Open/Closed (OCP):** Implement payment or notification providers as plugins, adding new providers without editing core order workflow logic.
- **Liskov Substitution (LSP):** Mock databases in test suites by substituting real repositories with in-memory counterparts without breaking services.
- **Interface Segregation (ISP):** Clients import only narrow repository read interfaces rather than full write-enabled interfaces.
- **Dependency Inversion (DIP):** Service classes import database repository *interfaces* rather than direct database driver implementation files.

## 2. Backend-Specific Pitfalls
- **Direct framework imports in domain core:** Importing framework decorators (like NestJS @Injectable or Express request types) inside core business classes, breaking SRP.
- **Leaking database models to controller layers:** Letting ORM database entities bleed directly into API responses, coupling database schemas with public APIs.

## 3. Code-Shape Example
`python
# Interface (Port) defining contract (DIP)
class UserRepository:
    def get_by_id(self, user_id: str) -> dict:
        raise NotImplementedError

# Concrete implementation (Adapter)
class PostgresUserRepository(UserRepository):
    def get_by_id(self, user_id: str) -> dict:
        return db.query("SELECT * FROM users WHERE id = %s", user_id)

# Service layer dependent on Interface, not concrete driver (SRP & DIP)
class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo  # Dependency Injection
        
    def get_profile(self, user_id: str) -> dict:
        return self.repo.get_by_id(user_id)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [SOLID Principles](../../production_principles/core-engineering-principles/01-solid-principles.md)
