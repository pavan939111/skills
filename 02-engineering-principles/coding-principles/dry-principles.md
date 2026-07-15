# DRY (Don't Repeat Yourself) in Backend Development

## 1. Backend Application Context
In backend code, the DRY principle is applied to eliminate duplication in validation schemas, database access methods, configuration loading, and error handling:
- **Global Error Handlers:** Map errors to HTTP responses in a single centralized middleware rather than using try-catch blocks in every controller.
- **Structured Database Helpers:** Wrap common query pagination or filtering parameters in shared repository utilities.
- **DTO Inheritance:** Reuse base validation schemas (like create vs update user schemas) using class inheritance.

## 2. Backend-Specific Pitfalls
- **Over-DRYing feature modules:** Sharing validation logic or database models between two completely distinct business features (e.g. sharing schemas between /users and /billing), creating tight coupling. If features diverge, changes to one break the other.
- **Duplicating route validation:** Writing data checking rules in both API gateways, controllers, and services. Validate exactly once at the entry boundary.

## 3. Code-Shape Example
`	ypescript
// Shared pagination helper class (prevents query parameter duplication)
export class PaginationParams {
  limit: number;
  offset: number;

  constructor(query: any) {
    this.limit = parseInt(query.limit) || 10;
    this.offset = parseInt(query.offset) || 0;
  }
}

// Controller routing (utilizes shared pagination helper)
app.get('/users', (req, res) => {
  const params = new PaginationParams(req.query);
  const users = userService.listUsers(params);
  res.json(users);
});
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [DRY Principle](../../production_principles/core-engineering-principles/02-dry-principles.md)
