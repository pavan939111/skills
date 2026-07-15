# Data Lineage (Data Flow & Origin Tracking)

## 1. Definition & Core Concepts

Data Lineage at the database layer is the process of tracking and documenting the origin, transformations, movements, and destinations of data as it flows through database tables, views, ETL pipelines, and external integrations.

Core lineage concepts:
- **Source-to-Target Mapping:** Documenting the relationship between a source column (where data originated) and a target column (where data is stored).
- **Data Transformation Tracking:** Recording how data is mutated, aggregated, or filtered as it transitions between tables (e.g. from raw staging tables to analytical fact tables).
- **Metadata Registries:** Centralized catalogs that store schema definitions, column descriptions, owner mappings, and data dependencies.
- **Correlation IDs (`trace_id`):** Unique request identifiers passed from application APIs and stored in database rows to connect data state modifications back to their source requests.

*(Boundary Note: Code-level tracing libraries (OpenTelemetry code), application API logging setups, and visual lineage dashboard software belong in operations and backend-development. This document covers database-level metadata schemas, transformation audits, audit trails, and schema change impacts.)*

## 2. Why It Exists / What Problem It Solves

As a database grows to hundreds of tables and views, understanding the data flow becomes difficult. If a business report calculates a metric incorrectly, or a security audit requires tracing where a specific customer's email was shared, developers must trace the data path. Data lineage maps these connections, allowing engineers to debug calculations, analyze the impact of schema changes, and comply with privacy audits.

## 3. What Breaks in Production Without It

- **Broken Downstream Analytics (Schema Drop Impact):** A developer drops or renames an apparently "unused" database column. A day later, the company's financial reporting pipelines fail because the column was secretly used by a downstream business intelligence tool.
- **Indebuggable Metric Divergence:** Two business dashboards show different totals for "Monthly Active Users." Because data lineage is undocumented, it is impossible to determine which database view is pulling from the correct data source, delaying business decisions.
- **Failed Compliance Audits:** Failing to show auditors the complete flow of sensitive PII data from user registration through storage, replication, and archiving, risking certification losses.
- **Traceability Failures during Corruption:** A bug in an ETL worker corrupts a subset of records. Because the rows lack correlation IDs or lineage tags, identifying which records were written by the buggy worker requires executing full database rollbacks.

## 4. Best Practices

- **Embed Request Correlation IDs in Rows:** Include `request_id`, `trace_id`, or `transaction_id` columns in all write-heavy tables. Link database changes directly to application logs.
- **Maintain Schema Dependency Catalogs:** Use database system catalogs (e.g. `information_schema` or `pg_depend` in PostgreSQL) to map and monitor dependencies between tables, views, and stored functions.
- **Version Control Schema Schematics:** Keep database schema documentation, ER diagrams, and data flow models in version control alongside DDL migration files.
- **Document Source-to-Target Maps for ETL:** Document which raw source tables feed into analytical staging tables, noting any transformation formulas (e.g., currency conversions).
- **Use Views to Abstract Lineage Paths:** Route reporting tools to database views instead of raw tables. If the underlying tables change, update the view query definition to prevent breaking downstream tools.

## 5. Common Mistakes / Anti-Patterns

- **Flying Blind on Schema Changes:** Dropping database tables or columns without auditing downstream view dependencies.
- **Undocumented Database Stored Procedures Transformations:** Performing heavy data transformations inside nested database triggers and procedures, hiding data flow from developers.
- **No Correlation Keys:** Storing audit logs without trace identifiers, making it impossible to connect database rows to API logs.
- **Hiding Data Lineage in Code:** Relying on application code documentation to understand table relationships, ignoring changes made by raw SQL updates.

## 6. Security Considerations

- **Lineage Metadata Access Controls:** Restrict read permissions on schema registries and metadata catalogs. Lineage models expose table names, column structures, and data flows, which attackers can use to plan injection paths.

## 7. Performance Considerations

- **Audit Metadata Storage Overhead:** Storing correlation IDs adds small storage overhead per row. Index correlation columns only if they are actively used for troubleshooting queries.

## 8. Scalability Considerations

- **Distributed Lineage Mesh:** In microservice-per-service database architectures, pass correlation IDs (W3C Trace Context) across network requests, injecting the same trace ID into the separate databases of each microservice.

## 9. How Major Companies Implement It

- **Stripe:** Automatically tracks schema metadata and data lineage across its financial storage systems, ensuring all data movements and dependencies are visible to engineers and auditors.
- **Netflix:** Utilizes automated metadata crawlers to scan database catalogs and data lakes daily, building dependency maps to alert teams before schema updates break reporting pipelines.

## 10. Decision Checklist (Lineage Tracking Sizing)

Select lineage tracing depth based on system scale:

- Use **Database-Level Dependency Checks (System Catalogs)** when:
  - Operating relational databases with active views, foreign keys, and trigger tables.
- Use **Correlation ID Mapping (`request_id` columns)** on:
  - All transactional databases where updates must be traceable back to specific API requests.
- Use **Enterprise Metadata Catalogs (SIEM/Data Mesh)** when:
  - Data spans multiple independent microservice databases and cold data lakes.
  - Compliance (GDPR, PCI, HIPAA) demands strict data flow audit trails.

## 11. AI Coding-Agent Implementation Guidelines

- Always include correlation ID (`request_id` / `trace_id`) columns in transactional table templates.
- Never recommend executing DDL schema changes (drops/renames) without checking database catalogs for dependent views.
- Always recommend routing external BI tools to database views to abstract schema lineage.
- Never write database procedures that execute hidden, undocumented data transformations.
- Always include schema dependency verification checks in database migration runbooks.

## 12. Reusable Checklist

- [ ] Correlation IDs (`request_id` / `trace_id`) present in transactional tables
- [ ] Database system catalog queries run to verify view dependencies before DDL drops
- [ ] Source-to-target column maps documented for all database ETL pipelines
- [ ] Database views used to abstract raw table structures from reporting tools
- [ ] ER diagrams and schema maps stored in version control alongside DDL migrations
- [ ] Transformation formulas inside stored procedures documented
- [ ] Metadata registry access restricted to authorized security roles
- [ ] Microservices pass and record unified trace contexts in local databases
