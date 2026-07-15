# Metadata Management (Database Catalog & Data Dictionary)

## 1. Definition & Core Concepts

Metadata Management at the database tier is the practice of defining, storing, and organizing "data about data" (schema definitions, column descriptions, data classifications, ownership, and relations) directly within the database engine's system catalog or a connected data dictionary.

Core metadata concepts:
- **System Catalogs:** Built-in read-only tables managed by the database engine containing the structural definition of all objects (e.g. `pg_catalog` in PostgreSQL, `INFORMATION_SCHEMA` in MySQL/SQL Server).
- **Column Comments:** SQL-native metadata strings attached directly to columns and tables in the database schema catalog.
- **Data Dictionary:** A centralized guide documenting the definition, constraints, data types, and business rules of every column in the schema.
- **Data Classification Tags:** Metadata labels identifying sensitivity tiers (e.g., public, PII, financial) of columns to drive access control and encryption rules.

*(Boundary Note: Enterprise data catalog web portals (Collibra, Alation), business glossaries software, and application object relationship maps belong in operations and backend-development. This document covers database-level DDL comments, system catalog tables, schema tagging, and data dictionary SQL definitions.)*

## 2. Why It Exists / What Problem It Solves

As a database grows, offline documentation (like wikis or Google Docs) drifts instantly. Developers and AI coding agents query tables but misinterpret cryptic column names (e.g. `usr_act_flg`), leading to bug-ridden queries or data corruption. Metadata management embeds documentation directly inside the database catalog. This ensures that anyone (or any AI agent) querying the system can read column definitions and constraints in real-time, directly from the database engine.

## 3. What Breaks in Production Without It

- **Incorrect Column Queries (Silent Data Corruption):** A developer writes a report query assuming the column `status` represents order delivery state. In reality, it represents payment state. Because no comments exist in the database catalog, the query reports incorrect metrics.
- **Out-of-Sync Wiki Documentation:** Documentation is stored on a separate intranet page. During a migration, columns are dropped and created. The intranet documentation is not updated, causing new developers to write broken queries.
- **Audit Failures from Unidentified PII:** Auditors request a list of all database columns containing PII. Because columns lack classification metadata tags, engineers must audit hundreds of columns manually, missing fields and failing compliance checks.
- **AI Agent Query Hallucinations:** Giving an AI coding agent access to a database without column comments. The agent writes SQL queries using wrong fields or misinterprets flag integer values (e.g., assuming `1` means active when it means pending).

## 4. Best Practices

- **Enforce Column Comments in All DDL Migrations:** Never create a table or column without appending SQL comments explaining the purpose and valid values:
  - *Example (PostgreSQL):*
    ```sql
    CREATE TABLE order_payment (
        id BIGINT PRIMARY KEY,
        status VARCHAR(20) NOT NULL
    );
    COMMENT ON COLUMN order_payment.status IS 'The payment processing state. Valid values: pending, authorized, captured, failed, refunded.';
    ```
- **Leverage `INFORMATION_SCHEMA` for Code Generation:** Query system catalog tables to build automated data validation rules in client applications:
  `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'user_account';`
- **Implement Catalog-Based Sensitive Data Tagging:** Use comment prefixes or database metadata tags to flag sensitive columns for security filters.
  - *Example:* `COMMENT ON COLUMN user_account.ssn IS 'TAG:PII_HIGH | The customer Social Security Number, encrypted.';`
- **Automate Schema Documentation Exports:** Configure CI/CD pipelines to parse database catalog comments and automatically generate data dictionaries in Markdown, keeping documentation in sync with DDL states.
- **Define Custom Domain Types:** Use custom user-defined types (UDTs) or domains with built-in metadata to ensure consistency across table column definitions.

## 5. Common Mistakes / Anti-Patterns

- **Documenting Schemas Externally Only:** Storing table guides on wikis or Notion docs instead of using database comments.
- **Cryptic, Uncommented Column Names:** Naming columns `f_name_x` without explaining what the data represents.
- **Missing State Enums Descriptions:** Storing integers (e.g. `0`, `1`, `2`) in status columns without adding comments defining what the integers represent.
- **Superuser Catalog Access:** Allowing general application connections to execute write queries against system catalog tables, risking database corruption.

## 6. Security Considerations

- **Catalog Protection:** System catalog tables contain the complete map of your database. Restrict access to `INFORMATION_SCHEMA` and metadata tables, blocking unauthorized users from scanning tables to plan SQL injection routes.

## 7. Performance Considerations

- **Catalog Metadata Read Overhead:** Querying system catalog tables takes millisecond lookup times. Avoid running catalog scanning queries frequently on critical transactional write paths.

## 8. Scalability Considerations

- **Schema Registries in Microservices:** In distributed architectures, aggregate metadata from all microservice databases into a central schema registry, ensuring the global data mesh remains documented and traceable.

## 9. How Major Companies Implement It

- **Stripe:** Mandates SQL comments on all schema objects, enforcing CI/CD checks that reject database migrations if table or column creation scripts lack comments.
- **Netflix:** Automatically extracts metadata directly from database system tables across all regional clusters, compiling a searchable data directory for engineering teams.

## 10. Decision Checklist (Metadata Documentation Rules)

Define metadata practices:

- Use **SQL-Native Database Comments (`COMMENT ON`)** on:
  - Every table, column, custom type, and database function in production schemas.
- Use **System Catalog Queries (`INFORMATION_SCHEMA`)** when:
  - Applications must read schema constraints dynamically (e.g., dynamic form builders, validation middleware).
  - Generating database documentation dashboards.
- Use **External Data Catalogs** ONLY when:
  - Aggregating business metadata across separate database servers, data warehouses, and data lakes.

## 11. AI Coding-Agent Implementation Guidelines

- Always append `COMMENT ON COLUMN` and `COMMENT ON TABLE` statements to all generated DDL schemas.
- Never write database configuration files that allow client roles read-write access to system catalog tables.
- Always read `information_schema.columns` comments to identify column meanings before writing queries if you are unsure of schema designs.
- Never use abbreviations for column names without writing a comment detailing their full names and constraints.
- Always include data classification tags (e.g. `TAG:PII`) in sensitive column comments.

## 12. Reusable Checklist

- [ ] Every database table and column documented using SQL `COMMENT ON` DDL
- [ ] Valid states and flags documented in status column comments
- [ ] Database system catalogs (`INFORMATION_SCHEMA`) secured against unauthorized read access
- [ ] Data sensitivity tags (`PII`, `Financial`) included in column comment metadata
- [ ] Schema changes automatically regenerate the data dictionary via CI/CD documentation hooks
- [ ] Data types match exact business domain limits (no loose VARCHARs for numeric inputs)
- [ ] Client applications query the catalog to validate schema metadata states
- [ ] Custom UDTs and domains used where appropriate to standardize metadata definitions
