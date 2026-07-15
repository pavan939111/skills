# Project Scope

## 1. Definition & Core Concepts
Project Scope defines the functional and technical boundaries of a project. It explicitly lists what features, integrations, platforms, and capabilities are included in the active release (In-Scope) and, equally important, what items are excluded (Out-of-Scope).

Core concepts:
- **In-Scope Features:** Features committed for delivery in the active milestone.
- **Out-of-Scope (Future Backlog):** Features acknowledged but deferred to future phases to protect deadlines.
- **Scope Creep:** The unauthorized expansion of project boundaries without adjustments to time, budget, or resources.
- **Minimum Viable Product (MVP):** The leanest version of the product required to solve core user problems and validate assumptions.

## 2. Why It Exists / What Problem It Solves
Engineering projects face continuous requests for new features. Without a project scope, developers attempt to accommodate every request, causing the project boundary to swell. This leads to missed deadlines, exhausted budgets, and bloated architectures. Defining scope sets clear boundaries, allowing teams to deliver high-quality code on time.

## 3. What Goes Wrong on a Project Without It
- **Infinite Development Loops:** The project never launches because "one more feature" is continuously added, stalling development for months.
- **Bloated System Designs:** Designing complex sharding structures for a V1 product that only has 100 pilot users, wasting engineering time.
- **Missed Target Launch Dates:** The project team fails to meet launch windows because they spent time building out-of-scope administrative interfaces.
- **Burned-out Teams:** Engineers work excessive overtime attempting to build undefined feature lists.

## 4. Best Practices
- **Define Scope Boundaries Early:** Document the scope *before* proposing system architectures.
- **Be Explicit about Out-of-Scope Items:** Write down deferred features (e.g. "Google SSO is out of scope for V1; password signup only"). This prevents assumptions.
- **Establish a Change Control Process:** Require product sponsor sign-offs before adding features to active sprint scopes.
- **Align Scope with Budget and Deadlines:** Ensure the list of in-scope features is realistic given team size and milestones.
- **Group Scope by Milestone Phases:** Break scope down into Phase 1 (MVP), Phase 2 (Growth), and Future iterations.

## 5. Common Mistakes / Anti-Patterns
- **The "Yes-Man" Scope:** Agreeing to build every feature request without adjusting project timelines or budgets.
- **Implicit Out-of-Scope Lists:** Assuming everyone knows a feature is out of scope without documenting it.
- **Gold-Plating (Over-building):** Developers adding unrequested features (e.g. custom chat systems) because they think it makes the app look better.
- **No MVP Boundary:** Blending complex scaling optimizations into the initial pilot release.

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** An MVP scope constraint limits the system design to simple, single-instance database deployments and monolithic backend structures, avoiding complex distributed network configurations early on.
- **Backend Architecture:** Restricting the scope to a single payment gateway (e.g. Stripe) simplifies payment handler architectures, avoiding complex routing logic.
- **Database Design:** Out-of-scope definitions (like deferring multi-tenancy) allow the database schema to remain flat and simple, keeping tables lean.

## 7. What "Good" Looks Like
A high-quality project scope document is clear, precise, and bounded. It lists exactly what features, integrations, and roles are in-scope for the active release, defines what is excluded, and aligns deliverables with budget and timelines.

## 8. How Major Companies/Teams Do It
- **Basecamp:** Practices "Shape Up": they define and bound a project's scope to fit a strict 6-week cycle. If a feature cannot be completed within 6 weeks, the scope is reduced, rather than extending the deadline.
- **Amazon:** Drafts clean product boundaries in their PR/FAQ documents, ensuring launch scopes are focused on customer solutions.

## 9. Decision Checklist
Go **Deep** (comprehensive scope definition) when:
- Designing products for external clients with fixed-price contracts.
- Launching new SaaS projects under strict, non-negotiable launch dates.
- Collaborating with multiple remote teams where scope overlap can occur.

Keep it **Lightweight** when:
- Developing minor internal tools or developer utility scripts.
- Building rapid prototypes where the goal is exploration, not release.

## 10. AI Coding-Agent Implementation Guidelines
When a user requests a project:
1. **Identify the Core Features:** Ask: "What are the essential, non-negotiable features required for this initial version?"
2. **Define the Exclusions:** Ask: "What features or integrations can be deferred to a later release?"
3. **Establish Constraints:** Align scope with budget and launch dates.
4. **Produce Project Scope Artifact:** Generate a structured scope document using the template below.

## 11. Reusable Checklist
- [ ] Core MVP features identified and documented
- [ ] Non-essential features explicitly listed as Out-of-Scope
- [ ] Deliverables aligned with team capacity and launch dates
- [ ] Scope changes require formal review and adjustments to deadlines/budgets
- [ ] Scope definitions exclude technical implementation details
- [ ] Out-of-scope items added to a deferred product backlog
- [ ] Integration boundaries (supported third-party APIs) specified
- [ ] Stakeholders signed off on scope limits

## 12. Output Template
```markdown
# Project Scope: [Project Name]

### 1. In-Scope Features (Phase 1 MVP)
- **User Authentication:** Email and password registration and login only.
- **Product Catalog:** List products, view product details, search by keyword.
- **Checkout Flow:** Add products to cart, enter shipping address, pay via Stripe.
- **Admin Panel:** View order lists and toggle shipping status.

### 2. Out-of-Scope (Deferred to Phase 2+)
- **Social Login:** Google/Apple SSO is excluded from this release.
- **Multi-Currency Support:** System supports USD only; foreign currency conversions are out of scope.
- **Automated Returns:** Refund requests must be handled manually by support agents via Stripe Dashboard.
- **Mobile Apps:** Launch is desktop web only; native iOS/Android apps are excluded.

### 3. Integration Boundaries
- **Supported Payment Gateways:** Stripe only. Paypal, Adyen, and Apple Pay are excluded.
- **Supported Shipping APIs:** EasyPost API only. Direct DHL/FedEx API integrations are excluded.
```
