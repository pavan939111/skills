# Master Production Readiness Checklist

## 1. What Question This Answers
"What is the final, aggregated checklist used to grant release clearance for all system components before production launch?"

## 2. Why It Matters at the System-Design Stage
A master checklist consolidates verification steps across database, backend, deployment, and security layers. This prevents deploying half-ready systems.

## 3. Methodology / How to Work Through It
1. **Review Sub-checklist Sign-offs:** Confirm database, security, and scalability reviews are complete.
2. **Verify Disaster Readiness:** Ensure backup restoration tests succeeded.
3. **Execute Master Checklist:** Run final checks.

## 4. Inputs Needed
- Individual review logs.

## 5. Outputs Produced
- Production launch clearance.

## 6. Worked Checklist Example
- [x] Database schema migrations are verified and rolled back successfully in staging.
- [x] Load tests confirm response times under peak user volume.
- [x] Secrets are rotated and stored in production vaults.

## 7. Common Mistakes
- **Skipping Verification Steps:** Skipping checks to meet release schedules.
- **Outdated Checklists:** Using lists that don't match the active architecture.

## 8. AI Coding-Agent Guidelines
1. **Require All Sign-offs:** Verify all sub-checklists are completed before launch.
2. **Confirm Backup Restoration:** Ensure backup restoration tests are documented.
3. **Produce Master Checklist Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Master Production Readiness Sign-off: [System Name]

### 1. Verification Tiers
- [ ] Architecture Design Review is complete and signed off.
- [ ] Database Schema and index checks are complete.
- [ ] Security threat scanning and secrets check are complete.
- [ ] Load and scalability test runs passed.
- [ ] Backup restoration tests passed.

### 2. Launch Clearance
- **Status:** [Approved / Deferred]
- **Approval Date:** [YYYY-MM-DD]
```
