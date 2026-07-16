# Caching

## 1. Backend Application Context
In backend service layers, caching is implemented to intercept database reads, storing hot records in local memory (e.g. Node-cache, Guava) or distributed key-value grids (Redis, Memcached) to reduce database read latencies.

## 2. Backend-Specific Pitfalls
- **Cache stampede (thundering herd):** Multiple threads fetch expired cache entries concurrently, querying the database and overloading tables. Solve by using distributed locks or background expirations.
- **Cache invalidation drift:** Updating database records but failing to clear or update matching cache keys, resulting in stale data reads.

## 3. Code-Shape Example
`python
def get_user_profile(user_id: str):
    cache_key = f"profile:{user_id}"
    # Read from cache
    profile = redis.get(cache_key)
    if profile:
        return json.loads(profile)
        
    # Cache miss - fetch database and populate cache
    profile_data = db.fetch_profile(user_id)
    redis.setex(cache_key, 3600, json.dumps(profile_data))
    return profile_data
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [Caching](../../04-database-design/04-database-best-practices/caching-implementation.md)
- Performance Engineering
