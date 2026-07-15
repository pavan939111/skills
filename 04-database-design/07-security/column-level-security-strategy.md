# Column-Level Security (CLS)

## 1. Definition & Core Concepts

Column-Level Security (CLS) is a database security feature that restricts access permissions to specific columns within a table based on the authenticated database user's role, preventing unauthorized users from reading or modifying sensitive attributes (e.g., SSN, credit card numbers, password hashes).

Core CLS concepts:
- **Column-Level Grants:** Restricting SQL privilege commands to explicit column lists (e.g., granting read access to name and email, but blocking access to salary).
- **Dynamic Data Masking (DDM):** Redacting or masking sensitive column values on the fly for non-privileged database users (e.g. displaying `XXX-XX-1234` instead of a raw SSN).
- **Vertical Partitioning (Decomposition):** Splitting sensitive columns into a separate, highly secured table linked by a 1:1 foreign key rather than using CLS controls on a single table.
- **View-Based Column Isolation:** Creating database views that exclude sensitive columns, routing general users to the view instead of the physical table.

*(Boundary Note: Code-level object serialization masking, application-tier encryption decrypters, and UI redact utilities are out of scope. This document covers database-native column grants, dynamic masking SQL configurations, database views, and vertical table partitioning.)*

## 2. Why It Exists / What Problem It Solves

Tables often contain a mix of public and highly sensitive attributes. For example, a `user_account` table contains public profile information (name, avatar URL) and sensitive data (password hashes, tax identifiers, billing balances). If database permissions are applied only at the table level, any user who can query the table can read the sensitive columns. CLS enforces boundaries within a table, ensuring roles only access columns matching their authorization level.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Accidental PII Leakage in Log Files:** A developer runs a diagnostic query (`SELECT *`) on the user table. The query retrieves sensitive password hashes and SSNs, which are written to application log files, violating compliance.
- **Application Crash Exceptions from Column Bans:** An application service connects to a table where CLS blocks access to a single column (e.g., `ssn`). The developer writes a query containing `SELECT *`. The database rejects the entire query, throwing `PermissionDenied` exceptions and crashing the page.
- **Dynamic Masking Bypass on Aggregates:** Applying dynamic data masking to columns that are subsequently used in calculation queries, causing the database to compute sums or checks using the masked values (e.g., calculating averages on masked numbers, returning corrupted metrics).
- **Broken Schema Migrations:** A migration script attempts to update a table structure, but fails because the migration database user lacks privileges to modify the restricted CLS columns.

## 4. Best Practices

- **Use Views to Segregate Column Access:** Instead of configuring complex column-level privileges in SQL, create database views that exclude sensitive columns (e.g. `v_public_user_profile`). Route general applications and reporting tools to these views.
- **Apply Column-Level Grants for Specific Roles:** Define column-scoped permissions explicitly in SQL.
  - *Example:* `GRANT SELECT (id, name, email) ON user_account TO support_role;`
- **Use Dynamic Data Masking (DDM) for PII:** Configure database-level DDM to mask columns automatically for non-admin database users (e.g. masking emails as `u***@company.com`).
- **Isolate Sensitive Fields using Vertical Partitioning:** If CLS rules are too complex, split the table vertically. Move sensitive columns (like passwords or credit card parameters) to a separate table (e.g. `user_credentials`) with strict table-level security.
- **Avoid `SELECT *` in CLS Environments:** Enforce code linters that require developers to write explicit column lists in all queries, preventing queries from accessing restricted columns.

## 5. Common Mistakes / Anti-Patterns

- **Using `SELECT *` on CLS Tables:** Triggering permission exceptions by requesting all columns.
- **Applying Masking on Join Keys:** Dynamic masking on foreign keys or join columns, breaking query joins.
- **Bypassing CLS in Reports:** Allowing business intelligence tools to query primary tables directly instead of routing them through sanitized database views.
- **Complex Column Privilege Matrix:** Creating highly complex column-level permission structures across dozens of roles, making schema maintenance difficult.

## 6. Security Considerations

- **Compliance Auditing (GDPR/PCI-DSS):** CLS and Dynamic Data Masking are critical for satisfying PCI-DSS constraints (e.g., masking primary account numbers) and GDPR controls, ensuring sensitive PII is only visible to authorized services.

## 7. Performance Considerations

- **Dynamic Masking Overhead:** Enforcing dynamic data masking requires the database engine to run redirection and masking functions on every row returned. Profile read query latency; if CPU overhead is high, replace DDM with vertical partitioning.

## 8. Scalability Considerations

- **Distributed Column Mapping:** In distributed databases, ensure column-level authorization metadata is replicated consistently across all query nodes to prevent authorization bypasses.

## 9. How Major Companies Implement It

- **Stripe:** Isolates primary cardholder numbers (PAN) in vertically partitioned, highly restricted vault databases, using dynamic masking to return only the last 4 digits (`XXXX-XXXX-XXXX-1234`) to general merchant query APIs.
- **Healthcare Providers:** Deploy database-level column masking on patient tables, ensuring that support staff view anonymized records while doctors view full medical histories.

## 10. Decision Checklist (CLS Sizing Framework)

Select the column protection method:

- Use **Vertical Partitioning (Table Split)** when:
  - Sensitive columns (like password hashes or API tokens) have a completely different access lifecycle than public columns.
  - Storage security audit requirements demand separate physical table encryption.
- Use **Database Views (Sanitized)** when:
  - General reporting tools or external partners require access to a subset of table columns.
  - Standard database SQL compatibility must be maintained.
- Use **Dynamic Data Masking (DDM)** when:
  - Non-privileged developers or support staff must view redacted data (PII masking) directly in the database.
- Never use **Column-Level Grants** directly on:
  - Databases where application code regularly executes `SELECT *` queries.

## 11. AI Coding-Agent Implementation Guidelines

- Always recommend vertical table partitioning for separating highly sensitive credentials from public profiles.
- Never generate SQL queries containing `SELECT *` on tables protected by column-level security.
- Always write explicit column lists in generated SELECT statements.
- Never apply dynamic data masking to columns used as join keys or index keys.
- Always recommend database views to present sanitized schema projections to reporting tools.

## 12. Reusable Checklist

- [ ] Sensitive columns (PII, credentials) identified and audited
- [ ] Vertical partitioning used to isolate passwords/tokens into separate tables
- [ ] Database views configured to hide restricted columns from general users
- [ ] Column-level grants explicitly configured for specific roles (no `GRANT ALL`)
- [ ] Dynamic Data Masking (DDM) active on columns containing credit card numbers or SSNs
- [ ] Application SQL queries select columns explicitly (no `SELECT *` statements)
- [ ] Masking rules verified not to apply to columns used in join or group criteria
- [ ] Migration runners granted specific privileges to update CLS-restricted columns
