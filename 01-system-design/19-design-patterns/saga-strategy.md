# Saga Strategy

### 1. The Question Decided
"How does the system coordinate multi-service transactions (Saga Pattern) without holding distributed database locks?"

### 2. Options Compared
| Dimension | Distributed Transactions (2PC) | Saga Pattern (Async compensation) |
|---|---|---|
| **Cost (Network)** | High | Low |
| **Availability** | Low (All nodes must lock) | High (Eventual sync) |
| **Data Consistency**| Strong ACID | Eventually consistent |
| **Complexity** | Extremely High | High |

### 3. Decision Rule
- **Choose Saga Pattern if:** A business transaction spans multiple physically isolated databases (e.g. checkout requires reserving inventory, charging payment, and shipping order) and eventual consistency is acceptable.
- **Avoid Saga if:** Transactions can be consolidated within a single database boundary (where local SQL transactions apply).

### 4. Red Flags to Revisit
- A payment fails, but inventory remains locked because compensating undo actions failed to publish, leaving database states inconsistent.
- Debugging transaction lifecycles requires manual logs correlation across 5 separate services.

### 5. Where to Go Next
- For database schema configurations, compensating transaction tables, and log stores, see [Saga Database Design](file:///c:/Users/mahip/OneDrive/Desktop/skills/database-design/13-design-patterns/saga-pattern.md).
- For orchestrator vs choreographer design briefs, see [Backend Orchestration Strategy](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/07-backend-strategy/orchestration-strategy-implementation.md).
