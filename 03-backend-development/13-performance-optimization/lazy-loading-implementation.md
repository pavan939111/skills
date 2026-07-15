# Lazy Loading

## 1. Backend Application Context
Lazy Loading defers loading database relationships or heavy modules until they are explicitly accessed, optimizing initial response latency.

## 2. Backend-Specific Pitfalls
- **N+1 queries:** Accessing lazy-loaded relations inside loops, running a database query for every item. Use eager loading for looped lists.

## 3. Code-Shape Example
`python
# Lazy vs Eager loading decisions
# Avoid lazy query loops:
users = db.query(User).all()
for u in users:
    # Triggers N queries:
    print(u.profile.bio)

# Use Eager Loading instead:
users_with_profiles = db.query(User).options(joinedload(User.profile)).all()
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [Performance Engineering](../../production_principles/performance-and-scale/01-performance-engineering.md)
