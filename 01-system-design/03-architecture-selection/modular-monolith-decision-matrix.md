# Modular Monolith

## 1. What Question This Answers
"How do we design a single-deployment monolithic application with strictly isolated service modules, preventing spaghetti dependencies while enabling future microservice extraction?"

## 2. Why It Matters at the System-Design Stage
A Modular Monolith represents the middle ground between monolithic simplicity and microservice modularity. It allows teams to build a single application binary (lowering deployment costs and eliminating network RPC calls) while enforcing strict boundary isolation between code components. This prevents modules from accessing other services' databases directly, keeping clean interfaces and ensuring that if a module must be split off into a separate microservice due to scale limits later, it can be extracted with minimal refactoring.

## 3. Methodology / How to Work Through It
1. **Define Module Boundaries:** Segregate domains (e.g. Identity, Billing, Shipping) into distinct code directories.
2. **Enforce Database Isolation (Logical Schema Splits):** Prevent Module A from directly querying tables owned by Module B. All cross-module data access must execute via defined API interfaces.
3. **Declare Clean Public API Interfaces:** Design service-to-service interfaces that use standard code interfaces (contracts) or in-process message buses.
4. **Implement Boundary Lint Checks:** Use architectural linters (e.g., ArchUnit, dependency-cruiser) to automatically reject code imports that violate boundaries.
5. **Decouple using In-Process Events:** Use event publishers to communicate state changes asynchronously inside the application thread.

## 4. Inputs Needed
- Product user flows and functional boundaries from [Functional Requirements](../../00-product-analysis/functional-requirements-analysis.md).
- Team capability constraints.

## 5. Outputs Produced
- Feeds into [Component Design](../../13-architecture-decision-records/index.md) and [Backend Strategy](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Order & Inventory System)
- **Domain Division:**
  - `OrderModule`: Manages sales logs. Owns `orders` table.
  - `InventoryModule`: Manages warehouse stock. Owns `stock` table.
- **Rules Enforced:**
  - `OrderModule` code cannot import classes from `InventoryModule` directly except through an interface: `InventoryServiceBridge`.
  - `OrderModule` SQL queries cannot join the `stock` table. If it needs inventory details, it must call `InventoryServiceBridge.checkAvailability()`.
- **System Design Choice:** Single deployment binary on a shared cloud VM, eliminating network card delays and API gateway costs while preserving boundary clean-cuts.

## 7. Common Mistakes
- **Database Backdoors (Cross-Schema Joins):** Allowing modules to bypass API interfaces and execute SQL joins directly against other modules' tables, breaking database isolation.
- **Circular Code Dependencies:** Creating tight import loops between modules (Module A imports B, which imports A), preventing clean microservice extractions.
- **Ignoring Boundary Lint Checks:** Failing to enforce boundary linters, allowing developers to import forbidden files during urgent features delivery cycles.

## 8. AI Coding-Agent Guidelines
1. **Define Folder Boundaries:** Structure project directories to segregate domains strictly.
2. **Establish Interface Contracts:** Write interfaces that act as bridges between modules.
3. **Enforce SQL Isolation:** Do not write SQL queries that join tables owned by different modules.
4. **Produce Modular Monolith specs:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Modular Monolith Design: [System Name]

### 1. Isolated Service Modules
- **Module A (e.g., Billing):** [Folder: `/modules/billing` | Controls tables: `invoice`, `transaction`]
- **Module B (e.g., User):** [Folder: `/modules/user` | Controls tables: `account`, `profile`]

### 2. Service-to-Service Bridge Contracts
- **Interface Definition:**
  - `BillingServiceBridge` interface defines: `createInvoice(userId, amount)`.
  - `User` module imports `BillingServiceBridge` to trigger invoices; no direct database writes allowed.

### 3. Database Schema Isolation Rules
- **No Join Constraints:** SQL queries in `/modules/user` must never query or join tables owned by `/modules/billing`.
- **Foreign Key Strategy:** Link records using logical identifiers (UUIDs) only; no physical foreign keys across modules to allow future database splits.
```
