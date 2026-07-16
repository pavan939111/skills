# Capacity Checklist

## 1. What Question This Answers
"What is the final, consolidated checklist to verify that all traffic, storage, bandwidth, compute, memory, request, and QPS estimations are quantified, modeled for future growth, and validated before technology selection begins?"

## 2. Why It Matters at the System-Design Stage
Capacity planning calculations contain many dependencies (e.g., QPS drives database connection requirements; row width drives storage growth rates; bandwidth drives CDN needs). If any single calculation is incorrect or omitted, the downstream system design decisions (API gateways, database sharding, caching tiers) will be flawed. This checklist acts as the final gate, ensuring all sizing parameters are verified.

## 3. Methodology / How to Work Through It
1. **Consolidate Sizing Metrics:** Gather calculation findings from the previous 8 files in the `02-capacity-planning` folder.
2. **Audit Sizing Formulas:** Cross-reference calculations to verify consistent numbers (e.g., ensuring peak QPS numbers match peak request rates).
3. **Verify Headroom Margins:** Confirm that all storage and compute sizes include a 30% to 50% safety buffer for operational overhead.
4. **Acquire Sizing Sign-off:** Review capacity projections with database administrators (DBAs) and finance leads to ensure budgets align with hosting projections.
5. **Freeze Capacity baseline:** Approve capacity metrics, initializing technology selection.

## 4. Inputs Needed
- All completed capacity estimation files in [Capacity Planning](../../13-architecture-decision-records/index.md).

## 5. Outputs Produced
- Feeds into [Technology Strategy Decision Briefs](../../13-architecture-decision-records/index.md) (folders 06–17) and [Trade-off Analysis](../../13-architecture-decision-records/index.md).

## 6. Worked Example (Standard SaaS Project Gate)
- **Status:** All previous 8 capacity planning files completed.
- **Audit Findings:** Storage estimates omitted index bloat calculations, underestimating annual disk storage requirements by 40%.
- **Action:** Re-calculated storage growth, adding 40% index and database bloat overhead, and updated Year 1 disk targets from 200GB to 280GB.
- **Sign-off:** DBA team signed off on updated storage capacity requirements.

## 7. Common Mistakes
- **Treating the Checklist as a Formality:** Checking boxes without verifying formulas and parameters.
- **Under-sizing safety buffers:** Sizing disks or compute pools exactly to peak numbers without leaving room for background tasks, maintenance jobs, or unexpected traffic bursts.
- **Failing to Track Operational Costs:** Planning capacity growth without verifying that the monthly infrastructure hosting bill fits company budgets.

## 8. AI Coding-Agent Guidelines
1. **Audit All Capacity Files:** Verify that files 01 through 08 in this folder are populated.
2. **Review Sizing Metrics:** Flag any unquantified capacity estimates.
3. **Produce Sizing Checklist:** Generate the consolidated checklist page using the template below.

## 9. Reusable Template
```markdown
# Capacity Validation Checklist: [System Name]

### 1. Traffic & Request Sizing
- [ ] Daily active user profiles and transaction frequencies documented.
- [ ] Average and peak QPS/RPS rates calculated (peak surge factors included).
- [ ] Read-to-write ratios segregated and mapped to query paths.

### 2. Resource Sizing & Headroom
- [ ] Database row widths and annual storage growth rates calculated (index and database bloat included).
- [ ] Network card bandwidth (Mbps/Gbps ingress and egress) estimated (CDN offloading verified).
- [ ] Compute core counts (vCPUs) and RAM requirements calculated for caches, vector indexes, and buffer pools.

### 3. Growth & Cost Planning
- [ ] 5-Year scale growth vectors modeled using CAGR compounding rates.
- [ ] Architectural transition gates (sharding, replica routing triggers) defined.
- [ ] Monthly infrastructure hosting costs estimated and matched against company budgets.

### 4. Sign-off Matrix
- **Infrastructure Lead Sign-off:** [Approved / Pending]
- **Finance Sponsor Sign-off:** [Approved / Pending]
- **DBA Architect Sign-off:** [Approved / Pending]
```
