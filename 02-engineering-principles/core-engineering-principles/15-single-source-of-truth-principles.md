# Single Source of Truth

## 1. Definition & Core Concepts

Single Source of Truth (SSOT) is the software architecture practice of structuring data models and logic so that every data element and business rule is defined and stored in exactly one authoritative location. All other system components read from this single source, preventing replication and inconsistency.

Core pieces:
- **Centralized Configurations:** Storing settings and connection strings in a single config module loaded on boot.
- **Computed Domain Properties:** Calculating derived values (e.g., `totalPrice = subtotal + tax`) dynamically at runtime rather than storing them as static mutable fields in databases.
- **Unified Enums & Constants:** Storing system states (e.g., `ORDER_STATUS`) and business values in single, shared code modules.
- **Single Model Authority:** Ensuring that for any business concept (e.g., a "User"), there is a single primary database table and model class that holds the authoritative state.

*(Boundary Note: Database schema normalization levels (1NF, 2NF, 3NF) and database replica sync settings belong in `database-design/`. This document covers code-level logic centralization, configuration models, and computed property derivations.)*

## 2. Why It Exists

When data or logic is duplicated, it eventually drifts. If a user's subscription status is cached in both the `users` table and the `invoices` table, a billing bug that updates one but not the other leaves the system in an invalid state. SSOT eliminates this drift, ensuring that every query and calculation relies on the exact same authoritative data state.

## 3. What Breaks in Production Without It

- **Divergent System States:** Caching a user's role in memory and in the database. A user's role is demoted in the database, but the application server continues reading the stale, cached role in memory, allowing unauthorized access.
- **Calculation Mismatch Failures:** Defining tax rates or currency conversion rules in multiple files. Staging calculate routines drift from production invoice routines, leading to financial discrepancies.
- **Configuration Desynchronization:** Storing database credentials in multiple environment files and configurations. Changing a password in one file leaves background workers attempting to connect using the old password, crashing queues.
- **API and UI Type Drift:** Duplicating type schemas in both the frontend (TypeScript) and backend (Python/Java). Adding a new required parameter to the backend without updating the frontend crashes client calls.

## 4. Best Practices

- **Derive Computed Values Dynamically:** Do not store calculated values (e.g. totals, averages, formatting statuses) in database columns unless required for performance search indexes. Calculate them dynamically at query time or in domain getters.
- **Centralize Configurations:** Use a single settings file (e.g. `config.ts` or `settings.py`) that loads and validates environment variables once. Consuming classes must read settings from this module.
- **Use Enums for System States:** Define statuses (e.g., `order_status = ['pending', 'processing', 'completed']`) inside a single enum type or code class. Never reference raw string variables in comparisons.
- **Generate API Contracts:** Drive API client schemas and backend models from a single source of truth (e.g., OpenAPI yaml, GraphQL schema, or Protobuf specifications) using automation.
- **Establish a Single Write Transaction Pathway:** Ensure mutations to an entity only go through a single domain service class, preventing different database adapters from modifying records using conflicting business rules.

## 5. Common Mistakes / Anti-Patterns

- **Hardcoding Constants in Multiple Files:** Defining the same tax rate or validation regex as raw values in controllers, repositories, and models.
- **Redundant Database Caching (Unsynchronized):** Denormalizing tables (e.g. caching `customer_name` inside `orders` table) without writing transaction listeners to update all occurrences when a customer changes their name.
- **Mismatched Client/Server Models:** Manually copying DTO structures from backend code to frontend code, which inevitably drifts.
- **Configuration Variable Splitting:** Having separate, overlapping variables for the same concern (e.g., `DB_TIMEOUT` and `SQL_TIMEOUT`).

## 6. Security Considerations

- **Single Authorization Authority:** Ensure authentication policies and user privilege validation logic reside in a single security module. Never write custom authentication parsing logic in separate controller routes, as this creates bypass vulnerabilities.

## 7. Performance Considerations

- **Cache Invalidation Costs:** When storing computed values is necessary to avoid expensive CPU recalculations, implement strict cache invalidation rules (e.g., invalidating cache on entity updates) to prevent serving stale data.

## 8. Scalability Considerations

- **Eventual Consistency Synchronization:** In microservice architectures, when a service denormalizes data for performance, it must listen to primary event streams (e.g., `UserUpdated`) to synchronize its local cache, maintaining a single source of truth.

## 9. How Major Companies Implement It

- **Stripe:** Guarantees ledger accuracy by ensuring every transaction balances exactly to a single primary account journal. They prevent concurrent account mutations from creating phantom states by locking database writes through a single transactional domain layer.
- **Google:** Employs centralized schema registries and Protocol Buffers to maintain a single source of truth for all API definitions, ensuring frontend and backend nodes agree on request parameters.

## 10. Decision Checklist

- Use **Single Source of Truth** on: System configurations, domain models, business validation rules, state enums, database writes, and API contract interfaces.
- Skip SSOT (Accept Denormalization) ONLY when: Querying data requires high-performance analytics, reporting, or search indexes (e.g. syncing data to Elasticsearch) where eventual consistency is acceptable.

## 11. AI Coding-Agent Implementation Guidelines

- Always define configuration values, database endpoints, and system settings inside a single central config file.
- Never write raw string constants for status values — use centralized enum structures.
- Always calculate computed fields dynamically in getters or queries rather than saving them as static attributes.
- Never duplicate DTO schemas — generate client interfaces from server source specifications.
- Always route database updates for an entity through a single service class.
- Never hardcode timezone formatting or currency constants in multiple service files.

## 12. Reusable Checklist

- [ ] Configurations loaded and validated in a single startup settings module
- [ ] Status indicators and system states managed via central enum files
- [ ] Computed fields (e.g., subtotal + tax) calculated dynamically in code getters
- [ ] Data mutation queries routed through a single authoritative service transaction class
- [ ] API types and client schemas generated from a single contract source
- [ ] No hardcoded constants, domain variables, or tax rules duplicated across files
- [ ] Denormalized/Cached database tables have synchronization routines configured
- [ ] Authentication and role checks gate API access through a single middleware
