# Scalability Review Readiness Guide

## 1. What Question This Answers
"Can the system scale horizontally to meet P95 latency and peak throughput targets, and have we eliminated all performance bottlenecks?"

## 2. Why It Matters at the System-Design Stage
Validating scaling strategies before writing code prevents database lock saturation and under-provisioned compute capacities under load.

## 3. Methodology / How to Work Through It
1. **Validate Statelessness:** Ensure no server node stores session states locally.
2. **Review Autoscaling Metrics:** Check if scale-out triggers are configured.
3. **Audit Database Read Scale:** Verify read replicas and sharding strategies are aligned.
4. **Run Checklist Audit:** Compare designs to performance requirements.

## 4. Inputs Needed
- Latency and throughput requirements from [Requirements Analysis](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/01-requirement-analysis/index.md).
- Chosen scaling designs.

## 5. Outputs Produced
- Feeds into [Database Scalability Review](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/12-production-checklists/scalability-review-strategy-implementation.md).

## 6. Worked Checklist Example
- [x] Application containers run stateless behind a Round-Robin load balancer.
- [x] High-volume reads are routed to read replica instances.
- [x] Autoscaling cool-down margins are configured.

## 7. Common Mistakes
- **Session Memory Sticky-binding:** Relying on load balancer sticky sessions to route users, preventing clean auto-scaling.
- **Un-indexed Queries:** Querying large tables without index coverage, saturating database IOPS.

## 8. AI Coding-Agent Guidelines
1. **Verify Stateless design:** Do not store local session parameters on app nodes.
2. **Enforce Read/Write separation:** Separate write paths from cached read paths.
3. **Produce Scalability Audit Page:** Generate the page using the template below.

## 9. Reusable Template
```markdown
# Scalability Review Log: [System Name]

### 1. Scaling Capacity Checks
- [ ] Application nodes are fully stateless (sessions stored in Redis).
- [ ] Autoscaling metrics and cool-down thresholds are configured.
- [ ] Database read replica routing is implemented.
- [ ] Slow query log monitors are enabled on SQL nodes.

### 2. Sign-off Status
- **Status:** [Go / No-Go]
- **Outstanding Actions:** [e.g. Configure query index paths on order tables.]
```
