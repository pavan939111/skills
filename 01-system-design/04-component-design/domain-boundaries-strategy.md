# Domain Boundaries

## 1. What Question This Answers
"How do we define the boundaries between domain models (entities, aggregates, value objects) inside our service logic, preventing model pollution and keeping schemas clean?"

## 2. Why It Matters at the System-Design Stage
A common architectural failure is creating a single, massive "User" or "Order" class that contains all attributes and logic for the entire system. An order object in a checkout service needs pricing and tax details; the same order object in a shipping service needs package weight and address details, but does not care about payment methods. Creating a single shared model couples domains. Domain boundary design separates models, ensuring each service works with a focused, localized domain representation.

## 3. Methodology / How to Work Through It
1. **Identify the Core Entities:** List the primary business entities in the domain (User, Product, Order).
2. **Segregate Entity Views per Bounded Context:** Define what fields and rules are required for each entity in each specific context:
   - *Checkout Context:* `Order` has `total_price`, `payment_status`.
   - *Fulfillment Context:* `Order` has `box_dimensions`, `shipping_status`.
3. **Declare Aggregates & Boundaries:** Group related entities that must be updated together in a single transaction (e.g. `Order` and its `OrderItems`), defining the aggregate root.
4. **Isolate Value Objects:** Identify immutable attributes that have no identity (e.g., Address, Money) and model them as value objects.
5. **Decouple using IDs:** Reference external aggregates using IDs only, never importing raw object classes across domain boundaries.

## 4. Inputs Needed
- Bounded contexts definitions from Service Boundaries.
- User flows and functional specs.

## 5. Outputs Produced
- Feeds into Module Design and database schema design structures.

## 6. Worked Example (User Account Segregation)
- **Domain Entity:** `User`.
- **Context Views:**
  - `AuthenticationContext`: `User` is simplified to `credential_hash`, `email`, and `active_status`.
  - `BillingContext`: `User` has `stripe_customer_id`, `payment_method_token`.
  - `ProfileContext`: `User` has `first_name`, `avatar_url`, `preferences`.
- **Result:** Instead of a single 50-column database table, the system designs three separate tables, managed by different modules, linked logically via `user_id`.

## 7. Common Mistakes
- **The "God Class" Pattern:** Creating a single, massive object (e.g. `User`) containing all attributes for all features in the codebase.
- **Direct Object References across Domains:** Allowing a Billing object to hold direct references to Shipping object classes, creating tight code coupling.
- **Ignoring Aggregate Roots:** Modifying child entities (like changing order items) directly in SQL bypassing the parent aggregate logic, violating business rules constraints.

## 8. AI Coding-Agent Guidelines
1. **Isolate Context Models:** Never define shared "global" entities containing fields for multiple subdomains.
2. **Use ID References:** Reference external entities using ID fields only.
3. **Group into Aggregates:** Ensure child tables (like order items) are updated through the parent aggregate class.
4. **Produce Domain Boundaries specs:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Domain Model Boundaries: [System Name]

### 1. Bounded Context Entity Segregation
- **Entity: [e.g. Product]**
  - *Catalog Context View:* `CatalogProduct` has `name`, `price`, `description`.
  - *Inventory Context View:* `InventoryProduct` has `stock_quantity`, `warehouse_location_id`.
  - *Shared Link:* Linked logically via `product_id` (UUID).

### 2. Aggregates & Boundaries
- **Aggregate Root A (e.g. Order):**
  - *Root Entity:* `Order`
  - *Child Entities:* `OrderItem` (must only be created, modified, or deleted via the `Order` root transaction).
  - *Transaction Boundary:* Enforce database-level locks on `Order` row when updating order items.

### 3. Value Objects (Immutable Attributes)
- **Value Object A (e.g., Money):** Contains `amount` (BigDecimal) and `currency` (String). Immutability enforced in code.
```
