# Layered Project Layout

## 1. Definition & Core Concepts
Layered Project Layout (also called package-by-layer) is an architectural layout pattern where codebase files are grouped in folders named after their technical execution layer (typically /controllers, /services, /repositories, /models).

## 2. Why It Exists / What Problem It Solves
For small, data-driven applications, layered layouts provide a clean, predictable, and familiar structure. It makes it easy to understand where database tables live, how business logic is isolated, and where HTTP routers are defined.

## 3. What Breaks in Production Without It
- **Architectural Bleeding:** Without defined layers, database query statements are written directly inside HTTP controller routes, making testing and maintenance difficult.

## 4. Best Practices
- **Enforce Uni-directional dependencies:** Lower layers must never import higher layers (e.g., a repository file must never import a controller).
- **Standardize DTO transfers:** Use Data Transfer Objects (DTOs) to move data between the controller layer and the service layer, keeping DB schemas isolated.
- **Implement Interface abstractions:** Define repository interfaces to isolate database client libraries from business services.

## 5. Common Mistakes / Anti-Patterns
- **Bypassing layers:** Routing requests from controllers directly to database repositories, bypassing the business logic service layer.
- **Creating giant folders:** Putting hundreds of unrelated files in a single /controllers folder, cluttering directories.

## 6. Security Considerations
- **API Boundary Protection:** Ensure that input validation is executed at the entry point (controller layer) before payloads are sent to inner layers.

## 7. Performance Considerations
- **Short-circuit queries:** In read-heavy CRUD configurations, optimize layers to fetch cached data early, avoiding database pools queries.

## 8. Scalability Considerations
- **Multi-layer Deployments:** Although code is layered, run deployments as unified stateless container clusters to optimize hosting costs.

## 9. How Major Companies Implement It
- **Standard Startups:** Startups often bootstrap their initial MVPs using layered frameworks (like Express or Ruby on Rails) to accelerate deployment speeds.

## 10. Decision Checklist (Layered Suitability)
- Use **Layered Layout** when:
  - Building lightweight CRUD utilities, database wrappers, or early-stage prototype products with low complexity.
- Use **Feature-Based Layout** when:
  - Codebases exceed 20-30 domain entities or are maintained by multiple engineering squads.

## 11. AI Coding-Agent Guidelines
- Route data flows sequentially through Controllers -> Services -> Repositories, ensuring that database client drivers remain in repository layers.

## 12. Reusable Checklist
- [ ] Folders separated by technical execution roles (controllers/services/repos)
- [ ] Dependencies flow downward only (controllers -> services -> repositories)
- [ ] Business logic services are completely isolated from HTTP routing details
- [ ] Database client imports reside exclusively in repository files
- [ ] Data Transfer Objects (DTOs) move values across layer boundaries
- [ ] Layered checks integrated in automated code review processes
