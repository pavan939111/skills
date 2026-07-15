# Job Queues

## 1. Backend Application Context
Job Queues defer slow, CPU-intensive, or non-blocking operations (e.g. sending reports, syncing data) to background worker services, returning immediate responses to clients.

## 2. Backend-Specific Pitfalls
- **Running long tasks in API threads:** Executing image processing or data exports directly inside HTTP request handlers, locking event loops.

## 3. Code-Shape Example
`python
# Push slow task to Redis-backed job queue
@app.post("/reports/generate")
def request_report(user_id: str):
    # Return immediate 202 Accepted, routing the task to background workers
    job = queue.enqueue(generate_report_task, user_id)
    return {"job_id": job.id, "status": "queued"}, 202
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Background Jobs and Messaging](../../production_principles/data-and-messaging/02-background-jobs-messaging.md)
