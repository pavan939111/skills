# KISS (Keep It Simple, Stupid) in Backend Development

> [!NOTE]
> That file covers the general KISS principle; this file covers backend-specific application.

## 1. Backend Application Context
KISS focuses on writing simple, readable API routes and business logic. It avoids unnecessary abstractions, complex framework layers, and convoluted query joins:
- **Straightforward Query Flows:** Write direct SQL queries or basic ORM actions for routine CRUD tasks rather than creating layers of interfaces.
- **Clear Routing Rules:** Organize HTTP endpoints predictably based on standard REST naming guidelines.
- **Explicit Parameter Checks:** Use basic schema validation decorators (like Joi or Class-Validator) rather than writing custom regex checking scripts.

## 2. Backend-Specific Pitfalls
- **Boilerplate Overkill:** Creating interfaces, repositories, use cases, and DTOs for a simple endpoint that merely returns a static system configurations table.
- **Convoluted SQL joins:** Joining 10 tables in a single SQL statement rather than executing two simple queries and combining them in service logic.

## 3. Code-Shape Example
`python
# Avoid: Creating multiple layers for a simple database retrieval
# Standard KISS approach for simple CRUD:
@app.get("/items/{item_id}")
def read_item(item_id: int):
    # Simple, direct lookup using db session
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [KISS Principle](../../02-engineering-principles/02-core-engineering-principles/03-kiss-principles.md)
