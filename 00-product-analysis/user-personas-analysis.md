# User Personas

## 1. Definition & Core Concepts
User Personas are semi-fictional representations of a product's target users based on real user data, research, and behavioral patterns. They detail the goals, pain points, technical capabilities, and workflow habits of the people who will interact with the application.

Core concepts:
- **Demographics & Context:** High-level background (role, industry, daily environment).
- **Goals & Motivations:** What the user wants to accomplish using the application.
- **Pain Points & Frustrations:** Obstacles that prevent the user from achieving their goals.
- **Technical Literacy:** The user's comfort level with technology, guiding UI and security design (e.g., preference for API vs. simple dashboards).
- **Access Patterns:** How often and from what devices the user accesses the product (mobile on-the-go vs desktop office environments).

## 2. Why It Exists / What Problem It Solves
Applications are built for humans. Developers often design interfaces and backend structures that make sense to *them*, but confuse the end-user. User Personas keep development user-centric, ensuring that feature prioritization, interface design, error messaging, and backend access controls are tailored to actual user behaviors.

## 3. What Goes Wrong on a Project Without It
- **Building for Nobody:** The product has a complex developer API, but the actual users are non-technical office managers who need a simple CSV upload button, causing low adoption rates.
- **Mismatched Authentication UX:** Forcing busy warehouse workers wearing gloves to enter complex MFA codes on mobile screens every 15 minutes, killing workflow efficiency and leading to bypass attempts.
- **Incorrect Performance Priorities:** Optimizing a backend for sub-10ms desktop searches, when the primary user persona accesses the app via slow 3G mobile connections where asset size optimization matters more.
- **Feature Overload:** Building excessive administrative panels when users only need basic self-service options.

## 4. Best Practices
- **Base Personas on Real Research:** Avoid making up personas based on assumptions. Interview actual users, review support tickets, and analyze telemetry.
- **Define Goals and Pain Points Clearly:** Focus on behaviors that directly impact how the software is used.
- **Categorize by Technical Literacy:** Classify personas into clear technical tiers (e.g. Non-technical, Tech-savvy, Developer) to shape UI complexity and documentation.
- **Map Personas to Access Roles:** Translate personas directly into security roles (e.g. Viewer, Editor, Administrator) to guide authorization schemas.
- **Keep it Bounded:** Create a small set of primary personas (typically 2 to 4) rather than trying to represent every edge-case user type.

## 5. Common Mistakes / Anti-Patterns
- **The "Average User" Persona:** Creating a single, generic user persona that tries to represent everyone, resulting in a design that fits nobody.
- **Stereotyped Profiles:** Adding irrelevant personal details (e.g., "Enjoys hiking on weekends") that do not influence software design choices.
- **Ignoring the Admin Persona:** Documenting consumer personas but forgetting the internal staff, support agent, and security auditor roles.
- **Stale Personas:** Failing to update user profiles as the product and customer base evolve over time.

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** Mobile-heavy consumer personas require offline caching and optimistic sync capabilities. Developer personas require robust API key management and webhook systems.
- **Backend Architecture:** Non-technical personas require verbose error translation layers rather than exposing database errors in APIs.
- **Database Design:** Multi-tenant dashboards queried by business owners require pre-computed read models to load metrics instantly.

## 7. What "Good" Looks Like
A high-quality user persona is realistic, data-grounded, and concise. It clearly details the user's role, daily workflow context, specific software objectives, technical limitations, and maps directly to a technical database access role.

## 8. How Major Companies/Teams Do It
- **Stripe:** Designs distinct personas for the developer (who reads API docs and tests code) and the finance manager (who queries dashboards for tax reconciliation), ensuring both have dedicated UI interfaces.
- **Airbnb:** Maps guest and host personas to separate application flows, utilizing behavioral profiles to optimize check-in features.

## 9. Decision Checklist
Go **Deep** (comprehensive persona research) when:
- Designing new SaaS platforms with diverse user roles (e.g., buyer, manager, technician).
- Building applications for non-technical users, children, or elderly demographics.
- The product UX is a key competitive differentiator.

Keep it **Lightweight** when:
- Building internal tooling for team members with known capabilities.
- Building standard developer APIs where the target audience is highly homogeneous.

## 10. AI Coding-Agent Implementation Guidelines
When starting a project:
1. **Identify the Users:** Ask the user: "Who will use this application? What are their technical skills and daily environments?"
2. **Determine Access Roles:** Ask: "What are the administrative and regular user access roles required?"
3. **Establish Device Targets:** Ask: "Will users primarily access this via mobile, desktop web, or CLI?"
4. **Generate Personas:** Create a structured personas document using the template below.

## 11. Reusable Checklist
- [ ] User personas based on actual customer research and support telemetry
- [ ] Demographics, daily context, and device access patterns documented
- [ ] Core goals and software motivations defined for each persona
- [ ] Technical literacy levels declared (Non-technical / Tech-savvy / Dev)
- [ ] Pain points and frustrations with current systems mapped
- [ ] Personas mapped to corresponding database authorization roles (Viewer/Editor/Admin)
- [ ] Edge-case administrative and internal support personas documented
- [ ] Irrelevant personal profile details excluded from design specs

## 12. Output Template
```markdown
# User Personas: [Project Name]

### Persona 1: [Name/Archetype Name, e.g. Sarah the Store Manager]
- **Role & Context:** [Describe their job title, business scale, and daily environment.]
- **Technical Literacy:** [Non-Technical / Tech-Savvy / Developer / Advanced]
- **Primary Goals:**
  - [Goal 1: e.g., Generate monthly inventory reports in under 5 minutes]
  - [Goal 2: e.g., Reorder stock without calling support]
- **Key Pain Points:**
  - [Pain Point 1: e.g., Current system crashes on slow mobile connections]
  - [Pain Point 2: e.g., Confusing error messages make it hard to debug order issues]
- **Primary Device & Access Patterns:** [e.g., Mobile Android app, accessed on-the-go in noisy environments]
- **Database Authorization Role:** [e.g. `tenant_manager` role]

### Persona 2: [Name/Archetype Name, e.g. David the Developer]
- **Role & Context:** [e.g. Integrates API endpoints into external platforms.]
- **Technical Literacy:** [Developer / Advanced]
- **Primary Goals:**
  - [Goal 1: e.g., Retrieve payment status asynchronously via webhooks]
- **Key Pain Points:**
  - [Pain Point 1: e.g., Lack of API sandbox testing tools]
- **Primary Device & Access Patterns:** [e.g., CLI, Desktop Web, API calls]
- **Database Authorization Role:** [e.g. `api_runner` role]
```
