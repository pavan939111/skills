# Fallback Strategy

### 1. The Question Decided
"What alternative logic flows (Fallbacks) execute when primary API connections, databases, or third-party integrations fail?"

### 2. Options Compared
| Fallback Mode | Stale Cache Return | Default Value / Mock | Queue for Later (Retry) |
|---|---|---|---|
| **Data Quality** | Medium (Out-of-date data) | Low | High (Completed later) |
| **User Impact** | Low (Interface works) | Medium | Low (Process delayed) |
| **Applicability** | Read-heavy queries | UI configuration lists | Write mutations |
| **Complexity** | Medium | Low | High |

### 3. Decision Rule
- **Choose Read Fallbacks based on data tolerances:**
  - *If* target is read-heavy profile metadata and DB is down, *then* fall back to returning **stale data from Redis**.
  - *If* target is critical write mutation (e.g. order checkout) and payment gateway fails, *then* fail fast and return error message (no write fallback).

### 4. Red Flags to Revisit
- Client applications crash completely during minor database glitches because the code lacks default fallback options.
- Users are shown misleading "zero balance" screens because the system fell back to empty mock values instead of stale cache data.

### 5. Where to Go Next
- For implementing fallback classes, mocking hooks, and stale cache lookups, see [Resilience Patterns & Implementations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/performance-and-scale/03-resilience-patterns.md).
