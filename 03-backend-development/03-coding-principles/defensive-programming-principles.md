# Defensive Programming in Backend Development

> [!NOTE]
> [That file covers general defensive programming checks; this file covers backend-specific application.](../../02-engineering-principles/02-core-engineering-principles/13-defensive-programming.md)

## 1. Backend Application Context
Defensive Programming is the practice of writing code that behaves predictably under unexpected conditions, verifying inputs, handling exceptions, and validating system bounds:
- **Assertive Input Validations:** Validate all incoming HTTP headers, body fields, and query parameters before processing payloads.
- **Graceful Null Checks:** Handle missing database results or API returns cleanly, returning appropriate error responses rather than crashing event loops.
- **Default Immutable Collections:** Return copy structures or immutable objects from service layers to prevent accidental changes in database query outputs.

## 2. Backend-Specific Pitfalls
- **Assuming external APIs are stable:** Making calls to third-party endpoints without configuring timeouts, retries, and fallback circuit breakers.
- **Raw parameter concatenation:** Inserting dynamic user input directly into file directories or database string runs.

## 3. Code-Shape Example
`python
# Defensive programming: input validations, null checks, timeouts
def get_user_orders_defensive(user_id: str):
    # 1. Assert input format
    if not is_valid_uuid(user_id):
        raise ValueError("Invalid user_id format")

    # 2. Safe DB fetch with Null Check
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise EntityNotFoundException(f"User {user_id} not found")

    # 3. Third-party call with timeout configurations
    try:
        orders = shipping_client.get_orders(user_id, timeout=3.0)
        return orders
    except TimeoutError:
        return get_cached_orders(user_id) # Fallback route
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Defensive Programming](../../production_principles/02-core-engineering-principles/13-defensive-programming-principles.md)
