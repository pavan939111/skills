# Feature-Based Project Layout

## 1. Definition & Core Concepts
Feature-Based Project Layout (also called package-by-feature) is a codebase organization pattern where all files related to a specific product feature or domain (controllers, services, repositories, schemas, and tests) are grouped together in a single folder.

## 2. Why It Exists / What Problem It Solves
Traditional layered architectures separate files by technical roles (e.g. putting all controllers in one folder, all services in another). As a codebase grows, developers must open multiple distant folders to make modifications to a single feature (e.g. adding a field to "users"). Feature-based layout keeps related code together, maximizing cohesion.

## 3. What Breaks in Production Without It
- **High Cognitive Load:** Developers struggle to locate related code, increasing editing friction.
- **Merge Conflicts:** High-frequency team edits on shared folders (like the global controllers folder) generate massive git merge conflicts.

## 4. Best Practices
- **Group by Domain Entities:** Define top-level folders around clean domain concepts (e.g., /users, /billing, /orders).
- **Expose Clean API Interfaces:** Use clear public/private code access patterns, exposing only the primary service endpoints while hiding helper files.
- **Isolate Feature Tests:** Place unit and integration tests inside the feature folder next to the code they validate.

## 5. Common Mistakes / Anti-Patterns
- **Creating cross-feature dependencies:** Letting code inside feature A directly modify data models in feature B without going through defined service APIs.
- **Over-segmentation:** Creating folders for trivial helper functions or single-use variables.

## 6. Security Considerations
- **Boundary Controls:** Restrict API authorization rules at the feature boundary, ensuring that user roles match feature module permissions.

## 7. Performance Considerations
- **Lazy Loading Modules:** In large projects (like Node/NestJS), feature-based organization allows the runtime to lazy-load modules, decreasing startup memory footprints.

## 8. Scalability Considerations
- **Transition to Microservices:** Since features are isolated, migrating a high-traffic feature (e.g., /billing) into a separate microservice requires copying the feature folder out.

## 9. How Major Companies Implement It
- **Uber:** Encourages feature-based packaging across its Go microservices, allowing separate engineering teams to maintain modules independently.

## 10. Decision Checklist (Layout Selection)
- Use **Feature-Based Layout** when:
  - Building medium-to-large business applications operated by multiple developers or distinct product squads.
- Use **Layered Layout** when:
  - building simple prototypes, CRUD operations, or single-developer scripts.

## 11. AI Coding-Agent Guidelines
- Group new controllers, models, and services inside a single named folder corresponding to the business feature domain.

## 12. Reusable Checklist
- [ ] Feature folders grouped by business domain entities (not technical roles)
- [ ] Cross-feature imports go through explicit public interface files
- [ ] Feature-specific tests live inside the corresponding feature directory
- [ ] Shared utility functions isolated in a central /shared folder
- [ ] Feature module dependencies documented in local config managers
- [ ] Directory boundaries checked by linter import-rules
