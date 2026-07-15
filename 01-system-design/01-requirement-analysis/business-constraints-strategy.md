# Business Constraints

## 1. What Question This Answers
"What are the commercial and operational limitations (budget, timeline, team capabilities, licensing) and how do they restrict system design and database choices?"

## 2. Why It Matters at the System-Design Stage
A technically perfect system design is useless if it cannot be built within the company's budget or before critical market deadlines. An architect must evaluate business constraints to choose appropriate tools: e.g. selecting managed database services (RDS) to save engineering setup time, or using open-source database engines (PostgreSQL) instead of paid commercial engines (Oracle) to save on licensing fees.

## 3. Methodology / How to Work Through It
1. **Identify Financial Limits:** Quantify the maximum hosting budget allocation for the database and system infrastructure.
2. **Review Timeline Milestones:** Check delivery dates to identify where development speed must be prioritized over custom engineering.
3. **Assess Team Capabilities:** Match the technical complexity of the design (e.g. Cassandra vs. simple PostgreSQL) to the team's language and operational expertise.
4. **Audit Licensing Risks:** Ensure third-party database tools are open-source or possess affordable enterprise licenses (e.g., avoiding AGPL conflicts).
5. **Establish Design Limits:** Use these constraints to choose between hosted SaaS databases vs self-hosted instances, and determine MVP bounds.

## 4. Inputs Needed
- Product-level business goals and constraints from [Constraints Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/00-product-analysis/constraints-analysis.md).
- Team organization specs and budget guidelines.

## 5. Outputs Produced
- Feeds into [Architecture Selection](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/03-architecture-selection/index.md) and [Cost Optimization Strategies](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/17-cost-optimization/index.md).

## 6. Worked Example (SaaS Startup MVP)
- **Financial Constraint:** Maximum $150/month infrastructure hosting budget.
- **Timeline Constraint:** Public beta launch required in 6 weeks.
- **Team Constraint:** Two developers with JavaScript and basic PostgreSQL knowledge (no DBA or DevOps specialists).
- **System Design Decisions:**
  - *Database Service:* Use a managed PostgreSQL database (such as Supabase or AWS RDS) to avoid administrative setups.
  - *No Sharding:* Deploy a single, consolidated database node rather than a complex sharded cluster, saving budget and operational overhead.
  - *Framework:* Use standard REST APIs on Node.js to match team skills.

## 7. Common Mistakes
- **Designing Beyond Budget Bounds:** Proposing multi-region active-active clusters that cost $2,000/month for a startup with a $100 budget.
- **Selecting Unmanageable Tooling:** Choosing complex distributed databases (e.g., CockroachDB or Cassandra) for teams with no dedicated database administrators, leading to maintenance issues.
- **Hype-Driven Architecture Decisions:** Implementing microservices when the delivery timeline is extremely short, delaying launch times.

## 8. AI Coding-Agent Guidelines
1. **Ask for Budget Limits:** Inquire about monthly infrastructure budget caps.
2. **Check Team Skills:** Inquire about language and database experience constraints.
3. **Align Database Choices:** Recommend simple managed databases (such as Postgres) as defaults for early stage teams.
4. **Produce Business Constraints Page:** Generate the artifact using the template below.

## 9. Reusable Template
```markdown
# Business Constraints Analysis: [System Name]

### 1. Financial Infrastructure Limits
- **Monthly Infrastructure Budget:** [e.g. $200/month maximum]
- **Licensing Cost Restrictions:** [e.g., Open-source databases only; no commercial licensing fees allowed.]

### 2. Timeline & Milestones
- **Beta Launch Deadline:** [e.g. 6 weeks from today]
- **Target Maintenance Windows:** [e.g., Low-traffic maintenance hours (2 AM - 4 AM)]

### 3. Team Capabilities & Resource Limits
- **Engineering Team Size:** [e.g. 3 developers]
- **Primary Languages/Skills:** [e.g., Node.js and TypeScript; basic PostgreSQL; no dedicated DBA]

### 4. Technical Architecture Decisions
- **Database Selection Constraint:** [e.g. Use managed cloud databases (such as RDS or Supabase) to save developer administrative hours.]
- **Deployment Sizing:** [e.g. Single-node PostgreSQL with replica, scale-up as traffic grows; sharding deferred.]
```
