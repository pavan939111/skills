# Constraints

## 1. Definition & Core Concepts
Constraints are non-negotiable boundaries, limitations, and fixed parameters within which a product must be built. Unlike requirements (which state what the system *should* do), constraints dictate what the team *cannot* change (e.g., fixed hosting platform, legacy database integrations, budget limits, delivery deadlines, and compliance environments).

Core concepts:
- **Technical Constraints:** Pre-existing tech stacks, hosting providers, or legacy systems that must be integrated.
- **Business Constraints:** Fixed project budget limits, timeline milestones, and team resource sizes.
- **Compliance Constraints:** Data privacy laws (GDPR data residency boundaries, PCI cardholder data rules).
- **Physical Constraints:** Device hardware limits, battery power constraints, or restricted network bandwidth.

## 2. Why It Exists / What Problem It Solves
Engineering teams often design architectures in a vacuum. They might propose a complex, multi-region Kubernetes microservices deployment, only to be told later that the company is restricted to hosting on a single shared VPS with a $100/month budget, or must integrate with an old, on-premise mainframe. Documenting constraints ensures that architectures are viable, realistic, and align with business limitations from day one.

## 3. What Goes Wrong on a Project Without It
- **Unbuildable Architectures:** Designing a real-time data streaming pipeline that exceeds the cloud hosting budget, forcing a full redesign late in the cycle.
- **Integration Outages (Legacy Drift):** Building a modern backend that cannot communicate with the client's legacy database due to incompatible protocols.
- **Compliance Penalties:** Replicating database backups containing European customer PII to US-based datacenters, violating GDPR residency laws and incurring heavy fines.
- **Missed Deadlines:** Underestimating development time by designing an over-engineered database schema that requires weeks to build and test.

## 4. Best Practices
- **Identify Constraints Before System Design:** Always document constraints as the very first step before proposing architectures.
- **Verify the Non-Negotiable Status:** Question constraints to confirm if they are truly fixed or merely preferences (e.g. "Do we *have* to use MySQL, or is it just the DBA's preference?").
- **Quantify Constraints:** Document exact numbers (e.g. "Hosting budget: $150/month maximum", "Deadline: October 1st").
- **Differentiate Constraints from Requirements:** Ensure constraints define *boundaries* (what we cannot change), not *features* (what we want to build).
- **Map Constraints to Risk Logs:** Document how specific constraints increase project risk, and outline mitigation plans.

## 5. Common Mistakes / Anti-Patterns
- **Confusing Preference with Constraint:** Treating a developer's preference for a specific database framework as a hard project constraint.
- **Ignoring Budget Limits:** Proposing cloud resources that exceed the client's monthly hosting capacity.
- **Late Discovery of Regulatory Rules:** Failing to check data privacy constraints early, leading to post-deploy legal violations.
- **Unrealistic Milestones:** Agreeing to launch dates that cannot be met within team resource limits.

## 6. How It Constrains/Informs Downstream Decisions
- **System Design:** A $100/month budget constraint forces the system to run on shared, consolidated database instances (pg_bouncer) rather than multi-node clusters.
- **Backend Architecture:** A legacy database integration constraint forces the backend to use adapter patterns and custom parsing drivers.
- **Database Design:** A GDPR residency constraint restricts the database to store and partition European records in European regions only.

## 7. What "Good" Looks Like
A high-quality constraints document is realistic, verified, and quantified. It separates hard constraints (technical, business, legal) from preferences, notes legacy integration requirements, and lists exact budget and deadline boundaries.

## 8. How Major Companies/Teams Do It
- **Uber:** Identifies mobile hardware and network bandwidth constraints in developing regions, designing lightweight, low-telemetry database updates to conserve customer battery and data.
- **Stripe:** Documents strict PCI-DSS constraints, building isolated token vaults to ensure primary transactional databases never store raw card numbers.

## 9. Decision Checklist
Go **Deep** (comprehensive constraints audit) when:
- Integrating with legacy enterprise systems or third-party databases.
- Operating under tight, fixed budgets ($ < 500$/month) or short delivery timelines.
- The project faces strict data privacy and residency laws.

Keep it **Lightweight** when:
- Building greenfield products with open budgets and modern hosting selections.
- Creating internal team experiments with no legacy integrations.

## 10. AI Coding-Agent Implementation Guidelines
Before writing system architectures:
1. **Identify the Hosting Platform:** Ask: "Where will this application be hosted? Are there specific cloud provider limits?"
2. **Clarify the Budget:** Ask: "What is the monthly hosting infrastructure budget?"
3. **Determine Legacy Integrations:** Ask: "Are there pre-existing databases, APIs, or legacy tables we must integrate with?"
4. **Establish Deadlines:** Ask: "What are the project milestones and launch dates?"
5. **Produce Constraints Artifact:** Generate a structured constraints page using the template below.

## 11. Reusable Checklist
- [ ] Technical hosting platforms and cloud providers identified
- [ ] Legacy systems, databases, and APIs requiring integration documented
- [ ] Monthly infrastructure budget limits quantified
- [ ] Delivery milestones and target launch dates specified
- [ ] Compliance and regulatory boundaries (GDPR/PCI) verified
- [ ] Hard constraints separated from developer preferences
- [ ] Constraints mapped to architecture risk mitigation plans
- [ ] Team capability limitations documented (language/framework restrictions)

## 12. Output Template
```markdown
# Constraints: [Project Name]

### 1. Technical & Infrastructure Constraints
- **Hosting Platform:** [e.g. Must host on AWS, restricted to the `us-east-1` region.]
- **Database Limits:** [e.g. Must use a pre-existing PostgreSQL 14 database cluster managed by the DBA team.]
- **Legacy Integrations:** [e.g. Must integrate with an old ERP system via an SOAP XML API.]

### 2. Business & Budget Constraints
- **Infrastructure Budget:** Maximum $[150]/month hosting cost.
- **Timeline Milestones:**
  - **Staging Deploy:** [Date]
  - **Production Launch:** [Date]
- **Team Resource Limits:** [e.g., Only one backend engineer available for maintenance.]

### 3. Compliance & Legal Constraints
- **Data Residency:** [e.g. European customer data must be stored on physical disks located within the EU (GDPR compliant).]
- **Security Standards:** [e.g. Database must comply with SOC2 audit logging rules.]
```
