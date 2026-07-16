# High Cohesion & Low Coupling in Backend Development

> [!NOTE]
> That file covers general cohesion and coupling metrics; this file covers backend-specific application.

## 1. Backend Application Context
Cohesion measures how closely related the functions inside a class or folder are; coupling measures how dependent different codebase modules are on each other:
- **High Cohesion (Feature modules):** Grouping controllers, schemas, and queries for /orders in a single folder ensures that order-related changes are isolated.
- **Low Coupling (Interfaces):** Modules communicate using public service interfaces or message queues, never by importing internal database implementation files or variables.

## 2. Backend-Specific Pitfalls
- **Shared Database Coupling:** Letting module A query module B's database tables directly, which breaks modularity and causes database locks when module schemas are modified.
- **Global utility files:** Dumping database actions, date string formatters, and authentication utilities into a single helpers.js file, coupling unrelated features.

## 3. Code-Shape Example
`python
# Low Coupling Example: OrderService queries InventoryService via its public API,
# rather than querying the inventory database table directly.

class InventoryService:
    def check_stock(self, item_id: str) -> bool:
        return db.query("SELECT in_stock FROM inventory WHERE item_id = %s", item_id)

class OrderService:
    def __init__(self, inventory_service: InventoryService):
        self.inventory = inventory_service  # Weak connection via reference dependency

    def create_order(self, order_dto):
        # Call public API, not inventory database queries
        if not self.inventory.check_stock(order_dto.item_id):
            raise OutOfStockException()
        db.save_order(order_dto)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [High Cohesion and Low Coupling](../../02-engineering-principles/02-core-engineering-principles/06-high-cohesion-low-coupling-principles.md)
