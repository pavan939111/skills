# Data Quality (Database-Level Validation)

## 1. Definition & Core Concepts

Data Quality at the database layer is the systematic enforcement of constraints, rules, and validators within the database schema to ensure that all stored records are accurate, complete, consistent, and logically valid.

Core concepts:
- **Check Constraints:** Database-level logical assertions that evaluate to true or false before allowing writes (e.g. `price > 0`).
- **Referential Integrity (Foreign Keys):** Guaranteeing that links between tables remain valid, preventing orphaned child records.
- **Nullability Constraints (`NOT NULL`):** Enforcing that mandatory database attributes must contain values.
- **Unique Constraints:** Preventing duplicate entries in logical keys (e.g. unique email keys).
- **Domain Verification (Enums/Types):** Restricting column inputs to explicit data types or pre-defined lists of valid values.

*(Boundary Note: Code-level form validation libraries, frontend UI validators, and business logic parser rules belong in `backend-development/`. This document covers SQL constraints, DDL validation rules, enum declarations, and database-tier referential integrity.)*

## 2. Why It Exists / What Problem It Solves

Relying entirely on application-tier code (Node.js, Go, Python) to validate data is a security and operational risk. Multiple services, admin scripts, and migration runners connect to the database. If one application service has a validation bug, or an admin runs a manual update query incorrectly, dirty data (e.g., empty emails, negative prices, orphaned foreign keys) enters the database, leading to application crashes and reporting errors. Enforcing quality at the database tier blocks invalid writes.

## 3. What Breaks in Production Without It

- **Null Pointer Exceptions (NPEs) in APIs:** A developer removes a `NOT NULL` constraint on a column to speed up a migration. Later, a worker process queries the row, encounters an unexpected `NULL` value, and throws an unhandled Null Pointer Exception, crashing the API.
- **Negative Account Balances:** Failing to configure check constraints on financial columns. A race condition or calculation bug subtracts balances past zero, writing a negative balance and losing money.
- **Orphaned Order Records:** Disabling or omitting foreign key constraints to "increase write speed." When a user account is deleted, their associated orders remain in the table, referencing a non-existent user ID and corrupting reports.
- **Duplicate Registration Collisions:** Bypassing unique constraints on user logins, allowing multiple users to register with the same email, locking them out of authentication paths.

## 4. Best Practices

- **Enforce Constraints Database-Side:** Declare `CHECK`, `NOT NULL`, and `FOREIGN KEY` constraints in table DDLs. Do not rely on application validation alone.
- **Validate Formats with Regex Check Constraints:** Use database regex checks to validate column shapes (e.g., verifying emails match valid formats).
  - *Example (PostgreSQL):* `ALTER TABLE user_account ADD CONSTRAINT chk_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');`
- **Use CHECK Constraints for Numeric Boundaries:** Prevent invalid financial or inventory values:
  - *Example:* `ALTER TABLE product ADD CONSTRAINT chk_price CHECK (price > 0);`
- **Use Database Enums for Category States:** Restrict columns to defined states using native database enum types rather than loose VARCHAR columns.
  - *Example:* `CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered');`
- **Set Default Fallback Values Database-Side:** Define clear default values (e.g. `DEFAULT false` or `DEFAULT 0`) to ensure optional fields write valid initial states.

## 5. Common Mistakes / Anti-Patterns

- **Trusting the Application Tier Alone:** Assuming backend validators prevent all bad data inserts.
- **Disabling Foreign Keys for Performance:** Omitting foreign keys to bypass referential checks, creating orphan records.
- **VARCHAR instead of Enums:** Storing status states as strings, allowing typos (e.g. saving `'shippd'` instead of `'shipped'`).
- **No Boundary Constraints:** Storing quantities, prices, or ratings without defining lower/upper bounds.

## 6. Security Considerations

- **SQL Data Type Sanitization:** Enforcing correct database datatypes (e.g. numeric types for numbers, UUID types for keys) blocks attackers from injecting malicious text payloads into numeric search fields.

## 7. Performance Considerations

- **Constraint Evaluation Cost:** Database check constraints and nullability checks are evaluated in-memory before writing the page to disk. The performance overhead is negligible (under 0.1ms) and protects the database from data corruption.

## 8. Scalability Considerations

- **Cross-Shard Referential Integrity:** In sharded databases, foreign key constraints cannot easily be validated across physical servers. Ensure related tables share the same shard key so they reside on the same shard node, allowing local foreign key verification.

## 9. How Major Companies Implement It

- **Stripe:** Configures strict check constraints, non-null types, and foreign key boundaries on all transaction schemas, preventing invalid financial states from being saved to disks.
- **Amazon:** Enforces schema and data validations on database boundaries to maintain catalog consistency across warehouse systems.

## 10. Decision Checklist (Database Constraints Selection)

Enforce database-level quality rules:

- Use **`NOT NULL` Constraints** on:
  - Every column that is mandatory for a valid business state (e.g. `user_id`, `email`, `status`).
- Use **`CHECK` Constraints** when:
  - Values must stay within defined numeric ranges (e.g., `price > 0`, `age BETWEEN 18 AND 100`).
  - Values must follow format shapes (e.g., emails, phone regex).
- Use **`FOREIGN KEY` Constraints** when:
  - Maintaining referential integrity between tables is required (e.g., linking order rows to valid user rows).
- Use **`ENUM` Types** when:
  - Columns represent a static, finite list of states (e.g., statuses, categories).

## 11. AI Coding-Agent Implementation Guidelines

- Always define `NOT NULL` on mandatory columns in generated schemas.
- Never write database schemas that omit foreign key references for related entities.
- Always include `CHECK` constraints on numeric columns representing prices, weights, or balances.
- Never suggest storing state values in open `VARCHAR` fields — recommend `ENUM` types.
- Always include default constraints for optional attributes.

## 12. Reusable Checklist

- [ ] All mandatory schema columns configured with `NOT NULL` constraints
- [ ] Foreign keys defined on all related tables (referential integrity active)
- [ ] Check constraints configured to block invalid numeric boundaries (e.g., `price > 0`)
- [ ] Regex check constraints active to validate format schemas (emails/phone)
- [ ] Database-native `ENUM` types used to restrict state fields
- [ ] Unique constraints configured to prevent duplicate logical records
- [ ] Default values declared database-side for optional columns
- [ ] Relational databases execute constraint validations in-memory before commits
