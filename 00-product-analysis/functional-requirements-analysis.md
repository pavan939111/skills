# Functional Requirements

## 1. Definition & Core Concepts
Functional Requirements specify what the application must *do* at a product level. They describe the features, behaviors, inputs, and outputs of the software in clear, non-technical language from the perspective of the user (e.g., "Users can download transaction statements as PDF").

Core concepts:
- **Product Features:** Logical capabilities of the system (authentication, invoicing, search).
- **User Roles & Permissions:** Who can perform which actions.
- **Input Validation Rules:** What parameters are accepted for user inputs.
- **Data Mutations:** What actions modify database state.

*(Boundary Note: Technical implementation specifications, database schemas, API syntax, and backend framework code belong in `01-system-design/` and `backend-development/`. This document covers product-tier functional scopes, business logic definitions, and user roles.)*

## 2. Why It Exists / What Problem It Solves
Functional Requirements define the software's functional scope. Without them, engineering teams operate on assumptions, building features that are either out of scope, incomplete, or deviate from product intentions. They serve as a contract between product managers, stakeholders, and developers, establishing what features must be built and validated.

## 3. What Goes Wrong on a Project Without It
- **Building Unnecessary Features:** Developers waste weeks building complex custom notification engines when the product only requires standard email alerts.
- **Mismatched Feature Logic:** A developer builds a payment refund feature that immediately releases stock back to inventory. The product requirement was that stock should only be returned after manual physical verification.
- **Security & Authorization Gaps:** Forgetting to document who has write access to sensitive administrative tables, leading to unauthorized user access.
- **Failed Quality Sign-offs:** The quality assurance (QA) team has no clear product criteria to test features, causing bug-ridden code to be released.

## 4. Best Practices
- **Write in User-Outcome Formats (User Stories):** Structure requirements as: "As a [User Role], I want to [Perform Action] so that [Business Value]."
- **Keep Requirements Atomic:** Each requirement should cover a single, distinct action that can be built and tested independently.
- **Specify Inputs, Transformations, and Outputs:** For every feature, define what values are inputted, how they are validated, and what output is returned.
- **Define Authorization Constraints per Feature:** Document which database roles (e.g. Reader, Editor) can execute the function.
- **Enforce Traceability:** Map every functional requirement back to a parent business requirement and forward to a technical design.

## 5. Common Mistakes / Anti-Patterns
- **Technical Dictation inside Functional Docs:** Writing requirements like: "The API must run a SELECT query on pg_user" instead of "The system must display the user's username on the dashboard."
- **Ambiguous Language:** Using vague terms like "The system should load pages quickly" or "Errors should be handled gracefully."
- **Overlapping/Redundant Scopes:** Blending multiple features into a single, complex requirement paragraph.
- **No Input Boundaries:** Documenting the happy path but failing to define validation rules (e.g. maximum character limits for usernames).

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** A requirement for "Real-time chat notification alerts" necessitates WebSockets or Server-Sent Events (SSE) architectures rather than simple HTTP polling.
- **Backend Architecture:** Multi-step wizard requirements require drafting schemas and server-side state validations.
- **Database Design:** A requirement to "Never lose transaction history even if an account is deleted" constrains the database to use the Soft Delete pattern and foreign key restrictions instead of physical deletes.

## 7. What "Good" Looks Like
A high-quality functional requirements document is atomic, verifiable, and structured. It lists distinct user stories, defines user role boundaries, and specifies input validations and data changes in clear business terms.

## 8. How Major Companies/Teams Do It
- **Stripe:** Documents API functional requirements by defining the exact input parameters, validation errors, and response structures from a merchant perspective before writing backend handlers.
- **Amazon:** Employs the "Working Backwards" model, detailing exactly how the customer will interact with a feature to outline its functional specs.

## 9. Decision Checklist
Go **Deep** (detailed functional requirements) when:
- Building user-facing transactional features (checkout, registration, settings).
- Defining critical administrative workflows and security permissions.
- The product must be validated by QA teams using explicit test cases.

Keep it **Lightweight** when:
- Developing simple, internal prototypes or experimental research projects.
- Making minor UI modifications or color adjustments.

## 10. AI Coding-Agent Implementation Guidelines
When a user requests a feature:
1. **Identify the Actor:** Ask: "Which user persona or role can perform this action?"
2. **Define the Inputs/Outputs:** Ask: "What values does the user submit, and what should the system return on success and failure?"
3. **Map Validation Rules:** Ask: "What are the limits on inputs? (e.g. maximum characters, file types, integer ranges)."
4. **Produce Functional Requirements Artifact:** Generate a user-story-focused functional requirements page using the template below.

## 11. Reusable Checklist
- [ ] Requirements written in atomic, user-outcome formats (User Stories)
- [ ] User role boundaries and permissions defined for each requirement
- [ ] Input parameters, data types, and validation rules specified
- [ ] Database state mutations (writes/deletes) identified in business terms
- [ ] Error messages and validation failures documented
- [ ] Technical implementation details excluded from requirements
- [ ] Requirements prioritized using MoSCoW method
- [ ] Acceptance criteria defined for every user story

## 12. Output Template
```markdown
# Functional Requirements: [Project Name]

### 1. User Roles & Permissions
- **Administrator:** Full read-write access to all tables, billing, and settings.
- **Manager (Tenant):** Read-write access to tenant-scoped tables (products, orders).
- **Customer:** Read-only access to catalogs, read-write access to personal orders.

### 2. Core Feature: [Feature Name, e.g. Billing & Invoice Generation]

#### FR-1: Generate Monthly Invoice
- **User Story:** As a Tenant Manager, I want to click 'Generate Invoice' so that a billing statement is created for my customers.
- **User Inputs:** `customer_id` (UUID), `billing_period_start` (Date), `billing_period_end` (Date).
- **Input Validation:**
  - `customer_id` must represent a valid active customer.
  - `billing_period_end` must be after `billing_period_start`.
- **System Actions (State Mutations):**
  - Verify customer has active transactions.
  - Create a new invoice record with status `UNPAID` in the database.
- **System Outputs:** Consolidated PDF invoice preview displayed on screen.

#### FR-2: Apply Invoice Discount
- **User Story:** As an Administrator, I want to apply a discount percentage to an invoice to correct pricing errors.
- **User Inputs:** `invoice_id` (UUID), `discount_percentage` (Integer).
- **Input Validation:** `discount_percentage` must be between 1 and 100.
- **System Actions:** Update invoice record, recalculating totals.
- **System Outputs:** Updated invoice totals displayed.
```
