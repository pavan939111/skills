# Separation of Concerns in Backend Development

> [!NOTE]
> [That file covers general separation of concerns; this file covers backend-specific application.](../../02-engineering-principles/02-core-engineering-principles/05-separation-of-concerns.md)

## 1. Backend Application Context
Separation of Concerns (SoC) divides a backend codebase into distinct sections, each handling a single technical or operational responsibility:
- **Middleware Layer:** Handles request logging, CORS headers, token authentication, and body parsing.
- **Controller/Routing Layer:** Maps HTTP endpoints, validates incoming payloads, and formats API JSON responses.
- **Service Logic Layer:** Implements business validation rules, workflows, and transaction state coordination.
- **Data Access Layer:** Interfaces with database clients, processes SQL queries, and maps results to schemas.

## 2. Backend-Specific Pitfalls
- **Leaking HTTP details into Services:** Passing Express request or response objects directly into business service functions, making testing in isolation impossible.
- **SQL strings in Controllers:** Writing raw SQL queries inside route definitions.

## 3. Code-Shape Example
`python
# Middleware (Concern: Authentication)
def auth_middleware(request):
    token = request.headers.get("Authorization")
    if not validate_token(token):
        return error_response(401)
    return proceed()

# Controller (Concern: Request Validation & API Mapping)
def get_user_controller(request):
    user_id = request.params.get("id")
    if not user_id:
        return bad_request()
    user = userService.get_user(user_id)
    return json_response(user)

# Service (Concern: Business Logic)
class UserService:
    def get_user(self, user_id):
        return dbRepository.find_by_id(user_id)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Separation of Concerns](../../production_principles/02-core-engineering-principles/05-separation-of-concerns-principles.md)
