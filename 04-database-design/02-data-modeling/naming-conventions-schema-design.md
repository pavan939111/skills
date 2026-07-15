# Naming Conventions (Logical Schema Naming)

## 1. Definition & Core Concepts

Naming Conventions define the rules for naming logical database entities (tables) and attributes (columns) to ensure readability, engine compatibility, and visual consistency across the schema.

Core concepts:
- **Case Formatting:** Choosing a consistent case convention. Databases default to **snake_case** (lowercase words separated by underscores) because SQL is case-insensitive by default in many engines.
- **Singular vs. Plural Tables:** Naming tables in the singular form (e.g., `user`, `order`) to represent the entity model, rather than plural (e.g., `users`, `orders`).
- **Standard Suffixes:** Consistent markers for column types:
    - `_id` for primary and foreign keys.
    - `_at` for timestamps (e.g., `created_at`).
    - `_date` for calendar days (e.g., `birth_date`).
    - `_code` for short standardized strings (e.g., `currency_code`).
- **Boolean Prefixing:** Naming logical flags with helper verb prefixes (e.g., `is_active`, `has_permission`, `was_processed`).

*(Boundary Note: Code-level variables casing, class naming conventions, and ORM class-to-table mapper configurations belong in `backend-development/`. This document covers SQL table naming, database column casing, and SQL reserved word avoidance rules.)*

## 2. Why It Exists / What Problem It Solves

Without strict naming conventions, database schemas become difficult to query. Developers mix singular and plural tables (e.g. joining `user` and `orders`), mix camelCase and snake_case column names, and use reserved SQL keywords as table names (like `user` or `group`), requiring escaping. Consistent naming makes SQL queries predictable, readable, and easy to autogenerate.

## 3. What Breaks in Production Without It

- **Query Syntax Failures from Reserved Keywords:** Naming a table `order` or `user` without escaping it in quotes (`"user"`). Runtimes throw syntax errors when executing standard queries because the database engine interprets the table name as a SQL command (`ORDER BY` or `CURRENT_USER`).
- **Case-Insensitive Column Collisions:** Using camelCase names (e.g., `userId` and `userid`) in case-insensitive database engines (like PostgreSQL which folds unquoted names to lowercase), causing columns to conflict or queries to fail.
- **Join Query Syntax Errors:** Joining tables where foreign keys have inconsistent naming (e.g. joining `user` to `order.customer_id` instead of `order.user_id`), slowing down query writing and causing bugs.

## 4. Best Practices

- **Enforce Singular Table Names:** Name tables in the singular form (e.g. `customer` instead of `customers`). A table represents a class model of a single entity instance; rows represent the plural collection.
- **Standardize on snake_case:** Use snake_case for all tables, columns, schemas, and views to avoid casing mapping issues across different OS and SQL engines.
- **Avoid SQL Reserved Keywords:** Never name tables or columns using keywords like `user`, `order`, `group`, `table`, `key`, `date`, or `status`. Use domain qualifiers instead (e.g., `user_account`, `order_record`, `is_active_status`).
- **Name Foreign Keys Consistently:** Define foreign keys as `parentTable_primaryKey` (e.g., a foreign key to the `user` table should be named `user_id` inside the `order` table).
- **Prefix Booleans:** Always prefix boolean columns with `is_`, `has_`, or `was_` (e.g., `is_verified`, `has_payment_method`).
- **Suffix Timestamps with `_at`:** Ensure all timestamp columns use the `_at` suffix and are timezone-aware (e.g. `created_at`, `updated_at`).

## 5. Common Mistakes / Anti-Patterns

- **Mixing Singular and Plural:** Naming one table `customers` and another `order`, leading to syntax errors during join writes.
- **Using camelCase in SQL:** Writing `userId` or `createdAt` columns, requiring escaping with double quotes in engines like PostgreSQL.
- **Generic `id` in Join Queries:** Naming every primary key `id` and every foreign key something different, forcing queries to use confusing aliases during joins.
- **Cryptic Abbreviations:** Naming columns `cust_addr_sz` instead of `customer_address_size`, making the schema unreadable.

## 6. Security Considerations

- **Auditable Log Columns:** Consistently name security and audit columns (e.g., `created_by_user_id`, `updated_by_user_id`) across all tables to allow security tools to run automated access audit queries.

## 7. Performance Considerations

- **No Performance Impact:** Naming conventions have zero direct runtime performance impact on SQL execution. Prioritize readability, predictability, and engine safety.

## 8. Scalability Considerations

- **Automated Tool Generation:** Clean naming conventions allow migration tools, ORM generators, and static analysis linters to parse the database schema cleanly without custom mapping overrides.

## 9. How Major Companies Implement It

- **Stripe:** Enforces strict naming conventions. Every table uses snake_case, singular nouns, and prefixes IDs with object type tags (e.g. `ch_123` for charge ID) inside database attributes to ensure global searchability.
- **Google:** Mandates style checkers that block database schema changes if tables or columns violate snake_case casing or use reserved SQL keywords.

## 10. Decision Checklist (when to use / when NOT to use)

- Enforce **Singular snake_case Naming Conventions** on: All production relational databases, schemas, views, column definitions, and index keys.
- Allow **Alternative Casing (camelCase/Plural)** ONLY when: Working in legacy databases where existing tables already use plural camelCase naming, maintaining consistency with existing code.

## 11. AI Coding-Agent Implementation Guidelines

- Always write SQL DDL using lowercase snake_case formatting.
- Never use SQL reserved keywords (`user`, `order`, `group`, `date`) as table or column names.
- Always name tables as singular nouns (e.g., `tenant`, `workspace`).
- Never name foreign key columns inconsistently — use `parentTable_id` (e.g., `workspace_id`).
- Always prefix boolean columns with `is_`, `has_`, or `was_`.
- Always suffix timestamp columns with `_at`.

## 12. Reusable Checklist

- [ ] All table and column names formatted in lowercase snake_case
- [ ] Table names are singular nouns (e.g., `account`, not `accounts`)
- [ ] No SQL reserved keywords (e.g., `user`, `order`, `group`, `table`) used as names
- [ ] Foreign keys named consistently using `parentTable_id` (e.g., `user_id`)
- [ ] Boolean columns prefixed with `is_`, `has_`, or `was_`
- [ ] Timestamps suffixed with `_at` (e.g., `created_at`)
- [ ] Dates suffixed with `_date` (e.g., `birth_date`)
- [ ] Abbreviations avoided (columns use explicit descriptive words)
- [ ] Audit columns named uniformly across all tables
