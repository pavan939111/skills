# Dead Letter Queue

## 1. Backend Application Context
A Dead Letter Queue (DLQ) is a secondary queue that stores permanently failed messages and tasks that exceeded retry limits, allowing engineers to inspect and debug failures manually.

## 2. Backend-Specific Pitfalls
- **Failing to monitor the DLQ:** Letting the DLQ fill up with thousands of failed tasks without alerting engineers, hiding bugs.

## 3. Code-Shape Example
`python
# Task routing to DLQ on failure exhaustion
def move_to_dead_letter_queue(job, error):
    dlq_payload = {
        "job_id": job.id,
        "task_name": job.task_name,
        "payload": job.payload,
        "failed_at": get_timestamp(),
        "error_message": str(error)
    }
    db.save_to_dlq_table(dlq_payload)
    # Trigger operations alert (PagerDuty / Slack)
    alert_operations_team(f"Job {job.id} moved to DLQ. Error: {str(error)}")
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Background Jobs and Messaging](../../production_principles/data-and-messaging/02-background-jobs-messaging.md)
