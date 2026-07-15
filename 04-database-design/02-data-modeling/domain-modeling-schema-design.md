# Domain Modeling

## 1. Definition & Core Concepts

Domain Modeling is the process of mapping real-world business domains and rules into a database schema structured around Domain-Driven Design (DDD) principles.

Core concepts:
- **Ubiquitous Language:** Utilizing the exact terminology of business experts when naming tables, columns, and keys, ensuring no translation layer exists between code and business logic.
- **Bounded Contexts:** Creating clear, independent schema boundaries for distinct business divisions (e.g., separating the `Billing` schema context from the `Shipping` schema context).
- **Entities vs. Value Objects:**
  - *Entity:* A table record that has a unique, persistent identifier (identity) throughout its lifecycle (e.g., `Customer` with `customer_id`).
  - *Value Object:* Attributes that describe characteristics but have no identity of their own. They are stored inline inside an Entity's table (e.g. storing street, city, zip code directly in a `user_addresses` table).
- **Aggregates & Aggregate Roots:** A cluster of associated objects (like `Order` and `OrderItems`) treated as a single transactional unit, accessed strictly through the parent table (Aggregate Root).

*(Boundary Note: Code-level domain services, application-layer aggregates code, and OOP entity class implementations belong in `backend-development/`. This document covers database-level bounded contexts, schemas segregation, and DB-level value object mapping.)*

## 2. Why It Exists / What Problem It Solves

If database schemas are designed without domain awareness, they become monolithic and highly coupled. Unrelated teams write to the same table columns, creating merge blockages. Using generic technical terms (like `data_field_1`) instead of domain terms causes logical bugs during refactoring. Domain modeling enforces boundaries and business alignment directly at the storage level, keeping data cohesive.

## 3. What Breaks in Production Without It

- **Cross-Domain Schema Deadlocks:** Multiple microservices read and write to a single shared `users` table. A schema change requested by the Billing team breaks the Auth service, blocking releases.
- **Translational Code Bugs:** Developers use one set of words in code (e.g., `SubscriptionRenewal`) but map it to different names in the database (e.g., `billing_action_t`). This mismatch leads to bugs during SQL updates.
- **Data Integrity Collapses in Aggregates:** Updating a child record (e.g., modifying `OrderItem` price) without going through the Aggregate Root (`Order` transaction validations), corrupting parent totals.

## 4. Best Practices

- **Enforce Ubiquitous Language:** Name all database objects (tables, columns, views) using the terminology of business domain experts. Avoid technical abbreviations.
- **Isolate Bounded Contexts using Schemas:** Use database schemas (e.g., `billing.invoice`, `inventory.product`) to segregate data namespaces. Never share tables directly across bounded contexts.
- **Embed Value Objects Inline:** Store value objects (like money amounts with currency tags: `amount, currency_code`) as inline columns in the parent table. Do not create separate tables for objects that lack independent identities.
- **Design Transactions around Aggregate Roots:** Ensure database updates target the aggregate root directly, wrapping updates to dependent child tables in a single transaction block.

## 5. Common Mistakes / Anti-Patterns

- **The Shared-Database Monolith:** Sharing tables (like a generic `products` table) directly across different domain services (Sales, Shipping, Inventory), leading to coupled databases.
- **Technical/Gibberish Naming:** Naming tables after technical implementations (e.g., `user_hash_tbl`) instead of domain concepts (e.g., `user_credentials`).
- **Entity Overkill:** Creating primary key IDs and separate tables for attributes that are logically Value Objects (e.g. creating a separate `currencies` table for simple transaction money attributes).
- **Bypassing the Aggregate Root:** Modifying child records directly without updating or locking the parent aggregate record, causing status synchronization drift.

## 6. Security Considerations

- **Bounded Context Security Isolation:** Restrict database-user permissions on a per-schema basis. For example, ensure the `shipping_service` database credentials only grant access to the `shipping` schema namespace, blocking access to `billing`.

## 7. Performance Considerations

- **Decomposing Shared Tables:** Splitting a generic shared table into domain-specific tables reduces table width and locking contention, optimizing database throughput.

## 8. Scalability Considerations

- **Microservice Separation Readiness:** By structuring database tables into clean bounded schemas (context namespaces), you ensure that extracting a domain (e.g. Billing) into a completely separate database instance requires minimal refactoring.

## 9. How Major Companies Implement It

- **Uber:** Segregates database access by domain boundaries. Driver profile databases, passenger trip databases, and billing databases run on isolated database engines, interacting only via APIs.
- **Amazon:** Enforces a database-per-service pattern where the shopping cart service has exclusive access to its DynamoDB domain instances, preventing cross-domain lock contentions.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **Bounded Context Schema Segregation** when:
  - Designing enterprise architectures with multiple developers working on distinct business features.
  - Preparing databases to scale independently across distinct services.
- Map data as a **Value Object (Inline columns / JSON)** when:
  - The data has no independent lifecycle and is defined solely by its attributes (e.g., price, coordinate, address).
- Map data as an **Entity (Table with PK)** when:
  - The record has an identity that must persist even if all other attributes change (e.g., a customer profile).

## 11. AI Coding-Agent Implementation Guidelines

- Always use the domain-expert ubiquitous language to name database entities and columns.
- Never share tables directly across different bounded contexts.
- Always map Value Objects as inline attributes or JSON blocks in the parent table instead of creating lookup tables.
- Never write database credentials that grant access to multiple domain schema namespaces.
- Always design transactions to execute updates through the aggregate root table.

## 12. Reusable Checklist

- [ ] Ubiquitous language terminology used for all tables and column names
- [ ] Bounded contexts separated into distinct database schemas (e.g., `billing.`, `catalog.`)
- [ ] Database credentials restricted to specific schema scopes (no cross-context logins)
- [ ] Value Objects (e.g., money, dimensions) stored inline in the parent table
- [ ] Primary keys used only for entities that have distinct business identity
- [ ] Aggregates (parent + children) updated within a single transaction block
- [ ] No shared tables exist between unrelated business domains
- [ ] Microservice migration paths analyzed for decoupled schemas
