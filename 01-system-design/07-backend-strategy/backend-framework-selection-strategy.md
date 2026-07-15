# Backend Framework Selection Strategy

### 1. The Question Decided
"Which backend framework class (Lightweight/Minimal Router vs. Opinionated Batteries-Included Enterprise) fits our architecture, and what trade-offs are accepted?"

### 2. Options Compared
| Dimension | Lightweight (e.g., Express, FastAPI) | Opinionated (e.g., Spring Boot, NestJS) |
|---|---|---|
| **Cost (Compute)** | Low (Minimal footprint) | Medium-High (JVM/DI overhead) |
| **Development Speed** | Fast (Simple setup) | Slow initially, fast at scale |
| **Complexity** | Low | High |
| **Scale Ceiling** | Very High | High |
| **Standardization** | Low (Ad-hoc patterns) | High (Forced patterns) |

### 3. Decision Rule
- **Choose Lightweight Frameworks if:** Building single-purpose microservices, serverless functions, or rapid prototypes where low resource footprint and fast startup are priority.
- **Choose Opinionated Frameworks if:** Building long-lived modular monoliths or complex enterprise backends where team-wide pattern standardization and robust Dependency Injection are required.

### 4. Red Flags to Revisit
- Developers build custom implementations of database ORM wrappers, auth middleware, and validation libraries on a lightweight router, creating maintenance overhead.
- Container startup times on serverless platforms are too slow (cold starts >5s) due to heavy JVM/Spring framework DI scans.

### 5. Where to Go Next
- For selecting a specific framework brand (e.g. NestJS vs Spring Boot) matching the strategy class, see [Backend Framework Selection Guide](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development01-project-initialization/backend-framework-selection-strategy-implementation.md).
