# Event Sourcing Strategy

### 1. The Question Decided
"Should state changes be stored as a sequential log of immutable events (Event Sourcing) instead of updating database records in-place?"

### 2. Options Compared
| Dimension | Traditional State DB (CRUD) | Event Sourced DB (Log-based) |
|---|---|---|
| **Write Performance**| Low-Medium (Blocks on locks) | Extremely High (Append-only logs) |
| **Read Performance** | Fast (Direct index reads) | Slow (Requires event replay) |
| **Audit Compliance** | Low | Infinite (Full history retained) |
| **Complexity** | Low | Very High |

### 3. Decision Rule
- **Choose Event Sourcing if:** The domain requires a strict, immutable audit log (e.g. accounting ledgers, medical charts) where reconstruction of any historical state is a regulatory requirement.
- **Avoid Event Sourcing if:** The system is a simple CRUD application without historical audit requirements.

### 4. Red Flags to Revisit
- Replaying event streams takes minutes, causing API response times to time out.
- Modifying business rules requires rebuilding the entire historical event stream, introducing data migrators risk.

### 5. Where to Go Next
- For database-level event store schemas, indexing, and snapshot optimization, see Event Sourcing Database Design.
- For implementing aggregates and event loop handlers in application code, see Event Sourcing Architecture Selection.
