# Retry Queues

## 1. Backend Application Context
Retry Queues manage task retries, holding failed jobs for scheduled retries using exponential backoffs to prevent overloading downstream systems.

## 2. Backend-Specific Pitfalls
- **Infinite retry loops:** Retrying failed tasks endlessly, clogging queues with permanently failing tasks. Configure max retry limits.

## 3. Code-Shape Example
`python
# Push task to retry queue with backoff calculation
def handle_failed_job(job, error):
    if job.attempts >= 5:
        # Move permanently failing tasks to DLQ
        move_to_dead_letter_queue(job, error)
        return
        
    # Calculate exponential backoff (e.g. 2^attempts * 10 seconds)
    backoff_delay = (2 ** job.attempts) * 10
    queue.enqueue_in(job, backoff_delay)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- Background Jobs and Messaging
