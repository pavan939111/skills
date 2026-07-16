# Scheduler Strategy

### 1. The Question Decided
"How does the system coordinate scheduled, recurring tasks (e.g. daily invoice runs, nightly cleanups) and guarantee single-instance execution (no duplicate runs)?"

### 2. Options Compared
| Dimension | Single-Instance Cron Daemon | Distributed Scheduler (e.g. Quartz, BullMQ) | Cloud Native Scheduler (e.g. AWS EventBridge) |
|---|---|---|---|
| **Cost** | Low (Zero additional infra) | Medium | Low |
| **High Availability**| None (Single node failure risk) | High | High |
| **Complexity** | Low | High | Medium |
| **Duplicate Safety**| High (Single node run) | Medium (Requires lock checks) | Medium |
| **Scale Ceiling** | Low | Very High | High |

### 3. Decision Rule
- **Choose Distributed/Cloud Schedulers if:** Scheduled jobs are critical, must run on high-availability clusters, and require automated retry logging.
- **Choose Single-Instance Cron if:** Scheduled jobs are simple, non-critical maintenance scripts, and team simplicity is preferred.

### 4. Red Flags to Revisit
- Customers receive duplicate billing invoices because a distributed scheduler scales out, triggering the invoice job on two nodes simultaneously.
- A critical daily backup script fails to run because the single VM hosting the cron daemon went offline.

### 5. Where to Go Next
- For implementing task scheduling hooks in backend frameworks, see [Schedulers Implementation](../../03-backend-development/11-background-processing/schedulers-implementation.md).
- For operational best practices on cron structures and lock management, see [Scheduling & Cron Systems](../../12-governance/03-operations-and-governance/02-scheduling-cron-systems-guideline.md).
