# API Idempotency Strategy

### 1. The Question Decided
"How does the system ensure write request idempotency, and where are idempotency keys validated and cached?"

### 2. Options Compared
| Dimension | Redis Key Cache | DB Unique Constraints | Distributed Lock (Consul) |
|---|---|---|---|
| **Cost (Compute)** | Low | Low | High |
| **Latency** | Extremely Low (<2ms) | Low | Medium |
| **Complexity** | Medium | Low | High |
| **Safety Ceiling** | Medium (Redis data loss risk) | High (ACID verified) | Very High |
| **Lock TTL** | Supported natively | Manual cleanup needed | Supported natively |

### 3. Decision Rule
- **Choose Redis Key Cache if:** Managing fast, low-latency API double-submit protection (e.g. checkout click safety) where a TTL is acceptable.
- **Choose Database Unique Constraints if:** Enforcing strict, permanent financial double-charge prevention (e.g. transactional ledger writes).

### 4. Red Flags to Revisit
- Customers are charged twice because Redis crashed during payment validation, losing the idempotency lock record.
- Database write queues clog because backend services acquire long-duration distributed locks on idempotency keys.

### 5. Where to Go Next
- For implementation of idempotency header parsing and key validation in controllers, see [API Development](file:///c:/Users/mahip/OneDrive/Desktop/skills/backend-development/05-api-development/restful-api.md).
- For database-level duplicate transaction prevention patterns, see [Outbox Pattern and Transaction Safety](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/13-design-patterns/outbox-pattern.md).
