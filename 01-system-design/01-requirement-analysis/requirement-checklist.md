# Requirement Checklist

## 1. What Question This Answers
"What is the final, comprehensive checklist to verify that all functional, non-functional, business, technical, compliance, latency, availability, and scalability requirements are fully analyzed, quantified, and validated before system design begins?"

## 2. Why It Matters at the System-Design Stage
Before designing database schemas, network topologies, and microservice boundaries, the architect must verify that there are no gaps or ambiguities in requirements. Moving to system design with unverified requirements leads to scope creep, incorrect database structures, and architectural redesigns later. This checklist serves as the final gateway before capacity planning and component design.

## 3. Methodology / How to Work Through It
1. **Consolidate Requirement Findings:** Gather the analysis results from all previous files in the `01-requirement-analysis` folder.
2. **Audit for Ambiguity:** Review every item to ensure it is quantified with concrete numbers (no terms like "fast" or "secure" without metrics).
3. **Validate Downstream Links:** Verify that every requirement has clear technical implications mapped to system tiers.
4. **Acquire Stakeholder Approvals:** Review the completed requirements checklist with business sponsors, engineering leads, and security officers.
5. **Freeze Requirements Scope:** Sign off on requirements, setting the baseline for capacity estimation.

## 4. Inputs Needed
- All completed requirements files in [Requirement Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/index.md).

## 5. Outputs Produced
- Feeds into [Capacity Planning](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/02-capacity-planning/index.md).

## 6. Worked Example (Standard SaaS Project Gate)
- **Status:** All previous 10 requirement analysis files completed.
- **Audit findings:** The latency SLO was specified as "sub-second," which is too vague.
- **Action:** Updated latency budget to: P95 response < 250ms, database query < 50ms.
- **Sign-off:** Stakeholders signed off on the revised metrics. The project team proceeds to capacity planning.

## 7. Common Mistakes
- **Treating the Checklist as a Formality:** Checking boxes without actually verifying that the underlying calculations are accurate and documented.
- **Accepting Vague Requirements:** Proceeding to design when key metrics (like QPS, RTO/RPO, or budget limits) are still undefined.
- **No Security/Compliance Review:** Bypassing compliance audits early, only to discover database sharding conflicts with data residency laws later.

## 8. AI Coding-Agent Guidelines
1. **Audit All Requirement Files:** Verify that files 01 through 10 in this folder exist and are populated.
2. **Review for Missing Metrics:** Flag any unquantified requirements.
3. **Produce Requirements Checklist:** Generate the consolidated checklist page using the template below.

## 9. Reusable Template
```markdown
# System Requirements Validation Checklist: [System Name]

### 1. Functional & Technical Requirements Validation
- [ ] Functional requirements translated into API endpoints, database mutations, and system events.
- [ ] Actor roles and table-level access permissions defined.
- [ ] Non-functional requirements (SLAs, SLOs) quantified with concrete performance numbers.

### 2. Constraints & Compliance Audit
- [ ] Business constraints (budget, milestones, team skills) verified and documented.
- [ ] Technical constraints (hosting, legacy integrations, database versions) identified.
- [ ] Regulatory and compliance requirements (GDPR/HIPAA/PCI) mapped to security designs.

### 3. Sizing & Recovery Objectives
- **Latency Budgets:** Allocated across database, network, and application layers.
- **Availability Target:** Sized to match SLA downtime budgets (multi-AZ/multi-region verified).
- **RTO / RPO Limits:** Sized and mapped to replication and backup frequencies.
- **Scalability Targets:** Headroom volumes, sharding keys, and partition strategies defined.

### 4. Sign-off Matrix
- **Engineering Lead Sign-off:** [Approved / Pending]
- **Security Officer Sign-off:** [Approved / Pending]
- **Business Sponsor Sign-off:** [Approved / Pending]
```
