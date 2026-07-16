# Retry Strategy

## 1. Backend Application Context
A Retry Strategy dictates how backend clients handle transient failures (network timeouts, database deadlocks) when communicating with external web services or database nodes.

## 2. Backend-Specific Pitfalls
- **Brute force retries:** Retrying failed API requests immediately in loops, creating a self-inflicted Denial of Service (DoS) on downstream servers. Configure exponential backoffs and random jitter.

## 3. Code-Shape Example
`python
import time
import random

def execute_with_retry(func, max_retries=3, base_backoff=1.0):
    for attempt in range(max_retries):
        try:
            return func()
        except TransientException as e:
            if attempt == max_retries - 1:
                raise e
            # Exponential backoff with random jitter
            sleep_time = (base_backoff * (2 ** attempt)) + random.uniform(0, 0.5)
            time.sleep(sleep_time)
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- Error Handling & Exception Strategy
