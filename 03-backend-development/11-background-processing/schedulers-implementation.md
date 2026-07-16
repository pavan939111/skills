# Schedulers

## 1. Backend Application Context
Schedulers orchestrate the execution of background tasks at specific times or intervals, managing task state logs and triggering worker runs.

## 2. Backend-Specific Pitfalls
- **Duplicate execution in container scaling:** Running local scheduler intervals on every container replica, causing duplicate jobs. Use distributed schedulers (e.g., pg-boss, BullMQ, Quartz) with lock controls.

## 3. Code-Shape Example
`python
# Distributed scheduler example (Scheduler runs on a single node, 
# or checks distributed locks in database before enqueuing)
def check_expired_subscriptions():
    with distributed_lock("subscription-check", expire_seconds=600):
        # Query database and process subscriptions
        db.query_and_process_expired()
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- Background Jobs and Messaging
