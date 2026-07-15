# Timeout Strategy

### 1. The Question Decided
"What timeout boundaries govern HTTP, RPC, and database connections, and how do we prevent resource saturation on slow routes?"

### 2. Options Compared
| Connection Tier | Connect Timeout | Read Timeout | DB Statement Timeout |
|---|---|---|---|
| **Purpose** | Abort if IP unreachable | Abort if response halts | Abort long SQL queries |
| **Typical Target**| Short (<2 seconds) | Moderate (2-5 seconds) | Extremely Short (<100ms) |
| **Resource Safety**| High | High | Extremely High |

### 3. Decision Rule
- **Enforce strict, tiered timeouts at all boundaries:**
  - *If* external HTTP request, *then* cap connect timeout at 2s, read timeout at 5s.
  - *If* internal gRPC call, *then* cap timeout at 500ms.
  - *If* database transaction, *then* set SQL statement timeout at 100ms.

### 4. Red Flags to Revisit
- Application VM hosts run out of memory or connection slots because slow external API calls block threads indefinitely (unbounded timeouts).
- Relational databases experience lock queues because database queries run indefinitely without timeouts.

### 5. Where to Go Next
- For configuring timeouts in HTTP clients, gRPC pools, and database connection settings, see [Resilience Patterns & Implementations](file:///c:/Users/mahip/OneDrive/Desktop/skills/production_principles/performance-and-scale/03-resilience-patterns.md).
- For request-path latency deconstructions, see [Synchronous Flow Sizing](file:///c:/Users/mahip/OneDrive/Desktop/skills/01-system-design/05-data-flow-design/sync-flow-strategy-implementation.md).
