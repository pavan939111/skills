# Constraints

## 1. Definition & Core Concepts

Database Constraints are declarative rules enforced by the database engine on tables and columns to guarantee data validity, consistency, and referential integrity during write operations.

Core constraints:
- **NOT NULL:** Enforces that a column cannot store NULL values, guaranteeing the presence of data.
- **UNIQUE:** Enforces that all values in a column (or combination of columns) are distinct across the table.
- **PRIMARY KEY / FOREIGN KEY:**
  - *Primary Key:* Uniquely identifies rows and guarantees non-nullability.
  - *Foreign Key:* Enforces referential consistency between tables.
- **CHECK Constraint:** Evaluates column values against a boolean expression, rejecting writes if the expression returns false (e.g., `CHECK (price > 0)`).
- **Triggers (Procedural Constraints):** Database-executed functions that validate complex cross-table business logic during writes.

*(Boundary Note: Application-level validation classes (e.g. class validators, middleware validation libraries) are out of scope. This document covers database-native constraints, SQL engine validation rules, and DDL constraint optimization.)*

## 2. Why It Exists / What Problem It Solves

Application code is constantly updated, refactored, and redeployed. Bugs in validation logic, race conditions, or manual SQL edits by developers can easily bypass application-level checks, writing corrupt data (e.g., duplicate usernames, negative bank balances, or null values in mandatory fields) to disk. Database constraints act as the final, immutable gatekeeper, blocking invalid data at the storage level.

## 3. What Breaks in Production Without It

- **Double-Signed Accounts (Unique Bypass):** Bypassing database `UNIQUE` constraints under the assumption that "the API checks for duplicates before writing". Under concurrent load, two users register with the same username simultaneously, bypassing the API check and creating duplicate rows, which crashes authentication routines.
- **Negative Account Balances:** A bug in billing math subtracts money, resulting in a negative balance. If no database-level `CHECK (balance >= 0)` constraint exists, the negative balance is saved, violating core business rules.
- **Null Reference Crashes:** Leaving fields nullable that are mandatory for business math (e.g., `invoice_total`). A null value written due to an API bug causes downstream reporting engines to fail with NullPointerExceptions.
- **Orphan Data Accumulation:** Omitting foreign keys, leaving orphaned dependent rows (like permissions) when user records are deleted.

## 4. Best Practices

- **Default to NOT NULL:** Always declare columns as `NOT NULL` unless there is a valid business reason for the value to be optional.
- **Use CHECK Constraints for Value Boundaries:** Enforce range checks, format rules, and status options at the database level.
  - *Examples:* `CHECK (price > 0)`, `CHECK (status IN ('draft', 'active', 'archived'))`, `CHECK (email LIKE '%@%')`.
- **Enforce UNIQUE Constraints on Candidate Keys:** Ensure fields like usernames, email addresses, and tax identifiers have a database-level `UNIQUE` index.
- **Ensure Constraints Have Descriptive Names:** Always name constraints explicitly in DDL (e.g., `CONSTRAINT chk_order_price_positive CHECK (price > 0)`) so that database error logs clearly identify which rule was violated.
- **Validate at the Lowest Level:** Never rely on application code to guarantee data integrity. Combine application validations with database constraints.

## 5. Common Mistakes / Anti-Patterns

- **No Database Constraints:** Relying solely on application-level validations to enforce business invariants.
- **Over-using Triggers for Constraints:** Writing complex PL/pgSQL database triggers for simple value checks instead of using declarative `CHECK` constraints, which slows writes and complicates debugging.
- **Unlabeled Constraints:** Letting the database engine auto-generate constraint names (e.g., `table_col_key_1a8b9`), making it impossible to identify violations in log traces.
- **Nullable Foreign Keys by Default:** Leaving foreign key columns nullable, permitting orphan records to be created.

## 6. Security Considerations

- **Input Validation Hardening:** Database constraints act as a defense-in-depth security barrier. If SQL injection attempts or library exploits bypass API sanitization, database-level data type limits and CHECK constraints block malicious, out-of-bounds payloads from writing to disk.

## 7. Performance Considerations

- **Write Overhead Verification:** Enforcing constraints requires the database engine to execute checks on every insert or update. However, declarative constraints (NOT NULL, CHECK) are highly optimized by the database compiler and have negligible performance overhead. Prioritize data safety.

## 8. Scalability Considerations

- **Local vs. Distributed Constraints:**
  - *Local Constraints:* `NOT NULL` and `CHECK` validate data within a single row and scale easily.
  - *Global Constraints:* `UNIQUE` and `FOREIGN KEY` require searching indexes across partitions. In highly distributed or sharded databases, keep global constraints local to a partition or manage them at the application layer to avoid slow cross-node network lookups.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict database-level `CHECK` constraints on transaction records, ensuring currency values are positive and status strings conform to defined lists, preventing financial anomalies.
- **Google:** Mandates strict schema constraints on Google Spanner databases, using DDL validation steps to block any table deployments that lack NOT NULL definitions on primary indices.

## 10. Decision Checklist (when to use / when NOT to use)

- Use **NOT NULL / UNIQUE / CHECK Constraints** on:
  - Every production database table and column containing structured operational data.
  - Value boundaries (price limits, age bounds, state lists).
- Skip Constraints ONLY when:
  - Storing unstructured log payloads inside a raw text table where parsing is deferred.

## 11. AI Coding-Agent Implementation Guidelines

- Always specify `NOT NULL` on columns by default.
- Never write DDL statements without explicit, named constraints (e.g. `CONSTRAINT chk_name CHECK (...)`).
- Always implement `CHECK` constraints for numeric ranges, state enums, and string format boundaries.
- Never rely on application-level code as the sole source of database integrity.
- Always use `UNIQUE` constraints to enforce candidate key integrity.

## 12. Reusable Checklist

- [ ] Columns declared `NOT NULL` by default (unless optionality is required)
- [ ] Candidate key columns (email, username) enforce uniqueness via `UNIQUE` constraints
- [ ] CHECK constraints enforce values range limits (e.g., price, age, state enums)
- [ ] Constraints explicitly named in DDL (e.g., `CONSTRAINT chk_table_column_rule`)
- [ ] Foreign Keys enforce referential integrity between tables
- [ ] Mismatched column data types resolved between foreign keys and target keys
- [ ] Database error logs map constraint names to human-readable errors
- [ ] Distributed partition constraints designed to run locally on nodes
