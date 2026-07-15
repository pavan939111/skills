# Scheduling & Cron Systems

## 1. Definition & Core Concepts

Scheduling and cron systems manage the automated, recurring execution of background tasks at predefined times or intervals (e.g., generating daily reports, sending monthly invoices, or cleaning up expired database sessions).

Core pieces:
- **Cron Expression:** A standard string format representing execution times (e.g., `0 0 * * *` for midnight daily).
- **Scheduler Daemon:** The core process that parses scheduled intervals and triggers jobs.
- **Overlap Prevention:** Logic that prevents a new execution of Job A from starting if the previous run of Job A is still executing.
- **Distributed Locking:** Coordinating executions across multiple server nodes so only one instance runs the job.
- **Task Delegation (Scheduler-to-Queue):** Rather than running heavy logic in the scheduling thread, the scheduler publishes a message to a background worker queue, which executes the job.

*(Boundary Note: Platform-specific scheduling like Kubernetes CronJobs configuration or AWS EventBridge cloud scheduler setup belongs in infra guides. This document covers code-level schedulers, locking, and execution safety patterns.)*

## 2. Why It Exists

Applications need to run cleanups, compliance sweeps, and billing routines at specific intervals. Schedulers automate these triggers, allowing developers to write asynchronous tasks that run without human intervention.

## 3. What Breaks in Production Without It

- **Duplicate Billing (No Locking):** The application is scaled horizontally to 3 container instances. Each instance runs an internal cron scheduler. At midnight, all three instances trigger the "Charge Customer Invoices" task concurrently, billing users multiple times.
- **Job Overlap Lockups:** A job is scheduled to run every 5 minutes. Due to database slowdown, the job takes 7 minutes. At the 5-minute mark, a new instance of the job starts, acquiring the same database locks, leading to deadlocks and resource starvation.
- **Silent Thread Death:** An unhandled exception occurs inside a scheduled job (e.g., database timeout). The scheduling engine catches nothing, the exception crashes the main scheduler thread, and no further cron tasks run until the container is restarted.
- **Web API Thread Blocking:** Running heavy CPU/network scheduled tasks directly inside the application's main thread, slowing down user API response times.

## 4. Best Practices

- **Delegate Tasks to Background Queues:** The scheduler should only act as a thin trigger. When a schedule fires, publish a task message to your background queue system (e.g., BullMQ, Celery, SQS). Workers process the job, keeping the scheduler lightweight.
- **Enforce Distributed Locking:** If you run schedulers inside scaled containers, wrap job execution in a distributed lock (e.g., Redis Redlock, PostgreSQL advisory locks). A node must acquire the lock before running; if it fails, it skips execution.
- **Implement Overlap Prevention:** Track if a job is currently active (via a local boolean flag or distributed key). If the scheduler triggers a new run but the active flag is true, skip the run and log a warning.
- **Wrap Job Logic in Try/Catch Blocks:** Ensure no exception can propagate out of a scheduled job to crash the scheduler engine. Always log failures with stack traces and trigger alerts.
- **Log Execution Metrics:** Record the start time, end time, duration, and success/failure state of every scheduled run.
- **Schedule During Off-Peak Hours:** Run heavy database-cleanup and analytics-compiling jobs during low-traffic periods (e.g., 2 AM local database time) to minimize impact on active users.

## 5. Common Mistakes / Anti-Patterns

- **Internal Node/JVM Memory Schedulers Without Locks:** Running libraries like `node-cron` or Java `ScheduledExecutorService` in autoscaled cloud containers without a distributed lock coordinating runs.
- **Database Table Polling as Scheduler:** Writing loops that query `SELECT * FROM tasks WHERE run_at <= NOW()` every 2 seconds, generating heavy database CPU utilization.
- **Ignoring Execution Timeouts:** Leaving scheduled jobs without timeouts. If an API call hangs inside a cron job, the thread is blocked forever.
- **Hardcoding Server Timezones:** Assuming the host machine runs in local time (e.g. EST). Always parse and execute cron intervals using Coordinated Universal Time (UTC).

## 6. Security Considerations

- **Authorization Checking in Tasks:** If scheduled jobs execute administrative APIs internally, ensure they authenticate using secure, scoped system tokens with limited permissions.
- **Input Sanitization on Dynamic Crons:** If users can set custom cron schedules, validate cron expression formats strictly to prevent parsing errors from crashing the scheduler.

## 7. Performance Considerations

- **Database Connection Conservation:** Scheduled batch jobs process thousands of rows. Ensure they retrieve records in batched chunks rather than loading all rows into RAM, and release database connections promptly.

## 8. Scalability Considerations

- **Centralized Scheduler:** For complex microservices, decouple the scheduler entirely. Run a single scheduler container (e.g., Celery Beat) whose sole purpose is to push tasks to queues shared across the entire system.

## 9. How Major Companies Implement It

- **Stripe:** Decouples scheduling from execution. Their cron systems publish message keys to queues. These keys are claimed by worker nodes that verify idempotency using ledger tokens before applying balance transitions.
- **Airbnb:** Utilizes Apache Airflow to schedule, coordinate, and monitor complex multi-step data pipelines, allowing them to visualize task dependencies and handle job retries automatically.

## 10. Decision Checklist

- Use **Scheduler Trigger + Background Queue** when: The job is heavy (e.g., takes >5 seconds, processes database records, calls external APIs) and execution must scale across workers.
- Use **Lightweight In-Process Cron Scheduler** (with locking) when: The task is quick (e.g., clearing local memory caches, refreshing configuration variables) and the app runs on a single node or has Redlock active.

## 11. AI Coding-Agent Implementation Guidelines

- Always wrap scheduled task executions inside try/catch blocks that log failures and stack traces.
- Never write scheduled execution scripts that run in autoscaled environments without a distributed lock validation check (e.g., checking a Redis lock before run).
- Always default schedulers and cron expressions to execute in UTC.
- Never run heavy CPU/database tasks directly inside the event-polling thread of the scheduler — always queue the task.
- Always include an overlap prevention check or lock TTL for scheduled routines.
- Always configure an explicit execution timeout on scheduled jobs.

## 12. Reusable Checklist

- [ ] All scheduled tasks wrap logic in try/catch blocks to prevent scheduler death
- [ ] Distributed lock (e.g., Redis/advisory lock) implemented for multi-node deployments
- [ ] Overlap prevention implemented (prevents duplicate runs of long-running crons)
- [ ] Heavy scheduled work delegated to background queues instead of running inline
- [ ] Cron expressions set to execute based on UTC timezone
- [ ] Execution metrics (start, end, duration, status) logged for every job run
- [ ] Jobs scheduled during off-peak hours where applicable
- [ ] Scheduled tasks have explicit execution timeouts configured
