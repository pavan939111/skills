# Business Requirements

## 1. Definition & Core Concepts
Business Requirements define the high-level goals, objectives, and success parameters of a product or project from the perspective of the business. They answer *why* the project is being undertaken, *what* value it brings to the organization, and *how* success will be measured financially or operationally.

Core concepts:
- **Business Value/Objective:** The primary commercial driver (e.g. increase revenue, reduce customer churn, automate operations).
- **Core Value Proposition:** The unique value the product offers to users that competitors do not.
- **Revenue Model:** How the product generates income (SaaS subscription, transaction fees, advertising).
- **Stakeholder Alignment:** Ensuring all business segments (product, legal, marketing, engineering) share a unified understanding of project scope and business metrics.

## 2. Why It Exists / What Problem It Solves
Engineering teams are prone to focusing on technical execution without understanding commercial constraints. Business Requirements ground technical efforts in business realities. They ensure that time and resources are spent building features that drive business outcomes, preventing teams from building over-engineered solutions that do not solve customer or business problems.

## 3. What Goes Wrong on a Project Without It
- **Building the Wrong Product:** Engineers build a highly scalable, real-time message queue architecture for a product that users only access once a month, wasting budget and development cycles.
- **Scope Creep & Drift:** Without clear boundaries, the project accumulates non-essential features, causing deadlines to slip.
- **Unviable Monetization Paths:** Designing database structures that cannot support the target pricing model (e.g., building a flat-rate database for a usage-based billing product).
- **Stakeholder Conflict:** Product and engineering disagree on feature priority because no core business goals were defined.

## 4. Best Practices
- **Define Goals using SMART Criteria:** Make business requirements Specific, Measurable, Achievable, Relevant, and Time-bound.
- **Differentiate Business Requirements from Technical Tasks:** Focus strictly on *outcomes* (e.g. "Reduce invoice creation times by 50%"), not implementations (e.g. "Use PostgreSQL pg_cron").
- **Quantify the ROI:** Document the expected financial impact of the feature (e.g., "Saves $10,000/month in server costs").
- **Map Requirements to Product Features:** Maintain a traceability matrix connecting every business requirement directly to functional requirements and system designs.
- **Envolve Stakeholders Early:** Review requirements with product, engineering, and legal stakeholders to identify blockers before coding begins.

## 5. Common Mistakes / Anti-Patterns
- **Generic Requirements:** Using vague phrases like "Make the application faster" or "Improve user experience" without metrics.
- **Implementation Dictation:** Specifying technical tools (e.g., "We must use AWS DynamoDB") inside business requirements.
- **Ignoring Regulatory Constraints:** Failing to note compliance rules (like GDPR/HIPAA) in the business outline, leading to architectural rewrites later.
- **No Priority Levels:** Treating all requirements as equally critical, causing key milestones to be missed.

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** High-value enterprise customer targets mandate multi-region high availability architectures. Free-tier consumer products use single-instance setups to save cost.
- **Backend Architecture:** A transaction-fee revenue model requires audit trails and outbox sync patterns.
- **Database Design:** A subscription SaaS billing model requires relational schemas to track monthly billing intervals and tenant partitions.

## 7. What "Good" Looks Like
A high-quality business requirements document is clear, structured, and quantified. It contains a well-defined business problem, target audience, success metrics (KPIs), regulatory boundaries, and prioritizes requirements using MoSCoW (Must have, Should have, Could have, Won't have).

## 8. How Major Companies/Teams Do It
- **Stripe:** Documents business requirements for new payment integrations by listing target merchant conversion lifts, regulatory compliance rules (PCI-DSS), and geographical availability targets before designing API schemas.
- **Amazon:** Uses the "Working Backwards" PR/FAQ template, writing a mockup press release and customer FAQ to clarify business value before writing a single line of code.

## 9. Decision Checklist
Go **Deep** (comprehensive analysis) when:
- The project is a new product launch or major pivot.
- Financial transactions, billing, or audit compliance is involved.
- Development costs are high and require executive sponsor approvals.

Keep it **Lightweight** when:
- The project is a minor feature update or UI layout tweak.
- Building an internal prototype or proof of concept.

## 10. AI Coding-Agent Implementation Guidelines
When a user requests building a new system:
1. **Clarify Business Objective:** Ask: "What is the primary business goal of this application? (e.g. monetize via subscriptions, automate manual invoice generation, etc.)"
2. **Define Monetization:** Ask: "What is the revenue or billing model? (e.g. free, flat SaaS subscription, usage-based per API call)."
3. **Establish Constraints:** Ask: "Are there regulatory compliance bounds we must enforce? (GDPR, PCI, HIPAA)."
4. **Produce Business Requirements Artifact:** Generate a structured requirements page using the template below before starting system design.

## 11. Reusable Checklist
- [ ] Primary business problem defined clearly
- [ ] Business goals quantified using SMART criteria (KPI targets)
- [ ] Target audience and pricing model documented
- [ ] Regulatory and compliance constraints identified (GDPR/HIPAA/PCI)
- [ ] Business requirements prioritized using MoSCoW method
- [ ] Technical implementation details excluded from business descriptions
- [ ] Traceability link established connecting business goals to functional features
- [ ] Stakeholders (Product, Engineering, Legal) reviewed and signed off

## 12. Output Template
```markdown
# Business Requirements: [Project Name]

### 1. Business Problem Statement
[Describe the problem the business or customer is facing and why it needs to be solved.]

### 2. Primary Business Objectives & KPIs
- **Goal 1:** [e.g. Reach 10,000 monthly active users by Q4]
- **KPI 1:** [e.g. Monthly active users count]
- **Goal 2:** [e.g. Automate payment collections, reducing admin hours by 30%]
- **KPI 2:** [e.g. Hours spent on manual collections]

### 3. Core Value Proposition
[What unique value does this product offer to customers?]

### 4. Revenue & Monetization Model
- **Pricing Tier:** [e.g., Free Tier, Pro Sub ($29/mo), Enterprise (custom)]
- **Billing Mechanics:** [e.g., Monthly recurring charge, usage-based metering]

### 5. Compliance & Regulatory Boundaries
- [e.g., PCI-DSS Compliance for payment processing]
- [e.g., GDPR data minimization for European users]

### 6. MoSCoW Prioritization
- **Must Have:** [Critical requirements without which the launch is blocked]
- **Should Have:** [Important features but not vital for V1]
- **Could Have:** [Nice-to-have features for future iterations]
- **Won't Have:** [Out of scope for this release]
```
