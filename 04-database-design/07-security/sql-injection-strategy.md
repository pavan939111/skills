# SQL Injection Prevention (Database-Tier Controls)

## 1. Definition & Core Concepts

SQL Injection (SQLi) is a security vulnerability where an attacker manipulates SQL inputs to execute arbitrary SQL commands, bypassing application authentication, reading unauthorized data, or deleting tables.

Core prevention concepts:
- **Parameterized Queries (Prepared Statements):** A query execution method where the query structure (SQL template) and parameter data are sent to the database separately. The database engine treats parameters strictly as literal values, never as executable code.
- **Dynamic SQL:** Constructing SQL statements by concatenating string variables. (This is the primary root cause of SQL injection).
- **Safe Dynamic SQL in Stored Procedures:** Using database-native formatting and sanitization functions (e.g. `quote_ident`, `quote_literal`, or `EXECUTE ... USING` syntax in PostgreSQL PL/pgSQL) when dynamic table or column names are required.
- **Query Parser Containment:** Separating query compilation (parsing) from execution, ensuring parameter inputs cannot change the SQL query tree structure.

*(Boundary Note: Code-level input validators, application web application firewalls (WAF), and HTTP request sanitizers belong in `backend-development/`. This document covers database-engine prepared statements, dynamic SQL inside stored procedures/functions, parameter escaping, and SQLi blast radius containment.)*

## 2. Why It Exists / What Problem It Solves

When applications construct SQL queries by concatenating raw strings with user inputs (e.g. `'SELECT * FROM user WHERE name = ''' + input + ''''`), the database query parser cannot distinguish between the query structure written by the developer and the string input supplied by the user. If a user inputs `'OR 1=1; DROP TABLE users;--`, the parser compiles the string as a command, executing unauthorized queries. Parameterization solves this by compiling the query template first, isolating user inputs.

## 3. What Breaks in Production Without It (or When Misapplied)

- **Total Data Leakage (Authentication Bypass):** Attackers input malicious values into login inputs, altering SQL queries to return true (e.g., `' OR '1'='1`), bypassing credentials checks and downloading customer tables.
- **Database Erasure (DDL Injection):** Attackers append drop commands to standard write queries, deleting tables (`DROP TABLE`) or clearing records (`TRUNCATE`).
- **SQLi in Stored Procedures:** Developers use prepared statements in application code, but call a stored procedure that internalizes string concatenation to execute dynamic SQL. The SQL injection occurs inside the database engine catalog.
- **Remote Code Execution (RCE) on Host:** In databases configured with high-privilege connections and host commands access (e.g. `xp_cmdshell` active in SQL Server), SQL injection allows attackers to run shell commands on the database host server.

## 4. Best Practices

- **Enforce Prepared Statements Globally:** Utilize parameterized queries for all SQL queries. Ensure application drivers compile SQL templates before binding variables.
- **Avoid Dynamic SQL inside Stored Procedures:** Never write stored procedures or database functions that concatenate input parameters into SQL strings.
- **Use Parameter Binding (`USING`) in Stored Procedures:** If dynamic query execution is required in PL/pgSQL, use parameter binding syntax:
  - *Bad:* `EXECUTE 'SELECT * FROM users WHERE id = ' || input_id;`
  - *Good:* `EXECUTE 'SELECT * FROM users WHERE id = $1' USING input_id;`
- **Sanitize Identifiers using Quote Functions:** If table names or column names must be passed dynamically inside database scripts, wrap them in identifier quotation functions to prevent injection.
  - *Example (PostgreSQL):* `EXECUTE format('SELECT * FROM %I WHERE id = $1', table_name) USING record_id;`
- **Limit SQLi Blast Radius via Role Permissions:** Connect applications using roles with restricted permissions (e.g., no DDL privileges, restricted schema access), preventing attackers from dropping tables even if SQLi occurs.

## 5. Common Mistakes / Anti-Patterns (Stored Procedure Code Examples)

The following stored procedure examples demonstrate unsafe dynamic SQL vs. safe parameterized executions:

### Unsafe Dynamic SQL inside PostgreSQL PL/pgSQL
```sql
-- BAD: Vulnerable to SQL injection via parameter concatenation
CREATE OR REPLACE FUNCTION get_user_by_name(user_name TEXT) 
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY EXECUTE 'SELECT * FROM users WHERE name = ''' || user_name || '''';
END;
$$ LANGUAGE plpgsql;
```
*Attacker payload input:* `' OR '1'='1` compiles as `SELECT * FROM users WHERE name = '' OR '1'='1'`, returning all users.

### Safe Parameterized Dynamic SQL
```sql
-- GOOD: Uses USING clause for safe parameter binding
CREATE OR REPLACE FUNCTION get_user_by_name(user_name TEXT) 
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY EXECUTE 'SELECT * FROM users WHERE name = $1' USING user_name;
END;
$$ LANGUAGE plpgsql;
```
In the safe code, the database compiler compiles `SELECT * FROM users WHERE name = $1` first. The input `$1` is treated as a literal search string, preventing execution of commands.

## 6. Security Considerations

- **Disable Host Commands Access:** Disable all database features that allow shell commands or file operations to execute from SQL statements (e.g. disable `xp_cmdshell` in SQL Server, restrict `COPY` to superusers in PostgreSQL).

## 7. Performance Considerations

- **Query Plan Reuse:** Parameterized queries (prepared statements) allow database engines to compile and cache the query execution plan. Subsequent executions reuse the cached plan, avoiding parser CPU overhead.

## 8. Scalability Considerations

- Prepared statement caching is local to database connection sessions. In environments with high connection recycling (like serverless without connection pooling), prepare overhead can increase. Use transaction-level connection proxies configured to manage prepared statements.

## 9. How Major Companies Implement It

- **Stripe:** Prohibits raw SQL string construction in backend API repositories, enforcing parameterization globally at the library level and auditing stored database functions for concatenation patterns.
- **Google:** Employs static analysis linters in deployment pipelines, blocking any code merge containing dynamic SQL statements.

## 10. Decision Checklist (SQLi Prevention Framework)

Enforce SQLi controls using:

- Use **Parameterized Queries (Bind Variables)** for:
  - 100% of standard application query routes (SELECT, INSERT, UPDATE, DELETE).
- Use **`USING` Parameter Binding** inside:
  - All stored procedures and database functions executing dynamic SQL.
- Use **Identifier Quotation (`quote_ident` / `%I` format)** ONLY when:
  - Dynamic table or column names must be passed to queries inside database scripts (e.g. partition routing scripts).

## 11. AI Coding-Agent Implementation Guidelines

- Never generate SQL query templates that concatenate variable strings with input parameters.
- Always use parameterized parameters (bind variables) in all SQL definitions.
- Always wrap dynamic identifiers in quotation formats inside database functions.
- Never write stored procedures that execute dynamic SQL without `USING` parameter binding.
- Always recommend restricted database connection roles to limit SQLi blast radius.

## 12. Reusable Checklist

- [ ] All client-database queries use parameterized bind variables
- [ ] No string concatenation used to construct SQL statements in application or database code
- [ ] Stored procedures use the `USING` clause for dynamic SQL parameter binding
- [ ] Dynamic table/column names inside DB functions wrapped in quotation identifiers (e.g., `%I`)
- [ ] Host commands access (`xp_cmdshell` / raw copy) disabled on the database engine
- [ ] Application connection roles restricted to least privilege (no DDL/drop permissions)
- [ ] Prepared statement caching verified to utilize query plan reuse
- [ ] Static analysis tools configured to scan migrations for dynamic SQL concatenation patterns
