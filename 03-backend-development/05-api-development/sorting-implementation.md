# Sorting

## 1. Definition & Core Concepts
Sorting is the order arrangement of API response records based on target variables (e.g. created date, alphabetically).

## 2. Why It Exists / What Problem It Solves
Sorting provides a consistent, predictable order of records for user interfaces and pagination controls.

## 3. What Breaks in Production Without It
- **Random Result Sequences:** Databases return records in random order when tables are updated, scrambling pagination pages.

## 4. Best Practices
- **Validate Sort Columns:** Enforce an allowlist of sortable database columns.
- **Define Default Sort Keys:** Fall back to default sorting (e.g. created_at DESC) when clients omit parameters.
- **Index Sort Fields:** Configure indexes on sort columns.

## 5. Common Mistakes / Anti-Patterns
- **Concatenating Sort Parameters:** Inserting client sort strings directly into SQL ORDER BY statements.

## 6. Security Considerations
- **Inject Prevention:** Validate sort directions (ASC/DESC) strictly.

## 7. Performance Considerations
- **Index Scanning:** Optimize query planners to scan indexes rather than sorting in temp database tables.

## 8. Scalability Considerations
- **Offloading Sorts:** Enforce default sort keys to optimize query execution plans.

## 9. How Major Companies Implement It
- **GitHub:** Supports predictable sort queries on search endpoints, validating sort parameter inputs.

## 10. Decision Checklist (Sorting Configuration)
- Use **Default Index-Aligned Sorting** when:
  - Building high-volume list endpoints where performance is critical.

## 11. AI Coding-Agent Guidelines
- Ensure that sorting parameters match allowed columns and default sort keys are configured.

## 12. Reusable Checklist
- [ ] Sort fields verified against allowed lists of columns
- [ ] Dynamic sort parameters bound using parameterized SQL (no concatenation)
- [ ] Database indexes active on popular sort columns
- [ ] Default sort keys defined for all list endpoints
- [ ] Sort directions (ASC/DESC) validated strictly
- [ ] Index scanning confirmed for default query sorts
