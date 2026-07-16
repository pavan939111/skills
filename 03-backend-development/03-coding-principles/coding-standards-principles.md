# Coding Standards in Backend Development

## 1. Backend Application Context
Coding Standards define the language rules, folder rules, type systems, and naming rules that teams follow:
- **Lint Configurations:** Enforce unified style formatters (Prettier, Black, Ruff, dotnet-format) inside commit workflows.
- **Standardized Response Schemas:** Return identical error formats (code, message, detail list) across all service APIs.
- **Database Casing Conventions:** Require snake_case column names and plural table names across SQL databases.

## 2. Backend-Specific Pitfalls
- **Permissive Git check-ins:** Allowing developers to merge code that fails style checker audits or linter thresholds.
- **Documenting standards in private files:** Leaving code style docs in static files that developers do not read, rather than automated linter settings.

## 3. Code-Shape Example
`json
// Example: ESLint configuration (.eslintrc.json) enforcing standards
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",
      { "selector": "class", "format": ["PascalCase"] },
      { "selector": "interface", "format": ["PascalCase"], "prefix": ["I"] }
    ],
    "no-console": "error",
    "eqeqeq": "error"
  }
}
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Engineering Governance](../../12-governance/03-operations-and-governance/07-engineering-governance-guideline.md)
