# Entity Identification

## 1. Definition & Core Concepts

Entity Identification is the database modeling phase where real-world business concepts, physical objects, or transactional events are isolated and defined as distinct database **Entities** (tables), each containing a unique set of **Attributes** (columns) and a defined identifier.

Core pieces:
- **Strong Entity:** An entity that exists independently of other entities and has its own primary key identifier (e.g., `Customer`, `Product`).
- **Weak Entity:** An entity whose existence depends on a parent entity, using a foreign key constraint as part of its primary key context (e.g., `InvoiceItem` depending on `Invoice`).
- **Attributes:** The structural data fields defining the entity properties (e.g. `price`, `created_at`).
- **Candidate Keys:** The minimal set of attributes that can uniquely identify a row in an entity table.

*(Boundary Note: Code-level entity model classes, domain entities mapping in ORMs, and application validation annotations are out of scope. This document covers database-level entity isolation, candidate key identification, and table boundary rules.)*

## 2. Why It Exists / What Problem It Solves

Without systematic entity identification, database designs suffer from structural bloat. Unrelated business attributes bleed into the same table (e.g., packing billing details, product descriptions, and user profile data into a single `users` table). This leads to massive NULL columns, data redundancy, write anomalies, and makes the schema impossible to query cleanly.

## 3. What Breaks in Production Without It

- **Write/Update Anomalies:** Storing customer address details inside the `orders` table. If a customer places 50 orders, their address is duplicated 50 times. Updating the address requires updating 50 rows; if one update fails, the database falls into an inconsistent state.
- **Orphan Attribute Deletion:** If customer details are stored only inside the `orders` table, deleting an order deletes the customer's historical profile entirely from the database.
- **Index Performance Collapse:** Querying a bloated "flat table" containing unrelated columns, forcing index scans to read large blocks of irrelevant memory on disk, slowing database throughput.

## 4. Best Practices

- **Align with Domain Boundaries (DDD):** Define entities based on distinct business domain concepts. Each table should represent a single real-world concept (Single Responsibility Principle for tables).
- **Separate Weak and Strong Entities:** Identify dependencies. Ensure weak entities (like `OrderItem`) utilize cascading delete rules (`ON DELETE CASCADE`) linked to their parent identifier.
- **Identify Immutable Natural Keys:** Look for naturally unique, unchanging fields (like `ISBN` for books or `VIN` for vehicles) as identifier options before defaulting to synthetic keys.
- **Isolate Dynamic Attributes:** If an attribute updates at a high frequency (e.g., `user_last_active_timestamp`), isolate it in a separate, highly optimized status table to prevent write operations from locking the primary entity table.

## 5. Common Mistakes / Anti-Patterns

- **The "God Table" Pattern:** Combining multiple distinct business concepts (e.g., user profiles, authentication settings, user roles, user logs) in a single, massive table.
- **Mutable Attributes as Keys:** Using mutable user attributes (like `email` or `phone_number`) as primary entity identifiers, which requires expensive cascading foreign-key updates across tables if they change.
- **Attribute Bleed:** Mixing transaction metrics (like `total_purchase_amount`) directly into static entity tables, forcing redundant writes.
- **Missing Weak Entity Associations:** Designing tables like `BillingAddress` without foreign key linkages, creating dead orphan records when the parent user account is deleted.

## 6. Security Considerations

- **Entity Metadata Isolation:** Keep security metadata (such as password hashes, MFA keys, or API tokens) in a separate, highly restricted entity table (e.g. `user_credentials`) rather than the primary profile table, preventing accidental exposure during general profile queries.

## 7. Performance Considerations

- **Vertical Table Splitting (Decomposition):** Split highly queried columns (e.g. `user_name`, `email`) from large, rarely queried text columns (e.g., `bio_text`, `raw_payload`) into separate tables to optimize database page-cache utilization.

## 8. Scalability Considerations

- **Entity Boundary Separation:** Keep entity table schemas clean and decoupled. This allows easily moving a specific entity (like the Billing tables) to a completely separate database cluster (sharding or microservices) as data scale grows.

## 9. How Major Companies Implement It

- **Stripe:** Structures their databases around strictly defined entity tables (`Charge`, `Refund`, `Customer`, `Token`). No payment transaction metrics are mixed into customer profiles, ensuring consistent schema boundaries.
- **GitHub:** Separates core entities like `User`, `Repository`, and `Organization` into distinct tables, ensuring they scale write operations independently across partitioned databases.

## 10. Decision Checklist (when to use / when NOT to use)

- Use a **Separate Entity (Table)** when:
  - The attributes describe a single, distinct real-world concept or event.
  - The data has its own independent lifecycle (e.g., a customer exists without an order).
  - Multiple instances of the data can associate with a single parent (one-to-many relationship).
- Embed **Attributes in Existing Tables** ONLY when:
  - The values describe a direct, single property of the parent entity (one-to-one relationship).
  - The attribute lifetime is identical to the parent entity.

## 11. AI Coding-Agent Implementation Guidelines

- Always define distinct tables for separate business concepts — never merge billing and profile entities.
- Never use mutable variables (like emails) as database-level primary keys.
- Always implement weak entities with explicit foreign key constraints and `ON DELETE CASCADE` properties.
- Never mix high-frequency status tracking columns in primary profile tables — isolate them.
- Always place sensitive credentials in a dedicated credential table separate from basic user entities.

## 12. Reusable Checklist

- [ ] Every table represents exactly one distinct business concept (high cohesion)
- [ ] Weak entities (e.g., `InvoiceItem`) depend on parents via explicit Foreign Keys
- [ ] No duplicate attributes stored across multiple tables (normalized schema)
- [ ] Sensitive attributes (passwords, tokens) isolated in dedicated tables
- [ ] Primary identifiers are immutable
- [ ] Unbounded text or binary attributes split vertically to protect page caches
- [ ] Transaction metrics separated from static profile entities
- [ ] Cascade delete rules (`ON DELETE CASCADE` / `SET NULL`) configured on dependent child tables
