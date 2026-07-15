# Master Data (Golden Record Management)

## 1. Definition & Core Concepts

Master Data Management (MDM) at the database tier is the architectural practice of defining, storing, and synchronizing a single, consistent, and authoritative reference point (the "Golden Record") for core business entities (such as customers, products, and accounts) shared across multiple application databases.

Core master data concepts:
- **Golden Record:** The single, validated, and authoritative representation of a data entity, resolved from multiple conflicting sources.
- **System of Record (SoR):** The specific database designated as the primary owner and writer of a particular data domain.
- **Global Unique Identifier (GUID / UUID):** A universally unique key assigned to a master entity at birth and propagated across all systems to link duplicate records.
- **Data Reconciliation (Deduplication):** The process of identifying, matching, and merging duplicate records (e.g. merging two customer accounts with matching addresses) into a single golden record.
- **Reference Data:** Stable lookup tables (e.g. country codes, currencies) that must be kept consistent across all database schemas.

*(Boundary Note: Enterprise MDM software UI setups, application data deduplication logic in code, and company organizational data ownership charts belong in backend-development and product analysis. This document covers database-level system of record boundaries, GUID propagation, CDC replication sync, data deduplication indexes, and reference schemas.)*

## 2. Why It Exists / What Problem It Solves

As a system scales, different services maintain their own databases. The billing service has a customer database; the shipping service has another; marketing has a third. If a customer changes their email address in the shipping database, but the billing database keeps the old email, billing transactions fail. If duplicate accounts are created with slight name variations, reporting metrics are corrupted. MDM establishes a single source of truth, synchronizing core entities across all tables.

## 3. What Breaks in Production Without It

- **Data Inconsistencies across Services:** A customer changes their shipping address. The shipping service updates its local database. The warehouse order database continues to read from an un-synchronized local copy, shipping packages to the customer's old address.
- **Duplicate Account Collisions:** A customer registers once with `john.doe@test.com` and again with `johndoe@test.com`. Because the database lacks deduplication index checking or global customer IDs, the system creates two separate customer ledgers, dividing payment histories.
- **Broken Data Lineage (No GUID):** Attempting to reconcile reports across systems when the billing table uses `billing_user_id` and shipping uses `shipping_customer_id` with no shared global key, making data mapping impossible.
- **Reference Data Drift:** One database updates currency codes to include new formats, while another database continues to use old codes, causing payment processing queries to fail during cross-database calls.

## 4. Best Practices

- **Designate a System of Record (SoR) for each Domain:** Ensure every master data entity has exactly one primary database owner. Other services must treat local copies of this data as read-only.
  - *Example:* The `user-profile` database is the SoR for customer emails. If the billing service needs the email, it must read from the user-profile database or receive sync updates from it.
- **Enforce Global Unique Identifiers (UUIDv7/ULID):** Assign a time-sorted UUID to all master records. Propagate this GUID across all downstream database tables to link records consistently.
- **Synchronize Master Data using Change Data Capture (CDC):** Propagate updates from the System of Record database to other databases asynchronously using CDC logs (e.g. Debezium streaming write updates) or transaction messages, keeping read caches in sync.
- **Deploy Deduplication Schema Constraints:** Create unique indexes or database constraints to prevent duplicate entries of core keys (e.g. email or business identifiers). Use similarity matching indexes (like Trigram indexes in PostgreSQL) to detect duplicate names.
- **Centralize Reference Data Tables:** Store reference data (country lists, currency keys) in dedicated, read-only schemas, and replicate them to all database nodes during maintenance cycles.

## 5. Common Mistakes / Anti-Patterns

- **Multiple Writers on Master Fields:** Allowing multiple databases to write to and modify the same customer fields concurrently, causing data drift.
- **Local Stale Copies without Sync:** Storing static duplicate tables of user profiles in reporting databases without configuring replication streams.
- **Shared Master DB (Monolithic Database):** Forcing all services to connect directly to a single shared master database to query master data, creating a single point of failure. Use asynchronous replication instead.
- **Ignoring Global Keys:** Creating local integer auto-increment IDs for shared entities instead of propagating GUIDs.

## 6. Security Considerations

- **Master Data Access Isolation:** Because the Golden Record database contains the authoritative customer PII, restrict direct access. Implement tokenization to allow secondary databases to reference tokens rather than reading raw master tables.

## 7. Performance Considerations

- **Sync Latency vs Local Queries:** Reading master data locally from asynchronously synced read tables is fast (<1ms). Quizzing the master database via network API calls on every request slows down performance. Always query local, synced read models.

## 8. Scalability Considerations

- **Global Reference Replication:** Replicate master reference tables (like price catalogs or currency rules) to all regional databases globally, allowing local read paths to evaluate queries without WAN hops.

## 9. How Major Companies Implement It

- **Stripe:** Enforces a unified customer identifier (`cus_XXXXXXXX`) across all billing, payment, and tax databases globally, ensuring no duplicate customer accounts exist.
- **Amazon:** Utilizes centralized master catalogs for product descriptions, synchronizing product details asynchronously to regional checkout databases.

## 10. Decision Checklist (Master Data Sizing)

Define master data routing:

- Route writes to **System of Record (SoR) Database** when:
  - Modifying or creating core entities (user profiles, catalogs, account keys).
- Query **Local Replicated Standby Tables** when:
  - Reading master details during general transactional lookups (e.g. reading customer name during checkout).
  - Data lag (eventual consistency) is acceptable.
- Enforce **UUIDv7/ULID Global Keys** on:
  - 100% of tables representing master business entities across all database clusters.

## 11. AI Coding-Agent Implementation Guidelines

- Never design database schemas that allow multiple independent services to write to the same master data columns.
- Always use UUIDs (e.g. UUIDv7) as primary keys for master records.
- Always recommend asynchronous replication (CDC) or event queues to synchronize master record updates.
- Never write database query templates that join cross-service tables using local auto-increment integer IDs.
- Always include unique constraints on logical identity keys (like emails) to prevent duplicate master entries.

## 12. Reusable Checklist

- [ ] System of Record (SoR) designated for each master data domain (Customer, Product, etc.)
- [ ] UUIDv7 or ULID global unique keys used for all master entity records
- [ ] Asynchronous synchronization (CDC/Events) active to update secondary database copies
- [ ] Read-only replicas or local synced tables used for master read lookups (no direct database hops)
- [ ] Unique constraints active on core identity keys to block duplicate records
- [ ] Similarity indexes (Trigram/Soundex) configured to search and flag duplicate candidates
- [ ] Reference data (currencies, country codes) centralized and replicated globally
- [ ] Master database access restricted and tokenized to protect sensitive PII
