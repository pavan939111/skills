# Schema Review Checklist

## 1. Purpose
This checklist validates that database schema structures, table designs, primary/foreign keys, constraints, and indexes follow established data integrity and naming standards before deployment. It is designed to be executed during final architecture review or staging sign-offs.

## 2. Checklist

### Keys & Identifiers
- [ ] Every table has a designated primary key.
- [ ] Primary keys for high-write tables use time-ordered UUIDv7 or ULID instead of random UUIDv4.
- [ ] Foreign keys are configured for all table relationships (no orphan rows permitted).
- [ ] Foreign key columns have explicit indexes configured to optimize join queries.

### Constraints & Integrity
- [ ] Mandatory columns have explicit `NOT NULL` constraints configured.
- [ ] Numeric columns representing values like price, quantity, or balances have `CHECK` constraints (e.g. `price > 0`).
- [ ] Table status and state fields use `ENUM` types or check constraints to block invalid entries.
- [ ] Unique constraints are configured for logical keys (emails, codes).

### Naming & Organization
- [ ] Naming follows lower_snake_case standards globally.
- [ ] Primary keys named `id` or `[table_basename]_id` consistently.
- [ ] Index naming follows prefixes: `idx_` for standard, `uq_` for unique, `fk_` for foreign keys.
- [ ] Schemas segregated logically using namespaces (e.g. `billing`, `identity`).

### Metadata
- [ ] Column and table descriptions populated directly in the catalog using SQL `COMMENT ON` statements.
- [ ] Data sensitivity tags (`PII`, `Financial`) documented in column comments.

## 3. Cross-references
This checklist compiles rules from the following detailed topic files:
- [Primary Keys](../03-schema-design/primary-keys-schema-design.md)
- [Foreign Keys](../03-schema-design/foreign-keys-schema-design.md)
- [Constraints](../../00-product-analysis/constraints-analysis.md)
- [Naming Standards](../04-database-best-practices/naming-standards-implementation.md)
- [Schema Organization](../04-database-best-practices/schema-organization-implementation.md)
- [Metadata Management](../09-data-governance/metadata-strategy.md)

## 4. Sign-off Criteria
The schema review passes when:
1. 100% of checklist boxes are verified.
2. DDL migrations have been run and verified on a staging database.
3. No naming or constraint violations are reported in schema diagnostics.
