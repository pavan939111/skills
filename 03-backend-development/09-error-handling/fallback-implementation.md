# Fallback Mechanisms

## 1. Backend Application Context
Fallback Mechanisms define the backup logic executed when a primary service or database query fails (e.g. loading a profile from memory caches when PostgreSQL timeouts occur).

## 2. Backend-Specific Pitfalls
- **Letting fallbacks crash:** Failing to wrap fallback operations in separate exception handlers, letting fallback failures crash requests.

## 3. Code-Shape Example
`python
def get_user_profile(user_id: str):
    try:
        # Primary database query
        return db.query_profile(user_id)
    except DatabaseTimeoutException:
        logger.warning(f"Database timeout for {user_id}. Executing fallback cache lookup.")
        # Fallback cache read
        profile = redis_cache.get(f"user:{user_id}")
        if profile:
            return profile
        raise FallbackFailedException("Database offline and cache empty")
`

## 4. Read First
Before applying this backend application note, review the full deep-dive:
- Error Handling & Exception Strategy
