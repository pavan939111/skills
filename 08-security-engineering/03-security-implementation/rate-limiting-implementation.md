# Rate Limiting

## 1. Backend Application Context
Rate Limiting restricts the number of API requests a user or client IP can execute within a time window, preventing brute force attacks and resource exhaustion.

## 2. Backend-Specific Pitfalls
- **Using server local memory:** Storing rate-limiting counts in local process memory, failing to track limits across auto-scaled microservices. Use Redis.

## 3. Code-Shape Example
`python
# Redis-backed rate limiting check (sliding window)
def check_rate_limit(client_ip: str, limit=100, window=60) -> bool:
    key = f"rate:{client_ip}"
    current_requests = redis.incr(key)
    if current_requests == 1:
        redis.expire(key, window)
    return current_requests <= limit
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- [Security](../security-fundamentals-policy.md)
